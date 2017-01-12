var bodyParser = require('body-parser');
var express = require('express');
var sonybravia = require('../js/sonybravia');
var wolnode = require('node-wol');
var config = require('../config');
var wol = require('wol')

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
	        powerintent = 'active';
	        wol.wake(config.sony.mac, function(err, result) {
		        console.log("wake res: " + result + " err: " + err);
		        if (err) {
		            res.send("I can't wake TV")
		        } else {
		            if (result) {
			            sonybravia.PowerStatus(function ResponseCallback(err, status) {
			                console.log("TV status: " + status)
			                if (status == "standby") {
				                sonybravia.IRcodeRequest("AAAAAQAAAAEAAAAVAw==", function ResponseCallback(err, codeResponse) {
                                    if (err != undefined) {
                                        res.send(codeResponse);
                                    } else {
                                        res.send("I have switched the TV on");
                                    }
                                });
			                } else {
                		        res.send("TV is already on");
			                }
            		    });
		            } else {
			            res.send("I can't wake TV now")
		            }
		        }
	        });
            break;
        case "off":
            sonybravia.PowerStatus(function ResponseCallback(err, status) {
		        console.log("TV status: " + status)
		        if (status == "active") {
		            sonybravia.IRcodeRequest("AAAAAQAAAAEAAAAVAw==", function ResponseCallback(err, codeResponse) {
                        if (err != undefined) {
                            res.send(codeResponse);
                        } else {
                            res.send("I have switched the TV off");
                        }
                    });
		        } else {
                    res.send("TV is already off");
		        }
            });
            powerintent = 'standby';
            break;
    }
});

router.post('/setvolume',function(req,res){
    var volume = req.headers.volume;
    console.log("User request volume " + volume);
    sonybravia.SetVolume(volume, function ResponseCallback(err, status) {
        console.log("volume status: " + status)
        if (status != "0") {
            res.send("I can't set volume");
        } else {
            res.send("volume set to " + volume);
        }
    });
});

router.post('/videoinput',function(req,res){
    var inputnumber = req.headers.inputnumber;
    console.log("User request TV Input change to " + inputnumber);
    if (inputnumber.toLowerCase() == "tv") {
        inputnumber = "5";
    }
    console.log("updated input " + inputnumber);

    //calls the VideoInputChange function to
    sonybravia.VideoInputChange(inputnumber, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/changevolume',function(req,res){
    var action = req.headers.action;
    console.log("User request to change volume to " + action);

    //calls the VideoInputChange function to
    sonybravia.VolumeChange(action, function ResponseCallback(speechoutput) {
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

router.post('/changechannel',function(req,res){
    var value = req.headers.action;
    console.log("User request to change channel " + value);

    //calls the VideoInputChange function to
    sonybravia.ChannelChange(value, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/channel',function(req,res){
    var value = req.headers.number;
    console.log("User request to set channel " + value);

    //calls the VideoInputChange function to
    sonybravia.SetChannelNumber(value, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/changevolume',function(req,res){
    var value = req.headers.action;
    console.log("User request to change volume " + value);

    //calls the VideoInputChange function to
    sonybravia.VolumeChange(value, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/mute',function(req,res){
    var mute = req.headers.mute;
    console.log("User request to mute " + mute);

    //calls the VideoInputChange function to
    sonybravia.SetMute(mute, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/guide',function(req,res){
    console.log("User request to show guide");

    //calls the VideoInputChange function to
    sonybravia.ShowGuide(function ResponseCallback(speechoutput) {
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


