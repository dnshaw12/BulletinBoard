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

router.get('/create', (req, res, next) => {
	
	res.render('groups/new.ejs',{
		session: req.session
	})

})

router.post('/', async (req, res, next) => {
	try {
		
		if (req.body.private === 'on') {
			req.body.private = true
		} else {
			req.body. private = false
		}

		req.body.creator = req.session.userId;

		const createdGroup = await Group.create(req.body);

		console.log(createdGroup);

		res.redirect('/groups')

	} catch(err){
	  next(err);
	}
})






module.exports = router;