require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res, next)=>{
  let urlFetch = req.body.url;
    
  let url;
  
  try {
    url = new URL(urlFetch);
  } catch (_) {
    return res.json({
      error: "Invalid URL"
    })
  }

     var checkUrl = dns.lookup(url.hostname,(err,address, family)=>{
       console.log(`${address} \n ${family}`)
     })
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
