const world = require('./world');
const g = require('./geometry');
const report = require('./report');

const possibleTypes = [
    require('./simple'),
    require('./advanced'),
    require('./carnivor')
];

const possibleWeights = [5, 5, 1];
const types = [].concat(...possibleWeights.map((w, i) => Array(w).fill(possibleTypes[i]))); // creates an array [simple, simple, simple, advanced] based on weights & types

let creatures = [];
let nextId = 0;
const createId = () => nextId++;

const r = max => Math.floor(Math.random() * max);

const createCreature = (strategy, turn) => Object.assign(
    {},
    g.rPoint(),
    {
        energy: strategy.props.initialEnergy,
        id: createId(),
        createdOn: turn,
        execute: strategy.execute,
        props: JSON.parse( JSON.stringify(strategy.props))
    });

const strategy = () => types[r(types.length)];

exports.all = () => creatures;

exports.createCreature = createCreature;

exports.create = turn => {
    creatures = Array(world.initCreatureCount)
        .fill({})
        .map(ignore => createCreature(strategy(), turn));
};

exports.endTurn = () => {
    creatures = creatures.filter(c => c.energy > 0);
};

exports.turn = context => {

    const ageCost = Math.floor(context.age * context.creature.props.ageEnergyPenalty);

    const speedCost =
        Math.max(
            0,
            (context.creature.props.speed - 1)) *
        Math.max(
            ageCost + 1,
            context.creature.props.speedEnergyPenalty);

    const energyCost = ageCost + speedCost;

    context.creature.energy -= energyCost;
    report.story(context.creature, 'paid energy of ' + energyCost);
    context.creature.execute(context);
};

exports.at = p => creatures.filter(c => c.x === p.x && c.y === p.y);

exports.remove = c => creatures
    .splice(
        creatures.findIndex(candidate => candidate.id === c.id),
        1);