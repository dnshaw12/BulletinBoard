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

router.get('/create', checkAuth, async (req, res, next) => {

	if (req.session.logged) {
		try {

			const now = new Date().toISOString().substr(0,19)
			const currentMember = await Member.findOne({_id: req.session.userId})
			const memberships = await Membership.find({member: req.session.userId, admin: true}).populate('group')
			const groups = memberships.map( m => m.group )


			// console.log(now, "NOW");



			// console.log(currentMember);
			
			res.render('events/new.ejs', {
				member: currentMember,
				groups: groups,
				now: now,
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

router.post('/', upload.single('profilePic'), async (req, res, next) => {
	// console.log("\n here is req.body");
	// console.log(req.body);
	// console.log("\n here is req.file");
	// console.log(req.file);

	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip
	req.body.requests = []

	console.log("\n here is req.body");
	console.log(req.body);

	try {
		const memberHost = await Member.findOne({ _id: req.body.host })

		console.log(req.file, "event req file 2");

		if (memberHost) {
			// console.log(memberHost,'memberHost');
			req.body.memberHost = req.body.host
			req.body.groupHost = null
		} else {
			req.body.memberHost = null
			req.body.groupHost = req.body.host
		}

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

		if (req.body.attendeeMax) {
			req.body.attendeeMax = parseInt(req.body.attendeeMax)
		}

		// console.log(req.body);

		const newEvent = await Event.create(req.body);

		if (req.file) {	
			const filePath = './uploads/' + req.file.filename
			newEvent.profilePic.data = fs.readFileSync(filePath)
			newEvent.profilePic.contentType = req.file.mimetype

			fs.unlinkSync(filePath)
		}

		await newEvent.save()

		const attendance = await Attendance.create({
		 	member: req.session.userId,
		 	event: newEvent._id
		})

		// console.log(attendance);

		req.session.message = `${req.body.name} has been created!`


		// console.log("\nwe created  this")
		// console.log(newEvent);

		res.redirect('/')
		
	} catch(err){
	  next(err);
	}
})

router.get('/:id', async (req, res, next) => {
	
	try {
		const event = await Event.findById(req.params.id).populate('memberHost').populate('groupHost').populate('requests.member')

		console.log(event, '========EVENT');

		let host

		if (event.groupHost !== null) {
			// console.log('group');
			host = await Membership.find({member: req.session.userId, group: event.groupHost._id, admin: true})

			if (host.length === 0) {
				host = false
			}
		} else if (event.memberHost._id.toString() === req.session.userId) {
			host = true
		} else {
			host = false
		}

		// console.log(DateFormat.format.date(event.beginDateTime));

		const attendance = await Attendance.find({member: req.session.userId, event: req.params.id})

		const attendees = await Attendance.find({event: req.params.id}).populate('member');

		// console.log(event.requests, req.session.userId);

		// console.log(event.requests.findIndex( r => r.member.toString() === req.session.userId), 'event reqs');
		// console.log(req.session.userId);

		// console.log(attendees);

		// console.log(attendance,'attendance');

		res.render('events/show.ejs', {
			event: event,
			host: host,
			session: req.session,
			attendance: attendance,
			attendees: attendees
		})
		
	} catch(err){
	  next(err);
	}
})

router.post('/:id/attend', async (req, res, next) => {
	
	try {
		const attendance = await Attendance.create({
		 	member: req.session.userId,
		 	event: req.params.id
		})

		// console.log(attendance);

		res.redirect('/events/' + req.params.id)

	} catch(err){
	  next(err);
	}


})

router.get('/:id/request', checkAuth, async (req, res, next) => {
	try {
		const event = await Event.findById(req.params.id);

		res.render('events/request.ejs', {
			event: event,
			session: req.session
		})


	} catch(err){
	  next(err);
	}
})

router.post('/:id/request', async (req, res, next) => {

	req.body.member = req.session.userId
	
	try {
		const event = await Event.findById(req.params.id)
		const newRequest = await Request.create(req.body)

		// console.log(newRequest);

		event.requests.push(newRequest)

		await event.save()

		// console.log(event.requests, 'event requests');

		res.redirect('/events/' + req.params.id)

	} catch(err){
	  next(err);
	}


})

router.delete('/:id/remove', async (req, res, next) => {
	// console.log(req.body, 'delete reqbody');

	try {
		const removedAttendance = await Attendance.findOneAndDelete({member: req.body.memberId, event: req.params.id})

		// console.log(removedAttendance);

		res.redirect('/events/'+req.params.id)


	} catch(err){
	  next(err);
	}

})

router.delete('/:id/reject', async (req, res, next) => {
	// console.log('reject');
	try {
		const event = await Event.findById(req.params.id)


		// console.log(event,"<----event");

		const rIndex = await event.requests.findIndex( r => {
			// console.log(r.member.toString() === req.body.memberId);
			return r.member.toString() === req.body.memberId
		})
		// console.log(rIndex);
		event.requests.splice(rIndex,1)

		event.save()

		res.redirect('/events/'+req.params.id)


	} catch(err){
	  next(err);
	}

})

router.post('/:id/accept', async (req, res, next) => {
	
	try {

		await Attendance.create({
			member: req.body.memberId,
			event: req.params.id
		})
		

		const event = await Event.findById(req.params.id)


		// console.log(event,"<----event");

		const rIndex = await event.requests.findIndex( r => {
			// console.log(r.member.toString() === req.body.memberId);
			return r.member.toString() === req.body.memberId
		})
		// console.log(rIndex);
		event.requests.splice(rIndex,1)

		event.save()

		res.redirect('/events/'+req.params.id)

	} catch(err){
	  next(err);
	}


})

router.get('/:id/edit', checkAuth, async (req, res, next) => {
	try {
		const event = await Event.findById(req.params.id).populate('memberHost').populate('groupHost')

		const beginDateTime = event.beginDateTime.toISOString().substr(0,19)
		let endDateTime

		if (event.endDateTime) {
			endDateTime = event.endDateTime.toISOString().substr(0,19)
		} else {
			endDateTime = null
		}

		// console.log(beginDateTime, 'beginDateTime',event.beginDateTime);

		res.render('events/edit.ejs', {
			event: event,
			beginDateTime: beginDateTime,
			endDateTime: endDateTime,
			session: req.session
		})

	} catch(err){
	  next(err);
	}
})

router.put('/:id', async (req, res, next) => {

	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip

	try {

		// console.log(req.body.host, 'HOST');

		// const memberHost = await Member.findOne({ _id: req.body.host })

		// if (memberHost) {
			// console.log(memberHost,'memberHost');
		// 	req.body.memberHost = req.body.host
		// 	req.body.groupHost = null
		// } else {
		// 	req.body.memberHost = null
		// 	req.body.groupHost = req.body.host
		// }

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

		if (req.body.attendeeMax) {
			req.body.attendeeMax = parseInt(req.body.attendeeMax)
		}


		const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true})



		req.session.message = `${req.body.name} has been updated!`


		// console.log("\nwe created  this")
		// console.log(updatedEvent);

		res.redirect('/events/'+req.params.id)
		
	} catch(err){
	  next(err);
	}
})

router.delete('/:id', async (req, res, next) => {

	try {

		const deletedEvent = await Event.deleteOne({_id: req.params.id})
		const deletedAttendance = await Attendance.deleteMany({event: req.params.id})

		// console.log(deletedEvent, 'deletedEvent');
		// console.log(deletedAttendance, 'deletedAttendance');

		res.redirect('/members/'+req.session.userId+'/events')
		
	} catch(err){
	  next(err);
	}
})

router.get('/profilePic/:id', async (req, res, next) => {
	try {


		// console.log("profile pic route hit!!!!!!!!!!!!!++++++++========");
		const event = await Event.findById(req.params.id);

		// console.log(group);

		res.set('Content-Type', event.profilePic.contentType)

		res.send(event.profilePic.data)



	} catch(err){
	  next(err);
	}
})

router.get('/:id/updatepic', async (req, res, next) => {

	try {

		const event = await Event.findById(req.params.id)

		res.render('events/updatePic.ejs',{
			event: event
		})
		
	} catch(err){
	  next(err);
	}
})

router.put('/:id/updatepic', upload.single('profilePic'), async (req, res, next) => {


	try {

		const event = await Event.findById(req.params.id)

		if (req.file) {	
			req.session.hasPic = true
			const filePath = './uploads/' + req.file.filename
			event.profilePic.data = fs.readFileSync(filePath)
			event.profilePic.contentType = req.file.mimetype

			fs.unlinkSync(filePath)

			await event.save()

			res.redirect('/events/'+req.params.id)

		} else {
			req.session.message = "No file was selected."

			res.redirect('/events/'+req.params.id+'/updatepic')
		}
		
	} catch(err){
	  next(err);
	}
})



module.exports = router;