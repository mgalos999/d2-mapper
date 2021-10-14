import * as fs from "fs";
import * as path from "path";
import { DrawingEntry } from "../types/DrawingData.type";
import { MapData } from "../types/MapData.type";
import { MapMod } from "../types/MapMod.type";
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

export async function generateHTMLfromMap(
  mapData: MapData,
  path: string,
  templateHTML: string
): Promise<string> {
  let mapAttributes: MapMod = { color: "#AAAAAA", xOffset: 0, yOffset: 0 };
  let rectangles: DrawingEntry[] = await parseMapData(mapData, mapAttributes);
  const htmlContents = await generateHTML(rectangles, templateHTML);
  const fileName: string = `${mapData.id}_${mapData.name}`;
  if (path !== "") {
    saveHTML(path, fileName, htmlContents);
  }
  return htmlContents;
}

export async function generateHTML(
  rectangles: DrawingEntry[],
  templateHTML: string
): Promise<string> {
  let htmlContents = templateHTML.replace(
    "[/*!-- GENERATED DATA HERE --!*/]",
    JSON.stringify(rectangles, null, 2)
  );
  const isometricCommands = makeIsometric(rectangles);
  htmlContents = htmlContents.replace(
    "/*!-- CANVAS COMMANDS HERE --!*/",
    isometricCommands
  );
  return htmlContents;
}
