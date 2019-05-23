const sql = require('mssql');

module.exports = app => {

    async function execute(query) {
        return new Promise((resolve, reject) => {

            new sql.ConnectionPool(app.dbConfig).connect().then(pool => {
                return pool.request().query(query)
            }).then(result => {

                resolve(result.recordset);

                sql.close();
            }).catch(err => {

                reject(err)
                sql.close();
            });
        });

    }

    return { execute };

}