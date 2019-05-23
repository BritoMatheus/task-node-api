const sql = require('mssql');
const configDb = require("./db.json");
var connection = sql.connect(configDb, function (err) {
    if (err)
        throw err; 
});

module.exports = connection; 