var whitelist = ["www.google.com", "www.google.de"];
function inWhitelist() {
	return (whitelist.indexOf(location.hostname) !== -1);
}

// Initialize with the current blocker state
var active = true;
function setActive(val) {
	active = val;
}
chrome.extension.sendRequest({type: "getActive"}, function(response) {
	setActive(response);
});

// Listen for blocker state changes
chrome.extension.onRequest.addListener(function(data, sender) {
	setActive(data.active);
});

// Insert a new script element into the DOM to get into the scope of the page
var script = document.createElement("script");
script.src = chrome.extension.getURL("nopop-inline.js");
document.body.appendChild(script);

// Listen for popup events
document.addEventListener("popupreceived", function(e) {
	// Block the popup
	if (active && !inWhitelist()) {
		// Send a message to background.html
		chrome.extension.sendRequest({type: "popupBlocked"});
		// Block the popup
		e.preventDefault();
	}
}, false);