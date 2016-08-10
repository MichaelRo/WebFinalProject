/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

var app = app || {};
var messages = [];
var socket = {};
var screenId = 0;
var messagesRequreyNeeded = false;

/*
 * Wireup function to connect to server and pull messages for the first time
 */
function wireup() {
    socket = io.connect(window.location.origin);

    // listen to requrey neede event
    socket.on('requeryNeeded', function(data) {
        messagesRequreyNeeded = true;
    });

    getMessages();
}

/*
 *
 *  Extracts relevant messages to display from general messages pool by timeFrames.
 *
 */
function getMessages() {
    screenId = getUrlParameter('screen');

    // perform ajax request to get the data
    $.get( "/api/screen=" + screenId, function( data ) {
        // if a some message gotten
        if (data && data.length > 0) {
            // loop through the messages to display
            displayMessages(data, 0);
        }
    });
}

/*
 *
 *  switches display between all the relevant messages according
 *  to message display length
 *
 */
function displayMessages(messages, indexOfMessageToDisplay) {
    if (messagesRequreyNeeded) {
        messagesRequreyNeeded = false;

        getMessages();
    }
    else {
        displayMessage(messages[indexOfMessageToDisplay]);

        var nextIndex = (indexOfMessageToDisplay + 1) % messages.length;

        setTimeout(function(){ displayMessages(messages, nextIndex); }, messages[indexOfMessageToDisplay].displayLength * 1000);
    }
}

/*
 *
 *  Manipulates the DOM tree to display the given message (Updates the HTML)
 *
 */
function displayMessage(message) {
    // if we already found a css link element
    if ($("link[rel='stylesheet']").length) {
        $("link[rel='stylesheet']").attr("href", message.templateUrl);
    }
    else {
        // if it doesn't exist, add it
        $("head").append("<link rel='stylesheet' type='text/css' href='" + message.templateUrl + "' />")
    }

    // clear all child elements
    $("#textContainer").empty();

    // foreach text in the message add a div with the given text
    for (i = 0; i < message.textArray.length; i++) {
        $("#textContainer").append( "<div id='text_" + i + "'>" + message.textArray[i] + "</div>");
    }

    // clear all child elements
    $("#videoContainer").empty();

    // if message contains a video
    if (message.videoPath !== "") {
        $("#videoContainer").append("<video loop autoplay>" +
                                        "<source src='" + message.videoPath + "' type=video/mp4>" +
                                    "</video>");
    }

    // clear all child elements
    $("#imageContainer").empty();

    // foreach image in the message add a img with the given path
    for (i = 0; i < message.imageArray.length; i++) {
        $("#imageContainer").append( "<img id='image_" + i + "' src='" + message.imageArray[i] + "'></img>");
    }
}

/*
 *
 *  Gets the value of a url parameter
 *
 */
function getUrlParameter(parameter) {
    var urlVariables = decodeURIComponent(window.location.pathname.substring(1)).split('&'),
        parameterName;

    for (var i = 0; i < urlVariables.length; i++) {
        parameterName = urlVariables[i].split('=');

        if (parameterName[0] === parameter) {
            return parameterName[1] === undefined ? true : parameterName[1];
        }
    }
};