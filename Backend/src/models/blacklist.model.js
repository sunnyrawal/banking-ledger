const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: [true, "Token must be unique"]
    },
    

},{
    timestamps: true
})

blacklistSchema.index({createdAt : 1},{
    expireAfterSeconds : 60 * 60 * 24 * 3 // 3 days
});

const blacklistModel = mongoose.model('blacklist', blacklistSchema);

module.exports = blacklistModel;