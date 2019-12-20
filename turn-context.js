const foods = require('./foods');
const creatures = require('./creatures');
const report = require('./report');
const world = require('./world');
const g = require('./geometry');

const r = max => Math.floor(Math.random() * max);

const eat = (c, f) => {
    foods.remove(f);
    c.energy += c.props.energyFromFood;
    report.story(c, 'eat food');
};

const moveToX = c => c.x--;
const moveAwayFromX = c => c.x++;
const moveToY = c => c.y--;
const moveAwayFromY = c => c.y++;

const goto = (c, p) => {
    let i = c.props.speed;
    while (i-- > 0 && (c.x !== p.x || c.y !== p.y)) {
        if (c.x > p.x) moveToX(c);
        if (c.x < p.x) moveAwayFromX(c);
        if (c.y > p.y) moveToY(c);
        if (c.y < p.y) moveAwayFromY(c);
        report.story(c, `steps left in this turn ${i} while going to ${JSON.stringify(p)} which is in distance ${g.dist(c, p)}`);
    }
};

const replicate = (c, turn) => {
    const child = creatures.createCreature(c, turn);
    child.x = c.x;
    child.y = c.y;

    Object.keys(child.props).forEach(propName => {
        if (r(world.mutationChance) === 0) {
            const v = child.props[propName];
            if (Number.isInteger(v)) {
                child.props[propName] = r(2) === 0
                    ? v + 1
                    : v - 1;
            }
            report.story(child, 'child born with a mutation on ' + propName);
        }
    });

    creatures.all().push(child);

    c.energy -= c.props.replicateEnergyCost;

    report.story(c, 'replicated ' + child.id);
    report.story(child, 'created from ' + c.id);
};

exports.create = (turn, creature) => ({
    turn,
    creature,
    age: turn - creature.createdOn,

    eat: food => eat(creature, food),
    goto: p => goto(creature, p),
    replicate: () => replicate(creature, turn),

    gotoRandom: () => {
        if (creature.temporaryDestination && (creature.temporaryDestination.x !== creature.x && creature.temporaryDestination.y !== creature.y)) {
            report.story(creature, 'continue my journey to random location');
            goto(creature, creature.temporaryDestination);

        } else {
            const p = g.rPoint();
            creature.temporaryDestination = p;
            report.story(creature, 'randomly picked a destination ' + JSON.stringify(p));
            goto(creature, p);
        }
    }
});