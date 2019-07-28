const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

const singleEvent = eventId => {
  return Event.findById(eventId)
    .then(singleEvent => {
      return {
        ...singleEvent._doc,
        _id: singleEvent.id,
        creator: user.bind(this, singleEvent.creator)
      };
    })
    .catch(err => {
      throw err;
    });
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            _id: booking.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString()
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5d2e90c3c71aff12b0a61a37"
    });
    let createdEvent;
    return event
      .save()
      .then(res => {
        createdEvent = {
          ...res._doc,
          _id: res._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, res._doc.creator)
        };
        return User.findById("5d2e90c3c71aff12b0a61a37");
      })
      .then(user => {
        if (!user) {
          throw new Error("El correo ingresado no existe.");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    // Validamos que solo sea un usuario (email)
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error("El correo ingresado ya se encuentra registrado.");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(res => {
        return { ...res._doc, password: null, _id: res.id };
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
        return {
          ...res._doc,
          _id: res.id,
          user: user.bind(this, res._doc.user),
          event: singleEvent.bind(this, res._doc.event),
          createdAt: new Date(res._doc.createdAt).toISOString(),
          updatedAt: new Date(res._doc.updatedAt).toISOString()
        };
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
        event = {
          ...res.event._doc,
          _id: res.event.id,
          creator: user.bind(this, res.event._doc.creator)
        };
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
