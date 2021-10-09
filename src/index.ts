import { generateHTML } from "./generate/generateMap";
import * as readMapListData from "./generate/readMapListData";
import  {generate} from "./generateFromSeed";
import  {fetchData} from "./generate/fetch";

export { generateHTML, readMapListData, generate, fetchData }
export type { MapList, MapData } from './generate/types/MapData.type';
