import { createCanvas } from "canvas";
import { getActualSize, parseMapData } from "./parseMapData";
import { MapData } from "../types/MapData.type";
import { DrawingEntry } from "../types/DrawingData.type";
import * as fs from "fs";
import * as path from "path";
import { MapMod } from "../types/MapMod.type";

function savePNG(folderName: string, mapName: string, HTMLdata: Buffer): void {
  folderName = path.resolve(folderName);
  if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive: true });
  let fileName = path.join(folderName, mapName + ".png");
  fs.writeFileSync(fileName, HTMLdata);
  console.log(`Saved ${fileName}...`);
}

export async function generatePNGfromMap(
  mapData: MapData,
  path: string
): Promise<Buffer> {
  let mapAttributes: MapMod = { color: "#AAAAAA", xOffset: 0, yOffset: 0 };
  let rectangles: DrawingEntry[] = await parseMapData(mapData, mapAttributes);
  let buf: Buffer = await generatePNG(rectangles);
  if (path !== "") {
    const fileName: string = `${mapData.id}_${mapData.name}`;
    savePNG(path, fileName, buf);
  }
  return buf;
}

export async function generatePNG(rectangles: DrawingEntry[]): Promise<Buffer> {
  
  const canvas = createCanvas(3000, 3000);
  const ctx = canvas.getContext("2d");
  let [minX, minY, maxX, maxY] = getActualSize(rectangles);

  rectangles.forEach((d) => {
    ctx.beginPath();
    ctx.fillStyle = d.c;
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.stroke();
  });

  const canvas2 = createCanvas(maxX, maxY);
  const ctx2 = canvas2.getContext("2d");
  ctx2.drawImage(canvas,
    minX, minY,   // Start at 10 pixels from the left and the top of the image (crop),
    maxX-minX, maxY-minY,   // "Get" a `80 * 30` (w * h) area from the source image (crop),
    0, 0,     // Place the result at 0, 0 in the canvas,
    maxX, maxY); // With as width / height: 160 * 60 (scale)
  
  return canvas2.toBuffer("image/png");
}

