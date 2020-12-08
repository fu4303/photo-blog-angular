const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
    maxPostId: {type: Number, required: true}
});

module.exports = mongoose.model('Sequence', sequenceSchema);