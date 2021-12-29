var connection = require("../modules/mysql");


exports.shouldWater = function(req, res, next) {
    let id = req.query.id;
    let key = req.query.key;

    connection.query("SELECT * FROM systems WHERE id = ?", [id], function(err, rows, fields) {
        if (err) throw err;

        // Check if id exists
        if (!rows.length) {
            res.sendStatus(404);
            return;
        }

        // Check API key
        if (key != rows[0].apiKey) {
            res.sendStatus(401);
            return;
        }
        

        // Get data from DB
        connection.query("SELECT * FROM wateringevents WHERE systemid = ?", [id], function(err2, rows2, fields2) {
            if (err2) throw err2;
    
            res.json(rows2);
        })
    });
}

exports.wateredPlant = function(req, res, next) {
    res.send("NOT IMPLEMENTED!");
}
