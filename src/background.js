var notifications = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === 'NOPOP_OPEN_POPUP') {
		var opt = {
			type: 'basic',
			title: 'Popup blocked',
			message: request.url,
			contextMessage: 'Click anywhere to close',
			iconUrl: 'images/icon19.png',
			buttons: [
				{ title: 'Open popup' }
			]
		};
		chrome.notifications.create('', opt, function(id) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return;
			}
			notifications[id] = {
				data: request,
				sendResponse: sendResponse
			};
		});
	}
	return true;
});

chrome.notifications.onButtonClicked.addListener(function(id, buttonIndex) {
	if (buttonIndex === 0) {
		notifications[id].sendResponse(true);
	}
	delete notifications[id];
});
chrome.notifications.onClosed.addListener(function(id) {
	delete notifications[id];
});
chrome.notifications.onClicked.addListener(function(id) {
	delete notifications[id];
});