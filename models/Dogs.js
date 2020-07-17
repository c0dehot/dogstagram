// Dogs schema
//     title: String
//     image: String
//     keywords: [ ]
//     comments: [ ]

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DogSchema = new Schema ({
    owner: { type: Schema.Types.ObjectId, ref: 'Users' },
    title:  {
        type: String,
        trim: true,
        required: 'Please give a title to your pic!' },
    image: {
        type: String,
        trim: true },
    keywords: [ { type: String, } ],
    comments: [ { comment: String, name: String } ]
}, {
    timestamps: true /* creates corresponding timestamp fields: createdAt, updatedAt */
});

module.exports = mongoose.model('Dogs', DogSchema);