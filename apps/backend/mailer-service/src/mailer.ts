import {MongoClient, ChangeStream,ChangeStreamDocument,Collection} from 'mongodb'
import nodemailer,{Transporter} from 'nodemailer'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const startWatching = async () =>{

const client = new MongoClient('mongodb+srv://sohambasak42:cQXQ72iRk42bbooG@cluster0.7fsjtdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
await client.connect();
const db  = client.db('test')
const collection:Collection = db.collection('subscriptions')

const transporter:Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'dexter.rocks.one.and.only@gmail.com',
        pass: 'jorsehaso'
    }

});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emailTemplatePath:string = path.join(__dirname,'./template/index.html')
const emailTemplate:string = fs.readFileSync(emailTemplatePath,'utf-8');

const sendEmail = async (email:string) => {
    const mailOptions = {
        from: 'dexter.rocks.one.and.only@gmail.com',
        to: email,
        subject: 'Hello from Dexter',
        html: `<h1>Welcome to </h1>`
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${email}`);
        
    } catch (error) {
        console.log(`Error sending email to ${email}`);
        console.log(error);
        
    }

};

const chaneStream:ChangeStream = collection.watch(); // Change Stream for the collection 'subscriptions'
chaneStream.on('change',async (next:ChangeStreamDocument) => {
    if(next.operationType === 'insert'){
        const email:string = next.fullDocument.email;
        await sendEmail(email)
    }
});

console.log('Listening for changes in the database');

}

startWatching().catch(err => {
    console.error(err)
    process.exit(1)
});