const moment = require("moment");
function formatMessage(name, text) {
  return {
    text,
    name,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
