require('dotenv').config();

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const connect = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.connect = connect;