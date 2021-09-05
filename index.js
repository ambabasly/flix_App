const mongoose = require('mongoose');
const Models = require('./models.js');

// const Movies = Models.Movie;
const Movies = Models.Movie;
const Users = Models.User;

//This allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within your REST API
mongoose.connect('mongodb://localhost:27017/myFlix_AppDB', { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express');
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
  //methodOverride = require('method-override');

const app = express();

const myLogger = (req, res, next) => {
  console.log('Request URL: ' + req.url);
  next();
}
// Logging middleware
app.use(morgan('common'));

// For the sending of static files
app.use(express.static('public'));

// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
    Director: {
      Name: 'Sergio Leone',
      Bio: "An Italian film director, producer and screenwriter, credited as the creator of the Spaghetti Western genre",
      Born: '03.03.1929',
      died: '30.04.1989'
    },
    description: 'This is the fourth movie',
    ImagePath: 'https://i.ytimg.com/vi/gcFH2Y7bdmk/movieposter_en.jpg'
   },

  {
    title: 'Equalizer',
    rank: '6',
    genre: {
      gname: 'Action',
      Description: 'A film genre in which the protagonist or protagonists are thrust into a series of event'
    },
    Director: {
      Name:'Antoine Fuqua',
      Bio: 'Antoine Fuqua is an American filmmaker and comic artist. He was originally known for directing music videos for Toni Braxton, Coolio, Stevie Wonder and Prince including the music video for Gangsta Paradise',
      Born: '1966',
      died: '-'
    },
    Description: 'The film focuses on a former U.S. Marine turned DIA intelligence officer who reluctantly returns to action to protect a teenage prostitute from members of the Russian mafia',
    ImagePath: 'https://m.media-amazon.com/images/M/MV5BMTQ2MzE2NTk0NF5BMl5BanBnXkFtZTgwOTM3NTk1MjE@._V1_UX67_CR0,0,67,98_AL_.jpg'
  },

  {
    title: 'Training Day',
    rank: '7',
    genre: {
      game: 'Action',
      Description: 'A film genre in which the protagonist or protagonists are thrust into a series of events'
    },
    Director: {
      Name:'Antoine Fuqua',
      Bio: 'Antoine Fuqua is an American filmmaker and comic artist. He was originally known for directing music videos for Toni Braxton, Coolio, Stevie Wonder and Prince including the music video for Gangsta Paradise',
      Born: '1966'
    },
    Description: 'Two LAPD narcotics officers over a 24-hour period in the gang-ridden neighborhoods of Westlake, Echo Park and South Central Los Angeles',
    ImagePath: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Training_Day_Poster.jpg'
  },

  {
    Title: 'Olympus Has Fallen',
    rank: '8',
    Genre: {
      Name: 'Action',
      Description: 'A film genre in which the protagonist or protagonists are thrust into a series of events'
    },
    Director: {
      Name:'Antoine Fuqua',
      Bio: 'Antoine Fuqua is an American filmmaker and comic artist. He was originally known for directing music videos for Toni Braxton, Coolio, Stevie Wonder and Prince including the music video for Gangsta Paradise',
      Born: '1966'
  },
    Description: 'Two LAPD narcotics officers over a 24-hour period in the gang-ridden neighborhoods of Westlake, Echo Park and South Central Los Angeles',
    ImagePath: 'https://upload.wikimedia.org/wikipedia/en/b/bf/Olympus_Has_Fallen_poster.jpg'
  },

  {
    Title: 'Inception',
    rank: '9',
    Genre: {
      Name: 'Action',
      Description: 'A film genre in which the protagonist or protagonists are thrust into a series of events'
    },
    Director: {
      Name:'Christopher Nolan',
      Bio: 'British film director and writer acclaimed for his noirish visual aesthetic and unconventional, often highly conceptual narratives',
      Born: '1970'
  },
    Description: 'The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets',
    ImagePath: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_UX67_CR0,0,67,98_AL_.jpg',
    },


  {
    Title: 'John Wick',
    rank: '10',
    Genre: {
      Name: 'Action',
      Description: 'A film genre in which the protagonist or protagonists are thrust into a series of events'
    },
    Director: {
      Name:'Chad Stahelski',
      Bio: 'Chad Stahelski is an American stuntman and film director. He is known for directing 2014 film John Wick along with David Leitch, and for doubling Brandon Lee after the fatal accident involving Lee at the set of The Crow (1994)',
      Born: '1968'
  },
    Description: 'The story focuses on John Wick (Reeves) searching for the men who broke into his home, stole his vintage car and killed his puppy, which was a last gift to him from his recently deceased wife',
    ImagePath: 'https://static.wikia.nocookie.net/john-wick8561/images/a/a1/John_Wick_Poster_001.jpg/revision/latest/scale-to-width-down/666?cb=20161128160702',
  }
  ]

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix');
});

//get all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Update a user's info, by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:ID/deactivate', (req, res) => {
  res.send('Successful DELETE request removing user');
});
  
// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Error: ' + err);
    });
});

// Delete a movie from the favorite list of an user
app.delete('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Name: req.params.Name}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8081, () => {
  console.log('Your server is live and listening on port 8081.');
});

// return data about a genre by name/title
app.get('/movies/genres/:genre', (req, res) => {
  res.send('Successful GET request returning data on a single genre');
});
app.get('/genres/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data about a director by name
app.get('/movies/directors/:director', (req, res) => {
  res.send('Successful GET request returning data on a single director');
});
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/genre/:name', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.genre.gname === req.params.name;
  }));
});

// allow users to deregister
// // remove a movie from user favorites by ID
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});