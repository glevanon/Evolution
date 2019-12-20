const foods = require('./foods');
const creatures = require('./creatures');
const world = require('./world');
const fs = require('fs');

module.exports.api = (req, res) => {
  try {
    res.send({
      world,
      foods: foods.all(),
      creatures: creatures.all()
    });
  } catch (err) {
    console.error('API failed to respond', err);
    res.status(500);
    res.send('API Error ' + err);
  }
};

module.exports.file = (req, res) => {
  try {
    const url = req.originalUrl;
    const filename =
      './web/' +
      (!url || url === '/'
        ? 'index.html'
        : url.substring(url.lastIndexOf('/') + 1, url.length));

    console.debug('serving file', filename);

    if (fs.existsSync(filename)) {
      res
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(fs.readFileSync(filename));
    } else {
      res.status(404);
      res.send('file ' + filename + ' not found');
    }

  } catch (err) {
    console.error('Failed to serve file', req.originalUrl, err);
    res.status(500);
    res.send('Error ' + err);
  }
};
