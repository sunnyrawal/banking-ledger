const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[ true , 'User reference is required'],
        index : true
    },
    status:{
        type : String,
        enum :{ 
            values : ['ACTIVE', 'FROZEN', 'CLOSED'],
            message : 'Status must be either ACTIVE, FROZEN, or CLOSED',
        },
        default : 'ACTIVE',
    },
    currency:{
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR',
    }
},{
    timestamps: true
})

accountSchema.index({ user: 1 , status: 1}); // Compound index on user and status for efficient queries

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;