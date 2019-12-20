const world = require('./world');
const report = require('./report');
const turnContext = require('./turn-context');
const foods = require('./foods');
const creatures = require('./creatures');
const web = require('./web');

const express = require('express');
const app = express();

foods.create();
report.start();

app.get('/api', web.api);
app.get('/', web.file);
app.get(/.*/, web.file);

app.listen(world.port, () => {
  console.log(`Example app listening on port ${world.port}!`);
});

const runTurn = () => {
  world.turn += 1;
  foods.all().forEach(foods.maybeDuplicate);

  for (let x = 0; x < world.size; x++) {
    for (let y = 0; y < world.size; y++) {
      foods.maybeCreate(x, y);
    }
  }

  if (world.turn === world.creaturesCreatedAt) {
    creatures.create(world.turn);

  } else if (world.turn > world.creaturesCreatedAt) {

    creatures.all().forEach(c => {
      const context = turnContext.create(world.turn, c);
      creatures.turn(context)
    });

    creatures.endTurn();
  }

  report.turn(world.turn);
};

const runTurns = () => {

  const noMoreCreatures = creatures.all().length === 0 && world.turn > world.creaturesCreatedAt;

  if (world.turn >= world.maxTurns || noMoreCreatures) {
    report.end();

  } else {
    runTurn();
    setTimeout(runTurns, world.turnDuration);
  }
};


/******************************/
/* EXECUTION ******************/
/******************************/

world.turn = 0;
for (let i=0; i<world.setupDuration; i++) {
  runTurn();
}

console.log('World setup done');

runTurns();
