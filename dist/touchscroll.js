(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (!window.requestAnimationFrame) {
  var lastTime = 0,
    vendors = ['ms', 'moz', 'webkit', 'o'],
    x,
    length,
    currTime,
    timeToCall;

  for (x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      lastTime = currTime + timeToCall;
      return window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}

},{}],2:[function(require,module,exports){
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

},{"./polyfill/raf.js":1}]},{},[2])