let express = require('express');
let app = express();
// let bodyParser = require('body-parser');
let port = 8080;
let starwars = require('./routes/starwars');
// let config = require('config'); //we load the db location from the JSON files
//db options
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
// mongoose.connect(config.DBHost, options);
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

//parse application/json and look for raw text                                        
// app.use(bodyParser.json());                                     
// app.use(bodyParser.urlencoded({extended: true}));               
// app.use(bodyParser.text());                                    
// app.use(bodyParser.json({ type: 'application/json'}));  

// ==========
// = ROUTES =
// ==========

app.route("/information")
    .get(starwars.getInformation);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing