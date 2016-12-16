
/**
 * App ID for the skill
 */

var AlexaSkill = require('./js/AlexaSkill');
var express = require('express');
var request = require('request');
var http = require('http')
var serverinfo = require("./js/serverinfo");
var config = require('./config');

var APP_ID = config.appid; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var Tivo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Tivo.prototype = Object.create(AlexaSkill.prototype);
Tivo.prototype.constructor = Tivo;

Tivo.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Tivo onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Tivo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Tivo onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the TV Controls, I can control the TV for you.";
    var repromptText = "You can say change channel to with the name of the channel.";
    response.ask(speechOutput, repromptText);
};

Tivo.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Tivo onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Tivo.prototype.intentHandlers = {
    // register custom intent handlers

    HelpIntent: function (intent, session, response) {
        response.ask("You can tell the TV to turn off and on, and request for various channels.");
    },

    TVPowerIntent: function (intent, session, response) {
        var header = {'power': intent.slots.power.value};//pulls variable from intent

        sendCommand("/sonybravia/power",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell("Initial TV Power " + powerintent + " sent from Lambda to home server.");
        });
    },

    VideoInputIntent: function (intent, session, response) {
        inputnumber = intent.slots.inputnumber.value;  //grab input value from user request
        var header = {'inputnumber': inputnumber};

        sendCommand("/sonybravia/videoinput",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell(res);
        });
    },

    VolumeIntent: function (intent, session, response) {
        volume = intent.slots.newvolume.value;  //grab input value from user request
        var header = {'newvolume': volume};

        sendCommand("/sonybravia/setvolume",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell(res);
        });
    },

    ChannelIntent: function (intent, session, response) {
        //Match name of channel to the corresponding number in channel-list.
        var channelname = intent.slots.channel.value.toLowerCase();
        var header = {'channel': channelname};

        sendCommand("/sonybravia/setchannel",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell(res);
        });
    },

};

function sendCommand(path,header,body,callback) {
    var opt = {
        host:serverinfo.host,
        port:serverinfo.port,
        path: path,
        method: 'POST',
        headers: header,
    };

    var req = http.request(opt, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
    });

    if (body) req.write(body);
    req.end();
};


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Tivo skill.
    var tivo = new Tivo();
    tivo.execute(event, context);
};

