const express 			= require('express');
const bodyParser 		= require('body-parser');
const methodOverride	= require('method-override');
const session      		= require('express-session');
const app         		= express();
const PORT 				= 3000;

require('./db/db');

const membersController = require('./controllers/membersController')

app.use(session({
  secret: 'THIS IS A RANDOM SECRET STRING',
  resave: false,
  saveUninitialized: false 
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use('/members', membersController)

app.get('/', (req, res, next) => {

	res.render('index.ejs', {
      		session: req.session
      	})
})

app.listen(PORT, () => {
  console.log('listening..... on port ' + PORT);
});