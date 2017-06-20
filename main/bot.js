var storyTitle = process.argv[2];

//Imports
var readline = require('readline');
var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

var storyData = require('./stories/' + storyTitle + '.json');

var validStory = true;
var tweetTitle = storyData.tvb.title;
var tweetTitleLength = tweetTitle.length;
var tweetMaxCount = storyData.tvb.tweetCount;
var loops;

// Title/Tweet Count Check
if (tweetTitleLength <= 15 && tweetTitle.charAt(0) == '#' && !tweetTitle.slice(1, 14).includes('#') && tweetMaxCount <= 99 && validStory) {
} else {
    validStory = false;
}

// Body Check
loops = 1;
while (loops <= tweetMaxCount && validStory) {
    var checkBody = storyData[loops].body;
    var checkBodyLength = checkBody.length;
    if (checkBody.includes('#') || checkBody.includes('@') || checkBodyLength > 120) {
        validStory = false;
    }
    loops += 1;
}

// Buffer Check
loops = 1;
while (loops <= tweetMaxCount && validStory) {
    var checkBuffer = storyData[loops].buffer;
    if (checkBuffer > 600 || checkBuffer < 120) {
        validStory = false;
    }
    loops += 1;
}

if (validStory) {
    //Main
    console.log('**\nBot Init\n**\n');

    var tweetCount = 0;
    var tweetNext = 1;

    console.log('-Twitventure Title: ' + tweetTitle + '\n');
    console.log('-Tweet Max Count: ' + tweetMaxCount);

    tweetLoop();
    function tweetLoop() {

        //Tweet Data
        if (tweetCount < tweetMaxCount) {
            tweetCount += 1;
            console.log('\n__\n-Tweet Count: ' + tweetCount + '\n');
            console.log('-Tweet Order: ' + tweetNext + '\n');
            var tweetBody = storyData[tweetNext].body;
            var tweetBuffer = storyData[tweetNext].buffer;
            tweetNext = storyData[tweetNext].next;
            console.log('-Tweet Next: ' + tweetNext + '\n');

            //Tweet Content
            if (tweetCount < tweetMaxCount) {
                var tweetContent = tweetTitle + ' ' + tweetCount + '\n' + tweetBody;
            } else {
                var tweetContent = tweetTitle + ' Fin\n' + tweetBody;
            }

            //Tweet Command
            T.post('statuses/update', { status: tweetContent }, tweetInfo);

            //Success/Error
            function tweetInfo(err, data, response) {
                if (err) {
                    console.log('>Error Tweeting.\n');
                } else {
                    console.log('>Successfully Tweeted:');
                    console.log(tweetContent + '\n');
                    if (tweetCount != tweetMaxCount) {
                        console.log('-Tweet Buffer Seconds: ' + tweetBuffer);
                        console.log('\n>Looping\n__\n');
                        startTimer();
                    } else {
                        console.log('\n**\nFinished Twitventure\n**\n');
                    }
                }
            }

            //Timer
            function startTimer() {
                var bufferSeconds = tweetBuffer;
                var bufferAmount = 0;
                var countdownTimer = setInterval(function () {
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write('Buffer Timer: ' + bufferSeconds);
                    bufferSeconds = bufferSeconds - 1;
                    bufferAmount += 1;

                    if (bufferSeconds <= 0) {
                        clearInterval(countdownTimer);
                        readline.clearLine(process.stdout);
                        readline.cursorTo(process.stdout, 0);
                        console.log('Buffer Time: ' + bufferAmount);
                        tweetLoop();
                    }
                }, 1000);
            }
        }
    }
} else {
    console.log('Story Provided Invalid');
}