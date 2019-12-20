const creatures = require('./creatures');
const g = require('./geometry');
const report = require('./report');
const foods = require('./foods');

const props = {
    type: 'carnivor',
    initialEnergy: 150,
    energyFromFood: 100,
    replicateThreshold: 300,   // replicate if energy is above this threshold
    replicateEnergyCost: 150,
    ageEnergyPenalty: 0.01,
    senseRadius: 20,
    speed: 2,
    speedEnergyPenalty: 3,
    fightEnergyThreshold: 175,
    minAttackAge: 10
};

const prey = creature =>
    creatures
        .all()
        .filter(c => c.props.type !== creature.props.type);

const visibleOther = context =>
    creatures
        .all()
        .filter(c =>
            c.props.type === context.creature.props.type &&
            c.id !== context.creature.id &&
            context.age + (context.creature.createdOn - c.createdOn) > context.creature.props.minAttackAge) // victim candidate age
        .filter(c => g.dist(context.creature, c) < context.creature.props.senseRadius)
        .sort((c1, c2) => g.dist(context.creature, c1) - g.dist(context.creature, c2))
        [0];

const closestCreature = (creature, r) =>
    prey(creature)
        .reduce((closest, current) =>
            g.dist(creature, current) < r && g.dist(creature, current) < g.dist(creature, closest)
                ? current
                : closest,
            null);

const kill = (creature, victim) => {
    const {x, y} = victim;
    creatures.remove(victim);
    report.story(creature, 'killed ' + victim.id);
    report.story(victim, 'was killed by ' + creature.id);
    if (!foods.foodAt(x, y)) {
        foods.add({x, y});
    }
};

exports.props = props;

exports.execute = context => {
    const creature = context.creature;
    const foundPrey = creatures.at(creature).filter(c => c.props.type !== creature.props.type)[0];
    const prey = closestCreature(creature, creature.props.senseRadius);
    const closestVictim = visibleOther(context);

    if (foundPrey) {
        report.story(creature, 'eaten ' + foundPrey.id);
        report.story(foundPrey, 'was eaten by ' + creature.id);

        creatures.remove(foundPrey);
        creature.energy += creature.props.energyFromFood;

    } else if (creature.energy > creature.props.fightEnergyThreshold && context.age > creature.props.minAttackAge && closestVictim ) {
        if (closestVictim.x === creature.x && closestVictim.y === creature.y) {
            kill(creature, closestVictim);

        } else {
            report.story(creature, 'attacking ' + closestVictim.id);
            report.story(closestVictim, 'being attacked by ' + creature.id);
            context.goto(closestVictim);
        }

    } else if (creature.energy > creature.props.replicateThreshold) {
        context.replicate(context.turn);

    } else if (prey) {
        context.goto(prey);

    } else {
        context.gotoRandom();
    }
};