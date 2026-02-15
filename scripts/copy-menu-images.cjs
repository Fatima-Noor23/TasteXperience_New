/**
 * Copies menu image files from src/assets to public/images
 * so they load reliably (fixes "images not showing" in menu).
 * Run once: node scripts/copy-menu-images.cjs
 */
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "src", "assets");
const publicImagesDir = path.join(__dirname, "..", "public", "images");

const menuImageFiles = [
  "Peri Peri.jpg",
  "Calzone-Chunks.jpeg",
  "Cheese Sticks.jpg",
  "Flaming Wings.png",
  "Oven-Baked Chicken Wings.jpg",
  "FajitaFajita Chicken Pizza.jpg",
  "chicken-tikka.jpg",
  "Arabic Rolls.jpg",
  "Bihari Rolls.png",
  "Chicken Tandoori.jpg",
  "Vegetable Pizza.jpg",
  "Sausage Pizza.jpg",
  "Cheese Lover Pizza.jpg",
];

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

menuImageFiles.forEach((file) => {
  const src = path.join(assetsDir, file);
  const dest = path.join(publicImagesDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log("Copied:", file);
  } else {
    console.warn("Skip (not found):", file);
  }
});

console.log("Done. Menu images are in public/images/");
