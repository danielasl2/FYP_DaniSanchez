const express = require('express');
const cookieRoutes = require('../backend/routes/cookieRoute');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cookiesDB' ; 

app.use(cors());
app.use(express.json());
app.use('/api', cookieRoutes);

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

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
db.on('connected', function() {
  console.log('Mongoose default connections is ope to ', mongoDBUri);
});
db.on('error', function(err) {
  console.log('Mongoose default connection has occurred ' + err + ' error');
})

process.on('SIGINT', function() {
  db.close(function() {
      console.log('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
  });
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
