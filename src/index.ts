import { fetchData } from './generate/fetch';
import readMapListData from './generate/readMapListData';
import { Difficulty } from './generate/types/Difficulty.type';
import { MapList } from './generate/types/MapData.type';

export default async function generate(seed: string, difficulty: Difficulty) {
    console.log("Started generting SVGS...");
    const mapList: MapList = await fetchData(seed, difficulty);
    readMapListData(mapList);
}

// change seed value or difficulty here
let seed: string = parseInt("0x2C4EE754", 16).toString();

generate(seed, Difficulty.Hell)


