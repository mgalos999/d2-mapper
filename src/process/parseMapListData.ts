import { MapData, MapList } from "../types/MapData.type";
import * as fs from "fs";
import * as path from "path";
import { generatePNGfromMap } from "./generatePNG";
import { Difficulty } from "../types/Difficulty.type";

export default async function parseMapListData(
  mapList: MapList,
  basePath: string
): Promise<string[]> {
  let hexString: string = Number(mapList.seed).toString(16);
  let difficulty = Difficulty.Hell;
  if (mapList.difficulty == 0) difficulty = Difficulty.Normal;
  if (mapList.difficulty == 1) difficulty = Difficulty.Nightmare;

  console.log(`Id ${mapList.id}`);
  console.log(`Seed ${mapList.seed} (0x${hexString})`);
  console.log(`Difficulty ${difficulty}`);
  let saveLocation: string = path.join(basePath, `${mapList.seed}/${difficulty}`);

  let generatedFiles: string[] = [];
  for (let mapIdx in mapList.maps) {
    let thisMap: MapData = mapList.maps[mapIdx];
    generatePNGfromMap(thisMap, saveLocation);
  }

  return generatedFiles;
}
