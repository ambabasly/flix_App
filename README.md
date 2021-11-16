# Project Name

**flix_App**

## Built With

- Javascript
- Node.js
- Express
- MongoDB
- Mongoose

- <img width="1430" alt="Screenshot 2021-10-13 at 00 06 06" src="https://user-images.githubusercontent.com/88083504/137035571-2eb09b54-5e82-4e91-a252-0788ec17b007.png">

## Getting Started

**The server-side component of a "movies" web application provides users with access to information about various movies, directors, and genres. Users can create an account, log in, update their personal information, and create a list of their favorite movies..**

### Feature Requirements:

- Return a list of ALL movies to the user.
- Return data (description, genre, director, image URL, whether it is featured or not) about a single movie by title to the user.
- Return data about a genre (description) by name/title (e.g. "Thriller")
- Return data about a director (bio, year of birth, year of death) by name
- Allow new users to register
- Allow users to update their user information (username, password, email, birthdate)
- Allow users to add a movie to their favorites list
- Allow users to remove a movie from their favorites list
- Allow existing users to log out

### Technical Requirements:

- The API is a Node.js and Express application.
- The API uses the REST architecture with URL endpoints corresponding to the data operations listed above.
- The API uses at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
- The API uses a "package.json" file.
- The database is created using MongoDB.
- The business logic is modeled using Mongoose.
- The API provides movie information in JSON format.
- The JavaScript code is error free.
- The API is tested in Postman.
- The API includes code for user authentication and authorization.
- The API contains logic for data validation.
- The API complies with data security regulations.
- The source code of the API is deployed on a publicly available platform such as GitHub.
- The API is deployed on Heroku.

### Dependencies:

- bcrypt
- body-parser
- cors
- express
- validator
- jsonwebtoken
- lodash
- mongoose
- morgan
- nodemon
- passport
- passportjtw
- passport-local
- uuid
