var express = require('express');
var bodyParser = require('body-parser');
var Channels = require('./Channels');
import mongoose from 'mongoose';
import reposRoute from './routes/repo';
import githubwebhookRoute from './routes/githubwebhook';
import dotenv from 'dotenv';

import Repo from './models/Repo';

dotenv.config()

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL,  { useMongoClient: true});


var app = express();
app.use(bodyParser.json());

app.use('/images', express.static('images'));
app.use('/repos', reposRoute);
app.use('/githubwebhook', githubwebhookRoute);

app.use(express.static('documentation'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Gitbot is up and running on port ', process.env.PORT || 3000);
});



