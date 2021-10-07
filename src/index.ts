import * as rawData from './data/hell.json';
import readMapListData from './readMapListData';
import { MapList } from './types/MapData.type';

let mapList: MapList = <MapList>rawData;
readMapListData(mapList)