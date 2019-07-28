const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: () => {
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
  bookEvent: args => {
    // const fetchedEvent = Event.findOne({ _id: args.eventId });
    return Event.findOne({ _id: args.eventId })
      .then(fetchedEvent => {
        const booking = new Booking({
          user: "5d2e90c3c71aff12b0a61a37",
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
  cancelBooking: args => {
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
