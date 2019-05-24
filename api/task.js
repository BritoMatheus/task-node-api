const moment = require('moment');

module.exports = app => {
    const getTasks = (req, res) => {
        var date = req.query.date ? new Date(req.query.date) : moment().endOf('day').toDate();
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2);
        console.log('Date after ====> ', `
        SELECT * 
        FROM Task 
        WHERE UsuarioId = ${req.user.id} AND CONVERT(date, EstimateAt) >= '${date}'
        ORDER BY estimateAt`)

        //Busca tudo
        app.config.sql.execute(`
                SELECT * 
                FROM Task 
                WHERE UsuarioId = ${req.user.id} AND CONVERT(date, EstimateAt) >= '${date}'
                ORDER BY estimateAt`)
            .then((result) => {
                let lstTask = result[0];
                console.log('lstTask => ', lstTask)
                return res.json(result);
            })
            .catch(err => {
                return res.status(500).json(err);
            });

    }

    const create = (req, res) => {
        console.log('req.body => ', req.body.descricao);
        if (!req.body.descricao || req.body.descricao.length <= 2) {
            console.log('Pq erro => ', req.body.descricao.trim());
            return res.status(400).send('Descrição obrigatória.');
        }

        var estimateAt = new Date(req.body.estimateAt);
        estimateAt = estimateAt.getFullYear() + '-' +
            ('00' + (estimateAt.getMonth() + 1)).slice(-2) + '-' +
            ('00' + estimateAt.getDate()).slice(-2) + ' ' +
            ('00' + estimateAt.getHours()).slice(-2) + ':' +
            ('00' + estimateAt.getMinutes()).slice(-2) + ':' +
            ('00' + estimateAt.getSeconds()).slice(-2);

        app.config.sql.execute(`
        INSERT INTO Task 
        (Descricao, EstimateAt, DoneAt, UsuarioId)
        OUTPUT INSERTED.Id
        VALUES
        ('${req.body.descricao}', 
        '${estimateAt}', 
        ${req.body.doneAt == undefined ? null : (`'${req.body.doneAt}'`)}, 
        ${req.user.id})`)
            .then((result) => {
                let id = result[0].Id;
                console.log('id => ', id);
                return res.json(id);
            })
            .catch(err => {
                console.log('error => ', err);
                res.status(500).json(err);
            });

    }

    const remove = (req, res) => {
        app.config.sql.execute(`
      DELETE FROM  Task 
      WHERE Id = ${req.params.id} 
        AND UsuarioId = ${req.user.id}`)
            .then((result) => {
                console.log('result => ', result);
                res.json(true);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

    const updateTaskDoneAt = (req, res, doneAt) => {
        var dateFormated = new Date(doneAt);
        dateFormated = dateFormated.getFullYear() + '-' +
            ('00' + (dateFormated.getMonth() + 1)).slice(-2) + '-' +
            ('00' + dateFormated.getDate()).slice(-2) + ' ' +
            ('00' + dateFormated.getHours()).slice(-2) + ':' +
            ('00' + dateFormated.getMinutes()).slice(-2) + ':' +
            ('00' + dateFormated.getSeconds()).slice(-2);

        app.config.sql.execute(`
      UPDATE Task SET
        DoneAt = '${dateFormated}'
      WHERE Id = ${req.params.id} 
        AND UsuarioId = ${req.user.id}`)
            .then((result) => {
                console.log('result => ', result);
                res.json(true);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

    const toggle = (req, res) => {
        console.log('req.params => ', req.params);
        app.config.sql.execute(`
            SELECT * 
            FROM Task 
            WHERE Id = ${req.params.id} 
            AND UsuarioId = ${req.user.id}`)
            .then((result) => {
                let task = result[0];
                console.log('task => ', task)
                if (!task) {
                    return res.status(400).send('Task não existe');
                }
                const doneAt = task.DoneAt ? null : new Date();
                updateTaskDoneAt(req, res, doneAt);
            })
            .catch(err => {
                res.status(500).json(err);
            });

    }

    return { getTasks, create, remove, toggle };
}