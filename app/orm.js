const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME || dogstragram}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = require( '../models')
console.log( 'attached the mongoose schemas: ', db )

async function initDb(){
    // seed some dog data
    const dogResult = await db.Dogs.insertMany([
        { title: 'Woofalicious',
            image: 'https://cdn.discordapp.com/attachments/708208453528584212/733690892464160798/hqdefault.png',
            keywords: [ 'Lovable' ]},
        { title: 'Peaceful meditation',
            image: 'https://cdn.discordapp.com/attachments/708208453528584212/733689355524243508/unknown.png',
            keywords: [ 'Zen'] }
    ])
    console.log( ' dogs saved: ', dogResult )
    // add 2 users
    // db.users.insertMany([
    //     {}
    // ])
}
function getDogList( criteria={} ){
    return null
}

function saveDog( dogData ){
    return null
}

module.exports = {
    initDb, getDogList, saveDog
}