// Overwrite the open function
open = (function(open) {
	// (open is kept as a closure)
	return function(windowUrl, windowName, windowFeatures) {
		// Send an event to nopopup-isolated.js
		var popupEvent = document.createEvent("Event");
		popupEvent.initEvent("popupreceived", false, true); // name, bubbles, cancelable
		// dispatchEvent() returns false if preventDefault() was called on the event
		var active = !document.dispatchEvent(popupEvent);

		// If the popup blocker is deactivated, open the popup
		if (!active) {
			// This is not recursion, it merely calls the original open() function
			return open(windowUrl, windowName, windowFeatures);
			//return open.apply(window, arguments);
		} else {
			var fuckyou = Object.create(window);
			//fuckyou.location = {"href": windowUrl};
			return fuckyou;
		}
	};
})(open);
