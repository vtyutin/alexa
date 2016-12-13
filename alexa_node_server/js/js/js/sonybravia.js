var request = require('request');
var bodyParser = require('body-parser');
var config = require('../config');
var channels = require('../sony/channels');

var IRcodeRequest = function(ircode, ResponseCallback) {
    console.log("IRcodeRequest function called with code " + ircode);  //verifies IRcode received

    request({
        url: 'http://' + config.sony.ip + ':' + config.sony.port + '/sony/ircc', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
        'X-Auth-PSK': '0000',
        'Content-Type': 'text/xml; charset=utf-8',
        'soapaction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
        'Cookie': '"auth=783712B1CF77382B975B0B53E44376CB6BCB7D93"'
        },
        body : '<?xml version="1.0"?>' +
              '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
              '<s:Body>' +
              '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
              '<IRCCCode>' + ircode + '</IRCCCode>' +
              '</u:X_SendIRCC>' +
              '</s:Body>' +
              '</s:Envelope>',
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            ResponseCallback(error, response);
        } 

        else {
            ResponseCallback(error, body);
            console.log(response.statusCode, body);
        }
    });
};  

var VideoInputChange = function (inputnumber, Callback) {
    console.log("VideoInputChange function called for HDMI " + inputnumber);
    var ircode;
    var speechOutput;
    switch (inputnumber) {
      case "1": ircode = "AAAAAgAAABoAAABaAw=="; break;
      case "2": ircode = "AAAAAgAAABoAAABbAw=="; break;
      case "3": ircode = "AAAAAgAAABoAAABcAw=="; break;
      case "4": ircode = "AAAAAgAAABoAAABdAw=="; break;
    }

    //If there is an IRCODE send to TV.
    if(ircode) {
      console.log(ircode + " code sent to TV");
      IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
          if (err) {
              speechOutput = "I had trouble processing this request. Please try again.";
          } else {
              speechOutput = "Input changed to HDMI " + inputnumber;
          } 
          Callback(speechOutput);
      });
    } 
    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(ircode == undefined) {
      speechOutput = "I had trouble finding that input.";
      Callback(speechOutput);
    }
};

var VolumeChange = function (isVolumeUp, inputnumber, Callback) {
    console.log("VolumeChange function called for value " + inputnumber);

    var ircode;
    var speechOutput;
    for (var index = 0; index < inputnumber; index++) {
        ircode = isVolumeUp ? "AAAAAQAAAAEAAAASAw==" : "AAAAAQAAAAEAAAATAw==";
        //If there is an IRCODE send to TV.
        if(ircode) {
            console.log(ircode + " code sent to TV");
            IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
                if (err) {
                    speechOutput = "I had trouble processing this request. Please try again.";
                } else {
                    speechOutput = "Volume " + (isVolumeUp ? "up" : "down");
                }
            });
        } else {
            speechOutput = "I had trouble finding that volume.";
        }
    }
    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(speechOutput == undefined) {
        speechOutput = "I had trouble finding that input.";
    }
    Callback(speechOutput);
};

var SetChannel = function (channelName, Callback) {
    console.log("SetChannel " + channelName);

    var ircode1;
    var ircode2;
    var ircode3;
    var speechOutput;

    var channel = channels[channelName];
    if (channel) {
        ircode1 = channel["ir1"];
        ircode2 = channel["ir2"];
        ircode3 = channel["ir3"];
    }

    if(ircode1 && ircode2 && ircode3) {
        console.log(ircode1 + " code sent to TV");
        IRcodeRequest(ircode1, function ResponseCallback(err, codeResponse) {
            if (err) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Channel switched to " + channelName;
            }
        });
        IRcodeRequest(ircode2, function ResponseCallback(err, codeResponse) {
            if (err) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Channel switched to " + channelName;
            }
        });
        IRcodeRequest(ircode3, function ResponseCallback(err, codeResponse) {
            if (err) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Channel switched to " + channelName;
            }
        });
    } else {
        speechOutput = "I had trouble finding that channel." + channelName;
    }
    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(speechOutput == undefined) {
        speechOutput = "I had trouble finding that input.";
    }
    Callback(speechOutput);
};

var PowerStatus = function(ResponseCallback) {
    console.log("Power Status function requested.");

    request({
        url: 'http://' + config.sony.ip + ':' + config.sony.port + '/sony/system', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST', 
        headers: {
            'X-Auth-PSK': '0000',
            'Content-Type': 'application/json'
        },
        json: {
            "id":20,
            "method":"getPowerStatus",
            "version":"1.0",
            "params":[]
        },
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            ResponseCallback(error, response);
        } 

        else {
            console.log(body);
            console.log(body.result[0].status);
            ResponseCallback(null, body.result[0].status)
        }
    });
};    

var CallSonyAPI = function (options, ResponseCallback) {
    console.log("Calling Sony API");

    request({
            url: 'http://' + config.sony.ip + ':' + config.sony.port + options.url , //URL to hit
            //qs: {from: 'blog example', time: +new Date()}, //Query string data
            method: 'POST', 
            headers: {
                'X-Auth-PSK': '0000',
                'Content-Type': 'application/json'
            },
            json: options.jsonmsg,
        }, function(error, response, body){
            if(error) {
                console.log('communication error ' + error);
                ResponseCallback(error, response);
            } 

            else {
                console.log(body);
                ResponseCallback(body)
            }
        });
};

module.exports = {
    IRcodeRequest : IRcodeRequest,
    VideoInputChange: VideoInputChange,
    VolumeChange: VolumeChange,
    SetChannel: SetChannel,
    PowerStatus: PowerStatus,
    CallSonyAPI: CallSonyAPI,
};