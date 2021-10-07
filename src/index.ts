import { fetchData } from './fetch';
import readMapListData from './readMapListData';
import { MapList } from './types/MapData.type';


const seed = "27396577"; // hex string of seed value
// const difficulty = "Normal"
// const difficulty = "Nightmare"
const difficulty = "Hell";

const mapList: MapList = fetchData(seed, difficulty);

if (mapList !== undefined) readMapListData(mapList);

