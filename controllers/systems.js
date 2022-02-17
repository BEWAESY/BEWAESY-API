var connection = require("../modules/mysql");
const { body, validationResult } = require("express-validator")


exports.shouldWater = [
    body("temperature").trim().isLength({ min: 1 }).toInt().escape().withMessage("inputMissing"),
    body("humidity").trim().isLength({ min: 1 }).toInt().escape().withMessage("inputMissing"),

    (req, res, next) => {
        // Check for validation errors
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);
            res.sendStatus(400);
            return;
        }

        // Get required values
        let id = req.query.id;
        let key = req.query.key;
        let temperature = req.body.temperature;
        let humidity = req.body.humidity;

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


            connection.query("SELECT * FROM systemlog WHERE systemid = ? AND timestamp >= CURDATE()", [id], function(err2, rows2, fields2) {
                if (err2) throw err2;

                let totalTimeWatered = 0;

                if (rows[0]["maxSeconds"] != 0) {
                    for (singleLog of rows2) {
                        totalTimeWatered += parseInt(singleLog["seconds"]);
                    }
                }

                
                // Get data from DB
                connection.query("SELECT * FROM wateringevents WHERE systemid = ?", [id], function(err3, rows3, fields3) {
                    if (err2) throw err2;
            
                    res.json([rows, rows3, rows[0]["maxSeconds"], totalTimeWatered]);
                });
            });

            // Write last call and temperature data to DB
            connection.query("UPDATE systems SET temperature = ?, humidity = ?, lastCall = ? WHERE id = ?", [temperature, humidity, new Date(), id], function(err3, rows3, fields3) {
                if (err3) throw err3;
            });
        });
    }
]


exports.wateredPlant = [
    body("seconds").trim().isLength({ min: 1 }).toInt().escape().withMessage("inputMissing"),
    body("timestamp").trim().isLength({ min: 1 }).escape().withMessage("inputMissing"),
    (req, res, next) => {
        let id = req.query.id;
        let key = req.query.key;

        let seconds = req.body.seconds;
        let timestamp = req.body.timestamp;

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

            
            // Check for validation errors
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                console.log(validationErrors);
                res.sendStatus(400);
                return;
            }

            // Check if values have right format
            if (!seconds || !timestamp) {
                res.sendStatus(422);
                return;
            }

            console.log(seconds);
            console.log(new Date());


            // Insert data into systemlog DB
            connection.query("INSERT systemlog SET systemid = ?, seconds = ?, timestamp = ?", [id, seconds, new Date()], function(err, results, fields) {
                if (err) throw err;
            })

            // Update info in systems DB
            connection.query("UPDATE systems SET lastExecution = ? WHERE id = ?", [timestamp, id], function(err, results, fields) {
                if (err) throw err;
            })

            res.sendStatus(201);
        })
    }
]
