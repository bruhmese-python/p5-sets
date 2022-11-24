const X = 0,
    Y = 1;
const POS = 0,
    SIZE = 1,
    COLOR = 2;
const CENTRE_POS = [300, 300];
const LARGE_SIZE = [250, 250];
const SIZE_DELTA = 2.5;

var setDim = {};
var posMap = {};
var noOfSmallerSets = 0;
var allSets = [];
var sets = [];

function randomColor() {
    r = random(250);
    g = random(250);
    b = random(250);
    a = 255 / allSets.length;

    return color(r, g, b, a);
}

function toPair(p) {
    var split_pair = p.split(",");
    for (let coord of split_pair) parseInt(coord);
    return split_pair;
}
function addPair(A, B) {
    return [A[X] + B[X], A[Y] + B[Y]];
}
function dividePair(A, a) {
    if (a != 0) {
        return [A[X] / a, A[Y] / a];
    }
    return A;
}

function setup() {

    allSets = ["cats", "dogs", "zebras", "lions", "horses", "donkeys"];
    //   Exactly in order of allSets indices
    sets = [
        ["cats", "dogs", "donkeys", "zebras", "lions", "horses"],
        ["dogs", "cats", "donkeys", "zebras", "lions", "horses"],
        ["zebras", "cats", "dogs", "donkeys", "lions", "horses"],
        ["horses", "cats", "dogs", "donkeys", "zebras", "lions"],
        ["cats", "dogs", "zebras", "lions", "horses"],
        ["donkeys", "dogs", "horses"],
    ];

    // initializing hashmap
    for (let x of allSets) {
        setDim[x] = [CENTRE_POS, LARGE_SIZE, randomColor()];
    }

    //Count smaller sets
    for (let x of sets) {
        if (x.length < allSets.length) noOfSmallerSets++;
    }

    for (let i = 0; i < sets.length; i++) {
        let avgPosition = [0, 0],
            avgSize = [0, 0];
        for (let x of sets[i]) {
            avgPosition = addPair(avgPosition, setDim[x][POS]);
            avgSize = addPair(avgSize, setDim[x][SIZE]);
        }
        avgPosition = dividePair(avgPosition, sets[i].length);
        avgSize = dividePair(avgSize, sets[i].length);

        avgSize = dividePair(
            avgSize,
            (allSets.length - sets[i].length) * SIZE_DELTA
        );

        if (sets[i].length < allSets.length) {
            //should be large__radius - avg_radius
            var radius = addPair(
                dividePair(LARGE_SIZE, SIZE_DELTA),
                dividePair(avgSize, -2)
            );

            angle = (i / noOfSmallerSets) * Math.PI * 2;
            _x = avgPosition[X] + Math.cos(angle) * radius[X];
            _y = avgPosition[Y] + Math.cos(angle) * radius[Y];

            avgPosition = [_x, _y];
        }
        setDim[allSets[i]][POS] = avgPosition;
        setDim[allSets[i]][SIZE] = avgSize;
    }
    for (let x of allSets) {
        each_dim = setDim[x];
        if (posMap[each_dim[POS]] === undefined)
            posMap[each_dim[POS]] = x.toString();
        else posMap[each_dim[POS]] += ", " + x.toString();
    }

    createCanvas(600, 600);
    stroke("rgba(0,0,0,0.1)");
}

function draw() {
    for (let each in setDim) {
        each_dim = setDim[each];
        fill(each_dim[COLOR]);
        ellipse(
            each_dim[POS][X],
            each_dim[POS][Y],
            each_dim[SIZE][X],
            each_dim[SIZE][Y]
        );
    }

    for (let pos in posMap) {
        textSize(10);
        fill(255, 255, 255, 255);

        var _pos = toPair(pos);
        text(posMap[pos], _pos[X], _pos[Y]);
    }
}