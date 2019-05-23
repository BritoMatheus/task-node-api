const { authSecret } = require('../.env');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {

        app.config.sql.execute(`SELECT * FROM Usuario WHERE Id = '${payload.id}'`)
            .then((result) => {
                console.log('======== passport ========')
                const user = result[0];
                if (user) {
                    console.log('======== EVERYTHING IS OK ========')
                    done(null, { id: user.Id, nome: user.Nome });
                } else {
                    done(null, false);
                }
            }).catch((err) => {
                done(err, false);
            });

        // app.db.connect(app.dbConfig)
        //     .then((conn) =>
        //         conn.query(`SELECT * FROM Usuario WHERE Id = '${payload.id}'`)
        //             .then((result) => {
        //                 console.log('======== passport ========')
        //                 let user = result.recordset[0];
        //                 if (user) {
        //                     done(null, { id: user.Id, nome: user.Nome });
        //                 } else {
        //                     done(null, false);
        //                 }
        //             })
        //             .then(() => {
        //                 app.db.close();
        //             })
        //             .catch(err => {
        //                 done(err, false);
        //             })
        //     );
    })

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}