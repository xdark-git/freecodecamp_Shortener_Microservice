// const mongoose = require("../dbConnection/connect.js") 
require('dotenv').config(); 

// let mongoose;
// try {
//   mongoose = require("mongoose");
// } catch (e) {
//   console.log(e);
// }

// const { Schema } = mongoose;

// const urlSchema = new Schema({
//   url: String,
//   ip: String,
//   urlSortener:{
//     type: Number,
//     required: true,
//     unique : true
//   }
// })
// let myurl =  mongoose.model("myurl", urlSchema);

exports.myurl = myurl;

// export default myurl;