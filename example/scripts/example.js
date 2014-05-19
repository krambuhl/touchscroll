$(function() {
	var test = $('#test');
	var std = $('#standard');
	var win = $(window);

	window.addEventListener('scroll', onScroll.bind(null, std));
	window.addEventListener('touchscroll', onScroll.bind(null, test));

	function limit(num) {
		return num > 0 ? num : 0;
	}

	function onScroll(el) {
		el.css('top', limit(win.scrollTop()));
	}

	onScroll(std);
	onScroll(test);
});
