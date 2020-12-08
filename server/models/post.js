var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String },
    imageUrl: { type: String },
    content: { type: String }
});

module.exports = mongoose.model("Post", postSchema); 