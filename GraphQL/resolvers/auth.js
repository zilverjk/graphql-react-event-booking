const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
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
  }
};
