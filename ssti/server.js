require('dotenv').config();

const fs = require('fs'); // this engine requires the fs module
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const busboy = require('connect-busboy');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const uuid    = require('uuid').v4;
const { getRandomNonce, getHMAC } = require('./helper.js');

const app = express();

// Parser for post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CSP
app.use(function(req, res, next) {
  res.locals.nonce = getRandomNonce()
  res.setHeader("Content-Security-Policy", `script-src 'nonce-${res.locals.nonce}'`);
  return next();
});

// Cookies 
const secretSession = uuid() + uuid() + uuid();
app.use(cookieParser());
app.use(session({
  secret: secretSession,
  resave: true,
  saveUninitialized: true,
  name: 'id',
}));

// Upload file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Template
app.engine('html', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    
    var rendered = content.toString()
      .replace(/{{referer}}/g, options.referer)
      .replace(/{{token}}/g, options.token)
      .replace(/{{name}}/g, options.name)
      .replace(/{{nonce}}/g, options.nonce)
      .replace("{{comment}}", options.comment);

    return callback(null, rendered)
  });
});

app.set('views', './views') // specify the views directory
app.set('view engine', 'html') // register the template engine

function handleUndefinedValue(req) {
  if (!!req.session) {
    if (req.session.name == null || req.session.name == undefined) {
      req.session.name = "{{name}}";
    }
  }
  return req
}

// Routings
app.get('/', function(req, res) {
  req = handleUndefinedValue(req)
  res.render('index', {
    nonce: res.locals.nonce,
    comment: `<!-- Developer note 1: Template parsing order
    var rendered = content.toString()
  .replace(/{{referer}}/g, options.referer)
  .replace(/{{token}}/g, options.token)
  .replace(/{{name}}/g, options.name)
  .replace(/{{nonce}}/g, options.nonce) -->
    
    <!-- Developer note 2: somehow the referer in /gettoken automatically decodeURI, why???
        TODO: Fix this
    -->`,
  });
});

app.get('/upload', function(req, res) {
  req = handleUndefinedValue(req)
  res.render('upload');
});

app.use(busboy());
app.post('/upload', function(req, res) {
  console.log(req.headers['content-length'])
  if (req.headers['content-length'] > 1024) {
    console.log('aaaa')
    res.send("Expected file size to be <= 1KB. <br/> <a href='/upload'>")
    return
  }
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    filename = filename.replace(/\.\./g, '')
    filename = filename.replace(/\//g, '')
    if (filename.length === 0) {
      res.send("Something is wrong. <br/> <a href='/upload'>")
      return
    }
    //Path where image will be uploaded
    try {
      let fstream = fs.createWriteStream(path.join(__dirname, 'uploads', filename));
      file.pipe(fstream);
      fstream.on('close', function () {    
        res.send("Upload Finished on /uploads/" + filename);
      });
    } catch (err) {
      res.send("Something is wrong. <br/> <a href='/upload'>")
    }
  });
});

app.get('/changename', function(req, res) {
  req = handleUndefinedValue(req)
  if (req.query.name !== undefined) {
    req.session.name = req.query.name
  }
  res.render('changename', { name: req.session.name } );
});
app.post('/changename', function(req, res) {
  req = handleUndefinedValue(req)
  if (req.body.name !== undefined) {
    req.session.name = req.body.name
  }
  res.render('changename', { name: req.session.name } );
});

app.get('/gettoken', function(req, res) {
  req = handleUndefinedValue(req)
  const referer = req.header('Referer') || "{{referer}}";
  const referer_dec = decodeURIComponent(referer);

  const token = getHMAC(secretSession, req.session.id);
  res.render('gettoken', { referer: referer_dec, token, name: req.session.name });
});

app.listen(6666);