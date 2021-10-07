import { fetchData } from './fetch';
import readMapListData from './readMapListData';
import { Difficulty } from './types/Difficulty.type';
import { MapList } from './types/MapData.type';



export default async function generate(seed: string, difficulty: Difficulty) {
    const mapList: MapList = await fetchData(seed, difficulty);
    readMapListData(mapList);
}

// change seed value or difficulty here (in decimal)
let seed: string = parseInt("0x048FCB4E", 16).toString();

generate(seed, Difficulty.Hell)


