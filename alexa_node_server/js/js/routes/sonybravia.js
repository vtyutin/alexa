var bodyParser = require('body-parser');
var express = require('express');
var sonybravia = require('../js/sonybravia');
var wol = require('node-wol');
var config = require('../config');

var router = express.Router();
router.use(bodyParser.json());

router.post('/power',function(req,res){
    var power = req.headers.power; 
    console.log("User request TV Power " + power);
    var powerintent = '';

    //sets the users power intent variable      
    switch (power) {
        case "on":
            console.log("Wake up TV " + config.sony.ip);

            wol.wake(config.sony.mac, function(error) {
                if(error) {
                    res.send("I can't wake up TV ");
                }
            });
            wol.wake('34:68:95:68:10:C5', function(error) {
                if(error) {
                    res.send("I can't wake up TV ");
                }
            });
            powerintent = 'active';
            console.log("TV has been turned " + power)
            break;
        case "off":
            console.log("TV has been turned " + power)

            sonybravia.IRcodeRequest("AAAAAQAAAAEAAAAVAw==", function ResponseCallback(err, codeResponse) {
                res.send("I have switched the TV " + req.headers.powerintent);
            });
            powerintent = 'standby';
            break;
    }
});

router.post('/videoinput',function(req,res){
    var inputnumber = req.headers.inputnumber; 
    console.log("User request TV Input change to " + inputnumber);

    //calls the VideoInputChange function to
    sonybravia.VideoInputChange(inputnumber, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/setvolume',function(req,res){
    var newvolume = req.headers.newvolume;
    var action = req.headers.action;
    console.log("User request to change volume to " + action);

    var isUp = (action == "up" ? true : false);

    //calls the VideoInputChange function to
    sonybravia.VolumeChange(isUp, newvolume, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/setchannel',function(req,res){
    var channel = req.headers.channel;
    console.log("User request to change channel to " + channel);

    //calls the VideoInputChange function to
    sonybravia.SetChannel(channel, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
  res.send('Sony API');
});

//Export Module
module.exports = router;

exports.CallSonyAPI = function (message, ResponseCallback) {
  console.log("Calling Sony API http://" + hostip + message.url);

  //Build JSON Body to talk to Bravia TV
  var jsonbody = message.jsonmsg;

  var post_options = {
    host: hostip,
    port: hostport,
    path: message.url,
    method: 'POST',
    headers: {
        'X-Auth-PSK': '0000',
        'Content-Type': 'application/json'
      },
    body : message.jsonmsg,
  };

  ResponseCallback("allo", null);
};


