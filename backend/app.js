const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const mongoDBUri = 'mongodb://localhost:27017/cookiesDB' ; 
const cors = require('cors');
app.use(cors());

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected');
});