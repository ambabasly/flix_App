const express = require('express');
  morgan = require('morgan'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

const requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
}

const myLogger = (req, res, next) => {
  console.log('Request URL: ' + req.url);
  next();
}

app.use(requestTime);
app.use(myLogger);
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
let movies = [
  {
    title: 'The Shawshank Redemption',
    rank: '1',
    genre: {
      gname: 'Drama',
      description: 'A category of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone'
    },
    director: {
      name: 'Frank A. Darabont',
      bio: ' A Hungarian-American film director, screenwriter and producer',
      born: '28.02.1959',
      died: '-'
    },
    description: 'This is a movie',
    imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/519NBNHX5BL._SY445_.jpg'
  },

  {
    title: 'The Godfather',
    rank: '2',
    genre: {
        gname: 'Crime',
        description: 'A film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection'
    },
    director: {
      name: 'Francis Ford Coppola',
      bio: ' An American film director, producer and screenwriter',
      born: '07.04.1939',
      died: '-'
    },
    description: 'This is another movie',
    imgUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR107,0,630,1200_AL_.jpg'
  },

  {
    title: 'The Godfather: Part II',
    rank: '3',
    genre: {
        gname: 'Crime',
        description: 'A film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection'
    },
    director: {
      name: 'Francis Ford Coppola',
      bio: ' An American film director, producer and screenwriter',
      born: '07.04.1939',
      died: '-'
    },
    description: 'This is the third movie',
    imgUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR107,0,630,1200_AL_.jpg'
  },

  {
    title: 'Pulp Fiction',
    rank: '4',
    genre: {
      gname: 'Comedy',
      description: 'Comedy may be divided into multiple genres based on the source of humor, the method of delivery, and the context in which it is delivered'
    },
    director: {
      name: 'Quentin Tarantino',
      bio: ' An American film director, screenwriter, producer, author, and actor',
      born: '27.03.1963',
      died: '-'
    },
    description: 'This is the fourth movie',
    imgUrl: 'https://3kek03dv5mw2mgjkf3tvnm31-wpengine.netdna-ssl.com/wp-content/uploads/2021/05/Pulp_Fiction.jpeg'
  },

  {
    title: 'The Good, the Bad and the Ugly',
    rank: '5',
    genre: {
      gname: 'Western',
      description: 'Western films as those set in the American West that embody the spirit, the struggle, and the demise of the new frontier'
    },
<<<<<<< HEAD
    director: {
      name: 'Sergio Leone',
      bio: ' An Italian film director, producer and screenwriter, credited as the creator of the Spaghetti Western genre',
      born: '03.01.1929',
      died: '30.04.1989'
    },
    description: 'This is the last movie',
    imgUrl: 'https://i.ytimg.com/vi/gcFH2Y7bdmk/movieposter_en.jpg'
  }
];

let users = [
  {
    id: 1,
    username: 'Peter',
    password: 'password1',
    email: 'peter@gmail.com',
    birthday: '2000-01-13'
  },

  {
    id: 2,
    username: 'Theo',
    password: 'password2',
    email: 'theo@gmail.com',
    birthday: '2001-04-23'
  },

  {
    id: 3,
    username: 'Fredrick',
    password: 'password3',
    email: 'fredrick@gmail.com',
    birthday: '1998-11-03'
  },

  {
    id: 4,
    username: 'Kenedy',
    password: 'password4',
    email: 'kenedy@gmail.com',
    birthday: '1985-07-27'
  }
];
=======
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
>>>>>>> 971b98e0a00f70b6d3de696ab8b105b01c1f109f

app.get('/', (req, res) => {

  const responseText = 'Welcome to my app!';
  responseText += '<small><br> Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

//movie requests
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.post('/movies', (req, res) => {

  const newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body!';
    res.status(400).send(message);
  }else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

app.get('/movies/directors/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.director.name === req.params.name;
  }));
});

app.get('/movies/genre/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.genre.gname === req.params.name;
  }));
});

//user requests
app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {

  const newUser = req.body;

  if (!newUser.username) {
    const message = 'Missing username in request body!';
    res.status(400).send(message);
  }else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

app.put('/users/:username', (req, res) => {

  const user = users.find((user) => { return user.username === req.params.username });

  if (!user) {
    res.status(404).send('User with the name ' + req.params.username + ' was not found.');
  } else {
    user.username = req.body.username;
    res.status(201).send('User ' + req.params.username + ' changed her/his name to: ' + user.username);
  }
});

app.delete('/users/:username', (req, res) => {

  const userToDelete = users.find((userToDelete) => { return userToDelete.username === req.params.username });

  if(userToDelete) {
    users = users.filter((obj) => { return obj.username !== req.params.username });
    res.status(201).send('User ' + req.params.username + ' was successfully deleted!');
  } else {
      res.status(404).send('User with the name ' + req.params.username + ' was not found.');
  }
});

//documentation
app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/documentation.html'));
});


app.get('/secreturl', (req, res) => {

  const responseText = 'This is a secret url with super top-secret content.';
  responseText += '<small><br> Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your server is live and listening on port 8080.');
});



