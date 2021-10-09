import { Difficulty } from './generate/types/Difficulty.type';
import { generate} from './generateFromSeed';

let basePath: string = `./dist/html/`;
let baseUrl: string = "http://localhost:8899";

// change seed value or difficulty here
let seed: string = parseInt("0x0192C7A2", 16).toString();

generate(seed, Difficulty.Hell, basePath, baseUrl);
