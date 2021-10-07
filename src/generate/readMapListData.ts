import generateSVG from './generateSVG';
import {MapList, MapData} from './types/MapData.type';
import * as fs from 'fs';
import * as path from 'path';

export default function readMapListData(mapList: MapList) {

    console.log(`Id ${mapList.id}`)
    console.log(`Seed ${mapList.seed}`)
    console.log(`Difficulty ${mapList.difficulty}`)
    for (let mapIdx in mapList.maps) {
        let mapName = mapList.maps[mapIdx].name;
        let levelSVG = generateSVG(mapList.maps[mapIdx]);
        saveSVG("./build/svgs", mapName, levelSVG);
    }
    console.log("Generated SVG map files in ./build/maps")
}

function saveSVG(folderName: string, mapName: string, SVGdata: string) {
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
    let fileName = path.join(folderName, mapName + ".svg");
    fs.writeFileSync(fileName, SVGdata);
}

