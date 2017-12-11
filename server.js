var builder = require('botbuilder');
var restify = require('restify');
var Promise = require('bluebird');
var request_promise = require('request-promise').defaults({ encoding: null });
var request = require('request');
var config = require('./configuration');
var util = require('util');
var textAnalytics = require('./textAnalyticsApiClient');
var languageAnalytics = require('./textLanguageApiClient');
var tokenHandler = require('./tokenHandler');
var locationDialog = require('botbuilder-location');
require('dotenv-extended').load();
var spellService = require('./spell-service');
// Setup Restify Server
var server = restify.createServer();
var applicationInsights = require("applicationinsights");
var telemetry = new applicationInsights.TelemetryClient("06dc0c53-d62e-43be-add5-ace7be50b7be");
var locationDialog = require('botbuilder-location');
//bot.library(locationDialog.createLibrary("AmkiwfSNw3goQWsCgmY0ndia7gpRe6vko65cS4j7vkNO0XvokLitfk4JR3ynOzPu"));
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var luisRecognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2895b4d4-54ab-4f00-93fb-026a6bc2810d?subscription-key=522a44688ce74f4b9c6260a342602b9b&spellCheck=true&verbose=true&timezoneOffset=0&q=').onEnabled(function (context, callback) {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(luisRecognizer);


/*bot.dialog('TravelInsurance', [
    function (session, args, next) {
        session.send('');
        telemetry.trackEvent({ name: "Travel Insurance" });
        session.send('EBL Visa Platinum cardholders are entitled for BDT 1,000,000 for Travel Accidental Death Insurance. In the unfortunate event of accidental death or permanent disability due to accident, cardholders’ family will receive coverage of the BDT 1,000,000.');
        session.endDialog('Would you like to know more?');
    }])//.triggerAction({ matches: /^does it offer travel insurance/i });
.triggerAction({ matches: 'TravelInsurance' });*/

bot.dialog('priv', [
    function (session, args, next)  {
        telemetry.trackEvent({ name: "Privileges" });
        session.send('Free to design PermataMe Card as you wish, free monthly administration fee, if your monthly average savings balance is greater than or equal to Rp 50.000, free monthly administration fee PermataMe Card!');
        session.endDialog('Is there something else I can help you with?');
    }]).triggerAction({ matches:'priv'});


bot.dialog('showCards', [
    function (session, args, next) {
        telemetry.trackEvent({ name: "Card options"});
        if (session.message && session.message.value) {
            processSubmitAction(session, session.message.value);
            return;
        }
             var card = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
                'type': 'AdaptiveCard',
                'version': '1.0',
                'body': [
                    {
                        'type': 'Container',
                        'speak': '<s>Are you looking for a Debit Card?</s>',
                        'items': [
                            {
                                'type': 'ColumnSet',
                                'columns': [
                                    {
                                        'type': 'Column',
                                        'size': 'auto',
                                        'items': [
                                            {
                                                'type': 'Image',
                                                'url': 'http://4.bp.blogspot.com/-su4Pxx4oweo/UNk6o4lDJxI/AAAAAAAAEVw/JXaK7_2IWzo/s1600/Logo+Bank+Permata.jpg',
                                                'size': 'medium',
                                                'style': 'person'
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 'stretch',
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Permata Bank',
                                                'weight': 'bolder',
                                                'isSubtle': true
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Are you looking for Debit Card or Credit Card?',
                                                'wrap': true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'actions': [
                    // Credit Cards Search form
                    {
                        'type': 'Action.ShowCard',
                        'title': 'Debit Cards',
                        'speak': '<s>Credit Cards</s>',
                        'card': {
                            'type': 'AdaptiveCard',
                            'body': [

                                {
                                    'type': 'TextBlock',
                                    'text': 'Welcome to the Debit Cards finder!',
                                    'weight': 'bolder',
                                    'size': 'large'
                                },
                                {
                                    'type': 'TextBlock',
                                    'text': 'For transactions such as : '
                                },
                                {
                                    "type": "Input.ChoiceSet",
                                    "id": "MultiSelectVal",
                                    "isMultiSelect": true,
                                    //"value": "1",
                                    "choices": [
                                        {
                                            "title": "ATM services",
                                            "value": "1"
                                        },
                                        {
                                            "title": "Mobile banking",
                                            "value": "2"
                                        },
                                        {
                                            "title": "Net banking",
                                            "value": "3"
                                        }
                                    ]
                                },
                                {
                                    'type': 'TextBlock',
                                    'text': 'Customizable design on card :'
                                },
                                {
                                    "type": "Input.ChoiceSet",
                                    "id": "MultiSelectVal",
                                    "isMultiSelect": true,
                                    //  "value": "1,2",
                                    "choices": [
                                        {
                                            "title": "Yes",
                                            "value": "1"
                                        },
                                        {
                                            "title": "No",
                                            "value": "2"
                                        }
                                    ]
                                },
                                 {
                                    "type": "TextBlock",
                                    "text": "Phone banking service : "
                                },
                                {
                                    "type": "Input.ChoiceSet",
                                    "id": "SingleSelectVal",
                                    "style": "expanded",
                                    "value": "2",
                                    "choices": [
                                        {
                                            "title": "Yes",
                                            "value": "1"
                                        },
                                        {
                                            "title": "No",
                                            "value": "2"
                                        }
                                    ]
                                }
             ]
                            ,
                            'actions': [
                                {
                                    'type': 'Action.Submit',
                                    'title': 'Search',
                                    'speak': '<s>Search</s>',
                                    'data': {
                                        'type': 'Debit Cardsearch'
                                    }
                                }
                            ]
                        }
                    },
                  {
                        'type': 'Action.ShowCard',
                        'title': 'Credit Cards',
                        'card': {
                            'type': 'AdaptiveCard',
                            'body': [
                                {
                                    'type': 'TextBlock',
                                    'text': 'Credit cards is not implemented =(',
                                   
                                    'weight': 'bolder'
                                }
                            ]
                        }
                    }
                ]
            }
        };

        var msg = new builder.Message(session)
            .addAttachment(card);
        session.send(msg);
    }
])//.triggerAction({matches:/^show me cards/i});
.triggerAction({matches:'showCards'});

bot.dialog('/', 
    function (session, args, next) {
    telemetry.trackEvent({ name: "greetings" });
    session.endDialog(`Hey there! Welcome to PermataBank. How may I assist you today?`);
    //builder.Prompts.text(session,`Hey there! Welcome to Eastern Bank Limited. How may I assist you today?`);  
 }
).triggerAction({matches :'greetings'});

function processSubmitAction(session, value) {
    var cards = getCardsAttachments();
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
    session.send('Based on your preferences I have found you these options ..');  
    session.endDialog(reply);
    session.send('Is there something else I can assist you with?');
}

function getCardsAttachments(session) {
    return [
new builder.HeroCard(session)
            .title('PermataMe!')
            .images([
                builder.CardImage.create(session, 'https://www.permatabank.com/uploadedImages/PermataBank/Content/Products/Personal/SavingAndAccounts/PermataMe!%20686x250px-01.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.permatabank.com/en/Retail/Kartu-Debit/PermataMe!/#.Wi4NiUqWbD4', 'Learn More')
            ]),
        new builder.HeroCard(session)
            .title('Permata Debit')
            .images([
                builder.CardImage.create(session, 'https://www.permatabank.com/uploadedImages/PermataBank/Content_Retail/Products/Retail/DebitCards/transaksi%20supermarket.JPG')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.permatabank.com/en/Retail/Kartu-Debit/PermataDebit/#.Wi4NZkqWbD4', 'Learn More')
            ]),
       
        new builder.HeroCard(session)
            .title('Permata e-Saving')
            .images([
                builder.CardImage.create(session, 'https://www.permatabank.com/uploadedImages/PermataBank/Content_Retail/Products/Retail/DebitCards/Consumer_E-Banking.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.permatabank.com/en/Retail/Kartu-Debit/Permatae-Saving/#.Wi4NfEqWbD4', 'Learn More')
            ])
        ]
};                           

bot.dialog('/enablecomputervision',
    function (session, args, next) {
        telemetry.trackEvent({ name: "Sign up" });
        var msg = session.message;
        var extractedUrl = extractUrl(msg);
        var attachment = msg.attachments[0];
        if (attachment) {
            console.log(attachment);

            var fileDownload = new Promise(
                function (resolve, reject) {
                    resolve(request_promise(attachment.contentUrl));
                }
            );
            fileDownload.then(
                function (response) {
                    var card = {
                        'contentType': 'application/vnd.microsoft.card.adaptive',
                        'content': {
                            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
                            'type': 'AdaptiveCard',
                            'version': '1.0',
                            'body': [
                                {
                                    'type': 'Container',
                                    'speak': '<s></s>',
                                    'items': [
                                        {
                                            'type': 'ColumnSet',//
                                            'columns': [
                                                {
                                                    'type': 'Column',//
                                                    'size': 'stretch',
                                                    'items': [
                                                        {
                                                            'type': 'TextBlock',
                                                            'text': 'Looks like you are from Indonesia :)  Would you like to switch to Indonesian?',
                                                            'wrap': true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            'actions': [
                                {
                                    'type': 'Action.ShowCard',
                                    'title': '',
                                    'card': {
                                        'type': 'AdaptiveCard',
                                        'body': [
                                        ],
                                        'actions': [
                                            {
                                                'type': 'Action.Submit',
                                                'title': 'Beralih ke Indonesia',
                                                'data': {
                                                    'type': 'Choice '
                                                }
                                            }
                                        ]
                                    }
                                }
                                , {
                                    'type': 'Action.ShowCard',
                                    'title': 'No, continue in English',
                                    'speak': '<s>No, continue in English</s>',
                                    'card': {
                                        'type': 'AdaptiveCard',
                                        'body': [
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Sure, let\'s continue in English',
                                                'weight' :'bolder'
                                            },
                                            
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Please confirm if these details are correct : Yes/No'
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Name : SITI AISYAH'
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Sex : F'
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Date of birth : 11 FEB 1992'
                                            }]
                                    }  },]} };

                    readImageText(response, attachment.contentType, function (error, response, body) {
                        session.send(extractText(body));
                        var msg = new builder.Message(session)
                            .addAttachment(card);
                        session.endDialog(msg);

                    });
                } 
             ).catch(function (err, reply) {
                    console.log('I could read your passport!: ', {
                        statusCode: err.statusCode,
                        message: err
                    });
                    session.send("I could read your passport! %s", err);
                });
        }
        else if (extractedUrl != "") {
            readImageTextUrl(extractedUrl, 'application/json', function (error, response, body) {
                session.send(extractText(body));
            })
        }
        else {

            session.send("Sure! Please attach a scanned copy of your passport - as an image or url link (jpeg, png, gif, or bmp work for me).")
        }
    }
).triggerAction({ matches: 'signup'});

bot.dialog('/confirmDetails',
    function (session) {
        telemetry.trackEvent({ name: "Final Submit" });
        session.send('Your information has been gathered and now your application is under process.');    
     //  session.send('Based on your current location, you can collect your card from any of the closest branch -\n 1. 8A Marina Blvd −1 Singapore 018984\n 2. 12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Level 3, 018982\n  3. 8 Marina View, Asia Square Tower 1, Singapore 018960');
       session.endDialog('Is there something else I can help with?');
}
).triggerAction({ matches: 'confirmDetails'});

var requestWithToken = function (url) {
    return obtainToken().then(function (token) {
        return request_promise({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};
var readImageText = function _readImageText(url, content_type, callback) {
    var options = {
        method: 'POST',
        url: config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_URL + "ocr/",
        headers: {
            'Ocp-Apim-Subscription-Key': config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_KEY,
            'Content-Type': 'application/octet-stream'
        },
        body: url,
        json: false
    };
    request(options, callback);

};

var readImageTextUrl = function _readImageTextUrl(url, content_type, callback) {

    var options = {
        method: 'POST',
        url: config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_URL + "ocr/",
        headers: {
            'ocp-apim-subscription-key': config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_KEY,
            'content-type': content_type
        },
        body: { url: url, language: "en" },
        json: true
    };

    request(options, callback);

};

var extractText = function _extractText(bodyMessage) {
    var bodyJson = bodyMessage;

    if (IsJsonString(bodyMessage)) {
        bodyJson = JSON.parse(bodyMessage);
    }
    var regs = bodyJson.regions;
    text = "";

    if (typeof regs === "undefined") { return "Something's amiss, please try again."; };

    // Get line arrays
    var allLines = regs.map(x => x.lines);
    // Flatten array
    var allLinesFlat = [].concat.apply([], allLines);
    // Get the words objects
    var allWords = allLinesFlat.map(x => x.words);
    // Flatten array
    var allWordsFlat = [].concat.apply([], allWords);
    // Get the text
    var allText = allWordsFlat.map(x => x.text);
    // Flatten
    var allTextFlat = [].concat.apply([], allText);

    text = allTextFlat.join(" ");

    if (text) {
        console.log(text);
        return text;
    } else {
        return "Could not find text in this image. :( Try again?";
    }
};

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

var extractUrl = function _extractUrl(message) {

    if (message.type !== "message") return;

    if (typeof message.attachments !== "undefined"
        && message.attachments.length > 0) {
        return message.attachments[0].contentUrl;
    }

    if (typeof message.text !== "") {
        return _findUrl(message.text);
    }

    return "";
};

function _findUrl(text) {
    var source = (text || '').toString();
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((http|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g;

    // Iterate through any URLs in the text.
    if ((matchArray = regexToken.exec(source)) !== null) {
        var token = matchArray[0];
        return token;
    }

    return "";
    }
var analyzeText = textAnalytics({
    apiKey: '802125f7762e477987db7b0029d3b3f4'
});

bot.dialog('enablefeedback', [
    function(session, args,next)  {
        telemetry.trackEvent({ name: "Feedback" });
        builder.Prompts.text(session, 'Would you like to rate my service?');
    },
    function(session, response,next) {
         var answer = session.message.text;
         analyzeText(answer, (err, score) => {
            if (err) {
                session.endDialog('Ooops! Something went wrong while analyzing your answer. Our Service Rep will get in touch with you to follow up soon.');
            } else {
                if (score <=0.5) {
                    session.send('Sentiment score : '+ score.toString().substring(0,6));
                    session.send('I understand that you might be dissatisfied with my assistance. Our Service Rep will get in touch with you soon to help you.'); 
                    builder.Prompts.text(session,'Anything else I can help with?');
                    
                } else {
                    session.send('Sentiment score : '+ score.toString().substring(0,6));
                    session.send('Thanks for your valuable feedback.');
                    builder.Prompts.text(session,'Anything else I can help with?');  
                }
            }
        });
    }
]).triggerAction({ matches: 'enablefeedback'});

tokenHandler.init();

var FROMLOCALE = 'zh-CHS'; 
var TOLOCALE = 'en';

bot.use({
    receive: function (extractText, next) {
        var token = tokenHandler.token();
        if (token && token !== "") { //not null or empty string
            var urlencodedtext = urlencode(extractText.text); // convert foreign characters to utf8
            var options = {
                method: 'GET',
                url: 'http://api.microsofttranslator.com/v2/Http.svc/Translate' + '?text=' + urlencodedtext + '&from=' + FROMLOCALE + '&to=' + TOLOCALE,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };
            request(options, function (error, response, body) {
                //Check for error
                if (error) {
                    return console.log('Error:', error);
                } else if (response.statusCode !== 200) {
                    //return console.log('Invalid Status Code Returned:', response.statusCode);
                } else {
                    // Returns in xml format, no json option :(
                    parseString(body, function (err, result) {
                        console.log(result.string._);
                        extractText.text = result.string._;
                        next();
                    });

                }
            });
        } else {
            console.log("No token");
            next();
        }
    }
});
