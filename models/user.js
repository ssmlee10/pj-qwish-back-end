const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, requried: true, },
  hashedPassword: { type: String, requried: true, },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
