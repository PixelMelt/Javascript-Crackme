const fs = require("fs");
const path = require("path");

// Read the levels data JSON file
function readLevelsData(jsonPath) {
  try {
    const data = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

// Calculate completions for each level from winners data
function calculateCompletions(levelsData) {
  const completions = {};
  const totalWinners = levelsData.winners ? levelsData.winners.length : 0;

  // Initialize all levels with 0 completions
  [...(levelsData.official || []), ...(levelsData.community || [])].forEach(
    (level) => {
      completions[level.id] = 0;
    }
  );

  // Count completions from winners
  if (levelsData.winners) {
    levelsData.winners.forEach((winner) => {
      winner.completedLevels.forEach((levelId) => {
        if (completions.hasOwnProperty(levelId)) {
          completions[levelId]++;
        }
      });
    });
  }

  return { completions, totalWinners };
}

// Generate HTML table for a specific section
function generateSectionTable(levels, sectionTitle, completions, totalWinners) {
  let table = `## ${sectionTitle} Levels
<table>
<tr>
<th>Level</th>
<th>Difficulty</th>
<th>Author</th>
<th>Category</th>
<th>Tags</th>
<th>Description</th>
<th>Completions</th>
<th>Pass Rate</th>
</tr>
`;

  levels.forEach((level) => {
    const tags = level.tags
      ? level.tags.map((tag) => `<code>${tag}</code>`).join(" ")
      : "";
    const levelCompletions = completions[level.id] || 0;
    const passRate =
      totalWinners > 0
        ? ((levelCompletions / totalWinners) * 100).toFixed(1)
        : "0.0";

    table += `<tr>
<td>${level.name}</td>
<td><img src="${level.difficultyImage}" alt="${level.difficulty}" width="50"></td>
<td>${level.author}</td>
<td><strong>${level.category}</strong></td>
<td>${tags}</td>
<td>${level.description}</td>
<td>${levelCompletions}/${totalWinners}</td>
<td>${passRate}%</td>
</tr>
`;
  });

  table += `</table>

<sub>*Difficulty ratings are subject to change, if you believe the ranking should be changed, please open an issue and explain why*</sub>

`;

  return table;
}

// Generate both official and community tables
function generateTables(levelsData) {
  let output = "";
  const { completions, totalWinners } = calculateCompletions(levelsData);

  if (levelsData.official && levelsData.official.length > 0) {
    output += generateSectionTable(
      levelsData.official,
      "Official",
      completions,
      totalWinners
    );
  }

  if (levelsData.community && levelsData.community.length > 0) {
    output += generateSectionTable(
      levelsData.community,
      "Community",
      completions,
      totalWinners
    );
  }

  return output;
}

// Generate winners list for README
function generateWinnersList(levelsData) {
  if (!levelsData.winners || levelsData.winners.length === 0) {
    return "";
  }

  const allLevels = [
    ...(levelsData.official || []),
    ...(levelsData.community || []),
  ];
  const totalLevels = allLevels.length;

  let winnersList = `# Hall of Fame\n\n`;

  // Sort winners by completion count (descending)
  const sortedWinners = [...levelsData.winners].sort(
    (a, b) => b.completedLevels.length - a.completedLevels.length
  );

  sortedWinners.forEach((winner, index) => {
    const completionCount = winner.completedLevels.length;
    const completionPercentage = (
      (completionCount / totalLevels) *
      100
    ).toFixed(1);

    // Rank
    const rankText =
      index === 0
        ? "1st Place"
        : index === 1
        ? "2nd Place"
        : index === 2
        ? "3rd Place"
        : `${index + 1}th Place`;

    winnersList += `## ${rankText} - [@${winner.username}](${winner.profileUrl})\n\n`;
    winnersList += `**Progress:** ${completionCount}/${totalLevels} levels (${completionPercentage}%)\n\n`;

    // Progress bar
    const progressBarLength = 20;
    const filledBars = Math.round(
      (completionCount / totalLevels) * progressBarLength
    );
    const emptyBars = progressBarLength - filledBars;
    const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
    winnersList += `\`${progressBar}\`\n\n`;

    // Completed levels with level names
    winnersList += `**Conquered Levels:** `;
    const completedLevelNames = winner.completedLevels.map((levelId) => {
      const level = allLevels.find((l) => l.id === levelId);
      if (level) {
        const displayId = level.name.includes("Community")
          ? `C${levelId - (levelsData.official?.length || 0)}`
          : levelId.toString();
        return `\`${displayId}\``;
      }
      return `\`${levelId}\``;
    });
    winnersList += completedLevelNames.join(" ");

    winnersList += `\n\n---\n\n`;
  });

  // Statistics section
  winnersList += `## Statistics\n\n`;
  winnersList += `- **Total Challengers:** ${levelsData.winners.length}\n`;
  winnersList += `- **Total Levels:** ${totalLevels}\n`;
  winnersList += `- **Most Popular Level:** `;

  // Find most completed level
  const { completions } = calculateCompletions(levelsData);
  let mostCompletedLevel = null;
  let maxCompletions = 0;

  allLevels.forEach((level) => {
    const levelCompletions = completions[level.id] || 0;
    if (levelCompletions > maxCompletions) {
      maxCompletions = levelCompletions;
      mostCompletedLevel = level;
    }
  });

  if (mostCompletedLevel) {
    winnersList += `${mostCompletedLevel.name} (${maxCompletions}/${levelsData.winners.length} completions)\n`;
  } else {
    winnersList += `None yet\n`;
  }

  winnersList += `- **Hardest Level:** `;

  // Find least completed level
  let leastCompletedLevel = null;
  let minCompletions = Infinity;

  allLevels.forEach((level) => {
    const levelCompletions = completions[level.id] || 0;
    if (levelCompletions < minCompletions) {
      minCompletions = levelCompletions;
      leastCompletedLevel = level;
    }
  });

  if (leastCompletedLevel && minCompletions < Infinity) {
    winnersList += `${leastCompletedLevel.name} (${minCompletions}/${levelsData.winners.length} completions)\n`;
  } else {
    winnersList += `None yet\n`;
  }

  winnersList += `\n---\n\n`;
  winnersList += `*Want to join the Hall of Fame? Open a GitHub issue with the MD5 hash of the flag you found and the level you completed!*\n\n`;
  winnersList += `[**Start Your Journey**](../README.md) | [**Join Discord**](https://discord.gg/USJQjwD7AY)\n`;

  return winnersList;
}

// Generate table with category filtering
function generateTableByCategory(levelsData) {
  const categories = [
    ...new Set(levelsData.levels.map((level) => level.category)),
  ];

  let output = "";

  categories.forEach((category) => {
    const categoryLevels = levelsData.levels.filter(
      (level) => level.category === category
    );

    output += `### ${category} Levels
<table>
<tr>
<th>Level</th>
<th>Difficulty</th>
<th>Author</th>
<th>Tags</th>
<th>Description</th>
</tr>
`;

    categoryLevels.forEach((level) => {
      const tags = level.tags
        ? level.tags.map((tag) => `<code>${tag}</code>`).join(" ")
        : "";

      output += `<tr>
<td>${level.name}</td>
<td><img src="${level.difficultyImage}" alt="${level.difficulty}" width="50"></td>
<td>${level.author}</td>
<td>${tags}</td>
<td>${level.description}</td>
</tr>
`;
    });

    output += `</table>

`;
  });

  return output;
}

// Main function
function main() {
  const jsonPath = path.join(__dirname, "levels-data.json");
  const levelsData = readLevelsData(jsonPath);

  if (!levelsData) {
    console.error("Failed to read levels data");
    return;
  }

  console.log("=== OFFICIAL & COMMUNITY TABLES ===");
  console.log(generateTables(levelsData));

  console.log("\n=== WINNERS LIST ===");
  console.log(generateWinnersList(levelsData));

  // Optionally write to files
  const tablesOutput = generateTables(levelsData);
  const winnersOutput = generateWinnersList(levelsData);

  fs.writeFileSync(path.join(__dirname, "tables.md"), tablesOutput);
  fs.writeFileSync(path.join(__dirname, "winners.md"), winnersOutput);

  console.log("\nFiles generated:");
  console.log("- tables.md");
  console.log("- winners.md");
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  readLevelsData,
  calculateCompletions,
  generateSectionTable,
  generateTables,
  generateWinnersList,
  generateTableByCategory,
};
