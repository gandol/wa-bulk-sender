require("@babel/register")({
    presets: ["@babel/preset-env"],
});
require("babel-polyfill");

let sc = process.argv[2]
module.exports = require(`./${sc}.js`)