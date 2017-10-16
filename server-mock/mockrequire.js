var path = require('path');
module.exports = (pkgname) => {
    return require(path.join(__dirname, '../server/node_modules/' + pkgname));
};