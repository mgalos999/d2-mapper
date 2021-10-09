import { fetchData } from "./generate/fetch";
import readMapListData from "./generate/readMapListData";
import { Difficulty } from "./generate/types/Difficulty.type";
import { MapList } from "./generate/types/MapData.type";

export async function generate(seed: string, difficulty: Difficulty, basePath: string, baseUrl: string) {
  console.log("Started generating maps...");
  const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
  readMapListData(mapList, basePath);
}

