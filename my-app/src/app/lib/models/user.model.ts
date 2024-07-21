// backend/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: String, required: true},
    username: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    account_type: { type: String, enum: ['landlord', 'tenant'], required: true },
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        } 
    ]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;