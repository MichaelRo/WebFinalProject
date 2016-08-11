/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

// global namespace
var app = app || {};
var messages = [];
var socket = {};
var screenId = 0;
var messagesRequeryNeeded = false;

/**
 * Wire up function to connect between the client and server and pull messages for the first time
 */
function wireup() {
    // Connect using socket io
    socket = io.connect(window.location.origin);

    // Listen to requrey neede event
    socket.on('requeryNeeded', function(data) {
        messagesRequeryNeeded = true;
    });

    // Get the messages to display
    getMessages();
}


/**
 * Extracts relevant messages to display from general messages pool by timeFrames.
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

/**
 * Switches display between all the relevant messages according to message display length.
 * @param messages - The relevant messages
 * @param indexOfMessageToDisplay - The index
 */
function displayMessages(messages, indexOfMessageToDisplay) {
    if (messagesRequeryNeeded) {
        messagesRequeryNeeded = false;
        // Get messages
        getMessages();
    }
    else {
        displayMessage(messages[indexOfMessageToDisplay]);

        // Calculate index of next message to display.
        var nextIndex = (indexOfMessageToDisplay + 1) % messages.length;

        setTimeout(function() { displayMessages(messages, nextIndex); },
                   messages[indexOfMessageToDisplay].displayLength * 1000);
    }
}

/**
 * Manipulates the DOM tree to display the given message (Updates the HTML).
 * @param message - The message to display.
 */
function displayMessage(message) {
    // If we already found a css link element
    if ($("link[rel='stylesheet']").length) {
        $("link[rel='stylesheet']").attr("href", message.templateUrl);
    }
    else {
        // If it doesn't exist, add it
        $("head").append("<link rel='stylesheet' type='text/css' href='" + message.templateUrl + "' />")
    }

    // Clear all child elements
    $("#textContainer").empty();

    // Foreach text in the message add a div with the given text
    for (i = 0; i < message.textArray.length; i++) {
        $("#textContainer").append( "<div id='text_" + i + "'>" + message.textArray[i] + "</div>");
    }

    // Clear all child elements
    $("#videoContainer").empty();

    // If message contains a video
    if (message.videoPath !== "") {
        $("#videoContainer").append("<iframe width=\"854\" height=\"480\" src='" + message.videoPath + "?autoplay=1' frameborder=\"0\"></iframe>");
    }

    // Clear all child elements
    $("#imageContainer").empty();

    // Foreach image in the message add a img with the given path
    for (i = 0; i < message.imageArray.length; i++) {
        $("#imageContainer").append( "<img id='image_" + i + "' src='" + message.imageArray[i] + "'></img>");
    }
}


/**
 * Gets the value of a url parameter
 * @param sParam - the parameter to take from url.
 * @returns true if found, else false.
 */
function getUrlParameter(sParam)
{
    var sPageURL = decodeURIComponent(window.location.pathname.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
