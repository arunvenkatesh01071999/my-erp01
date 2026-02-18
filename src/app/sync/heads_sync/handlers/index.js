const postHeadsDetailsSyncHanlder = require("./postHeadsDetailsHandler");
const getHeadsDetailsSyncHanlder = require("./getHeadsDetailsHandler");
const putHeadsDetailsSyncHanlder = require("./putHeadsDetailsHandler");
const putHeadsStatusHanlder = require("./putStatusChangeHandler");
module.exports = {
    postHeadsDetailsSyncHanlder,
    getHeadsDetailsSyncHanlder,
    putHeadsDetailsSyncHanlder,
    putHeadsStatusHanlder
}