import fetch from "cross-fetch";
import * as fs from "fs";
import * as path from 'path';
import { MapList } from "../types/MapList.type";

async function getData(url = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow",
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  if (response.status !== 200) {
    throw "Response not 200";
  }
  return response.json();
}

async function fetchWebDataAndSave(cachedFile, url) {
  console.log(`Fetching data from web ${url}`);
  const mapList: MapList = await getData(url);
  saveFile(cachedFile, mapList);
  return mapList;
}

function saveFile(fileName: string, data: MapList) {
  console.log(`Saving file ${fileName}`);
  if (!fs.existsSync(path.dirname(fileName)))
    fs.mkdirSync(path.dirname(fileName), { recursive: true });
  fs.writeFileSync(fileName, JSON.stringify(data));
  console.log(`Cached JSON ${fileName}`);
}

export async function fetchData(
  baseUrl: string,
  seed: string,
  difficulty: string
): Promise<MapList> {
  let cachedFile = `./public/data/${seed}_${difficulty}.json`;
  let url = `${baseUrl}/v1/map/${seed}/${difficulty}.json`

  // fetch the data from the web and save to ./build/data folder
  if (!fs.existsSync(cachedFile)) {
    return await fetchWebDataAndSave(cachedFile, url);
  } else {
    // if it was previously saved, use the same file
    console.log(`Reading cached file ${cachedFile}`);
    const mapList: MapList = JSON.parse(
      fs.readFileSync(path.resolve(cachedFile), { encoding: "utf8" })
    );
    return mapList;
  }
}
