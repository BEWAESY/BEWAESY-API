var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DBHOSTNAME,
  user     : process.env.DBUSER,
  password : process.env.DBPASSWORD,
  database : process.env.DBDATABASE,
  timezone: "utc+0100"
});

connection.connect();

module.exports = connection;
