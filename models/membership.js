const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Member'
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Group'
	},
	admin: {
		type: Boolean,
		default: false
	},
	dateOfMembership: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Membership', membershipSchema)