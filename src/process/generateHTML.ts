import * as fs from "fs";
import * as path from "path";
import { DrawingEntry } from "../types/DrawingData.type";
import { MapData } from "../types/MapData.type";
import { getActualSize, parseMapData } from "./parseMapData";

function saveHTML(folderName: string, mapName: string, HTMLdata: string): void {
  folderName = path.resolve(folderName);
  if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive: true });
  let fileName = path.join(folderName, mapName + ".html");
  fs.writeFileSync(fileName, HTMLdata);
  console.log(`Saved ${fileName}...`);
}

function makeIsometric(rectangles: DrawingEntry[]) {
  let [minX, minY, maxX, maxY] = getActualSize(rectangles);
  return `
          ctx.translate(${maxX / 2}, ${maxY / 2});
          ctx.scale(1, 0.5);
          ctx.rotate(45 * Math.PI /180);
          ctx.translate(-${maxX / 2},-${maxY / 2});
          ctx.translate(${minX},${minY});
          `;
}

export async function generateHTML(
  mapData: MapData,
  path: string,
  templateHTML: string
): Promise<string> {
  let rectangles: DrawingEntry[] = await parseMapData(mapData);

  let htmlContents = templateHTML.replace(
    "[/*!-- GENERATED DATA HERE --!*/]",
    JSON.stringify(rectangles, null, 2)
  );
  const isometricCommands = makeIsometric(rectangles);
  htmlContents = htmlContents.replace(
    "/*!-- CANVAS COMMANDS HERE --!*/",
    isometricCommands
  );

  const fileName: string = `${mapData.id}_${mapData.name}`;
  if (path !== "") {
    saveHTML(path, fileName, htmlContents);
  }
  return htmlContents;
}
