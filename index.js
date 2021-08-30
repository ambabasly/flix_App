const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

// Logging middleware
app.use(morgan('common'));

// For the sending of static files
app.use(express.static('public'));

//use body-parser
app.use(bodyParser.json());

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

// Returning my top ten movies
app.get('/movies', (req, res) => {
  res.send('Successful GET request returning data on all the movies');
});

// Returning a welcoming message
app.get('/', (req, res) => {
  res.send('Welcome to my movie database!');
});

// Get data about a movie
app.get('/movies/:title', (req, res) => {
  res.json(topTenMovies.find((movie) => {
    return movie.title === req.params.title
  }));
});

// Add a movie
app.post('/movies', (req, res) => {
  let newMovie = req.body;
  if (!newMovie.title) {
    const message = 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    topTenMovies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

// Deletes a movie from the list by ID
app.delete('/movies/:id', (req, res) => {
  topTenMovies = topTenMovies.filter((obj) => { return obj.id !== req.params.id });
  res.status(201).send('Movie with the ID of ' + req.params.id + ' was deleted.');
  let movie = topTenMovies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    topTenMovies = topTenMovies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie with the ID of ' + req.params.id + ' was deleted.');
  } else {
    res.status(404).send(`Movie with the id ${req.params.id} was not found.`);
  }
});

// Update the year of a movie with the title
app.put('/movies/:title/:year', (req, res) => {
  let movie = topTenMovies.find((movie) => {
    return movie.title = req.params.title
  });
  if (movie) {
    movie.year = parseInt(req.params.year);
    res.status(201).send(`Movie ${req.params.title} was assigned the year of ${req.params.year}.`);
  } else {
    res.status(404).send(`Movie wit the title ${req.params.title} was not found.`);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something gone wrong mate!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

