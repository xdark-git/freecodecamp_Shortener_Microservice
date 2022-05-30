require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require("body-parser");



//const myurl = require("./model/urlSchema.js").myurl;


// const { Schema } = mongoose;
// const count = require("./model/countSchema.js")

// creation an url schema

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const urlSchema = new Schema({
  url: String,
  ip: String,
  urlSortener:{
    type: Number,
    required: true,
    unique : true
  }
})
const count = new Schema({
  number: Number
})

let myurl =  mongoose.model("myurl", urlSchema);

let countN = mongoose.model("countN", count);
countN.createCollection().then(function(collection) {
  console.log('Collection is created!');
});
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

//url handling
app.post('/api/shorturl', (req, res, next)=>{
  
  let urlFetch = req.body.url;
  let url;
 const httpFormat = /^(http|https)(:\/\/)/
  if(!httpFormat.test(urlFetch)) return res.json({
    error: "invalid url"
  })
    
  try {
    url = new URL(urlFetch);
    console.log(url)
  } 
  catch (e) {
    console.log(e.toString())
    return res.json({ error: 'Invalid url' })
    // console.log("error")
  }

  var checkUrl = dns.lookup(url.hostname,(err,address, family)=>{
      //console.log(`${address} \n ${family}`)
      // console.log(url)
      /*
        checking if with the given url, the ipaddress exist
        in our collection
        if not then we create a new document
      */
    myurl.find({url: urlFetch}, (error, data)=>{
      
    if(error) return console.error(error)
    if(data.length===0)
    {
      let shortUrl;
      countN.find({}, (error, num)=>{
        if(error) return console.error(error)
        if(num.length === 0)
        {
          countN.create({number: 1})
          shortUrl = 1;
        }
        if(num.length > 0){
          // getting the number inside count collection and updating it
          shortUrl = num[0].number + 1;
          countN.findById({_id: num[0]._id},(err, doc)=>{
            if(err) console.error(err)
            doc.number = shortUrl;
            doc.save()
          })
        
        }
        // creating the a document in myurl
        myurl.create({
          url: urlFetch,
          ip:  address,
          urlSortener: shortUrl
        })

        
        return res.json({
          original_url: urlFetch,
          short_url: shortUrl
        })
      })
      
    }
    
      //fetch the data and display
     // console.log(data[0].url)
    if(data.length>0){
      // console.log(true)
      return res.json({
            original_url: data[0].url,
            short_url: data[0].urlSortener
          })
    }
        
    })
  })
  
})

app.get('/api/shorturl/:short_url', (req, res)=>
  {
    // console.log(req.params.short_url)
    myurl.find({urlSortener: req.params.short_url},(error, data)=>{
      if(data.length > 0){
        // console.log(data)
        res.writeHead(301, {
        Location: data[0].url
        }).end();
      }
    })
  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
