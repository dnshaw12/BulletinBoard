module.exports = (date) => {

	const options = { 
		weekday: 'short', 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric', 
		timeZone: 'America/Chicago', 
		hour: 'numeric',
		hour12: true, 
		minutes: 'numeric' };

	return date.toLocaleDateString('en-US',options)

}