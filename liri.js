require("dotenv").config();

var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");

var action = process.argv[2]
var input = process.argv[3]

function commands(action, input) {
    switch (action) {
        case "concert-this":
            getConcert(input);
            break;

        case "spotify-this-song":
            getSong(input);
            break;

        case "movie-this":
            getMovie(input);
            break;

        case "do-what-it-says":
            justDoIt(input);
            break;

        default:
            console.log("Valid input has not been entered. Please enter a command: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says' followed by input.");
    }
};

function getConcert(artist) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    console.log(queryUrl);

    axios.get(queryUrl)
    .then(function (response) {

            var concertObject = response.data;
            var venue = concertObject[0].venue;
            var myNewTime = moment(concertObject[0].datetime).format('MM/DD/YYYY');

            var concertResults =
                "------------------------------ begin ------------------------------" + "\r\n" +
                "Name of the Venue: " + venue.name + "\r\n" +
                "Venue Location: " + venue.city + "\r\n" +
                "Date of Event: " + myNewTime + "\r\n" +
                "------------------------------ end ------------------------------" + "\r\n";
            console.log(concertResults);

            fs.appendFile('log.txt', concertResults, function (err) {
                if (err) throw err;
            });
            console.log("Saved!");
            logResults(response);
    })
    .catch(function(error) {
        console.log(error);
    })
};

function getSong(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    };

    console.log(songName);

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url);

        var logSong = "Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url + "\n";

        fs.appendFile('log.txt', logSong, function (err) {
            if (err) throw err;
        });

        logResults(data);
    });
};

function getMovie(movieName) {
    if (!movieName) {
        movieName = "mr nobody";
    }


    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy"

    console.log(queryUrl);

    axios.get(queryUrl)
    .then(function (response) {

            var movieObject = response.data;

            var movieResults =
                "------------------------------ begin ------------------------------" + "\r\n" +
                "Title: " + movieObject.Title + "\r\n" +
                "Year: " + movieObject.Year + "\r\n" +
                "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                "Country: " + movieObject.Country + "\r\n" +
                "Language: " + movieObject.Language + "\r\n" +
                "Plot: " + movieObject.Plot + "\r\n" +
                "Actors: " + movieObject.Actors + "\r\n" +
                "------------------------------ end ------------------------------" + "\r\n";
            console.log(movieResults);

            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
            });
            console.log("Saved!");
            logResults(response);
        })
        .catch(function(error) {
            console.log(error);
        })
    };

function justDoIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            console.log(data);

            var randomData = data.split(",");
            commands(randomData[0], randomData[1]);
        }
        console.log("test" + randomData[0] + randomData[1]);
    });
};

function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err)
            throw err;
    });
};

commands(action, input);