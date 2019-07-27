const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	memberHost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	organizationHost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Member'
	},
	dateTimeOfEvent: {
		type: Date,
		required: true
	},
	endDateTime: {
		type: Date,
		required: true
	},
	requests: Array,
	description: {
		type: String,
		required: true
	},
	membersOnly: Boolean,
	attendeeMax: Number,
	location: {
		addr1: {
			type: String,
			required: true
		}, 
		addr2: String, 
		city: {
			type: String,
			required: true
		}, 
		state: {
			type: String,
			required: true
		}, 
		zip: {
			type: String,
			required: true
		},
		hasAlcohol: Boolean
	},
})

module.exports = mongoose.model('Event', eventSchema);



