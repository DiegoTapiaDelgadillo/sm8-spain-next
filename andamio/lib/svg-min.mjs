// Compacta los `d` de un SVG del kit (solo usa M, L y Z absolutos con 1 decimal):
// pasa a coordenadas relativas en décimas exactas (m, l, h, v), sin separadores sobrantes.
// No cambia la geometría: cada vértice queda en la misma posición redondeada a 0,1.

const fmt = (t) => {
  // t en décimas (entero)
  const neg = t < 0;
  const a = Math.abs(t);
  const i = Math.floor(a / 10);
  const f = a % 10;
  const s = f ? (i ? `${i}.${f}` : `.${f}`) : `${i}`;
  return neg ? `-${s}` : s;
};

// Une números sin espacios cuando el siguiente empieza por "-" o por "." tras un número con decimales
const join = (nums) => {
  let out = "";
  for (const n of nums) {
    if (!out) out = n;
    else if (n[0] === "-" || (n[0] === "." && /\.\d*$/.test(out.split(/[ \-a-zA-Z]/).pop() ?? ""))) out += n;
    else out += " " + n;
  }
  return out;
};

export function minifyPath(d) {
  const toks = d.match(/[MLZmlz]|-?\d*\.?\d+(?:e-?\d+)?/g);
  if (!toks || /NaN/.test(d)) return d;
  let out = "";
  let cmd = "";
  let lastOut = ""; // última letra escrita
  let cx = 0, cy = 0, sx = 0, sy = 0;
  let first = true;
  const emit = (letter, nums) => {
    const body = join(nums);
    if (letter === lastOut && letter !== "m" && letter !== "M") {
      out += body[0] === "-" ? body : " " + body;
    } else {
      out += letter + body;
      lastOut = letter;
    }
  };
  for (let i = 0; i < toks.length; ) {
    const t = toks[i];
    if (/[MLZmlz]/.test(t)) {
      cmd = t;
      i++;
      if (t === "Z" || t === "z") {
        out += "z";
        lastOut = "z";
        cx = sx;
        cy = sy;
      }
      continue;
    }
    const x = Math.round(parseFloat(toks[i]) * 10);
    const y = Math.round(parseFloat(toks[i + 1]) * 10);
    i += 2;
    if (cmd === "M") {
      if (first) emit("M", [fmt(x), fmt(y)]);
      else emit("m", [fmt(x - cx), fmt(y - cy)]);
      first = false;
      cx = sx = x;
      cy = sy = y;
      cmd = "L"; // pares siguientes a un M son L implícitos
    } else if (cmd === "L") {
      const dx = x - cx, dy = y - cy;
      if (dx === 0 && dy === 0) continue;
      if (dy === 0) emit("h", [fmt(dx)]);
      else if (dx === 0) emit("v", [fmt(dy)]);
      else emit("l", [fmt(dx), fmt(dy)]);
      cx = x;
      cy = y;
    } else return d; // comando no previsto: se deja tal cual
  }
  return out;
}

export const minifySvg = (svg) => svg.replace(/ d="([^"]*)"/g, (_, d) => ` d="${minifyPath(d)}"`);
