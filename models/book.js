const { Schema, model } = require("mongoose");

const Book = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

module.exports = new model("books", Book);
