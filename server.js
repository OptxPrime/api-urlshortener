require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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

var dokle = 0;
var spasene = []

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

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
  //console.log( req.body );
  if (!isValidHttpUrl(req.body.url)) {
    res.json({ 'error': 'invalid url' })
  }
  const stranica = spasene.find(el => el.original_url === req.body.url);
  //console.log(stranica);
  if (stranica)
    res.json({ "original_url": req.body.url, "short_url": stranica.short_url })
  else {
    var obj = { "original_url": req.body.url, "short_url": dokle };
    spasene.push(obj);
    res.json(obj);
    dokle++;
  }
});





app.get('/api/shorturl/:url?', function (req, res) {
  console.log(req.params.url);
  var short = req.params.url;
  var original = spasene.find(el => el.short_url == short);
  //console.log(original.original_url);
  //res.json( {"originalni" :  original.original_url } );
  // res.redirect('http://'+ original.original_url);
  res.redirect(original.original_url);
});







app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});


