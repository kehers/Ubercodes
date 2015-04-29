var Twit = require('twit')
    , twtxt = require('twitter-text')
    , express = require('express')
    , app = express()
    , server = require('http').Server(app)
    , io = require('socket.io')(server)
    ;

// Middlewares
//app.use(compression());
//app.use(favicon(__dirname + '/public_html/images/favicon.png'));
app.use(express.static(__dirname + '/public_html'));

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public_html/index.html');
});

var twitter = new Twit({
    consumer_key: process.env['KEY']
  , consumer_secret: process.env['SECRET']
  , access_token: process.env['TOKEN']
  , access_token_secret: process.env['TOKEN_SECRET']
});


var stream = twitter.stream('statuses/filter', { track: 'uber code' });
stream.on('tweet', function (tweet) {
  // No sensitive or retweeted tweet
  if (tweet.possibly_sensitive ||
    tweet.retweeted_status) {
    return;
  }

  // Push to socketio if there is a connection
  // ...and autolink
  io.emit('tweet', tweet,
    twtxt.autoLink(twtxt.htmlEscape(tweet.text), {
        urlEntities: tweet.entities.urls
      }));
  // Retweet
  // Add some random probability to avoid over tweeting
  if (parseInt(Math.random() * 10) > 7) {
    T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
    });
  }
});
