"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twemoji = require('twemoji');
const screenshot_1 = __importDefault(require("./screenshot"));
/**
 * Convert a text's emojis to twitter SVG emojis (chrome-aws-lambda does not support emojis)
 * @param text Any text containing unicode emojis
 * @returns Text with emojis replaced
 */
const emojify = (text) => twemoji.parse(text, { folder: 'svg', ext: '.svg' });
const extractTweetData_1 = __importDefault(require("./extractTweetData"));
const app = (0, express_1.default)();
app.set('views', __dirname + '/tweet');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.use('/screenshot', screenshot_1.default);
app.use('/tweet/assets', express_1.default.static(__dirname + '/tweet/assets'));
app.use('/', express_1.default.static(__dirname + '/public'));
app.get('/tweet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Load the tweet data from the url `tweetData` JSON query object
    const tweetData = yield (0, extractTweetData_1.default)(req, res);
    const tweetDataEmojified = Object.assign(Object.assign({}, tweetData), { pseudo: emojify(tweetData.pseudo), content: emojify(tweetData.content), quoted: tweetData.quoted && tweetData.quoted.content ? Object.assign(Object.assign({}, tweetData.quoted), { pseudo: emojify(tweetData.quoted.pseudo), content: emojify(tweetData.quoted.content) }) : null });
    // Check if a custom template was asked
    if (['no-stats'].some(x => x === req.query.style))
        res.render(req.query.style, { tweetData: Object.assign({}, tweetDataEmojified) });
    else
        res.render('classic', { tweetData: Object.assign({}, tweetDataEmojified) });
}));
app.listen('8080');
