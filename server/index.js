const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; //use port 5000 unless there is already a preconfigured port

app.use(cors()); //used for the backend and frontend to communicate with eachother
app.use(express.json()); //used to parse incoming requests to json payloads (json payloads are key value pairs such as strings, objects, numbers, etc)

app.get('/', (req, res) => {
    res.send('Welcome to the Express server');
  }); //defines a route in the express.js server when a get request is made at the URL '/' with the message 'Welcome to the Express server'

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  }); //app.post is defining a post route at /api/login in a express.js server that extracts 'email' and 'password' from the request body

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }); //app.listen is starting an express.js server and listening on the specified port. It will log a message saying what port it is listening on
