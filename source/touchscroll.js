require('./polyfill/raf.js');

var touchscroll = new CustomEvent('touchscroll', { });

var startScrollPos = -1,
	currentScrollPos,
	isStarted = false,
	backupTimer,
	animFrame;


function updateScroll() {
	currentScrollPos = window.pageYOffset;
}

function trigger() {
	window.dispatchEvent(touchscroll);
}


function onTouchStart() {
	clearTimeout(backupTimer);

	updateScroll();
	onScrollFinish();

	startScrollPos = currentScrollPos;
}

function onTouchMove() {
	updateScroll();
	trigger();

	if (isStarted === false && currentScrollPos !== startScrollPos) {
		startScroll();
	}
}

function startScroll() {
	isStarted = true;
	animFrame = window.requestAnimationFrame(tickScroll, 60);
	trigger();
}

function tickScroll() {
	trigger();
}

function onTouchEnd() {
	backupTimer = setTimeout(function () {
		onScrollFinish();
	}, 1000);
}

function onScrollFinish() {
	isStarted = false;
	window.cancelAnimationFrame(animFrame);

	trigger();
}




window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchmove', onTouchMove);
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('scroll', onScrollFinish);

// on touchstart:
// - save el.scrolltop

// on touchmove:
// - if el.scrolltop is different
//   + fire touchscroll events

// on touchend:
// - start autoupdater every frame until scroll event fires

// on scroll
// - stop autoupdater
//   + fire touchscroll event

// module.exports = TouchScroll;
