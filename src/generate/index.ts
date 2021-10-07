import { fetchData } from './fetch';
import readMapListData from './readMapListData';
import { Difficulty } from './types/Difficulty.type';
import { MapList } from './types/MapData.type';



export default function generate(seed: string, difficulty: Difficulty) {
    const mapList: MapList = fetchData(seed, difficulty);
    if (mapList !== undefined) readMapListData(mapList);
}

generate("27396577", Difficulty.Hell)