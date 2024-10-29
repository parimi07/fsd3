const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
