const express = require('express');
const router  = express.Router();
const Member  = require('../models/member');
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
	} catch(err){
	  next(err);
	}

	// console.log(req.body);
})




router.get('/new', (req, res, next) => {
	res.render('members/new.ejs')
})


module.exports = router;