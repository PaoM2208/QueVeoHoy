var conexion = require('../lib/conexionbd');

function withData(param) {
    return param.trim().length > 0;
}

function lookforReal(param) {
    return param !== undefined && withData(param);
}

function lookforMovie(req, res) {
    const dataMovie = {
        titulo: {
            attr: [req.query.titulo],
            sql: ' titulo LIKE ' + '"%' + req.query.titulo + '%"'
        },
        anio: {
            attr: [req.query.anio],
            sql: ' anio LIKE ' + '"%' + req.query.anio + '%"'
        },
        genero: {
            attr: [req.query.genero],
            sql: lookforReal(req.query.genero)
                ? ' genero_id = ' + req.query.genero
                : ' genero_id '
        }
    };

    const moreInfoMovie = {
        orden: {
            attr: [req.query.columna_orden, req.query.tipo_orden],
            sql: ' ORDER BY ' + req.query.columna_orden + ' ' + req.query.tipo_orden
        },
        limit: {
            attr: [req.query.pagina, req.query.cantidad],
            sql: ' LIMIT ' + ((req.query.pagina - 1) * req.query.cantidad) + ', ' + req.query.cantidad
        }
    }

    let sizeSql = 0;
    let index = 0;
    let sql = ' SELECT * FROM pelicula ';

    Object.keys(dataMovie).forEach(data => {
        if (dataMovie[data].attr.every(lookforReal)) sizeSql++;
    });
    if (sizeSql > 0) sql += ' WHERE ';

    Object.keys(dataMovie).forEach(data => {
        if (dataMovie[data].attr.every(lookforReal)) {
            sql += dataMovie[data].sql;
            index += dataMovie[data].attr.length;
            if (sizeSql > index) sql += ' AND ';
        }
    });
    sql += moreInfoMovie.orden.sql;
    sql += moreInfoMovie.limit.sql;
    conexion.query(sql, function (err, answer) {
        if (err) {
            return res.status(404).send("Error en consulta película.");
        }

        res.send(JSON.stringify({
            peliculas: answer,
            total: 20
        }));
    });
}

function lookforGender(req, res) {
    const genero = req.query.genero;
    const sql = 'select * from genero';
    if (genero !== undefined && genero != "") {
        sql += " where nombre = '" + genero + "'";
    }
    else {
        sql;
    }

    conexion.query(sql, function (err, answer) {
        if (err) {
            return res.status(404).send("Error en consulta género.");
        }

        return res.send(JSON.stringify({
            generos: answer
        }));
    });
}

function infoMovie(req, res) {
    if (req.params.id === 'recomendacion') return;
    const id = req.params.id;
    let sql = 'SELECT * FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = ' + id;
    conexion.query(sql, (err, answer) => {
        if (err) {
            return res.status(404).send('Error en consulta del id de película.');
        }

        sql = 'SELECT * FROM actor_pelicula INNER JOIN actor ON actor_pelicula.actor_id = actor.id WHERE actor_pelicula.id = ' + id;
        conexion.query(sql, (err_, answer_) => {
            if (err_) return res.status(404).send('Error en consulta del actor de pelicula.');

            return res.send(JSON.stringify({
                peliculas: answer[0],
                generos: answer[0].nombre,
                actores: answer_,
            }));
        });
    });
}

function suggestMovie(req, res) {
    let sql = 'SELECT * FROM pelicula ';
    const attrs = {
        genero: {
            data: [req.query.genero],
            sql: 'INNER JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = ' + req.query.genero
        },
        puntuacion: {
            data: [req.query.puntuacion],
            sql: 'pelicula.puntuacion = ' + req.query.puntuacion
        },
        anio: {
            data: [req.query.anio_inicio, req.query.anio_fin],
            sql: 'pelicula.anio BETWEEN ' + req.query.anio_inicio + ' AND ' + req.query.anio_fin
        }
    };

    const sizeSql = Object.keys(req.query).length;
    let index = 0;
    if (!(attrs.genero.data.every(lookforReal)) && sizeSql > 0) {
        sql += ' WHERE ';
    }

    Object.keys(attrs).forEach(attr => {
        if (attrs[attr].data.every(lookforReal)) {
            sql += attrs[attr].sql;
            index += attrs[attr].data.length;
            if (sizeSql > index) sql += ' AND ';
        }
    });

    conexion.query(sql, (err, answer) => {
        if (err) return res.status(404).send('Error en consulta película recomendada.');
        return res.send(JSON.stringify({
            peliculas: answer
        }));
    });
}

module.exports = {
    lookforMovie,
    lookforGender,
    infoMovie,
    suggestMovie
};