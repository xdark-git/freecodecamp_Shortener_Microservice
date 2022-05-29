require('dotenv').config(); 

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

let { Schema } = mongoose;

const count = new Schema({
  number: Number
})

let countN = mongoose.model("countN", count);