module.exports = {
    storySet: function (storyTitle) {

        var validStory = true;
        var tweetTitle = storyData.tvb.title;
        var tweetTitleLength = tweetTitle.length;
        var tweetMaxCount = storyData.tvb.tweetCount;
        var loops;

        // Title/Tweet Count Check
        if (tweetTitleLength <= 15 && tweetTitle.charAt(0) == '#' && !tweetTitle.slice(1, 14).contains('#') && tweetMaxCount <= 99 && validStory) {
        } else {
            validStory = false;
        }

        // Body Check
        loops = 1;
        while (loops <= tweetMaxCount && validStory) {
            var checkBody = storyData[loops].body;
            var checkBodyLength = checkBody.length;
            if (checkBody.contains('#') || checkBody.contains('@') || checkBodyLength > 120) {
                validStory = false;
            }
            loops += 1;
        }

        // Buffer Check
        loops = 1;
        while (loops <= tweetMaxCount && validStory) {
            var checkBuffer = storyData[loops].body;
            if (checkBuffer <= 600 && checkBuffer >= 120) {
                validStory = false;
            }
            loops += 1;
        }

        if (storyValid) {
            var storyData = require('./stories/${storyTitle}.json');
        }
    }
}