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
		// if (req.local.firstName) {
		// 	req.local.firstName = req.session.firstName;
		// } else {
		// 	req.local.firstName = undefined
		// }
		// req.local.logged = req.session.logged;
		// if (req.session.message) {
		// 	req.local.message = req.session.message;
		// } else {
		// 	req.local.message = undefined
		// }

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
		const events = await Event.find({}).populate('groupHost').populate('memberHost')

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