const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createEvent: (args, req) => {
    if (!req.isAuth) throw new Error("Petición no autorizada.");
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    return event
      .save()
      .then(res => {
        createdEvent = transformEvent(res);
        return User.findById(req.userId);
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
  }
};
