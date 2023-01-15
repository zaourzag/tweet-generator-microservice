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
Object.defineProperty(exports, "__esModule", { value: true });
const atob = require('atob');
const resThrow = (res, errors, status = 400) => new Promise(() => res.status(status).json({ errors }).end(() => {
    throw new Error(errors.join(', '));
}));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetData: tweetDataRaw } = req.query;
    if (!tweetDataRaw)
        yield resThrow(res, ['Missing tweetData query JSON object']);
    if (Array.isArray(tweetDataRaw))
        yield resThrow(res, ['tweetData query should not be an array of string']);
    let tweetData;
    try {
        tweetData = JSON.parse(decodeURIComponent(tweetDataRaw));
    }
    catch (error) {
        try {
            tweetData = JSON.parse(decodeURIComponent(atob(tweetDataRaw)));
        }
        catch (error) {
            yield resThrow(res, ['tweetData query is not a valid JSON object']);
        }
    }
    let errors = [];
    // Check tweet content
    const mainTweet = {
        pseudo: tweetData.pseudo,
        handle: tweetData.handle,
        content: tweetData.content,
        verified: tweetData.verified || false,
        date: tweetData.date || new Date(),
        retweets: tweetData.retweets || 0,
        likes: tweetData.likes || 0,
        replies: tweetData.replies || 0,
        avatar: tweetData.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
    };
    // Check all mandatory parameters were set
    if (!mainTweet.pseudo || !mainTweet.handle || !mainTweet.content)
        errors.push('Missing pseudo, handle or content');
    // Check date is valid, current date if not set
    if (isNaN(Date.parse(mainTweet.date)))
        errors.push('Invalid date');
    // Check quoted tweet content (if any)
    const quotedTweet = tweetData.quoted ? {
        pseudo: tweetData.quoted.pseudo,
        handle: tweetData.quoted.handle,
        content: tweetData.quoted.content,
        verified: tweetData.quoted.verified || false,
        date: tweetData.quoted.date || new Date(),
        retweets: tweetData.quoted.retweets || 0,
        likes: tweetData.quoted.likes || 0,
        replies: tweetData.quoted.replies || 0,
        avatar: tweetData.quoted.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
    } : null;
    // Check there's no request errors
    if (errors.length > 0)
        yield resThrow(res, errors);
    return Object.assign(Object.assign({}, mainTweet), { quoted: quotedTweet });
});
