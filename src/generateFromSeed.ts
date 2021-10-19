import { fetchData } from "./process/fetch";
import readMapListData from "./process/parseMapListData";
import { Difficulty } from "./types/Difficulty.type";
import { MapList } from "./types/MapList.type";

export async function generate(seed: string, difficulty: Difficulty, basePath: string, baseUrl: string) {
  console.log("Started generating maps...");
  const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
  await readMapListData(mapList, basePath);
  console.log("Finished generating maps");
}


export async function generateSingle(seed: string, difficulty: Difficulty, basePath: string, baseUrl: string, mapId: number) {
  console.log("Started generating map...");
  const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
  for (let mapIdx in mapList.levels) {
    
    if (mapList.levels[mapIdx].id != mapId) {
      delete mapList.levels[mapIdx];
    } 
  }
  await readMapListData(mapList, basePath);
  console.log("Finished generating maps");
}
