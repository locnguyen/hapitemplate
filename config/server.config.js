var path = require('path');

module.exports = {
    development: {
        log: {
            path: path.join(__dirname, '../', 'tmp'),
            level: 'debug'
        }
    }
};
