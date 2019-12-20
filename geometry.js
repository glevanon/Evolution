const world = require('./world');

const r = max => Math.floor(Math.random() * max);

const removeDuplicates = (p, i, arr) => arr.findIndex(p2 => p2.x === p.x && p2.y === p.y) === i

const around = (p, r = 1) =>
    (r == 0
        ? [p]
        : r == 1
            ? [
                p,
                {x: p.x-1, y: p.y},
                {x: p.x+1, y: p.y},
                {x: p.x, y: p.y-1},
                {x: p.x, y: p.y+1}]
            : around(p, r-1)
                .map(l => around(l, 1))
                .reduce((prev, current) => prev.concat(current), []))
      .filter(p =>
        p.x >=0 &&
        p.x < world.size
        && p.y >= 0 &&
        p.y < world.size)
      .filter(removeDuplicates);  // get rid of duplicates

exports.rPoint = () => ({
    x: r(world.size),
    y: r(world.size)
});

exports.around = around;

exports.dist = (o1, o2) =>
    o1 && o2
        ? Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)) // Pythagoras
        : 99999999;