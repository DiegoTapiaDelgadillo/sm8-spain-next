// Recomprime las imágenes fuente de `assets-src/img/` a WebP en `public/img/` (spec 05, tarea 3.1).
//
// Uso:
//   node scripts/optimize-images.mjs              # todas las imágenes de assets-src/img
//   node scripts/optimize-images.mjs fachada.jpg  # solo las indicadas
//
// - Ancho máximo 2400 px (nunca agranda).
// - Objetivo ≤ 300 KB: prueba calidades de 82 a 70 y se queda con la primera que cabe.
//   Si a 2400 px no cabe ni con calidad 70, baja el ancho por escalones (2000, 1600, 1400, 1200;
//   las tarjetas se pintan a ~400 px CSS, así que 1200 px cubre pantallas 3×)
//   y repite. Si aun así no cabe, usa el último intento y avisa.
// - Conserva la transparencia (WebP con alfa) si la imagen la tiene.
// - Usa `sharp`, que ya viene como dependencia de Next (no hace falta instalarlo).
import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "assets-src", "img");
const OUT_DIR = path.join(ROOT, "public", "img");

const WIDTHS = [2400, 2000, 1600, 1400, 1200];
const TARGET_BYTES = 300 * 1024;
const QUALITIES = [82, 80, 78, 76, 74, 72, 70];
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"]);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

const encode = async (file, width, quality, alpha) =>
  sharp(file)
    .rotate() // respeta la orientación EXIF antes de quitar los metadatos
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, alphaQuality: alpha ? 90 : 100, effort: 6, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });

const optimize = async (name) => {
  const input = path.join(SRC_DIR, name);
  const meta = await sharp(input).metadata();
  const alpha = Boolean(meta.hasAlpha) && !(await sharp(input).stats()).isOpaque;

  let result;
  let quality;
  search: for (const width of WIDTHS) {
    // Si el original ya es más estrecho que este escalón, el resultado sería igual.
    if (width !== WIDTHS[0] && (meta.width ?? 0) <= width) continue;
    for (quality of QUALITIES) {
      result = await encode(input, width, quality, alpha);
      if (result.data.length <= TARGET_BYTES) break search;
    }
  }

  const outName = `${path.parse(name).name}.webp`;
  await writeFile(path.join(OUT_DIR, outName), result.data);

  const before = (await stat(input)).size;
  const fits = result.data.length <= TARGET_BYTES ? "" : "  ⚠ supera el objetivo";
  console.log(
    `${name} (${meta.width}×${meta.height}, ${kb(before)}) → ${outName} ` +
      `(${result.info.width}×${result.info.height}, ${kb(result.data.length)}, q${quality}` +
      `${alpha ? ", alfa" : ""})${fits}`,
  );
};

const main = async () => {
  await mkdir(OUT_DIR, { recursive: true });
  const requested = process.argv.slice(2);
  const files = requested.length
    ? requested
    : (await readdir(SRC_DIR)).filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()));

  if (!files.length) {
    console.log(`No hay imágenes en ${path.relative(ROOT, SRC_DIR)}`);
    return;
  }
  for (const file of files) await optimize(file);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
