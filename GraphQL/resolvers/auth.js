const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  },
  login: ({ email, password }) => {
    let user_id;
    let user_email;
    return User.findOne({ email: email })
      .then(user => {
        if (!user) throw new Error("El usuario ingresado no existe.");
        else {
          user_id = user.id;
          user_email = user.email;
        }
        return bcrypt.compare(password, user.password); // compare va a comparar el password ingresado con el de la BD
      })
      .then(res => {
        if (!res) throw new Error("Contraseña incorrecta.");
        return jwt.sign(
          {
            userId: user_id,
            email: user_email
          },
          "somesupersecretkey",
          { expiresIn: "1h" }
        ); // 1. data, 2. required to hash the token, 3. set a expire time for the token (optional)
      })
      .then(token => {
        return {
          userId: user_email,
          token: token,
          tokenExpiration: 1
        };
      })
      .catch(err => {
        throw err;
      });
  }
};
