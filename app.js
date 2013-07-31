var lazy = require("lazy"),
        fs  = require("fs"),
        http = require("http"),
        express = require('express');

var app = express();
var jsonObj = new Object();
var count = 0;


/* Actual log parser */

/*
new lazy(fs.createReadStream('log.txt'))
   .lines
   .forEach(function(line){
     	var dateString = line.toString().substring(0,20);
     	dateString = dateString.replace("/","-");
     	dateString = dateString.replace("/","-");
     	var date = new Date(dateString);

     	jsonObj.count = count;
     	jsonObj.time = date.getTime();
      console.log(JSON.stringify(jsonObj));
      count++;
   }
);
*/


app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  response.redirect("/login.html");
  
});

app.get('/dashboard', function(request, response) {
  response.redirect("/dashboard.html");
});

/* Actual handler */
/*
app.get('/request', function(request, response) {
  response.send(jsonObj);
});
*/

app.get('/request', function(request, response) {
  var num = Math.floor((Math.random()*100)+50)
  var date = new Date();
  jsonObj.count = num;
  jsonObj.time = date;
  response.send(jsonObj);
});


var port = process.env.PORT || 5000
app.listen(port, function() {
  console.log("listening on " + port);
});