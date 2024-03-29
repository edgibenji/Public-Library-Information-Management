const mongoose = require('mongoose')

const copySchema = new mongoose.Schema({
    copyID: {
        type: String,
        require: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    }
})

module.exports = mongoose.model('Copy', copySchema)