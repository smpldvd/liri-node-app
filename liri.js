require("dotenv").config();
const keys = require("./keys.js");
const request = require("request");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const fs = require("fs");

var cmdInput = process.argv[2];
var userInput = process.argv[3];

switch (cmdInput) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        if (userInput) {
            spotify(userInput);
        }
        else {
            spotify("The Sign");
        }
        break;
    case "movie-this":
        if (userInput) {
            movie(userInput);
        }
        else {
            movie('Mr. Nobody');
        }
        break;
    case "do-what-it-says":
        whatever();
        break;
    default:
        console.log("You didn't make a command")
        break;
};

function tweets() {
    const client = new Twitter(keys.twitter);
    var params = {screen_name: 'jimjefferies', counts: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          for(i = 0; i < tweets.length; i++){
              console.log("---------------------------------");
              console.log("Tweet: " + tweets[i].text);
              console.log("Created: " + tweets[i].created_at);
              console.log("---------------------------------");
              console.log("")
            }
        }else {
            console.log(error);
        }
    });
};

function spotify(input) {
    const spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: userInput, limit: 5 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }; 
        let song = data.tracks.items;
        for (i = 0; i < song.length; i++){
        // console.log(song);
        console.log("---------------------------------");
        console.log("Artist: " + song[i].album.artists[0].name); 
        console.log("Song: " + song[i].name); 
        console.log("Album: " + song[i].album.name); 
        console.log("Preview: " + song[i].preview_url); 
        console.log("---------------------------------");
        };
      });
};

function movie(input) {
    const queryUrl = "http://www.omdbapi.com/?i=tt3896198&apikey=d8d7e221&t=" + input;
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let movie = JSON.parse(body);
            // console.log(movie);
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Produced in: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        };
    });
};

function whatever() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        }
        else {
        let readRandom = data.split(',');
        spotify(readRandom[1]);
        }
    })
};