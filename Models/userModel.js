const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User email required"],
  },
  email: {
    type: String,
    required: [true, "User email required"],
    unique: [true, "This email is already used "],
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a email`,
    },
  },
  password: {
    type: String,
    required: [true, "User password Confirm required"],
    validate: {
      validator: function (v) {
        return this.password === v;
      },
      message: () => "Repeat password not match the password",
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 6;
      },
      message: () => "User password must have atleast 6 characters",
    },
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = "";
  next();
});
userSchema.methods.passwordIsCorrect = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.isChangedPassword = function () {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTtimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
