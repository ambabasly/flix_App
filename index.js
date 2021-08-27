const express = require('express');
morgan = require('morgan');

const app = express();

// Logging middleware
app.use(morgan('common'));

// For the sending of static files
app.use(express.static('public'));

// An array of objects with my top ten movies
let topTenMovies = [
    {
      id: 1,
      id: '1',
      title: 'Power',
      year: '2014'
    },
    {
      id: 2,
      id: '2',
      title: 'Godfather of Harlem',
      year: '2019'
    },
    {
      id: 3,
      id: '3',
      title: '24',
      year: '2001'
    },
    {
      id: 4,
      id: '4',
      title: 'Spartacus',
      year: '2010'
    },
    {
      id: 5,
      id: '5',
      title: 'Prison Break',
      year: '2005'
    },
    {
      id: 6,
      id: '6',
      title: 'Underworld',
      year: '2004'
    },
    {
      id: 7,
      id: '7',
      title: 'Training Day',
      year: '2001'
    },
    {
      id: 8,
      id: '8',
      title: 'Inception',
      year: '2010'
    },
    {
      id: 9,
      id: '9',
      title: 'John Wick',
      year: '2015'
    },
    {
      id: 10,
      id: '10',
      title: 'Equalizer',
      year: '2014'
    }
  ]

app.use(express.static('public'));

app.get('/', (req, res) => { 
    res.send('Welcome to my top ten movie list!');
});
app.get('/movies', (req, res) => { 
    res.json(topTenMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/*app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  }); */

