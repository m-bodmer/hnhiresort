function bindClose($filter, $subfilter) {
	$filter.onclick = function (evt) {
		evt.preventDefault();

		$subfilter.style.display = "none";

		bindSubfilterMenus();
	}
}

function bindOpen(link) {
	var $filter = document.getElementById(link + '-filter');

	$filter.onclick = function (evt) {
		evt.preventDefault();

		var $subfilter = document.getElementById('sub-filter-' + link);
		$subfilter.style.display = "inline";

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