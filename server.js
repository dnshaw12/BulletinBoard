const express 			= require('express');
const bodyParser 		= require('body-parser');
const methodOverride	= require('method-override');
const session      		= require('express-session');
const app         		= express();
const PORT 				= 3000;

require('./db/db');

app.get('/', (req, res, next) => {
	res.send('working')
})

app.listen(PORT, () => {
  console.log('listening..... on port '+PORT);
});