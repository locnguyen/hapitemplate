module.exports = function (env) {
    var knexfile = require('knexfile.js')[env];
    return  require('knex')(knexfile);
};