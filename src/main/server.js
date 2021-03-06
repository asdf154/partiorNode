let express = require('express');
let app = express();
let port = 8080;
let starwars = require('./routes/starwars');
app.set('json spaces', 2)


// ==========
// = ROUTES =
// ==========

app.route("/information")
    .get(starwars.getInformation);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing