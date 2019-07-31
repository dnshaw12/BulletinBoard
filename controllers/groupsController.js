const express = require('express');
const router  = express.Router();
const multer = require('multer')
const Group  = require('../models/group');
const Member  = require('../models/member');
const Event  = require('../models/event');
const Attendance  = require('../models/attendance');
const Membership  = require('../models/membership');
const Request  = require('../models/request');
const checkAuth = require('../lib/requireAuth')
const bcrypt  = require('bcryptjs');
const fs = require('fs')
const upload = multer({dest: 'uploads/'})

router.get('/', checkAuth, async (req, res, next) => {
	// console.log('group page');
	try {

		const publicGroups = await Group.find({private: false})
		// console.log(await Membership.find({}));
		const memberships = await Membership.find({member: req.session.userId})
			.populate('group')

			// console.log(memberships,"Membershipsssss");

		const privateMemberships = await memberships.filter( m => m.group.private === true)

		const privateGroups = await privateMemberships.map( m => m.group )

		const groups = publicGroups.concat(privateGroups)



		// console.log(privateGroups, '------ private groups');
		const events = await Event.find({})

		events.forEach(e => console.log(e.groupHost))
		// console.log(groups, "------groups");

		
		res.render('groups/index.ejs',{
			groups: groups,
			events: events,
			session: req.session
		})
	} catch(err){
	  next(err);
	}

})

router.get('/create', checkAuth, (req, res, next) => {
	
	res.render('groups/new.ejs',{
		session: req.session
	})

})

router.post('/', upload.single('profilePic'), async (req, res, next) => {
	// console.log("\n here is req.body");
	// console.log(req.body);
	// console.log("\n here is req.file");
	// console.log(req.file);
	
	try {

		console.log(req.body, "req.boday");
		
		if (req.body.private === 'on') {
			req.body.private = true
		} else {
			req.body.private = false
		}
		console.log("\n, req file");
		console.log(req.file);

		req.body.creator = req.session.userId;

		const createdGroup = await Group.create(req.body);

		if (req.file) {	
			const filePath = './uploads/' + req.file.filename
			createdGroup.profilePic.data = fs.readFileSync(filePath)
			createdGroup.profilePic.contentType = req.file.mimetype

			fs.unlinkSync(filePath)
		}

		const newMembership = await Membership.create({member: req.session.userId, group: createdGroup._id, admin: true})

		// console.log(createdGroup, 'new group');
		// console.log(newMembership, 'newMembership');

		res.redirect('/groups')

	} catch(err){
	  next(err);
	}
	
})

router.get('/:id', async (req, res, next) => {
	try {
		
		const group = await Group.findById(req.params.id).populate('requests.member')

		const adminMember = await Membership.findOne({member: req.session.userId, group: req.params.id, admin: true})

		const membership = await Membership.find({member: req.session.userId, group: req.params.id})

		const members = await Membership.find({group: req.params.id}).populate('member');
		const memberIds = members.map( m => m.member._id)

		const events = await Event.find({groupHost: req.params.id}).populate('groupHost')

		const nonMembers = await Member.find({_id: {
			$nin: memberIds
		}})

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
			members: members,
			events: events,
			session: req.session,
			membership: membership,
			nonMembers: nonMembers
		})

	} catch(err){
	  next(err);
	}
})

router.get('/:id/request', checkAuth, async (req, res, next) => {
	try {
		const group = await Group.findById(req.params.id);

		res.render('groups/request.ejs', {
			group: group,
			session: req.session
		})


	} catch(err){
	  next(err);
	}
})

router.post('/:id/request', async (req, res, next) => {

	req.body.member = req.session.userId
	
	try {
		const group = await Group.findById(req.params.id)
		const newRequest = await Request.create(req.body)

		// console.log(newRequest);

		group.requests.push(newRequest)

		await group.save()

		// console.log(group.requests, 'group requests');

		res.redirect('/groups/' + req.params.id)

	} catch(err){
	  next(err);
	}


})

router.delete('/:id/remove', async (req, res, next) => {
	// console.log(req.body, 'delete reqbody');

	try {
		const removedMembership = await Membership.findOneAndDelete({member: req.body.memberId, group: req.params.id})

		

		res.redirect('/groups/'+req.params.id)


	} catch(err){
	  next(err);
	}

})

router.delete('/:id/reject', async (req, res, next) => {
	// console.log('reject');
	try {
		const group = await Group.findById(req.params.id)


		// console.log(group,"<----group");

		const rIndex = await group.requests.findIndex( r => {
			// console.log(r.member.toString() === req.body.memberId);
			return r.member.toString() === req.body.memberId
		})
		// console.log(rIndex);
		group.requests.splice(rIndex,1)

		group.save()

		res.redirect('/groups/'+req.params.id)


	} catch(err){
	  next(err);
	}

})

router.post('/:id/accept', async (req, res, next) => {
	
	try {

		await Membership.create({
			member: req.body.memberId,
			group: req.params.id,
			admin: false
		})
		

		const group = await Group.findById(req.params.id)


		// console.log(group,"<----group");

		const rIndex = await group.requests.findIndex( r => {
			// console.log(r.member.toString() === req.body.memberId);
			return r.member.toString() === req.body.memberId
		})
		// console.log(rIndex);
		group.requests.splice(rIndex,1)

		group.save()

		res.redirect('/groups/'+req.params.id)

	} catch(err){
	  next(err);
	}


})

router.post('/:id/acceptAdmin', async (req, res, next) => {
	
	try {

		await Membership.create({
			member: req.body.memberId,
			group: req.params.id,
			admin: true
		})
		

		const group = await Group.findById(req.params.id)


		// console.log(group,"<----group");

		const rIndex = await group.requests.findIndex( r => {
			// console.log(r.member.toString() === req.body.memberId);
			return r.member.toString() === req.body.memberId
		})
		// console.log(rIndex);
		group.requests.splice(rIndex,1)

		group.save()

		res.redirect('/groups/'+req.params.id)

	} catch(err){
	  next(err);
	}


})

router.get('/:id/edit', checkAuth, async (req, res, next) => {
	try {
		const group = await Group.findById(req.params.id)

		res.render('groups/edit.ejs',{
			group: group,
			session: req.session
		})

	} catch(err){
	  next(err);
	}
})

router.put('/:id', async (req, res, next) => {
	try {
		
		if (req.body.private === 'on') {
			req.body.private = true
		} else {
			req.body. private = false
		}

		const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body,{new: true})

		res.redirect('/groups/'+req.params.id)

	} catch(err){
	  next(err);
	}
})

router.delete('/:id', async (req, res, next) => {

	try {

		const deletedGroup = await Group.deleteOne({_id: req.params.id})
		const deletedMembership = await Membership.deleteMany({group: req.params.id})
		const eventsToDelete = await Event.find({groupHost: req.params.id})

		eventsToDelete.forEach( async e => {
			await Attendance.deleteMany({event: e._id})
		})

		const deletedEvents = await Event.deleteMany({groupHost: req.params.id})

		res.redirect('/members/'+req.session.userId+'/groups')
		
	} catch(err){
	  next(err);
	}
})

router.post('/:id/addMember', async (req, res, next) => {
	try {

		
		const newMembership = await Membership.create({member: req.body.member, group: req.params.id, admin: false})

		res.redirect('/groups/'+req.params.id)


	} catch(err){
	  next(err);
	}
})

router.post('/:id/addAdmin', async (req, res, next) => {
	try {

		
		const newMembership = await Membership.create({member: req.body.member, group: req.params.id, admin: true})

		res.redirect('/groups/'+req.params.id)


	} catch(err){
	  next(err);
	}
})

router.get('/profilePic/:id', async (req, res, next) => {
	try {

		const group = await Group.findById(req.params.id);


		res.set('Content-Type', group.profilePic.contentType)

		res.send(group.profilePic.data)

	} catch(err){
	  next(err);
	}
})



module.exports = router;