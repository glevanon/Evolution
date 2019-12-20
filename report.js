const world = require('./world');
const fs = require('fs');
const foods = require('./foods');
const creatures = require('./creatures');

const lines = [];
const gfxLines = [];
const fileName = '/Users/guylevanon/Desktop/1';

exports.start = () => {
    lines.push(`max turns,${world.maxTurns}`);
    lines.push(`size,${world.size}`);
    lines.push(`start foods,${world.initFoodCount}`);
    lines.push(`food replication,1:${world.foodReplicationChance}`);
    lines.push(`food creation,1:${world.foodCreationChance}`);
    lines.push('');
    lines.push(`start creatures,${world.initCreatureCount}`);
    lines.push(`creatures join turn,${world.creaturesCreatedAt}`);
    lines.push('');
    lines.push('turn,foods,simple,advanced,carnivor,total');
};

exports.end = () => {
    const csvFileName = fileName + '.csv';
    const mapFileName = fileName + '.txt';
    const creaturesFileName = fileName + '.creatures.txt';

    fs.writeFile(csvFileName, lines.join('\n'), (err) => {
        if (err) console.log(err);
        console.log('Successfully Written to File ', csvFileName);
    });

    fs.writeFile(creaturesFileName, creatures.all().map(JSON.stringify).join('\n'), (err) => {
        if (err) console.log(err);
        console.log('Successfully Written to File ', creaturesFileName);
    });

    if (world.tellStory) {
        fs.writeFile(mapFileName, gfxLines.join('\n'), (err) => {
            if (err) console.log(err);
            console.log('Successfully Written to File ', mapFileName);
        });
    }


};

exports.turn = turn => {
    const simpleCount = creatures.all().filter(c => c.props.type === 'simple').length;
    const advancedCount = creatures.all().filter(c => c.props.type === 'advanced').length;
    const carnivorCount = creatures.all().filter(c => c.props.type === 'carnivor').length;
    const msg = `${turn}, ${foods.all().length}, ${simpleCount}, ${advancedCount}, ${carnivorCount}, ${creatures.all().length}`;
    console.log(msg);
    lines.push(msg);

    if (world.tellStory) {
        const board = Array(world.size).fill({}).map(ignore => Array(world.size).fill(' '));
        foods.all().forEach(f => board[f.x][f.y] = '.');
        creatures.all().forEach(c => board[c.x][c.y] = c.props.type[0]);

        gfxLines.push(`Turn ${turn}`);
        gfxLines.push(`-============---`);
        board.forEach(l => gfxLines.push(l.join('')));
        gfxLines.push('');
    }
};

exports.story = (creature, msg) => {
    if (world.tellStory && world.trackedCreatures.includes(creature.id)) {
        console.log(`${creature.id} ${msg}   `, JSON.stringify(creature));
    }
};