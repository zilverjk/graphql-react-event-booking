const Event = require("../../models/event");
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
        createdEvent = transformEvent(res);
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
  }
};
