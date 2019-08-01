require('dotenv').config()
const express 			= require('express');
const bodyParser 		= require('body-parser');
const methodOverride	= require('method-override');
const session      		= require('express-session');
const app         		= express();
const PORT 				= 3000;
const Event  = require('./models/event');

require('./db/db');

const membersController = require('./controllers/membersController')
const eventsController = require('./controllers/eventsController')
const groupsController = require('./controllers/groupsController')

app.use(express.static('public'))

app.use(session({
  secret: process.env.SECRET_STRING,
  resave: false,
  saveUninitialized: false 
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
	try {
		if (req.session.firstName) {
			res.locals.firstName = req.session.firstName;
		} else {
			res.locals.firstName = undefined
		}
		res.locals.logged = req.session.logged;

		if (req.session.message) {
			res.locals.message = req.session.message;
		} else {
			res.locals.message = undefined
		}

		if (req.session.userId) {
			res.locals.userId = req.session.userId;
		} else {
			res.locals.userId = undefined
		}
		// console.log(req.session.userId,res.locals.userId, "LOCALS ID!!!!!!!");
		res.locals.hasPic = req.session.hasPic ? true : false


		// console.log(res.locals, 'LOCALSSSSSSSSS');


		next()
	} catch(err){
	  next(err);
	}
})

app.use('/members', membersController)
app.use('/events', eventsController)
app.use('/groups', groupsController)

app.get('/', async (req, res, next) => {

	try {
		const events = await Event.find({membersOnly: false}).populate('groupHost').populate('memberHost')

		console.log(events);

		if (req.session.logged) {
			session.message = "Hi, "+req.session.firstName+"!"
		}

		res.render('index.ejs', {
			events: events,
	  		session: req.session
	  	})
	} catch(err){
	  next(err);
	}

})

app.listen(PORT, () => {
  console.log('listening..... on port ' + PORT);
});