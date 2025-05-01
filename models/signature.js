const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: true
    },
    documentHash: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Signature', signatureSchema);
