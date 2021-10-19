import { Level, ObjectType } from "../types/MapList.type";
import { Circle, DrawingElements, Rectangle } from "../types/DrawingData.type";
import { MapMod } from "../types/MapMod.type";
import { mapRefList } from '../refdata/mapLabels.json';
import { MapRefData } from "../types/MapRefData";

// accepts data for a single map and HTML template and generates an array of rectangles to draw
export async function parseMapData(levelData: Level, mapAttributes: MapMod): Promise<DrawingElements> {
  
  const dotSize = 2; // pixel size
  let de: DrawingElements = { rectangles: [], circles: [], icons: [], text: [] };

  // this part generates the walls (collisions as it's called)
  levelData.map.forEach((coord, index) => {
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
  levelData.objects.forEach((mapObject) => {
    let x = (mapAttributes.xOffset + mapObject.x) * dotSize;
    let y = (mapAttributes.yOffset + mapObject.y) * dotSize;

    // waypoints
    if (mapObject.type === ObjectType.Object) {
      if (mapObject.name == "Waypoint") {
        let size = dotSize * 10;
        de.rectangles.push({x: x - size / 2, y: y - size / 2, w: size,h: size, c: "#FFFF00"});
      }

      if (mapObject.name == "chest") {
        de.rectangles.push(drawObjRectangle(1, x, y, "#00FFFF"));
      }

      // mark super chests in lower kurast for farming
      if (levelData.name == "Lower Kurast") {
        //if (mapObject.name === undefined) {
        //if (mapObject.id === 581) {
          de.rectangles.push(drawObjRectangle(1, x, y, "#00DDFF"));
        //}
        //}
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
    if (mapObject.type === ObjectType.NPC) {
      // magot lair boss
      if (levelData.name == "Maggot Lair Level 3") {
        de.circles.push(drawObjRectangle(dotSize, x, y, "#FF0000"));    
      } else {
        de.circles.push({x: x, y: y, w: dotSize, h: dotSize, c: "#FF0000" });
      }
    }

    // Exits
    if (mapObject.type === ObjectType.Exit) {
      // console.log(`${mapData.id},${mapData.name},${mapObject.id}`);
      let size = dotSize * 10;

      de.rectangles.push({
        x: x - size / 2,
        y: y - size / 2,
        w: size,
        h: size,
        c: "#FF00FF",
      });
      
      // the id of the exit object is the id of the map itself
      let textColor = "#FFFFFF";
      let fontSize = 20;
      const mapList: MapRefData = mapRefList.find(map => map.id == mapObject.id);
      let mapLabel = mapList?.name ? mapList.name : ""
      if (mapLabel) {
        const lastDigitExitLocation = mapLabel.substr(-1);
        const lastDigitCurrentMap = levelData.name.substr(-1);
        
        if (isNumeric(lastDigitCurrentMap) && isNumeric(lastDigitExitLocation)) {
          mapLabel = `L${lastDigitExitLocation}`;
          textColor = "#000000";
          fontSize = 18;
        }
        de.text.push({x: x, y:y, fontSize: fontSize, text: mapLabel, c: textColor});
      }
    }
  });
  return de;
}

const isNumeric = (value: string): boolean =>
  !new RegExp(/[^\d]/g).test(value.trim());

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
