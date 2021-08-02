const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, '/public'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/history');
});

app.get('/history', (req, res) => {
  res.render('index.html');
});

app.get('/chart', (req, res) => {
  res.render('index.html');
});

app.get('/calendar', (req, res) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`Domino app is now runing at http://localhost:${port}`);
});
