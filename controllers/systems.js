var connection = require("../modules/mysql");


exports.water = function(req, res, next) {
    connection.query("SELECT * FROM users WHERE id = 2", function(err, rows, fields) {
        if (err) throw err;

        res.send(rows[0]);
    })
}
