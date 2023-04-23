const mongoose = require('mongoose');

const wmSchema = new mongoose.Schema({
    date: Date,
    note: String,
});
module.exports = mongoose.model('wmSchema',wmSchema);
