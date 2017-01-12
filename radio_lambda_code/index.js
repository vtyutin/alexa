
/**
 * App ID for the skill
 */

var AlexaSkill = require('./js/AlexaSkill');
var express = require('express');
var request = require('request');
var http = require('http')
var config = require('./config');
var channel = "";

var APP_ID = config.appid;

var Radio = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Radio.prototype = Object.create(AlexaSkill.prototype);
Radio.prototype.constructor = Radio;

Radio.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Radio onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Radio.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Radio onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "You can play radio romantic";
    var repromptText = "Say play to start radio playing";
    response.ask(speechOutput, repromptText);
};

Radio.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Radio onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Radio.prototype.intentHandlers = {
    // register custom intent handlers

    HelpIntent: function (intent, session, response) {
        response.ask("You can tell the radio to play and stop.");
    },
    'AMAZON.PauseIntent': function (intent, session, response) {
        response.askWithDirectives("radio channel paused", null, [
            {
                "type": "AudioPlayer.Stop"
            }
        ]);
    },
    'AMAZON.StopIntent': function (intent, session, response) {
        response.askWithDirectives("radio channel stopped", null, [
            {
                "type": "AudioPlayer.Stop"
            }
        ]);
    },
    'AMAZON.CancelIntent': function (intent, session, response) {
        response.askWithDirectives("radio channel stopped", null, [
            {
                "type": "AudioPlayer.Stop"
            }
        ]);
    },
    'AMAZON.ResumeIntent': function (intent, session, response) {
        response.askWithDirectives("radio channel started", null, [
            {
                "type": "AudioPlayer.Play",
                "playBehavior": "REPLACE_ALL",
                "audioItem": {
                    "stream": {
                        "token": config.token,
                        "url": channel,
                        "offsetInMilliseconds": 0
                    }
                }
            }
        ]);
    },
    PlayIntent: function (intent, session, response) {
        channel = config.romantika_url;
        /*var channelname = intent.slots.channel.value;
        if (channelname == "bangla") {
            channel = config.indian_url2;
        } else if (channelname == "tamil") {
            channel = config.indian_url3;
        }*/
        response.askWithDirectives("radio channel started", null, [
            {
                "type": "AudioPlayer.Play",
                "playBehavior": "REPLACE_ALL",
                "audioItem": {
                    "stream": {
                        "token": config.token,
                        "url": channel,
                        "offsetInMilliseconds": 0
                    }
                }
            }
        ]);
    },
    'AMAZON.LoopOffIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.LoopOnIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.NextIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.PreviousIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.RepeatIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.ShuffleOffIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.ShuffleOnIntent': function (intent, session, response) {response.ask("not supported");},
    'AMAZON.StartOverIntent': function (intent, session, response) {response.ask("not supported");},

};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Radio skill.
    var radio = new Radio();
    radio.execute(event, context);
};
