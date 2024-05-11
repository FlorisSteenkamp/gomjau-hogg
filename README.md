# This is a FORK of the original Antwerp.

The original Antwerp can be found on [Github](https://github.com/HHogg/antwerp).

The major differences are:
* the original Antwerp has a better demo
* runs optimally in `O(n)`; original runs in `O(n^3)` (where `n` is the number of tiles)
* 🔥blazingly fast🔥 - under a *micro*-second per tiled shape


<p align="center">
  <img src="./site/assets/antwerp.svg" />
</p>

<h2 align="center" style="margin: 0">ANTWERP</h2>
<h5 align="center" style="margin: 0">Application for Nets and Tessellations With Edge-to-edge Regular Polygons</h5>
<h5 align="center"  style="margin: 10px"><a href="https://antwerp.hogg.io">https://antwerp.hogg.io</a></h5>

<p align="center"  style="margin-top: 30px">
  A web application for visualising the <a href="https://hogg.io/writings/generating-tessellations">GomJau-Hogg notation</a> for generating any regular polygon tessellations.
</p>


## Installation

```
npm install gomjau-hogg
```

### Usage

```typescript
import { toShapes } from 'gomjau-hogg';

// Any tesselation in GomJau-Hogg notation
const configuration = '6-4-3,3/m30/r(h1)';

// transformation repetition count ~ c*sqrt of number of shapes tiled,
// e.g. `15` results in `1099` tiles for the above configuration
const repeatCount = 15;

// size of sidelength of shapes
const shapeSize = 25;  

const data = toShapes(configuration, repeatCount, shapeSize);

// `data` will be:
{
    maxStage: 9,
    maxStagePlacement: 4,
    shapes: [
        {
          "sides": 6,  // number of sides of shape -> hexagon in this case
          "stage": 0,  // transformation stage -> 0 means seed placement
          "stagePlacement": 1,  // stage within each transformation - can be used for coloring
          "θm": -6,    // the rotation angle of the shape in 𝜋/12 increments
          "c": [0,0]   // shape centroid
        },
        { "sides": 4, "stage": 0, "stagePlacement": 2, "θm": 16, "c": [ 13.660254037844375, 23.660254037844393 ] },
        ...
    ],
    transformPointsMaps: [Map(...)]  // map of transform points
}
```

To get the actual vertices of a shape just call:
```typescript
const { c, θm, sides } = shape;
fromCentroidAndAngle(c, θm, sides, shapeSize);  //=> array of points, i.e. `points: number[][]`
```


### Running the [demo](https://florissteenkamp.github.io/gomjau-hogg)

#### Clone the repo and install deps

git clone git@github.com:FlorisSteenkamp/gomjau-hogg.git\
npm i\
cd sever\
npm i\
cd..\
cd browser\
npm i

#### First run the server
```
cd server\
npm run go

```

#### Then build the index.js file (auto copied to server folder)

```
cd browser\
wepack -w
```

Then navigate to http://localhost:8080/ and click on the library icon at the top right.

### Demo Notes

The demo has been hacked from the [original](https://antwerp.hogg.io/) and for the
purpose of testing the library so lots of functionality has been removed mostly
because I struggled (and didn't have the time) getting things (mostly the newest
version of React Router and preshape) working but it's relatively easy to fix
all the shortcomings.

Most notably:
* no web workers
* `repeatCount` replaces `maxRepeat` in the web address search params
* cannot directly edit notation - must use the library
* options can only be set in the addess bar, an example being
  - http://localhost:8080/?configuration=6-4-3%2C3%2Fm30%2Fr(h1)&repeatCount=20&shapeSize=20
* several minor omissions, e.g. only one way of coloring, doesn't display transforms, etc.

