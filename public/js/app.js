$('.profile-pic').on('click', (e) => {

	const $overlay = $(`<div id="overlay" />`)
	$overlay.css({
		'background-color': 'rgba(13,55,13,0.5)',
		'width': '100vw',
		'height': '100vh',
		'position': 'fixed',
		'z-index': '10',
		'top': '0px',
		'display': 'flex',
		'flex-direction': 'row',
		'justify-content': 'flex-start',
		'align-items': 'center'
	})

	$overlay.on('click',() => {
		$('#overlay').remove()
	})

	$img = $(`<img src="${e.currentTarget.src}"/>`)

	$img.css({
		'opacity': '1',
		'margin': 'auto',
		'top': '4.7em',
		'border': '10px solid rgb(13,55,13)',
		'max-height': '75%',
		'max-width': '75%'

	})

	$('body').keyup(e => {
	    if(e.key === "Escape") {
	        $('#overlay').remove()
	    }
	})

	$overlay.append($img)

	$('body').append($overlay)
})