// Require libs
var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var redis = require("redis");
var crypto = require('crypto');
var qs = require('qs');

// config
var retry = false;
var queue = "low";
var device_class = "YourWorker";
var app_key = "123";

app.use(express.bodyParser());

// Connect to redis -- need to set heroku here
if (process.env.REDISTOGO_URL) {
  // redis to go on heroku
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = require("redis").createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

/*
  Get request with url params
*/
app.post('/create', function(req, res) {
  if (req.body.app_key != app_key || typeof(req.body.phone_number) === 'undefined') {
    console.log('Invalid request');
    res.send({ "success": false });
  } else {
    jobs = qs.parse(req.body.jobs);
    
    for (key in jobs) {
      if (!jobs.hasOwnProperty(key)) {
        continue;
      }

      job = jobs[key];

      buf = crypto.randomBytes(12);
      var token = buf.toString('hex');

      var job_data = {
        "retry": retry,
        "queue": queue,
        "class": device_class,
        "args": [
          job.attr_1,
          job.attr_2
        ],
        "jid": token
      }

      client.lpush("queue:" + queue, JSON.stringify(job_data));
      console.log('Added job ' + token);
    }

    res.send({ "success": jobs });
  }
});

var port = process.env.PORT || 1337;

app.listen(port);
console.log('Listening on port ' + port);
