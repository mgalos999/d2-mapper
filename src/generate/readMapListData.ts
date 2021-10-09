import {MapList} from './types/MapData.type';
import * as fs from 'fs';
import {generateHTML} from './generateMap';

export default function readMapListData(mapList: MapList) {
    let hexString: string = Number(mapList.seed).toString(16);
    console.log(`Id ${mapList.id}`)
    console.log(`Seed ${mapList.seed} (0x${hexString})`)
    console.log(`Difficulty ${mapList.difficulty}`)
    let path: string = `./dist/html/${mapList.seed}/${mapList.difficulty}/`;

    const templateHTML: string = fs.readFileSync("./src/generate/template/template.html", { encoding: 'utf8' })
    
    for (let mapIdx in mapList.maps) {
        generateHTML(mapList.maps[mapIdx], path, templateHTML);
    }
}
