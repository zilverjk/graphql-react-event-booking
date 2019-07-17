const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event" //<-- Lo definimos en el export de event.js , esto  es para hacer referencia a que evento estamos referenciando para grabarlo
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
