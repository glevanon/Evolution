const foods = require('./foods');
const g = require('./geometry');
const report = require('./report');
const simple = require('./simple');

const closestUntaggedFood = c =>
    foods
        .all()
        .reduce((closest, current) =>
            !('tag' in current) && g.dist(c, current) < c.props.senseRadius && g.dist(c, current) < g.dist(c, closest)
                ? current
                : closest,
            null);

exports.props = {
    type: 'advanced',
    initialEnergy: 100,
    energyFromFood: 50,
    replicateThreshold: 150,   // replicate if energy is above this threshold
    replicateEnergyCost: 100,
    ageEnergyPenalty: 0.05,
    senseRadius: 10,
    speed: 1,
    speedEnergyPenalty: 10
};

exports.execute = context => {
    const creature = context.creature;
    const foundFood = foods.foodAt(creature.x, creature.y);
    const closest = closestUntaggedFood(creature);

    if (closest && 'tag' in closest && closest.tag !== creature.id) {
        report.story(creature, 'all food is tagged, switching to simple');
        simple.execute(context);

    } else if (foundFood) {
        context.eat(foundFood);

    } else if (creature.energy > creature.props.replicateThreshold) {
        context.replicate(context.turn);

    } else if (closest) {
        closest.tag = creature.id;
        context.goto(closest);

    } else {
        report.story(creature, 'no food is available, switching to simple');
        simple.execute(context);
    }
};