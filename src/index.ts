import { parseMapData } from "./process/parseMapData";
import * as readMapListData from "./process/parseMapListData";
import  {generate} from "./generateFromSeed";
import  {fetchData} from "./process/fetch";
import { generatePNG } from './process/generatePNG';
import { generateHTML } from './process/generateHTML';

export { parseMapData, readMapListData, generate, fetchData, generatePNG, generateHTML }
export type { MapList, MapData } from './types/MapData.type';
