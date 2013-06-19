// Cross-browser, cross-platform support for browser
// windows that auto-resize to match a specified 
// usable interior size. JavaScript code copyright 2006, 
// Boutell.Com, Inc. 
//
// See http://www.boutell.com/newfaq/ for more information.
//
// Permission granted to use, republish, sell and otherwise
// benefit from this code as you see fit, provided you keep 
// this notice intact. You may remove comments below this line.
//
// END OF NOTICE
//
// INSTRUCTIONS: this WON'T WORK unless you do the following in the
// document that includes it.
//
// 1. Specify the right doctype at the top of your page:
//
//    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
//      "http://www.w3.org/TR/html4/strict.dtd">
//
// 2. Set the right event handlers in your body element
//    (you may call other functions too, use semicolons to separate).
//    Pass the interior width and height YOU want to resizingWindowLoaded.
//
//    <body 
//      onLoad="resizingWindowLoaded(500, 500)" 
//      onResize="resizingWindowResized()">
//
// 3. BE SURE to call resizingWindowEndOfBody() before you
// close your <body> element:
//
//      <script>
//        resizingWindowEndOfBody();
//      </script>
//    </body>
//
// And that's all it takes! 
//
// WARNINGS:
//
// 1. In my tests, the very latest version of Opera doesn't allow
//   JavaScript to resize the browser window AT ALL, even if the
//   window resizing option is enabled under 
//   Tools->Advanced->JavaScript Options. There's not much to
//   be done about that. However the code should work correctly if
//   your copy of Opera does allow resizing. Note that there is
//   also a small fudge factor to allow for a vertical scrollbar in
//   Opera, because Opera is the only browser that can't be
//   convinced to report the true interior usable space not wasted
//   by a scrollbar, and we never, ever want to force a 
//   horizontal scrollbar unnecessarily.
//
// 2. Users with JavaScript disabled won't get the resizing behavior.
//   Hey, there's no miracle cure for that! Design your page layout to
//   cope adequately if the browser window is not the expected size.

function resizingWindowIsIE()
{
	if (navigator.appName == 'Microsoft Internet Explorer') {
		return true;
	}
	return false;
}

function resizingWindowIsOpera()
{
        if (navigator.appName == 'Opera') {
                return true;
        }
        return false;
}

// We resize a maximum of three times. This allows
// the code to try to resolve any boundary conditions,
// such as scrollbars appearing or disappearing,
// in the browser's reaction to the first resize - but
// also prevents an infinite loop.

var resizingWindowMaxResizes = 3;
var resizingWindowResizes = 0;

var dwidth;
var dheight;

function resizingWindowLoaded(width, height)
{
	dwidth = width;
	dheight = height;
	resizingWindowResizes = 0;
	resizingWindowGo();
}

function resizingWindowEndOfBody()
{
	document.write("<div " +
		"id='resizingWindowTestSizeDiv' " +
		"style='width: 100%; " +
		"  height: 100%; " +
		"  position: fixed; " +
		"  left: 0; " +
		"  top: 0; " +
		"  visibility: hidden; " +
		"  z-index: -1'></div>\n");
}

function resizingWindowResized()
{
	resizingWindowGo();
}

function resizingWindowGo()
{
	// We're in "standards mode," so we must use
	// document.documentElement, not document.body, in IE.
	var width;
	var height;
	var x, y, w, h;
	if (resizingWindowResizes == resizingWindowMaxResizes) {
		return;
	}
	resizingWindowResizes++;
	// Get browser window inner dimensions
	if (resizingWindowIsIE()) {
		// All modern versions of IE, including 7, give the
		// usable page dimensions here. 
		width = parseInt(document.documentElement.clientWidth); 	
		height = parseInt(document.documentElement.clientHeight); 	
	} else if (resizingWindowIsOpera()) {
		// This is slightly off: the width and height will include
		// scrollbar space we can't really use. Compensate by
		// subtracting 16 pixels of scrollbar space from the width
		// (standard in Opera). Fortunately, in Firefox and Safari,
		// we can use a third method that gives accurate results
		// (see below).
		width = parseInt(window.innerWidth) - 16;
		// If there is a horizontal scrollbar this will be
		// 16 pixels off in Opera. I can live with that.
		// You don't design layouts on purpose with
		// horizontal scrollbars, do you? (Shudder)
		height = parseInt(window.innerHeight);
	} else {
		// Other non-IE browsers give the usable page dimensions here.
		// We grab the info by discovering the visible dimensions 
		// of a hidden 100% x 100% div. Opera doesn't like this
		// method any more than IE does. Fun!
		testsize = document.getElementById('resizingWindowTestSizeDiv');
		width = testsize.scrollWidth;
		height = testsize.scrollHeight;
	}
	// Compute the difference and add or subtract
	// space as required. Notice that we don't have to
	// know the dimensions of the toolbar, status bar, etc.
	// All we have to do is make a relative adjustment.
	if ((dwidth == width) && (dheight == height)) {
		// Don't resize anymore now that it's right!
		// We don't want to interfere with manual resize
		resizingWindowResizes = resizingWindowMaxResizes;
		return;
	}
	var xchange = dwidth - width;
	var ychange = dheight - height;
	window.resizeBy(xchange, ychange);
}


