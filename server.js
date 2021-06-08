require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/local';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var ObjectId = require('mongodb').ObjectID;

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  original_url: String,
  // shortu_url: String
});


var Url = mongoose.model('Url', urlSchema);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

var spasene = []


function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

app.post('/api/shorturl', function (req, res) {

  if (!isValidHttpUrl(req.body.url)) {
    res.json({ 'error': 'invalid url' })
  }

  //const stranica = spasene.find(el => el.original_url === req.body.url);


  Url.find({ 'original_url': req.body.url }, function (err, athletes) {
    if (err) return handleError(err);
    if (athletes.length > 0)
      res.json({ "original_url": req.body.url, "short_url": athletes[0]._id });
    else {
      var instanca_url = new Url({ original_url: req.body.url });

      // Save the new model instance, passing a callback
      instanca_url.save(function (err, data) {
        if (err) return handleError(err);

        res.json({ "original_url": req.body.url, "short_url": data._id });

      });

    }

  });


});





app.get('/api/shorturl/:url?', function (req, res) {
  var short = req.params.url;

  Url.findById(short, function (err, data) {
    if (err)
      return handleError(err);
    //console.log(data.original_url);
    res.redirect(data.original_url);
  });
});



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});


