const express = require('express');
const router  = express.Router();
const Group  = require('../models/group');
const Member  = require('../models/member');
const Event  = require('../models/event');
const Attendance  = require('../models/attendance');
const Membership  = require('../models/membership');
const Request  = require('../models/request');
const bcrypt  = require('bcryptjs');

router.get('/', async (req, res, next) => {
	console.log('group page');
	try {

		const publicGroups = await Group.find({private: false})
		// console.log(await Membership.find({}));
		const memberships = await Membership.find({member: req.session.userId})
			.populate('group')

		const privateMemberships = await memberships.filter( m => m.group.private === true)

		const privateGroups = await privateMemberships.map( m => m.group )

		const groups = publicGroups.concat(privateGroups)


		console.log(privateGroups, '------ private groups');
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

		const newMembership = await Membership.create({member: req.session.userId, group: createdGroup._id, admin: true})

		console.log(createdGroup, 'new group');
		console.log(newMembership, 'newMembership');

		res.redirect('/groups')

	} catch(err){
	  next(err);
	}
})

router.get('/:id', async (req, res, next) => {
	try {
		
		const group = await Group.findById(req.params.id)

		const adminMember = await Membership.findOne({member: req.session.userId, group: req.params.id, admin: true})

		console.log(adminMember, 'adminMember');

		let admin

		if (adminMember === null) {
			amind = false
		} else {
			admin = true
		}

		console.log(admin, 'admin');

		res.render('groups/show.ejs',{
			group: group,
			admin: admin,
			session: req.session
		})

	} catch(err){
	  next(err);
	}
})





module.exports = router;