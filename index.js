const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let movieId = 0;
let userId = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

// app.get("/", (req, res) => {
//   res.status(200).send(`
//   <style type="text/css">
//     h1 {
//       color: #fedde1;
//       position: fixed;
//       top: 50%;
//       left: 50%;
//       transform: translate(-50%, -50%);
//     }
//   </style>
//   <h1>
//     Welkom op in mijn api!
//   <h1>`)
// });

app.post("/api/movie", (req, res) => {
  let movie = req.body;
  movieId++;
  movie = {
    type:"movie",
    id:movieId,
    ...movie,
  };
  console.log(movie);
  database.push(movie);
  res.status(201).json({
    status: 201,
    result: movie,
  });
});

// app.get("/api/movie/:movieId", (req, res, next) => {
//   const movieId = req.params.movieId;
//   console.log(`Movie met ID ${movieId} gezocht`);
//   let movie = database.filter((item) => item.id == movieId);
//   if (movie.length > 0) {
//     console.log(movie);
//     res.status(200).json({
//       status: 200,
//       result: movie,
//     });
//   } else {
//     res.status(401).json({
//       status: 401,
//       result: `Movie with ID ${movieId} not found`,
//     });
//   }
// });

// app.get("/api/movie", (req, res, next) => {
//   res.status(200).json({
//     status: 200,
//     result: database,
//   });
// });

app.get("/api/user", (req, res) => {
  res.status(200).json({
    status: 200,
    result: database.filter((item) => item.type == "user"),
  });
});

app.post("/api/user", (req, res) => {
  let user = req.body;

  if(user.email != null && database.filter((item) => item.email == user.email).length == 0){
    userId++;
    user = {
      type:"user",
      id:userId,
      ...user,
    };
    console.log(user);
    database.push(user);
    res.status(201).json({
      status: 201,
      result: user,
    });
    return;
  }

  res.status(400).json({
    status: 400,
    result: "An email has not been specified or is already in use.",
  });
  
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
