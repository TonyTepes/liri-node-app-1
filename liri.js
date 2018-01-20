// Code to read and set any environment variables with the dotenv package
require('dotenv').config();

// Importing files needed to run the funtions
var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Variables to target specific APIs in the keys.js file

var liriCommand = process.argv[2];
//======================================================================

// Available commands for liri 
//my-tweets, spotify-this-song, movie-this, do-what-it-says
switch (liriCommand) {
    case "my-tweets":
    getTweets();
    break;

    case "spotify-this-song":
    getSong();
    break;

    case "movie-this":
    getMovie();
    break;

    case "do-what-it-says":
    getRandom();
    break;

    //If no command is entered, this is the default message to user
    default:
      console.log("No valid argument has been provided, please enter one of the following commands: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says' followed by parameter.");
}
//========================================================================

// FUNCTION FOR EACH LIRI COMMAND

// Function for Twitter
function getTweets() {
    var client = new twitter(keys.twitter);
    var twitterUserName = process.argv[3];

    //Callback for twitter to search 20 latest tweets for a specific twitter user
    var params = {screen_name: twitterUserName, count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        else {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text + "\nCreated: " + tweets[i].created_at);

                //Creates variable to log tweets into log.txt file
                var logTweets = twitterUserName + "\nTweet: " + tweets[i].created_at + "\nTweet Text: " + tweets[i].text + "\n-------\n";

                //Appends txt to log.txt file
                fs.appendFile('log.txt', logTweets, function (err) {
                    if (err) throw err;
                });

                console.log('Saved!');

            }
        }
    })
};

//Function for Spotify
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);

    //Store all of the arguments in an array
    var nodeArgs = process.argv;
    var songName= "";

    //Loop to run node arguments for songs that have more than one word
        for (var i =3; i <nodeArgs.length; i++) {
                songName = songName + " " + nodeArgs[i];
        }
    //If no song is provided, use "The Sign" 
        if (!songName) {
            songName = "The Sign";
        };        

        console.log(songName);

        //Callback to spotify to search for song name
        spotify.search({ type: 'track', query: songName}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            console.log("Artist: " + data.tracks.items[i].artists[0].name + "\nSong name: " + data.tracks.items[i].name +
            "\nAlbum Name: " + data.tracks.items[i].album.name + "\nPreview Link: " + data.tracks.items[i].preview_url); 
            
            //Creates a variable to save text into log.txt file
            var logSong = "Artist: " + data.tracks.items[i].artists[0].name + "\nSong name: " + data.tracks.items[i].name +
            "\nAlbum Name: " + data.tracks.items[i].album.name + "\nPreview Link: " + data.tracks.items[i].preview_url + "\n";
            
            //Appends text to log.txt file
            fs.appendFile('log.txt', logSong, function (err) {
                if (err) throw err;
              });
            
            logResults(data);
        });
};

//Function for movies
function getMovie() {
    //Store all of the arguments in an array
    var nodeArgs = process.argv;
    var movieName = "";
    //Loop to run node arguments for movies that have more than one word
        for (var i =3; i <nodeArgs.length; i++) {
            movieName = movieName + "+" + nodeArgs[i];
        }   
    //If no movie name is provided, use Mr.Nobody as default
        if (!movieName) {
            movieName = "mr nobody";
        }
            
    // Runs a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

    // Helps debugging
    console.log(queryUrl);

    //Callback to OMDB API to get movie info
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);

            //console.log(movieObject); // Show the text in the terminal
            var movieResults = 
            "------------------------------ begin ------------------------------" + "\r\n" +
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

            //Appends movie results to log.txt file
            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
              });
              console.log("Saved!");
              logResults(response);
        } 
        else {
			console.log("Error :"+ error);
			return;
		}
    });
};

//Function for Random
function getRandom(){
    //Reads text in random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        else {
        console.log(data);

        //creates a variable for data
        var randomData = data.split(",");
        //passes data into getSong function
        getSong(randomData[1]);
        }
        console.log(randomData[1]);
    });
};

//Function to log results from the other functions
function logResults(data){
    fs.appendFile("log.txt", data, function(err) {
      if (err)
          throw err;
    });
  }


