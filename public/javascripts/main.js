function bindClose(link) {
	// TODO: Close filter bar functionality
}

function bindOpen(link) {
	var filterLink = document.getElementById(link + '-filter');

	debugger;
	filterLink.onclick = function (evt) {
		evt.preventDefault();

		var filter = document.getElementById('sub-filter-' + link);
		filter.style.display = "inline";

		bindClose(link);
	}
}

window.onload = function(){
	bindOpen('location');
	bindOpen('job');
}