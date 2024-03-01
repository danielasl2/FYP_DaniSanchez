require('dotenv').config();
const express = require('express');
const cookieRoutes = require('./routes/cookieRoute');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGODB_URI = "mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.isdd3bt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(cors());
app.use(express.json());
app.use('/api/cookies', cookieRoutes);

const port = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  console.log('Connected to DB on host %s and port %s', db.host, db.port);
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


