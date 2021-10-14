import * as express from "express";
import * as fs from 'fs';
import { fetchData } from "../process/fetch";
import readMapListData from "../process/parseMapListData";
import { MapList } from "../types/MapData.type";
import { generateHTML, generateHTMLfromMap } from "../process/generateHTML";
import { generatePNG, generatePNGfromMap } from "../process/generatePNG";

const baseUrl = process.env.BASEURL

const app = express();
app.listen(3001, () => {
 console.log("Server running on port 3001");
});
// Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/v1/map/:seed/:difficulty", async (req, res) => {
    const seed = req.params.seed;
    const difficulty = req.params.difficulty;
    const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
    res.json(mapList);
});

app.get("/v1/map/:seed/:difficulty/:mapid/html", async (req, res) => {
    const seed: string = req.params.seed;
    const difficulty: string = req.params.difficulty;
    const mapid: string = req.params.mapid;
    const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
  
    const templateHTML: string = fs.readFileSync(
      "./src/process/template/template.html",
      { encoding: "utf8" }
    );
    const html: string = await generateHTMLfromMap(mapList.maps[mapid], "", templateHTML);
    res.send(html);
});

app.get("/v1/map/:seed/:difficulty/:mapid/image", async (req, res) => {
    const seed: string = req.params.seed;
    const difficulty: string = req.params.difficulty;
    const mapid: string = req.params.mapid;
    
    const mapList: MapList = await fetchData(baseUrl, seed, difficulty);
    const pngBuffer: Buffer = await generatePNGfromMap(mapList.maps[mapid], "");
    const base64Data = pngBuffer.toString('base64').replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const img = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
});

