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
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const extractTweetData_1 = __importDefault(require("./extractTweetData"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tweetData = yield (0, extractTweetData_1.default)(req, res);
    try {
        const options = Object.assign({ headless: true, defaultViewport: {
                width: 600,
                height: 200,
                deviceScaleFactor: 3.2
            } }, (process.env.NODE_ENV === 'development'
            ? {
                executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                ignoreDefaultArgs: ['--disable-extensions']
            }
            : {
                args: chrome_aws_lambda_1.default.args,
                executablePath: yield chrome_aws_lambda_1.default.executablePath,
                headless: chrome_aws_lambda_1.default.headless
            }));
        const browser = yield puppeteer_1.default.launch({ args: ['--no-sandbox --headless'] });
        const page = yield browser.newPage();
        yield page.goto(`http://127.0.0.1:8080/tweet?tweetData=${JSON.stringify(tweetData)}&style=${req.query.style || ''}`);
        const file = yield page.screenshot({
            type: 'png',
            fullPage: true,
            omitBackground: true
        });
        yield browser.close();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        res.end(file);
    }
    catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error(error.message);
    }
});
