const express = require('express');
const router  = express.Router();
const Member  = require('../models/member');
const Event  = require('../models/event');
const bcrypt  = require('bcryptjs');

router.post('/', async (req, res, next) => {
	console.log(req.body);
	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip

	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	try {
		const newMember = await Member.create(req.body)
		console.log(newMember, 'newMember');

		req.session.userId = newMember._id;
      	req.session.firstName = newMember.firstName;
      	req.session.message = `Thanks for joining us, ${newMember.firstName}!`
      	req.session.logged = true;

      	console.log(req.session);
      	res.redirect('/')
	} catch(err){
	  next(err);
	}

	// console.log(req.body);
})

router.post('/login', async (req, res, next) => {
	
	try {
		
		const foundMember = await Member.findOne({email: req.body.email});
		console.log(foundMember,'foundMember');

		if (foundMember) {
			if (bcrypt.compareSync(req.body.password, foundMember.password)) {
				req.session.userId = foundMember._id;
		      	req.session.firstName = foundMember.firstName;
		      	req.session.message = `Welcome back, ${foundMember.firstName}!`;
		      	req.session.logged = true;

		      	res.redirect('/');

			} else {
				req.session.message = 'Username or Password is incorrect'

      			res.redirect('/')
			}
		} else {
			req.session.message = 'Username or Password is incorrect'

      		res.redirect('/')
		}

	} catch(err){
	  next(err);
	}
})

router.get('/logout', async (req, res, next) => {

	try {
		await req.session.destroy()

		res.redirect('/')
	} catch(err){
	  next(err);
	}

})


router.get('/new', (req, res, next) => {
	res.render('members/new.ejs')
})


module.exports = router;