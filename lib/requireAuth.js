module.exports = (req, res, next) => {


	if(!req.session.logged) {
		req.session.message = "Please log in or sign up first!"
		res.redirect('/')
	}
	else {
		next()
	}
}