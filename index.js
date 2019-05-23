
const express = require('express');
const app = express();
const mssql = require('mssql');
const consign = require('consign');
const configDb = require("./config/db.json");
const sql = require("./config/sql.js");

app.db = mssql;
app.dbConfig = configDb;

consign()
    .include('./config/passport.js')
    .include('./config/sql.js')
    .then('./config/middleware.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app);

//app.db = db;


app.get('/', (req, res) => {
    res.status(200).send('Meu primeiro endPoint, uhuu');
})

app.listen(3000, () => {
    console.log('Backend executando...')
});