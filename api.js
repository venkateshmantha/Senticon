module.exports = {
    analyze: function (searchString, response) {

        //init twitter params
        var twit = require('twitter');
        var config = {
            consumer_key: 'cawTdQqUijbgrd8LPeQyoteUo',
            consumer_secret: 'onO5zUrs38VMx2F5cgA2ffSqnv9azhv2t5lEEIkqKh7HMHw62p',
            access_token_key: '776146037459279873-Vviu9KQ51v8x1BD5YEDBPl61BI5DWPB',
            access_token_secret: 'ZyZ1ILcnuM08RK7Yhs4ant5HIg6PCO2s0Wr4IiePploDH'
        };
        var twitterClient = new twit(config);
        var params = { q: searchString, count: 100 };

        //init watson conf.
        var watson = require('watson-developer-cloud');
        var tone_analyzer = watson.tone_analyzer({
            username: '3eb0e59d-5ee3-430f-b64a-cfde15acaf60',
            password: 'rob0mNUOBXsY',
            version: 'v3',
            version_date: '2016-05-19'
        });

        //pass twitter data to watson
        twitterClient.get('search/tweets', params, function(error, tweets) {
            if (!error) {
                var iter = tweets.statuses.length;
                var fs = require('fs');
                fs.open('out.txt', 'a+', function(err) {
                    for (i = 0; i < iter; i++) {
                        fs.appendFile('out.txt', tweets.statuses[i].text, function(err) {
                            if (err) {
                                console.log(err);
                                return response(err);
                            }
                        });
                    }

                    fs.readFile('out.txt', 'utf8', function(err, data) {
                        tone_analyzer.tone({ text: "'" + data + "'" }, function(err, tone) {
                            tone.document_tone.tone_categories[0].status = true;
                            var output = JSON.stringify(tone.document_tone.tone_categories[0], null, 2);
                            console.log(output);
                            fs.truncate('out.txt', 0, function(err) {
                                if (err) {
                                    console.error(err);
                                    return response(err);
                                }
                            });
                            return response(null, output);
                        });
                    });
                });
            }
        });
    }
};







