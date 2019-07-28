const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: (args, req) => {
    if (!req.isAuth) throw new Error("Petición no autorizada.");
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return transformBooking(booking);
        });
      })
      .catch(err => {
        throw err;
      });
  },
  bookEvent: (args, req) => {
    if (!req.isAuth) throw new Error("Petición no autorizada.");
    return Event.findOne({ _id: args.eventId })
      .then(fetchedEvent => {
        const booking = new Booking({
          user: req.userId,
          event: fetchedEvent
        });
        return booking.save();
      })
      .then(res => {
        return transformBooking(res);
      })
      .catch(err => {
        throw err;
      });
  },
  cancelBooking: (args, req) => {
    if (!req.isAuth) throw new Error("Petición no autorizada.");
    let event;
    return Booking.findById(args.bookingId)
      .populate("event")
      .then(res => {
        event = transformEvent(res.event);
      })
      .then(res => {
        return Booking.deleteOne({ _id: args.bookingId });
      })
      .then(res => {
        return event;
      })
      .catch(err => {
        throw err;
      });
  }
};
