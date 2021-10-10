import { MapData, Type } from "../types/MapData.type";
import { DrawingEntry } from "../types/DrawingData.type";

// accepts data for a single map and HTML template and generates an array of rectangles to draw
export async function parseMapData(mapData: MapData): Promise<DrawingEntry[]> {
  const dotSize = 2; // pixel size

  let rectangles: DrawingEntry[] = [];

  // this part generates the walls (collisions as it's called)
  mapData.map.forEach((coord, index) => {
    let fill = false;
    let x = 0;
    let y = index * dotSize;
    coord.forEach((plotx) => {
      let width = plotx * dotSize;

      // only the first (every odd) number is used
      // the second value is void space and not necessary
      fill = !fill;
      if (!fill) {
        rectangles.push({ x: x, y: y, w: width, h: dotSize, c: "#AAAAAA" });
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
        rectangles.push({
          x: x - size / 2,
          y: y - size / 2,
          w: size,
          h: size,
          c: "#FFFF00",
        });
      }
    }

    // NPCs
    if (mapObject.type === Type.NPC) {
      rectangles.push({
        x: x - dotSize / 2,
        y: y - dotSize / 2,
        w: dotSize,
        h: dotSize,
        c: "#FF0000",
      });
    }

    // Exits
    if (mapObject.type === Type.Exit) {
      let size = dotSize * 10;
      rectangles.push({
        x: x - size / 2,
        y: y - size / 2,
        w: size,
        h: size,
        c: "#FF00FF",
      });
    }
  });
  return rectangles;
}

export function getActualSize(rectangles: DrawingEntry[]): [number, number, number, number] {
  const minX: DrawingEntry = rectangles.reduce(function (prev, curr) {
    return prev.x < curr.x ? prev : curr;
  });

  const minY: DrawingEntry = rectangles.reduce(function (prev, curr) {
    return prev.y < curr.y ? prev : curr;
  });

  const maxX: DrawingEntry = rectangles.reduce(function (prev, curr) {
    return (prev.x + prev.w) > (curr.x + curr.w) ? prev : curr;
  });

  const maxY: DrawingEntry = rectangles.reduce(function (prev, curr) {
    return (prev.y + prev.h) > (curr.y + curr.h) ? prev : curr;
  });
  return [minX.x, minY.y, maxX.x + maxX.w, maxY.y + maxY.h];
}
