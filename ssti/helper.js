const uuid    = require('uuid').v4;
const crypto  = require('crypto');

function getHMAC(key, val) {
  return crypto.createHmac('sha256', key)
    .update(val)
    .digest('hex');
}

module.exports = {
  getHMAC,
}
