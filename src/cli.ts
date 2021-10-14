import { Difficulty } from './types/Difficulty.type';
import { generate, generateSingle} from './generateFromSeed';

let basePath: string = `./public/`;
let baseUrl: string = process.env.BASEURL;

// usage:
// npm run generate <seed in hex> <difficulty 0,1,2>
// e.g. npm run generate 0x109FA631 2


const defaultSeed: string = "0x109FA631"; // hex value

// default values
let seed: string = parseInt(defaultSeed, 16).toString();
let difficulty = Difficulty.Hell

var args = process.argv.slice(2);
if (args[0] !== undefined) {
    seed = parseInt(args[0], 16).toString();
}

if ((seed !== defaultSeed) && (baseUrl === undefined)) {
    throw Error("Need to set BASEURL environment variable, e.g. set BASEURL=http://localhost:8899");
}

if (args[1] !== undefined) {
    if (args[1] == '0') difficulty = Difficulty.Normal
    else if (args[1] == '1') difficulty = Difficulty.Nightmare
}

if (args[2] !== undefined) {
    generateSingle(seed, difficulty, basePath, baseUrl, Number(args[2]));
} else {
    generate(seed, difficulty, basePath, baseUrl);
}

