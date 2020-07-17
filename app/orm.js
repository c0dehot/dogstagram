const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${process.env.DB_NAME || dogstragram}`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = require( '../models')
console.log( 'attached the mongoose schemas: ', db )

let userId

async function initDb(){
    await db.Dogs.deleteMany()
    await db.Users.deleteMany()

    // add user
    const userData = await db.Users.create( {
        username: 'test',
        thumbnail: 'https://ygsna.sites.yale.edu/sites/default/files/styles/people_thumbnail/public/pictures/picture-43-1410454948.jpg',
        password: 'test'
    } )
    console.log( '.. created user: ', userData )
    userId = userData._id

    // seed some dog data
    const dogInsert = await db.Dogs.insertMany([
        { owner: userData._id,
            title: 'Woofalicious',
            image: 'https://cdn.discordapp.com/attachments/708208453528584212/733690892464160798/hqdefault.png',
            keywords: [ 'Lovable' ]},
        { owner: userData._id,
            title: 'Peaceful meditation',
            image: 'https://cdn.discordapp.com/attachments/708208453528584212/733689355524243508/unknown.png',
            keywords: [ 'Zen'] }
    ])
}
function getDogList( criteria={} ){
    return db.Dogs.find( criteria, '-__v' ).populate('owner', '-password -__v -createdAt -updatedAt' )
}

function saveDog( dogData ){
    // TEMPORARY HACK, remove when sessions are crated!!!
    dogData.owner = userId
    return db.Dogs.create( dogData )
}

function addDogComment( commentData ){
    return db.Dogs.updateOne( { _id: commentData._id }, { $push: { comments: { comment: commentData.comment, name: 'anonymous' }} } )
}

module.exports = {
    initDb, getDogList, saveDog, addDogComment
}