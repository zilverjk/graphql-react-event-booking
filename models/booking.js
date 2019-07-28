const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true // Por cada registro en la DB, Mongoose va a crear un campo de creación y modificación DateTime.
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
