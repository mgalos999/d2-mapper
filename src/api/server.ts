import * as express from "express";
import { fetchData } from "../process/fetch";
import { MapList } from "../types/MapList.type";
import { generatePNGfromMap } from "../process/generatePNG";
import { param, validationResult } from "express-validator";

const baseUrl = process.env.BASEURL;

const app = express();
app.listen(3001, () => {
  if (baseUrl === undefined) {
    throw new Error("BASEURL environment variable needs to be set");
  }
  console.log("Server running on port 3001");
});
// Add headers before the routes are defined
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get(
  "/v1/map/:seed/:difficulty",
  param("seed").isNumeric(),
  param("difficulty").isNumeric(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const seed = req.params.seed;
      const difficulty = req.params.difficulty;
      const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
      res.json(mapList);
    } catch (err) {
        res.status(500).json(err);
    }
  }
);

app.get(
  "/v1/map/:seed/:difficulty/:mapid/image",
  param("seed").isNumeric(),
  param("difficulty").isNumeric(),
  param("mapid").isNumeric(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const seed: string = req.params.seed;
      const difficulty: string = req.params.difficulty;
      let mapid: string = req.params.mapid;

      const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
      const thisMap = mapList.levels.find(level => level.id === parseInt(mapid));
      const pngBuffer: Buffer = await generatePNGfromMap(thisMap);
      const base64Data = pngBuffer
        .toString("base64")
        .replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const img = Buffer.from(base64Data, "base64");

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": img.length,
      });
      res.end(img);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
