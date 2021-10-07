import generateSVG from './generateSVG';
import {MapList, MapData} from './types/MapData.type';

export default function readMapListData(mapList: MapList) {
    let hexString: string = Number(mapList.seed).toString(16);
    console.log(`Id ${mapList.id}`)
    console.log(`Seed ${mapList.seed} (0x${hexString})`)
    console.log(`Difficulty ${mapList.difficulty}`)
    let path: string = `./dist/svg/${mapList.seed}/${mapList.difficulty}/`;
    for (let mapIdx in mapList.maps) {
        generateSVG(mapList.maps[mapIdx], path);
    }
    console.log("Generated SVG map files")
}
