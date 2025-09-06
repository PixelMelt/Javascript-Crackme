(e => {
  let r;
  let t;
  let n;
  let o;
  let l;
  let f;
  let a;
  let i;
  let w;
  let u;
  let y = Uint8Array;
  let d = Uint16Array;
  let A = Float64Array;
  let b = DataView;
  let g = Math.ceil;
  let h = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : {};
  ((p = 0, U = 0, c = []) => function (...s) {
    let T = e => (r = e.charCodeAt(0)) > 64 && r < 91 ? r - 65 : r > 96 && r < 123 ? r - 71 : r > 47 && r < 58 ? r + 4 : r === 43 ? 62 : r === 47 ? 63 : 0;
    s = s.slice(0, U);
    let j = p;
    let k = c;
    let m = ((e, r = 0) => {
      n = (t = e.length) * 3 + 1 >> 2;
      o = r ? g(n / r) * r : n;
      l = new y(o);
      f = 0;
      a = 0;
      i = 0;
      for (; i < t; i++) {
        w = i & 3;
        f |= T(e[i]) << (3 - w) * 6;
        if (w === 3 || t - i == 1) {
          for (u = 0; u < 3 && a < o; u++, a++) {
            l[a] = f >>> (16 >>> u & 24) & 255;
          }
          f = 0;
        }
      }
      return l;
    })(e);
    let B = true;
    let D = (e => {
      let r = -1;
      for (let t = 0; t < e.length - 3; t++) {
        if (e[t] === 35 && e[t + 1] === 74 && e[t + 2] === 13 && e[t + 3] === 91) {
          r = t + 4;
          break;
        }
      }
      let t = new d(e.buffer.slice(r, r + 2))[0];
      let n = new Uint32Array(e.buffer.slice(r + 2, r + 6))[0];
      let o = (e => {
        let r = {};
        for (let t = 0; t < e.length; t += 3) {
          r[String.fromCharCode(e[t])] = e[t + 2].toString(2).padStart(e[t + 1], "0");
        }
        return r;
      })(new d(e.buffer.slice(r + 6, r + 6 + t * 2)));
      return ((e, r) => {
        let t = Object.entries(r).reduce((e, [r, t]) => {
          e[t] = r;
          return e;
        }, {});
        let n = "";
        let o = "";
        for (let r of e) {
          if (t[o += r]) {
            n += t[o];
            o = "";
          }
        }
        return n;
      })(Array.from(e.slice(r + 6 + t * 2)).map(e => e.toString(2).padStart(8, "0")).join("").slice(0, n), o).split("|~|").filter(Boolean);
    })(m);
    let F = () => {
      r = m.slice(j + 1, j + 9);
      j += 8;
      t = new b(new y([...r]).buffer);
      return new A(t.buffer)[0];
    };
    let M = e => {
      k.push(e);
    };
    let O = () => k.pop();
    let S = arguments;
    M(S);
    for (r of s) {
      M(r);
    }
    let V = [,,,, () => {
      O();
    },,,,,,,,, () => {
      r = F();
      t = O();
      n = [];
      o = 0;
      for (; o < r; o++) {
        n.push(O());
      }
      M(t(...n));
    }, () => {
      r = F() - 1;
      if (!O()) {
        j = r;
      }
    },,,,,,, () => {
      M(D[F()]);
    },,,, () => {
      let e = F();
      M(k[e]);
    },,,, () => {
      M(O() == O());
    },,,,,, () => {
      B = false;
      j--;
    },,,,,,,,, () => {
      j = F() - 1;
    },,,,,,,,,,, () => {
      M(h[O()]);
    }, () => {},,,,,,];
    while (j < m.length && B == 1) {
      V[m[j]]();
      j++;
    }
  })(0, [])();
})("FQAAAAAAAAAAFQAAAAAAAPA/Nw0AAAAAAADwPxUAAAAAAAAAQBkAAAAAAADwPx0OAAAAAACAV0AVAAAAAAAACEAVAAAAAAAAEEA3DQAAAAAAAPA/BCwAAAAAAMBeQBUAAAAAAAAUQBUAAAAAAAAQQDcNAAAAAAAA8D8EIyNKDVtdAEcCAAAuAAUAAABQAAYAAgBwAAYAAwBuAAQAAQBlAAMAAQAgAAMAAgB0AAQABgByAAQABwBsAAQACABhAAQACQBvAAUAFABtAAYAKgB1AAYAKwBnAAYALABFAAcAWgA6AAcAWwAnAAcAXABmAAcAXQBDAAcAXgAhAAcAXwB8AAQADAB5AAUAGgB+AAUAGwBUAAcAcABJAAcAcQBoAAYAOQBpAAUAHQBrAAYAPAB2AAYAPQBkAAYAPgBzAAYAPwC0LF03JXh1bzeBvSoNs3mqV3IhCfS6u9H5VFclzm8vUGx5auJbtB/vrhyV4dLv69mO/AzeTBds3nEfZjvy8OgIKDP5TPpTZPRA");
