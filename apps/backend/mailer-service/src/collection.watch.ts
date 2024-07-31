import {MongoClient, ChangeStream,ChangeStreamDocument,Collection} from 'mongodb'
import { sendEmail } from './send.mail';
import { env } from './validations/env';



const startWatching = async () =>{

const client = new MongoClient(env.MONGO_URL)
await client.connect();
const db  = client.db('test')
const collection:Collection = db.collection('subscriptions')


const chaneStream:ChangeStream = collection.watch();
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