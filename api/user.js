const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
  const obterHash = (password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => callback(hash));
    })
  }

  const save = (req, res) => {
    obterHash(req.body.password, hash => {
      console.log('========= user Save');
      const password = hash;

      if (!req.body.nome || !req.body.email || !req.body.password) {
        return res.status(400).send('Dados incompletos');
      }

      app.config.sql.execute(`
INSERT INTO Usuario 
(Nome, Email, Password)
OUTPUT INSERTED.Id
VALUES
('${req.body.nome}', '${req.body.email}', '${password}')
          `)
        .then((result) => {
          if (result && result[0].Id) {
            res.json({
              id: result[0].Id
            })
          } else {
            return res.status(400).send('Usuário não encontrado!');
          }
        })
        .catch(err => {
          res.status(400).json(err);
        });
    })
  }

  return { save };
}