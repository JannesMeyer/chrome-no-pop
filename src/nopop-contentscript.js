// Insert nopop-inline.js into the scope of the page
var script = document.createElement('script');
script.src = chrome.extension.getURL('nopop-inline.js');
document.body.appendChild(script);

// From the inline script
addEventListener('message', function(e) {
	if (e.source !== window) {
		return;
	}
	if (e.data === undefined || e.data.type !== 'NOPOP_OPEN_POPUP') {
		return;
	}

	chrome.runtime.sendMessage(e.data, function(response) {
		open(e.data.url, e.data.name, e.data.features);
	});
}, false);