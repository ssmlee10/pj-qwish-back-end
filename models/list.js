const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        },
        description: {
            type: String,

        },
    closeDate: {
        type: Date,
    },
}, 
{ timestamps: true });

const List = mongoose.model('List', listSchema);

module.exports = List;