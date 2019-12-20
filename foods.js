const world = require('./world');
const g = require('./geometry');

const r = max => Math.floor(Math.random() * max);

const foodAt = (x, y) => foods.filter(c => c.x === x && c.y === y)[0];

let foods = [];

exports.all = () => foods;
exports.foodAt = foodAt;
exports.add = p => foods.push(p);

exports.create = () => {
    foods = Array(world.initFoodCount)
        .fill({})
        .map(ignore => g.rPoint());
};

exports.maybeDuplicate = food => {
    if (r(world.foodReplicationChance) === 0) {
        g.around(food).forEach(p => {
            if (!foodAt(p.x, p.y)) {
                foods.push(p);
            }
        })
    }
};

exports.maybeCreate = (x, y) => {
    if (r(world.foodCreationChance) === 0) {
        if (!foodAt(x, y)) {
            foods.push({x, y})
        }
    }
};

exports.remove = f => foods
    .splice(
        foods.findIndex(candidate => candidate.x === f.x && candidate.y === f.y),
        1);

