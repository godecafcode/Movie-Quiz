const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/public/html' });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('server is up and running on port 3000');
});
