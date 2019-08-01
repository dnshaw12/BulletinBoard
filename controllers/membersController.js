const express = require('express');
const router  = express.Router();
const multer = require('multer')
const Member  = require('../models/member');
const Event  = require('../models/event');
const Membership  = require('../models/membership');
const Attendance  = require('../models/attendance');
const checkAuth = require('../lib/requireAuth')
const bcrypt  = require('bcryptjs');
const fs = require('fs')
const upload = multer({dest: 'uploads/'})

router.post('/', upload.single('profilePic'), async (req, res, next) => {
	// console.log(req.body);
	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip

	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	try {

		console.log(req.file, "BODY PROFILE PIC");



		// console.log(req.body,"look for profile pic");
		// console.log(req.file.filename, "FILE NAME");

		const newMember = await Member.create(req.body)
		// console.log(newMember, 'newMember');

		if (req.file) {	
			req.session.hasPic = true
			const filePath = './uploads/' + req.file.filename
			newMember.profilePic.data = fs.readFileSync(filePath)
			newMember.profilePic.contentType = req.file.mimetype

			fs.unlinkSync(filePath)
		}


		// console.log(newMember, 'NEWMEMBER');

		await newMember.save()

		req.session.userId = newMember._id;
      	req.session.firstName = newMember.firstName;
      	req.session.message = `Thanks for joining us, ${newMember.firstName}!`
      	req.session.logged = true;

      	// console.log(req.session);
      	res.redirect('/')
	} catch(err){
	  next(err);
	}

	// console.log(req.body);
})

router.post('/login', async (req, res, next) => {
	
	try {
		
		const foundMember = await Member.findOne({email: req.body.email});
		// console.log(foundMember,'foundMember');

		if (foundMember) {
			if (bcrypt.compareSync(req.body.password, foundMember.password)) {
				req.session.userId = foundMember._id;
		      	req.session.firstName = foundMember.firstName;
		      	req.session.message = `Welcome back, ${foundMember.firstName}!`;
		      	req.session.logged = true;

		      	// console.log(foundMember.profilePic.data, "PROFILE PIC CHECK");

		      	if (foundMember.profilePic.data) {
		      		req.session.hasPic = true
			  	} else {
			  		req.session.hasPic = false
			  	}

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

router.get('/:id/edit', checkAuth, async (req, res, next) => {
	try {
		const member = await Member.findById(req.params.id)

		let birthday;

		if (member.birthday) {
			birthday = member.birthday.toISOString().substr(0,10)
		} else {
			birthday = null
		}

		res.render('members/edit.ejs',{
			birthday:birthday,
			member: member,
			session: req.session
		})

	} catch(err){
	  next(err);
	}
})

router.get('/new', (req, res, next) => {
	res.render('members/new.ejs',{
		session: req.session
		})
})

router.put('/:id', async (req, res, next) => {
	// console.log(req.body);
	req.body.location = {}

	req.body.location.addr1 = req.body.addr1
	req.body.location.addr2 = req.body.addr2
	req.body.location.city = req.body.city
	req.body.location.state = req.body.state
	req.body.location.zip = req.body.zip


	try {
		const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, {new: true})


      	req.session.firstName = updatedMember.firstName;
      	req.session.message = `Your information has been updated, ${updatedMember.firstName}!`;

      	// console.log(updatedMember,'updatedMember!!!!');

      	res.redirect('/members/'+req.params.id)
	} catch(err){
	  next(err);
	}

})

router.get('/:id/groups', checkAuth, async (req, res, next) => {
	// console.log('my group page');
	try {

		const memberships = await Membership.find({member: req.session.userId})
			.populate('group')

		const groups = await memberships.map( m => m.group )

		const events = await Event.find({})

		
		res.render('members/mygroups.ejs',{
			groups: groups,
			events: events,
			session: req.session
		})
	} catch(err){
	  next(err);
	}

})

router.get('/:id/events', checkAuth, async (req, res, next) => {

	try {
		const attendance = await Attendance.find({member: req.session.userId})
			.populate({
			    path: 'event',
			    populate: [{ path: 'memberHost' },{ path: 'groupHost' }]
			});

			// console.log(attendance,'attendance');

		const events = await attendance.map( a => a.event )


		res.render('members/myevents.ejs', {
			events: events,
	  		session: req.session
	  	})
	} catch(err){
	  next(err);
	}

})

router.get('/:id', async (req, res, next) => {


	try {

		const member = await Member.findById(req.params.id)
		console.log(member, "MEMBERRRR");
		let admin
		
		if (req.params.id === req.session.userId) {
			admin = true
		} else {
			admin = false
		}

		res.render('members/show.ejs', {
			member: member,
			admin: admin,
			session: req.session
		})


	} catch(err){
	  next(err);
	}
})

router.get('/profilePic/:id', async (req, res, next) => {
	try {


		// console.log("profile pic route hit!!!!!!!!!!!!!++++++++========");
		const member = await Member.findById(req.params.id);

		// console.log(member);

		res.set('Content-Type', member.profilePic.contentType)

		res.send(member.profilePic.data)



	} catch(err){
	  next(err);
	}
})

router.get('/:id/updatepic', async (req, res, next) => {

	try {

		const member = await Member.findById(req.params.id)

		res.render('members/updatePic.ejs',{
			member: member
		})
		
	} catch(err){
	  next(err);
	}
})

router.put('/:id/updatepic', upload.single('profilePic'), async (req, res, next) => {

	console.log("update pic req.file", req.file);

	try {

		const member = await Member.findById(req.params.id)

		if (req.file) {	
			req.session.hasPic = true
			const filePath = './uploads/' + req.file.filename
			member.profilePic.data = fs.readFileSync(filePath)
			member.profilePic.contentType = req.file.mimetype

			fs.unlinkSync(filePath)

			await member.save()

			res.redirect('/members/'+req.params.id)

		} else {
			req.session.message = "No file was selected."

			res.redirect('/members/'+req.params.id+'/updatepic')
		}
		
	} catch(err){
	  next(err);
	}
})


module.exports = router;