// Users schema:
//     username: String
//     thumbnail: String
//     dogs: [ reference ]

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema ({
    username:  {
        type: String,
        trim: true,
        required: 'Please include your username!' },
    thumbnail: {
        type: String,
        trim: true },
    password: {
        type: String,
        required: 'Please give a password' },
    dogs: [
        { _id: Schema.Types.ObjectId, ref: 'Dogs' }
    ]
}, {
    timestamps: true /* creates corresponding timestamp fields: createdAt, updatedAt */
});

module.exports = mongoose.model('Users', Users);