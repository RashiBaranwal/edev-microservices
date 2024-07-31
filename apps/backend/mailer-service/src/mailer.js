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
const mongodb_1 = require("mongodb");
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./validations/env");
const startWatching = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(env_1.env.MONGO_URL);
    yield client.connect();
    const db = client.db('test');
    const collection = db.collection('subscriptions');
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'dexter.rocks.one.and.only@gmail.com',
            pass: 'jorsehaso'
        }
    });
    const emailTemplatePath = path_1.default.join(__dirname, './template/index.html');
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf-8');
    const sendEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const mailOptions = {
            from: 'dexter.rocks.one.and.only@gmail.com',
            to: email,
            subject: 'Hello from Dexter'
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        }
        catch (error) {
            console.log(`Error sending email to ${email}`);
        }
    });
    const chaneStream = collection.watch();
    chaneStream.on('change', (next) => __awaiter(void 0, void 0, void 0, function* () {
        if (next.operationType === 'insert') {
            const email = next.fullDocument.email;
            yield sendEmail(email);
        }
    }));
    console.log('Listening for changes in the database');
});
startWatching().catch(err => {
    console.error(err);
    process.exit(1);
});
