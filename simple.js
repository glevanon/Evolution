const foods = require('./foods');
const report = require('./report');
const g = require('./geometry');

const props = {
    type: 'simple',
    initialEnergy: 100,
    energyFromFood: 50,
    replicateThreshold: 150,   // replicate if energy is above this threshold
    replicateEnergyCost: 100,
    ageEnergyPenalty: 0.05,
    senseRadius: 10,
    speed: 1,
    speedEnergyPenalty: 8
};

const closestFood = (x, y, r) =>
    foods
        .all()
        .reduce((closest, current) =>
            g.dist({x, y}, current) < r && g.dist({x, y}, current) < g.dist({x, y}, closest)
                ? current
                : closest,
            null);

exports.props = props;

exports.execute = context => {
    const creature = context.creature;
    const foundFood = foods.foodAt(creature.x, creature.y);
    const closest = creature.closest && foods.foodAt(creature.closest.x, creature.closest.y)
        ? creature.closest
        : closestFood(creature.x, creature.y, creature.props.senseRadius);

    if (foundFood) {
        context.eat(foundFood);
        creature.closest = undefined;

    } else if (creature.energy > creature.props.replicateThreshold) {
        context.replicate(context.turn);

    } else if (closest) {
        creature.closest = closest;
        context.goto(closest);

    } else {
        context.gotoRandom();
    }
};