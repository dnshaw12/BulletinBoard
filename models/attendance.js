const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
	member: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Member'
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Event'
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Attendance', attendanceSchema)