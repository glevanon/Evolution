exports.maxTurns = 1000;
exports.size = 100;
exports.initFoodCount = 400;
exports.foodReplicationChance = 50; // chance that an existing food duplicates. units are "to one", for example 1000 means 1:1000 chance of replication
exports.foodCreationChance = 100; // chance for an empty spot to spontaneously create food. units are "to one", for example 1000 means 1:1000 chance of replication

exports.initCreatureCount = 400;
exports.creaturesCreatedAt = 10;
exports.mutationChance = 50;  // chance a property will change on replication. units are "to one", for example 1000 means 1:1000 chance of replication

exports.tellStory = false;
exports.trackedCreatures = [10000];

exports.port = 3000;
exports.turnDuration = 1000;
exports.setupDuration = 100;
