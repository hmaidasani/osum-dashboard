var lazy = require("lazy"),
        fs  = require("fs"),
        http = require("http"),
        express = require('express'),
        // splunkjs = require('splunk-sdk'),
        login = require("./routes/login"),
        dashboard = require("./routes/dashboard");
        // Class = splunkjs.Class,
        // utils = splunkjs.Utils,
        // Async = splunkjs.Async;

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
  app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
});

app.get('/', login.login);


app.get('/dashboard', dashboard.dashboard);
app.post('/dashboard', dashboard.dashboard);


/* Actual handler */
/*
app.get('/request', function(request, response) {
  response.send(jsonObj);
});
*/

// app.get('/splunk', function(request, response) {
//   // Create a Service instance and log in 
// var service = new splunkjs.Service({
//   scheme:"https",
//   host:"oprdfishd406.corp.intuit.net",
//   port:"8089",
//   username:"osumdashboard",
//   password:"12345678",
//   version:"default"
// });

// //var service = new splunkjs.Service({username: "admin", password: "changeme"});
// service.login(function(err, success) {
//     if (err || !success) {
//         console.log('Error: ' + err.toString());
//         for(var e in err){
//           console.log(e+" : "+ err[e]);
//         }

//     }

//     console.log("Login was successful: " + success);
//     service.jobs().fetch(function(err, jobs) {
//         var jobList = jobs.list();
//         for(var i = 0; i < jobList.length; i++) {
//             console.log("Job " + i + ": " + jobList[i].sid);
//         }
//     });
// });
// });

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