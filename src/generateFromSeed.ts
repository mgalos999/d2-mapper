import { fetchData } from "./process/fetch";
import readMapListData from "./process/parseMapListData";
import { Difficulty } from "./types/Difficulty.type";
import { MapList } from "./types/MapData.type";

export async function generate(seed: string, difficulty: Difficulty, basePath: string, baseUrl: string) {
  console.log("Started generating maps...");
  const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
  await readMapListData(mapList, basePath);
  console.log("Finished generating maps");
}
