// Code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Importing files needed to run the funtions
var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');

//Variables to target specific APIs in the keys.js file
// var spotify = new spotify(keys.spotify);

var liriCommand = process.argv[2];
//======================================================================

// Available commands for liri 
//my-tweets, spotify-this-song, movie-this, do-what-it-says

switch (liriCommand) {
    case "my-tweets":
    tweets();
    break;

    case "spotify-this-song":
    song();
    break;

    case "movie-this":
    movie();
    break;

    case "do-what-it-says":
    random();
    break;
}

//========================================================================

// FUNCTION FOR EACH LIRI COMMAND

// Function for Twitter
function tweets() {
    var client = new twitter(keys.twitter);
    var twitterUserName = process.argv[3];

    var params = {screen_name: twitterUserName};
    client.get('statuses/user_timeline', params, function(error, data, response) {
        if (error) {
            console.log(error);
        }
        else {

        console.log(twitterUserName + " latest tweets are: " + data);
        }
    })
};

//Function for Spotify
function song() {

};

//Function for movies
function movie() {
    // Store all of the arguments in an array
    var movieName = process.argv[3];
        if (!movieName) {
            movieName = "mr nobody";
        }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);
            //console.log(movieObject); // Show the text in the terminal
            var movieResults = 
            "------------------------------ begin ------------------------------" + "\r\n"
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(movieResults);
        } 
        else {
			console.log("Error :"+ error);
			return;
		}
    });
};

//Function for Random
function random(){

};
