import { MapData, Type } from "./types/MapData.type";
import * as fs from 'fs';
import * as path from 'path';
import { DrawingEntry } from "./types/DrawingData.type";

// accepts data for a single map and HTML template and generates a HTML page.

export async function parseMapData(mapData: MapData, templateHTML: string): Promise<string> {
    const dotSize = 2; // pixel size

    
    let rectangles: DrawingEntry[] = [];

    // this part generates the walls (collisions as it's called)
    mapData.map.forEach((coord, index) => {
        let fill = false;
        let x = 0;
        let y = index * dotSize;
        coord.forEach((plotx) => {
            let width = (plotx * dotSize);

            // only the first (every odd) number is used
            // the second value is void space and not necessary
            fill = !fill;
            if (!fill) {
              rectangles.push({x: x, y: y, w: width, h: dotSize, c: "#AAAAAA"})
            }
            x = x + width;
        });
    });

    // this part adds the special objects (doors, waypoints etc)
    mapData.objects.forEach((mapObject, index) => {
        let x = mapObject.x * dotSize;
        let y = mapObject.y * dotSize;

        // waypoints
        if (mapObject.type === Type.Object) {
            if (mapObject.name == "Waypoint") {
                let size = dotSize * 10;
                rectangles.push({x: (x - (size/2)),y: y - (size/2), w: size, h: size, c: "#FFFF00"})
            }
        }

        // NPCs
        if (mapObject.type === Type.NPC) {
          rectangles.push({x: (x - (dotSize/2)),y: y - (dotSize/2), w: dotSize, h: dotSize, c: "#FF0000"})
        }

        // Exits
        if (mapObject.type === Type.Exit) {
            let size = dotSize * 10;
            rectangles.push({x: (x - (size/2)),y: y - (size/2), w: size, h: size, c: "#FF00FF"})
        }
    });
    let html = templateHTML.replace("[/*!-- GENERATED DATA HERE --!*/]", JSON.stringify(rectangles, null, 2));

    const isometricCommands = makeIsometric(rectangles);
    html = html.replace("/*!-- CANVAS COMMANDS HERE --!*/", isometricCommands);

    return html;
}

function makeIsometric(rectangles: DrawingEntry[]) {
    const minX: number = rectangles.reduce(function(prev, curr) {
        return prev.x < curr.x ? prev : curr;
    }).x;

    const minY: number = rectangles.reduce(function(prev, curr) {
        return prev.y < curr.y ? prev : curr;
    }).y;

    const maxX: number = rectangles.reduce(function(prev, curr) {
        return prev.x > curr.x ? prev : curr;
    }).x;

    const maxY: number = rectangles.reduce(function(prev, curr) {
        return prev.y > curr.y ? prev : curr;
    }).y;
    
    
    return `
        ctx.translate(${maxX / 2}, ${maxY / 2});
        ctx.scale(1, 0.5);
        ctx.rotate(45 * Math.PI /180);
        ctx.translate(-${maxX / 2},-${maxY / 2});
        ctx.translate(200,-50);
        `;
}


function saveHTML(folderName: string, mapName: string, HTMLdata: string) {   
    folderName = path.resolve(folderName);
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName, { recursive: true });
    let fileName = path.join(folderName, mapName + ".html");
    fs.writeFileSync(fileName, HTMLdata);
    console.log(`Saved ${fileName}...`);
}

export default async function generateHTML(mapData: MapData, path: string, templateHTML:string) {
    const htmlFileContents = await parseMapData(mapData, templateHTML);
    saveHTML(path, `${mapData.id}_${mapData.name}`, htmlFileContents);
}