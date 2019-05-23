const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const signin = async (req, res) => {
        console.log('========= auth signin');

        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos');
        }

        app.config.sql.execute(`SELECT * FROM Usuario WHERE Email = '${req.body.email}'`)
            .then((result) => {
                let user = result[0];
                if (user) {
                    bcrypt.compare(req.body.password, user.Password, (err, isMatch) => {
                        if (err || !isMatch) {
                            return res.status(401).send('Unauthorized');
                        }
                        const payload = { id: user.Id };
                        res.json({
                            id: user.Id,
                            nome: user.Nome,
                            token: jwt.encode(payload, authSecret)
                        })
                    });
                } else {
                    return res.status(400).send('Usuário não encontrado!');
                }
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    return { signin };
}