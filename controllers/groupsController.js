const express = require('express');
const router  = express.Router();
const Group  = require('../models/group');
const Member  = require('../models/member');
const Event  = require('../models/event');
const Attendance  = require('../models/attendance');
const Request  = require('../models/request');
const bcrypt  = require('bcryptjs');

router.get('/', async (req, res, next) => {

	try {

		const groups = await Group.find({private: false})
		const events = await Event.find({})

		
		res.render('groups/index.ejs',{
			groups: groups,
			events: events,
			session: req.session
		})
	} catch(err){
	  next(err);
	}

})








module.exports = router;