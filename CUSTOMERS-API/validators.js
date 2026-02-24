// validators.js
function isEmailValid(email) {
  if (!email) return false;
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRe.test(email);
}

function checkRequiredFields(obj, required = []) {
  return required.filter((f) => !obj[f]);
}

module.exports = { isEmailValid, checkRequiredFields };
