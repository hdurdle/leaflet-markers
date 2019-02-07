const mongoose = require('mongoose');

const MarkersSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    location: String,
    lat: String,
    long: String,
    isVerified: Boolean,
    isAdmin: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Marker', MarkersSchema);
