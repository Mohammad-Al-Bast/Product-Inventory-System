import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, require: true, unique: true },
        phone: { type: Number, required: true },
        website: { type: String, require: false },
        address: { type: String, require: true},
        city: { type: String, require: true},
        state: { type: String, require: true},
        zip: { type: Number, required: true },
        country: { type: String, require: true, default: 'Lebanon' },
        notes: { type: String, required: false },
    },
    { timestamps: true },
);

const supplierModel = mongoose.model('Supplier', supplierSchema);

export default supplierModel;