const mongoose = require('mongoose');

const UseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        minlength:4,
        maxlength: 16
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emoji: {
        type: String,
        required: true
    }
}
,
{
    timestamps: true
});

module.exports = mongoose.model('User', UseSchema);
