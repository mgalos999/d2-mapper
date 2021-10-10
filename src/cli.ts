import { Difficulty } from './types/Difficulty.type';
import { generate} from './generateFromSeed';

let basePath: string = `./public/`;
let baseUrl: string = "http://localhost:8899";


// usage:

// npm run generate <seed in hex> <difficulty 0,1,2>
// e.g. npm run generate 0x109FA631 2


// default values
let seed: string = parseInt("0x109FA631", 16).toString();
let difficulty = Difficulty.Hell

var args = process.argv.slice(2);
if (args[0] !== undefined) {
    seed = parseInt(args[0], 16).toString();
}

if (args[1] !== undefined) {
    if (args[1] == '0') difficulty = Difficulty.Normal
    else if (args[1] == '1') difficulty = Difficulty.Nightmare
}

generate(seed, difficulty, basePath, baseUrl);
