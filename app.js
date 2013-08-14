var lazy = require("lazy"),
        fs  = require("fs"),
        http = require("http"),
        express = require('express'),
        // splunkjs = require('./splunk-sdk-javascript/index'),
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
var username='osumdashboard', password='12345678';

app.get('/splunk', function(request, response) {
  
  // var sys = require('sys')
  // var exec = require('child_process').exec;
  // // var child;
  // var parseString = require('xml2js').parseString;

  // Run curl commands to connect to splunk
  // First get sessionKey
  /*exec("curl -k https://oprdfishd406.corp.intuit.net:8089/services/auth/login -d username="+username+" -d password="+password, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    var sessionKey;
    parseString(stdout, function (err, result) {
      sessionKey = result['response']['sessionKey'][0];
    });
    // console.dir(sessionKey);

    //get list of resultsLinks to query
    exec("curl -k -u "+username+":"+password+" https://oprdfishd406.corp.intuit.net:8089/services/saved/searches/Peak%20Transactions%20Per%20Second/history", function (error, stdout, stderr) {  
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      var resultsLinks = [];
      parseString(stdout, function (err, result) {
        for(var i = 0; i < result['feed']['entry'].length; i++) {
          resultsLinks.push(result['feed']['entry'][i]['id'] + '/results?output_mode=json');
        }
      });
      // console.dir(resultsLinks);

      for(var i = 0; i < resultsLinks.length; i++) {
        var link = resultsLinks[i];
        if(i==resultsLinks.length-1)
          exec("curl -k -u "+username+":"+password+" "+link, function (error, stdout, stderr) {  
            if (error !== null) {
              console.log('exec error: ' + error);
            }
           
            var result = JSON.parse(stdout);

            // for(var index in result) {
            //   for(var key in result[index]) {
            //     console.log(key);
            //     if(key.indexOf('_') == 0){
            //       console.log(key);
            //       delete result[key];
            //     }
            //   }
            // }
            // console.dir(i)
            //  console.dir(result);
            
              response.send(result);

            
          });
      }
    });
  });
*/
var result = [
  {
    "MaxTPS": "227",
    "_span": "1",
    "Time": "2013-08-13 11:21:53"
  },
  {
    "MaxTPS": "220",
    "_span": "1",
    "Time": "2013-08-13 13:29:18"
  },
  {
    "MaxTPS": "212",
    "_span": "1",
    "Time": "2013-08-13 12:39:47"
  },
  {
    "MaxTPS": "211",
    "_span": "1",
    "Time": "2013-08-13 13:11:04"
  },
  {
    "MaxTPS": "209",
    "_span": "1",
    "Time": "2013-08-13 11:08:04"
  },
  {
    "MaxTPS": "208",
    "_span": "1",
    "Time": "2013-08-13 11:42:15"
  },
  {
    "MaxTPS": "206",
    "_span": "1",
    "Time": "2013-08-13 13:26:22"
  },
  {
    "MaxTPS": "203",
    "_span": "1",
    "Time": "2013-08-13 11:30:45"
  },
  {
    "MaxTPS": "203",
    "_span": "1",
    "Time": "2013-08-13 12:04:14"
  },
  {
    "MaxTPS": "203",
    "_span": "1",
    "Time": "2013-08-13 12:20:47"
  }
];
response.send(result);



  //SPLUNK REST CALLS - NEED XML2JSON APP ON SPLUNK PROD SERVER IN ORDER FOR REST CALLS TO WORK

  // Create a Service instance and log in 
  // var service = new splunkjs.Service({
  //   scheme:"https",
  //   host:"oprdfishd406.corp.intuit.net",
  //   port:"8089",
  //   username:"osumdashboard",
  //   password:"12345678",
  //   //version:"4.0"
  // });

  // //var service = new splunkjs.Service({username: "admin", password: "changeme"});
  // service.login(function(err, success) {
  //     if (err || !success) {
  //         console.log('Error: ' + err.toString());
  //         for(var e in err){
  //           console.log(e+" : "+ err[e]);
  //         }
  //         // console.login(err['response']);

  //     }

  //     console.log("Login was successful: " + success);
  //     service.jobs().fetch(function(err, jobs) {
  //         var jobList = jobs.list();
  //         for(var i = 0; i < jobList.length; i++) {
  //             console.log("Job " + i + ": " + jobList[i].sid);
  //         }
  //     });
  // });
});

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