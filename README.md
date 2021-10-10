# d2-mapper

Diablo 2 maps are randomly generated based on a seed value and difficulty.  
There is another project which uses Diablo 2 to generate JSON payloads describing the layout of these maps.
This repo takes that data and creates PNGs and HTML pages showing maps visually.

Refer to this project for more info <https://github.com/blacha/diablo2/tree/master/packages/map>

This repo uses the above project as a backend server to generate data based on a given seed/difficulty.
If you don't have that project setup to fetch JSON data, this repo comes with a few sample payloads you can try.

At the moment this project is setup to take one sample output `src/public/data/26396577_Hell.json` and generate images from it.

## Examples

##### Durance of hate level 2

![Durance of hate level 2](duranceofhate.png)

##### Arcane Sanctuary

![Arcane Sancutuary](arcanesanctuary.png)

## Setup backend

This repo does not include the backend server.
Please refer to <https://github.com/blacha/diablo2/tree/master/packages/map>

However to get the above project working:

* Install Diablo 2 LOD 1.14b
* Install Project Diablo 2
* Install docker

```bash
docker pull blacha/diablo2
docker run -it -v "/E/Games/Diablo II":/app/game docker.io/blacha/diablo2:latest /bin/bash
wine regedit /app/d2.install.reg
wine bin/d2-map.exe game --seed 10 --level 1 --difficulty 0
```

The last wine command tests that it's working

This command will run a REST API server on port 8899:

```bash
docker run -v "/E/Games/Diablo II":/app/game -p 8899:8899 docker.io/blacha/diablo2:latest
```

### Install

```bash
npm install
npm build
```

### Execute example

```bash
npm run generate
```

```bash
npm run generate <seed> <difficulty>
npm run generate 26396577 2
```


This will generate HTML for every level in `./public/<seed>/<difficulty>` folder.
You can open these HTML pages in any browser.

`npm run generate` has a default seed value, but you can pass a seed value `npm run generate <seed>`

This repo has an already cached response for 26396577/Hell and 1294978398/Hell so you can run this without a backed for those 2 settings.

### Usage

This is published as a package that can be used to generate images from raw JSON.
It also has an API server, which is really used for demo purposes.

#### REST API

`npm run serve` will run an API server, where you could fetch images this way:

```typescript
imageUrl = `http://localhost:3001/v1/map/${seedDecimal}/${selectedDifficulty}/${mapId}/image`;
```

### Notes

* Purple box for exits
* Red dot for monsters
* Yellow box for waypoint.

## TODO

* Getting an isometric perspective to work is tricky to get right, it's a flat top down perspective for now
* Special icons/markings for exits and special items to be improved (bosses, special chests etc)
