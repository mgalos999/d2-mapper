import { MapData, Type } from "../types/MapData.type";
import { Circle, DrawingElements, Rectangle } from "../types/DrawingData.type";
import { MapMod } from "../types/MapMod.type";

// accepts data for a single map and HTML template and generates an array of rectangles to draw
export async function parseMapData(mapData: MapData, mapAttributes: MapMod): Promise<DrawingElements> {
  
  const dotSize = 2; // pixel size
  let de: DrawingElements = { rectangles: [], circles: [], icons: [] };

  // this part generates the walls (collisions as it's called)
  mapData.map.forEach((coord, index) => {
    let fill = false;
    let x = mapAttributes.xOffset * dotSize;
    let y = (mapAttributes.yOffset + index) * dotSize;
    coord.forEach((plotx) => {
      let width = plotx * dotSize;

      // only the first (every odd) number is used
      // the second value is void space and not necessary
      fill = !fill;
      if (!fill) {
        de.rectangles.push({ x: x, y: y, w: width, h: dotSize, c: mapAttributes.color });
      }
      x = x + width;
    });
  });

  // this part adds the special objects (doors, waypoints etc)
  mapData.objects.forEach((mapObject, index) => {
    let x = (mapAttributes.xOffset + mapObject.x) * dotSize;
    let y = (mapAttributes.yOffset + mapObject.y) * dotSize;

    // waypoints
    if (mapObject.type === Type.Object) {
      if (mapObject.name == "Waypoint") {
        let size = dotSize * 10;
        de.rectangles.push({x: x - size / 2, y: y - size / 2, w: size,h: size, c: "#FFFF00"});
      }

      if (mapObject.name == "chest") {
        de.rectangles.push(drawObjRectangle(1, x, y, "#00FFFF"));
      }

      //quest items adding a green circle
      switch (mapObject.name) {
        case 'orifice':
        case 'Inifuss':
        case 'taintedsunaltar': // claw viper temple 2 altar
        case 'gidbinn altar':
        case 'Tome': 
        case 'Hellforge':
        case 'cagedwussie1':   // prisoners act 5
          de.circles.push(drawObjRectangle(dotSize, x, y, "#00FF00"));
          break
      }
    }

    // NPCs
    if (mapObject.type === Type.NPC) {
      // magot lair boss
      if (mapData.name == "Maggot Lair Level 3") {
        de.circles.push(drawObjRectangle(dotSize, x, y, "#FF0000"));    
      } else {
        de.circles.push({x: x, y: y, w: dotSize, h: dotSize, c: "#FF0000" });
      }
    }

    // Exits
    if (mapObject.type === Type.Exit) {
      let size = dotSize * 10;
      de.rectangles.push({
        x: x - size / 2,
        y: y - size / 2,
        w: size,
        h: size,
        c: "#FF00FF",
      });
    }
  });
  return de;
}

function drawObjRectangle(dotSize, x, y, color) {
    let size = dotSize * 10;
    return {x: x - size / 2, y: y - size / 2, w: size,h: size, c: color}
}

export function getActualSize(rectangles: Rectangle[]): [number, number, number, number] {
  const minX: Rectangle = rectangles.reduce(function (prev, curr) {
    return prev.x < curr.x ? prev : curr;
  });

  const minY: Rectangle = rectangles.reduce(function (prev, curr) {
    return prev.y < curr.y ? prev : curr;
  });

  const maxX: Rectangle = rectangles.reduce(function (prev, curr) {
    return (prev.x + prev.w) > (curr.x + curr.w) ? prev : curr;
  });

  const maxY: Rectangle = rectangles.reduce(function (prev, curr) {
    return (prev.y + prev.h) > (curr.y + curr.h) ? prev : curr;
  });
  return [minX.x, minY.y, maxX.x + maxX.w, maxY.y + maxY.h];
}
