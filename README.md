# Northcoders News API


## Project Summary
NC News is a social news platform inspired by Reddit. It allows registered users to create articles, post comments and up/down vote articles. 

It's built using PSQL and Express.js to run the database and server.


## View my project 
You can view the hosted API at https://nc-news-xyud.onrender.com/ 


## Instructions
Follow these steps to create a copy of the project on your local machine for development and testing purposes: 

### Prerequisites

- Node.js v21.7.3 (or later) installed on your computer
- You will also need Postgres v14 (or later)

### Setup

- Clone repo from https://github.com/esmefrance/be-nc-news 
- Install dependencies using command:
```
npm install
```

### .env files
This Repository contains two databases (test and development). 
- You will need to create the following .env files for the code to run: 
1. **file name:** .env.test
```
PGDATABASE=[insert test database name]
```

2. **file name:** .env.development
```
PGDATABASE=[insert development database name]
```

3. **file name:** .env.production
```
DATABASE_URL=[insert URI connection string]
```

- Double check that all .env files are .gitignored.

## Running the code and tests
There are several scripts depending on whether you run the test or developer database:
- Setup the local database
```
npm run setup-dbs
```
_Required first time to setup the database and tables._

---
- Seed the developer database
```
npm run seed
```
_Seeds the developer database with the developer data._

---
- Test any of the test files
```
npm test [file_name]
```
For example
```
npm test app
```
will run the app.test.js test file.

_The test database will seed itself with the test data for each test._



## Acknowledgements
This portfolio project was created as part of a Full-Stack Web Development Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
