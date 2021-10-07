import { MapData, Type } from "./types/MapData.type";

export default function generateSVG(mapData: MapData): string {
    const svgScale = 2;
    
    let svgArray: string[] = [];
    const svgHeight = mapData.size.height * svgScale * 2;
    const svgWidth = mapData.size.width * svgScale * 2;

    svgArray.push(`<svg width="${svgWidth}" height="${svgHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color:black">`);
    svgArray.push(`<title>${mapData.name}</title>`);
    // this will force an isometric view
    svgArray.push(`<g id="source" transform="translate(100,${svgWidth * .4}) scale(1, .6) rotate(-45)">`);
    
    const height = (1 * svgScale);
    mapData.map.forEach((coord, index) => {
        let fill = false;
        let x = 0;
        let y = index * svgScale;
        coord.forEach((plotx) => {
            let width = (plotx * svgScale);
            fill = !fill;
            if (!fill) {
                svgArray.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" style="stroke:#aaa;fill:#aaa"/>`)
            }
            x = x + width;
        });
    });

    mapData.objects.forEach((mapObject, index) => {
        let x = mapObject.x * svgScale;
        let y = mapObject.y * svgScale;
        if (mapObject.type === Type.Object) {
            if (mapObject.name == "Waypoint") {
                let size = svgScale * 25;
                svgArray.push(`<image x="${x - (size/2)}" y="${y - (size/2)}"  width="${size}" height="${size}" href="./icons/waypoint.gif" />`)
            }
        }
        if (mapObject.type === Type.NPC) {
            svgArray.push(`<rect x="${x}" y="${y}" width="${svgScale}" height="${svgScale}" style="stroke:red;fill:red"/>`)
        }

        if (mapObject.type === Type.Exit) {
            let size = svgScale * 25;
            svgArray.push(`<rect x="${x}" y="${y}" width="${svgScale * 5}" height="${svgScale * 5}" style="stroke:purple;fill:purple"/>`)
        }
        
        
    });
    svgArray.push("</g>"); // close group
    svgArray.push("</svg>"); // close svg
    return svgArray.join("\n");
}
