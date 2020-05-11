const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    imagePath: { type: String },
    contact: { type: String },
    gst: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Customer', customerSchema);
