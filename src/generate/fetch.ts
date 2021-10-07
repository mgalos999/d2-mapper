import fetch from 'cross-fetch';
import * as fs from 'fs';
import path = require('path');
import { MapList } from './types/MapData.type';

async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
  if (response.status !== 200) { throw 'Response not 200'; }
  return response.json();
}


function saveFile(fileName: string, data: MapList) {
    console.log(`Saving file ${fileName}`);
    if (!fs.existsSync(path.dirname(fileName))) fs.mkdirSync(path.dirname(fileName));
    fs.writeFileSync(fileName, JSON.stringify(data));
    console.log(`Cached JSON ${fileName}`)
}


export async function fetchData(seed: string, difficulty: string): Promise<MapList> {
    let cachedFile = `./build/data/${seed}_${difficulty}.json`;
    let url = `http://localhost:8899/${seed}/${difficulty}.json`

    // fetch the data from the web and save to ./build/data folder
    if (!fs.existsSync(cachedFile)) {
        console.log(`Fetching data from web ${url}`);
        const response: MapList = await getData(url);
        let mapList: MapList = <MapList> response;
        saveFile(cachedFile, mapList);
        return mapList;
    } else {
        // if it was previously saved, use the same file
        console.log(`Reading cached file ${cachedFile}`);
        const mapList: MapList = JSON.parse(fs.readFileSync(path.resolve(cachedFile), { encoding: 'utf8' }));
        return mapList;
    }
}


