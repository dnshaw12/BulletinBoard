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





module.exports = router;