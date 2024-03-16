const express = require('express');
const mongoose = require('mongoose');
const Celebrity = require('../models/Celebrity');
const Movie = require('../models/Movie');
const router = express.Router();
require('dotenv/config');

const NAME = process.env.DB_NAME;
const URI = process.env.DB_URI;

mongoose.connect(`${URI}${NAME}`)
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => console.log("Error connecting to mongo: ", err));

router.get('/movies', (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render('./movies/index', { movies: movies });
    })
    .catch(error => next(error));
});

router.get('/movies/new', (req, res, next) => {
  Celebrity.find()
    .then(celebrities => {
      res.render('./movies/new', { celebrities: celebrities });
    })
    .catch(error => next(error));
});

router.post('/movies', (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  const newMovie = new Movie({ title, genre, plot, cast });

  newMovie.save()
    .then(movie => {
      console.log(movie);
      res.redirect('/movies');
    })
    .catch(error => next(error));
});

router.get('/movies/:id', (req, res, next) => {
  const id = req.params.id;

  Movie.findById({ _id: id })
    .populate('cast')
    .then(movie => {
      console.log(movie);
      res.render('./movies/show', { movie: movie });
    })
    .catch(error => next(error));
});

router.post('/movies/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Movie.findByIdAndRemove({ _id: id })
    .then(() => {
      console.log('Movie deleted');
      res.redirect('/movies');
    })
    .catch(error => next(error));
});

router.get('/movies/:id/edit', (req, res, next) => {
  const id = req.params.id;
  let allCelebrities = [];

  Celebrity.find()
    .then(celebrities => {
      allCelebrities = [...celebrities];
    })
    .catch(error => next(error));

  Movie.findById({ _id: id })
    .populate('cast')
    .then(movie => {
      allCelebrities.forEach(celeb => {
        movie.cast.forEach(element => {
          if (element.id === celeb.id) allCelebrities.splice(celeb, 1);
        });
      });
      res.render('./movies/edit', { movie, allCelebrities })
    })
});

router.post('/movies/:id', (req, res, next) => {
  const id = req.params.id;
  const { title, genre, plot, cast } = req.body;

  Movie.update({ _id: id }, { title, genre, plot, cast })
    .then(() => {
      res.redirect(`/movies/${id}`)
    })
    .catch(error => next(error));
})

module.exports = router;