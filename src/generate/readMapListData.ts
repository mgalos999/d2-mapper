import { MapList } from "./types/MapData.type";
import * as fs from "fs";
import * as path from "path";
import { generateHTML } from "./generateMap";

export default function readMapListData(mapList: MapList, basePath: string) {
  let hexString: string = Number(mapList.seed).toString(16);
  console.log(`Id ${mapList.id}`);
  console.log(`Seed ${mapList.seed} (0x${hexString})`);
  console.log(`Difficulty ${mapList.difficulty}`);
  let saveLocation: string = path.join(
    basePath,
    `${mapList.seed}/${mapList.difficulty}`
  );

  const templateHTML: string = fs.readFileSync(
    "./src/generate/template/template.html",
    { encoding: "utf8" }
  );

  for (let mapIdx in mapList.maps) {
    generateHTML(mapList.maps[mapIdx], saveLocation, templateHTML);
  }
}
