const mongoose = require('mongoose');
const Celebrity = require('../models/Celebrity');
require('dotenv/config');

const celebrities = [
  {
    name: 'Brad Pitt',
    occupation: 'Actor',
    catchPhrase: 'I want my scalps'
  },

  {
    name: 'Samuel L. Jackson ',
    occupation: 'Actor',
    catchPhrase: 'Mother F#cker'
  },

  {
    name: 'Carrie-Anne Moss',
    occupation: 'Actress',
    catchPhrase: 'Dodge This'
  }
];

const NAME = process.env.DB_NAME;
const URI = process.env.DB_URI;

mongoose.connect(`${URI}${NAME}`)
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => console.log("Error connecting to mongo: ", err));

Celebrity.create(celebrities, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${celebrities.length} movies`);
  mongoose.connection.close();
}); 