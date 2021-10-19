import { parseMapData } from "./process/parseMapData";
import * as readMapListData from "./process/parseMapListData";
import { generate } from "./generateFromSeed";
import { fetchData } from "./process/fetch";
import { generatePNG, generatePNGfromMap } from "./process/generatePNG";

export {
  parseMapData,
  readMapListData,
  generate,
  fetchData,
  generatePNG,
  generatePNGfromMap,
};
export type { MapList, Level } from "./types/MapList.type";
