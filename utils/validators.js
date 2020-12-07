const moment = require("moment");

const isNullInputField = input => {
  return input === undefined || input === null || input == "";
};

const isName = name => /^[A-Za-z]{2,}$/.test(name);

const isEmail = email =>
  /^[a-z][a-z0-9.]+\@[a-z]{3,}\.[a-z]{2,6}$/i.test(email.toLowerCase());

const isValidPassword = password => /^[A-Za-z0-9]{8,32}$/.test(password);

const isValidBirthday = birthdayStr => {
  const today = moment(new Date());
  const birthday = moment(new Date(birthdayStr));

  return today.diff(birthday, "years") >= 18;
};

const isImage = file => file.mimetype.indexOf("image") != -1;

module.exports = {
  isNullInputField,
  isName,
  isEmail,
  isValidPassword,
  isValidBirthday,
  isImage
};
