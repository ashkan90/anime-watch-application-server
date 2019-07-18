const express = require('express');

const app = express();
const scraper = require('./scrapper.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search/anime/:name', (req, res) => {
  scraper.animeSearch(req.params.name)
    .then((anime) => {
      res.json(anime);
    });
});

app.get('/anime/list', (req, res) => {
  scraper.animeList()
    .then(list => res.json(list));
});

app.get('/anime/details/:anime', (req, res) => {
  scraper.animeDetails(req.params.anime)
    .then(resp => res.json(resp));
});

app.get('/anime/ep/:url', (req, res) => {
  scraper.animeEpisode(req.params.url)
    .then(resp => res.json(resp));
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening: ${port}`);
});
