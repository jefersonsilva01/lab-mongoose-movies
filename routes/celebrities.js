const express = require('express');
const mongoose = require('mongoose');
const Celebrity = require('../models/Celebrity');
const router = express.Router();
require('dotenv/config');

const NAME = process.env.DB_NAME;
const URI = process.env.DB_URI;

mongoose.connect(`${URI}${NAME}`)
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => console.log("Error connecting to mongo: ", err));

router.get('/celebrities', (req, res, next) => {
  Celebrity.find()
    .then(celebrities => {
      res.render('./celebrities/index', { celebrities: celebrities });
    })
    .catch(error => next(error));
});

router.get('/celebrities/new', (req, res, next) => {
  res.render('./celebrities/new');
});

router.post('/celebrities/new', (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  const newCelebrity = new Celebrity({ name, occupation, catchPhrase });

  newCelebrity.save()
    .then(celebrity => {
      console.log(celebrity);
      res.redirect('/celebrities');
    })
    .catch(error => {
      console.log(error);
      res.render('./celebrities/new');
    });
});

router.get('/celebrities/:id', (req, res, next) => {
  const id = req.params.id;

  Celebrity.findById({ _id: id })
    .then(celebrity => {
      res.render('./celebrities/show', { celebrity: celebrity });
    })
    .catch(error => next(error));
});

router.post('/celebrities/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, occupation, catchPhrase } = req.body;

  Celebrity.update({ _id: id }, { name, occupation, catchPhrase })
    .then(() => {
      res.redirect('/celebrities')
    })
    .catch(error => next(error));
});

router.post('/celebrities/:id/delete', (req, res, next) => {
  const { id } = req.params;

  Celebrity.findByIdAndRemove({ _id: id })
    .then(() => {
      console.log('Celebrity deleted');
      res.redirect('/celebrities');
    })
    .catch(error => next(error));
});

router.get('/celebrities/:id/edit', (req, res, next) => {
  const id = req.params.id;

  Celebrity.findById({ _id: id })
    .then(celebrity => {
      res.render('./celebrities/edit', { celebrity: celebrity });
    })
    .catch(error => next(error));
});

module.exports = router;