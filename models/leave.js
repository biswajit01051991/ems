var mongoose = require('mongoose');

//Category schema
var LeaveSchema = mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        require:true
    }
});

var Category = module.exports = mongoose.model('leave', LeaveSchema);

