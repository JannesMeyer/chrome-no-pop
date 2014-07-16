open = function(url, name, features) {
	postMessage({ type: 'NOPOP_OPEN_POPUP', url: url, name: name, features: features }, '*');
	return {};
};