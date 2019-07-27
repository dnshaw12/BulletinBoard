const express = require('express');
const router  = express.Router();
const Member  = require('../models/member');
const Event  = require('../models/event');
const bcrypt  = require('bcryptjs');

router.get('/create', async (req, res, next) => {

	if (req.session.logged) {
		try {

			const currentMember = await Member.findOne({_id: req.session.userId})

			console.log(currentMember);
			
			res.render('events/new.ejs', {
				member: currentMember,
				session: req.session
			})
		} catch(err){
		  next(err);
		}

	} else {
		req.session.message = 'Please log int before creating an event.'
		res.redirect('/')
	}

})

router.post('/', async (req, res, next) => {

	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip
	req.body.requests = []

	console.log(req.body);

	try {
		const memberHost = await Member.findOne({ _id: req.body.host })

		if (memberHost) {
			console.log(memberHost,'memberHost');
			req.body.memberHost = req.body.host
		} // else {} if org

		if (req.body.hasAlcohol === 'on') {
			req.body.hasAlcohol = true
		} else {
			req.body.hasAlcohol = false
		}

		if (req.body.membersOnly === 'on') {
			req.body.membersOnly = true
		} else {
			req.body.membersOnly = false
		}

		console.log(req.body);

		const newEvent = await Event.create(req.body);

		req.session.message = `${req.body.name} has been created!`

		console.log(newEvent);

		res.redirect('/')
		
	} catch(err){
	  next(err);
	}
})





module.exports = router;