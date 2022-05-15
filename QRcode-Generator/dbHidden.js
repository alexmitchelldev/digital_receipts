var pg = require('pg');
var client = new pg.Client("postgres://orzouptu:TNO1aFZmDWgXGisXZYDWW9mM9XehtMZq@tyke.db.elephantsql.com/orzouptu");

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }

  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(`Successfully connected to the database! \nThe time and date is ${result.rows[0].theTime}.`);
  });

});

module.exports = client;