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

app.use(session({
  secret: 'THIS IS A RANDOM SECRET STRING',
  resave: false,
  saveUninitialized: false 
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use('/members', membersController)
app.use('/events', eventsController)

app.get('/', async (req, res, next) => {

	try {
		const events = await Event.find({}).populate('memberHost')
		
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