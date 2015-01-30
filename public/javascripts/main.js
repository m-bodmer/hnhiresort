function bindClose($filter, $subfilter) {
	$filter.onclick = function (evt) {
		evt.preventDefault();

		// Remove active class
		this.className = '';

		$subfilter.style.display = "none";

		bindSubfilterMenus();
	}
}

function bindOpen(link) {
	var $filter = document.getElementById(link + '-filter');

	$filter.onclick = function (evt) {
		evt.preventDefault();

		// Add an active class to the filter
		this.className = 'active';

		// Show the relevant sub filter
		var $subfilter = document.getElementById('sub-filter-' + link);
		$subfilter.style.display = "table";

		bindClose($filter, $subfilter);
	}
}

function bindSubfilterMenus() {
	var filters = ['location', 'job', 'type'];

	for (var i = 0, len = filters.length; i < len; i++) {
		bindOpen(filters[i]);
	}
}

window.onload = function(){
	bindSubfilterMenus();
}