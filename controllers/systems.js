var connection = require("../modules/mysql");


exports.shouldWater = function(req, res, next) {
    let id = req.query.id;
    let key = req.query.key;

    connection.query("SELECT * FROM systems WHERE id = ?", [id], function(err, rows, fields) {
        if (err) throw err;

        if (!rows.length) {
            res.send("Doesn't exist!");
            return;
        }

        res.send(rows);
    })



    /*connection.query("SELECT * FROM users WHERE id = 2", function(err, rows, fields) {
        if (err) throw err;

        res.send(rows[0]);
    })*/
}

exports.wateredPlant = function(req, res, next) {
    res.send("NOT IMPLEMENTED!");
}
