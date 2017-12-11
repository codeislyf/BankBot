var _config = {
    CHAT_CONNECTOR: {
        APP_ID: process.env.MICROSOFT_APP_ID, //You can obtain an APP ID and PASSWORD here: https://dev.botframework.com/bots/new
        APP_PASSWORD: process.env.MICROSOFT_APP_PASSWORD
    },
    COMPUTER_VISION_SERVICE: {
        API_URL: "https://southeastasia.api.cognitive.microsoft.com/vision/v1.0/",
        API_KEY: '9ac28fa17c364295ad83cc23aae3ac1d'  //You can obtain an COGNITIVE SERVICE API KEY: https://www.microsoft.com/cognitive-services/en-us/pricing
    }
};
exports.CONFIGURATIONS = _config;
