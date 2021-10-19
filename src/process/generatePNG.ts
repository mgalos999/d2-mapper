import { createCanvas } from "canvas";
import { getActualSize, parseMapData } from "./parseMapData";
import { Level } from "../types/MapList.type";
import { DrawingElements } from "../types/DrawingData.type";
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
  mapData: Level,
  path: string = ""
): Promise<Buffer> {
  let mapAttributes: MapMod = { color: "#AAAAAA", xOffset: 0, yOffset: 0 };
  console.log(`Generating ${mapData.id} ${mapData.name}`);
  let de: DrawingElements = await parseMapData(mapData, mapAttributes);
  let buf: Buffer = await generatePNG(de);
  if (path !== "") {
    const fileName: string = `${mapData.id}_${mapData.name}`;
    savePNG(path, fileName, buf);
  }
  return buf;
}

export async function generatePNG(de: DrawingElements): Promise<Buffer> {
  
  const canvas = createCanvas(3000, 3000);
  const ctx = canvas.getContext("2d");
  let [minX, minY, maxX, maxY] = getActualSize(de.rectangles);

  de.rectangles.forEach((d) => {
    ctx.beginPath();
    ctx.fillStyle = d.c;
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.stroke();
  });

  de.circles.forEach((d) => {
    ctx.beginPath();
    ctx.fillStyle = d.c;
    ctx.arc(d.x, d.y+(d.w/2), d.w/2, 0, 2 * Math.PI);
    ctx.fill();
  });


  de.text.forEach((d) => {
    ctx.font = `${d.fontSize}px Arial`;
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle"; 
    ctx.fillStyle = d.c;
    ctx.fillText(d.text, d.x, d.y);
  });


  // this section will crop the excess space surrounding the map
  const canvas2 = createCanvas(maxX, maxY);
  const ctx2 = canvas2.getContext("2d");
  ctx2.drawImage(canvas,
    minX, minY,
    maxX-minX, maxY-minY,
    0, 0,
    maxX, maxY);

  // make the image isometric
  const hypot = Math.sqrt((maxX * maxX) + (maxY * maxY));
  const canvas3 = createCanvas(hypot, hypot);
  const ctx3 = canvas3.getContext("2d");
  ctx3.translate(hypot/2, hypot/2);
  ctx3.scale(1, 0.6);
  ctx3.rotate(45 * Math.PI /180)
  ctx3.translate(-(maxX/2), -(maxY/2));
  ctx3.drawImage(canvas2, 0,0);


  // make the image isomettric

  const canvas4 = createCanvas(hypot, hypot);
  const ctx4 = canvas4.getContext("2d");
  ctx4.drawImage(canvas3, 0,0);


  return canvas3.toBuffer("image/png");
}

