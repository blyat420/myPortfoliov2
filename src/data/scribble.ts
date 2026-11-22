// Hand-drawn pen loops for the folder hover. The reference swaps between
// several slightly different loops every ~90ms ("boiling" line), so we
// generate a few deterministic variants at build time.

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/** `count` loop paths that wrap an ellipse inside a w x h box. */
export function scribbles(count = 6, w = 448, h = 360): string[] {
  return Array.from({ length: count }, (_, i) => {
    const r = rng(i * 977 + 13);
    const cx = w / 2;
    const cy = h / 2;
    const rx = w * 0.44;
    const ry = h * 0.42;
    const turns = 1.55 + r() * 0.35;
    const start = r() * Math.PI * 2;
    const tilt = (r() - 0.5) * 0.25;
    const [p1, p2] = [r() * 6.28, r() * 6.28];
    const [a1, a2] = [0.03 + r() * 0.03, 0.015 + r() * 0.02];
    const steps = Math.round(48 * turns);

    const pts: [number, number][] = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const th = start + t * turns * Math.PI * 2;
      const s = (1 + (t - 0.5) * 0.08) * (1 + a1 * Math.sin(3 * th + p1) + a2 * Math.sin(5 * th + p2) + (r() - 0.5) * 0.012);
      const x = Math.cos(th) * rx * s;
      const y = Math.sin(th) * ry * s;
      pts.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
    }

    // Catmull-Rom through the points, written as cubic Béziers
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let k = 0; k < pts.length - 1; k++) {
      const [a, b, c, e] = [pts[k - 1] ?? pts[k], pts[k], pts[k + 1], pts[k + 2] ?? pts[k + 1]];
      d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
    }
    return d;
  });
}
