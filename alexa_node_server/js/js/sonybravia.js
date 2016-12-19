var request = require('request');
var bodyParser = require('body-parser');
var config = require('../config');
var channels = require('../sony/channels');
var channelNumbers = require('../sony/numbers');

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
            ResponseCallback(undefined, body);
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
      case "5": ircode = "AAAAAQAAAAEAAAAkAw=="; break;
    }

    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(ircode == undefined) {
        speechOutput = "I had trouble finding that input.";
        Callback(speechOutput);
    }

    //If there is an IRCODE send to TV.
    if(ircode) {
      console.log(ircode + " code sent to TV");
      IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
          if (err != undefined) {
              speechOutput = "I had trouble processing this request. Please try again.";
          } else {
              if (inputnumber == "5") {
                  speechOutput = "Input changed to tv";
              } else {
                  speechOutput = "Input changed to HDMI " + inputnumber;
              }
          } 
          Callback(speechOutput);
      });
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
                if (err != undefined) {
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

var ChannelChange = function (value, Callback) {
    console.log("ChannelChange function called for value " + value);
    var ircode;
    var speechOutput;
    switch (value) {
        case "up": ircode = "AAAAAQAAAAEAAAAQAw=="; break;
        case "down": ircode = "AAAAAQAAAAEAAAARAw=="; break;
    }

    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(ircode == undefined) {
        speechOutput = "I had trouble change channel to " + value;
        Callback(speechOutput);
    }

    //If there is an IRCODE send to TV.
    if(ircode) {
        console.log(ircode + " code sent to TV");
        IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
            if (err != undefined) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Channel changed " + value;
            }
            Callback(speechOutput);
        });
    }
};

var VolumeChange = function (value, Callback) {
    console.log("VolumeChange function called for value " + value);
    var ircode;
    var speechOutput;
    switch (value) {
        case "up": ircode = "AAAAAQAAAAEAAAASAw=="; break;
        case "down": ircode = "AAAAAQAAAAEAAAATAw=="; break;
    }

    //If IRCODE is not located. Tell the user had trouble finding that input.
    if(ircode == undefined) {
        speechOutput = "I had trouble change volume " + value;
        Callback(speechOutput);
    }

    //If there is an IRCODE send to TV.
    if(ircode) {
        console.log(ircode + " code sent to TV");
        IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
            if (err != undefined) {
                speechOutput = "I had trouble processing this request";
            } else {
                speechOutput = "Volume changed " + value;
            }
            Callback(speechOutput);
        });
    }
};

var SetMute = function (value, Callback) {
    console.log("SetMute function called for value " + value);
    var ircode = "AAAAAQAAAAEAAAAUAw==";
    var speechOutput;

    //If there is an IRCODE send to TV.
    if(ircode) {
        console.log(ircode + " code sent to TV");
        IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
            if (err != undefined) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Mute changed";
            }
            Callback(speechOutput);
        });
    }
};

var ShowGuide = function (Callback) {
    console.log("ShowGuide function called");
    var ircode = "AAAAAQAAAAEAAAAOAw==";
    var speechOutput;

    //If there is an IRCODE send to TV.
    if(ircode) {
        console.log(ircode + " code sent to TV");
        IRcodeRequest(ircode, function ResponseCallback(err, codeResponse) {
            if (err != undefined) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Guide is shown";
            }
            Callback(speechOutput);
        });
    }
};

var SetChannel = function (channelName, Callback) {
    if ((channelName == '1') || (channelName == "1") || (channelName == 1) || (channelName == "first") || (channelName == "1st")) {
        channelName = "one"
    }
    else if (channelName == '5') {
        channelName = "five"
    }
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
            if (err != undefined) {
                speechOutput = "I had trouble processing this request. Please try again.";
            } else {
                speechOutput = "Channel switched to " + channelName;
		        IRcodeRequest(ircode2, function ResponseCallback(err, codeResponse) {
            	    if (err != undefined) {
                        speechOutput = "I had trouble processing this request. Please try again.";
                    } else {
                        speechOutput = "Channel switched to " + channelName;
			            IRcodeRequest(ircode3, function ResponseCallback(err, codeResponse) {
            		        if (err != undefined) {
                		        speechOutput = "I had trouble processing this request. Please try again.";
            		        } else {
                		        speechOutput = "Channel switched to " + channelName;
                                Callback(speechOutput);
            		        }
        		        });
                    }
                });
            }
        });       
    } else {
        speechOutput = "I had trouble finding that channel " + channelName;
        Callback(speechOutput);
    }
};

var SetChannelNumber = function (channelNumber, Callback) {
    console.log("SetChannelNumber " + channelNumber);

    var ircode1;
    var ircode2;
    var ircode3;
    var speechOutput;

    var channel = channelNumbers[channelNumber];
    if (channel) {
        ircode1 = channel["ir1"];
        ircode2 = channel["ir2"];
        ircode3 = channel["ir3"];
    }

    if(ircode1 && ircode2 && ircode3) {
        console.log(ircode1 + " code sent to TV");
        IRcodeRequest(ircode1, function ResponseCallback(err, codeResponse) {
            if (err != undefined) {
                speechOutput = "I had trouble processing this request";
            } else {
                speechOutput = "Channel switched to " + channelNumber;
                IRcodeRequest(ircode2, function ResponseCallback(err, codeResponse) {
                    if (err != undefined) {
                        speechOutput = "I had trouble processing this request";
                    } else {
                        speechOutput = "Channel switched to " + channelNumber;
                        IRcodeRequest(ircode3, function ResponseCallback(err, codeResponse) {
                            if (err != undefined) {
                                speechOutput = "I had trouble processing this request";
                            } else {
                                speechOutput = "Channel number is " + channelNumber;
                                Callback(speechOutput);
                            }
                        });
                    }
                });
            }
        });
    } else {
        speechOutput = "I had trouble set channel " + channelNumber;
        Callback(speechOutput);
    }
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
        if(error != undefined) {
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

var SetVolume = function(volume, ResponseCallback) {
    console.log("SetVolume function requested.");

    request({
        url: 'http://' + config.sony.ip + ':' + config.sony.port + '/sony/audio', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        headers: {
            'X-Auth-PSK': '0000',
            'Content-Type': 'application/json'
        },
        json: {
            "id":2,
            "method":"setAudioVolume",
            "version":"1.0",
            "params":[{
                "target":"headphone",
                "volume":volume
            }]
        },
    }, function(error, response, body){
        if(error) {
            console.log('communication error ' + error);
            ResponseCallback(error, response);
        }
        else {
            if (body != undefined) {
                console.log(body.result[0]);
                ResponseCallback(null, body.result[0])
            } else {
                console.log(body);
                ResponseCallback("error", body)
            }
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
    ChannelChange: ChannelChange,
    SetChannelNumber: SetChannelNumber,
    VolumeChange: VolumeChange,
    SetMute: SetMute,
    ShowGuide: ShowGuide,
    SetChannel: SetChannel,
    PowerStatus: PowerStatus,
    SetVolume: SetVolume,
    CallSonyAPI: CallSonyAPI,
};