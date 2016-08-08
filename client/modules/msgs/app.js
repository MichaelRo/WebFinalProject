/**
 * Michael Roytman
 * Itay Desalto
 * Marom Felz
 */

// global namespace
var app = app || {};
var displayTimeout;
var messages = [];
var socket = {};
var screenId = 0;
var messagesRequreyNeeded = false;

/*
 * Wireup function to connect to server and pull messages for the first time
 */
function wireup()
{
    // connect using socket io
    socket = io.connect(window.location.origin);

    // listen to requrey neede event
    socket.on('requeryNeeded', function(data)
    {
        // indicate requery needed
        messagesRequreyNeeded = true;
    });

    // get the messages to display
    getMessages();
}


/*
 *
 *  Extracts relevant messages to display from general messages pool by
 *  timeframes.
 *
 */
function getMessages()
{
    screenId = getUrlParameter('screen');
    // perform ajax request to get the data
    $.get( "/api/screen=" + screenId, function( data ) {

        // if a some message gotten
        if (data && data.length > 0)
        {
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
function displayMessages(messages, indexOfMessageToDisplay)
{
    if (messagesRequreyNeeded)
    {
        // reset reqoury flag
        messagesRequreyNeeded = false;
        // refetch messages
        getMessages();
    }
    else
    {
        // display message
        displayMessage(messages[indexOfMessageToDisplay]);

        // calculate index of next message to display (cyclic formula)
        var nextIndex = (indexOfMessageToDisplay + 1) % messages.length;

        //if (nextIndex < messages.length)
        //{
        setTimeout(function(){
            displayMessages(messages, nextIndex);
        }, messages[indexOfMessageToDisplay].displayLength * 1000);
    }
}

/*
 *
 *  Manipulates the DOM tree to display the given message (Updates the HTML)
 *
 */
function displayMessage(msg)
{
    // if we already found a css link element
    if ($("link[rel='stylesheet']").length)
    {
        $("link[rel='stylesheet']").attr("href", msg.templateUrl);
    }
    else
    {
        // if it doesn't exist, add it
        $("head").append("<link rel='stylesheet' type='text/css' href='" + msg.templateUrl + "' />")
    }

    // clear all child elements
    $("#textContainer").empty();

    // foreach text in the message add a div with the given text
    for (i = 0; i < msg.textArr.length; i++)
    {
        $("#textContainer").append( "<div id='text_" + i + "'>" + msg.textArr[i] + "</div>");
    }

    // clear all child elements
    $("#videoContainer").empty();

    // if message contains a video
    if (msg.videoPath !== "")
    {
        $("#videoContainer").append("<video loop autoplay>" +
                                        "<source src='" + msg.videoPath + "' type=video/mp4>" +
                                    "</video>");
    }

    // clear all child elements
    $("#imageContainer").empty();

    // foreach image in the message add a img with the given path
    for (i = 0; i < msg.imageArr.length; i++)
    {
        $("#imageContainer").append( "<img id='image_" + i + "' src='" + msg.imageArr[i] + "'></img>");
    }
}


/*
 *
 *  Gets the value of a url parameter
 *
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
