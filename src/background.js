"use strict";

/*
 * Event listeners
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.type === "popupBlocked") {
		Nop.showPopupNotification();
	} else if (request.type === "getActive") {
		// Send a response to nopopup-isolated.js with the current state
		sendResponse(Nop.active);
	}
});

/*
 * Helper classes
 */
var jn = {
	_notifications: [],
	_expiredNotifications: [],
	_hold: false
};

// Don't hide any notifications
jn.hold = function() {
	jn._hold = true;
}

// Resume hiding notifications after they timed out
jn.resume = function() {
	jn._hold = false;
	setTimeout(function() {
		if (jn._hold === false) {
			jn.hideAll(jn._expiredNotifications);
		}
	}, 400);
}

jn.hideAll = function(notifications) {
	// by default, hide only the visisble notifications
	if (typeof notifications === "undefined") {
		notifications = jn._notifications;
	}
	
	// Hide the notifications
	notifications.forEach(function(notification) {
		notification.hide();
	});
	
	// Clear the array
	notifications.length = 0;
}

jn.add = function(n, duration) {
	// Add the notification to our internal array
	var index = jn._notifications.push(n) - 1;
	
	n.notification.addEventListener("close", function() {
		// Remove it from the notifications array
		jn._notifications[index] = undefined;
	});
	
	// Optional: Hide the notification if a duration is specified
	if (typeof duration !== "undefined") {
		setTimeout(function() {
			if (jn._hold) {
				jn._expiredNotifications.push(n);
			} else {
				n.hide();
			}
		}, duration * 1000);
	}
}

/**
 * Notification
 * 
 * @param title
 *            (can be empty)
 * @param body
 *            Notification text
 * @param duration
 *            (optional) Time in seconds until the notification is automatically hidden
 */
function Notification(title, body, duration) {
	var _ = this;

	// Create a notification
	_.notification = webkitNotifications.createNotification("images/icon48.png", title, body);
	_.notification.show();

	// hide() method
	_.hide = function() {
		_.notification.cancel();
	}
	
	_.addEventListener = function() {
		_.notification.addEventListener.apply(_, arguments);
	}

	jn.add(_, duration);
}

/**
 * HtmlNotification
 * 
 * @param url
 *            HTML file
 * @param duration
 *            (optional) Time in seconds until the notification is automatically hidden
 */
function HtmlNotification(url, duration) {
	var _ = this;

	// Create a notification
	_.notification = webkitNotifications.createHTMLNotification(url);
	_.notification.show();

	// hide() method
	_.hide = function() {
		_.notification.cancel();
	}

	jn.add(_, duration);
}

/**
 * Base namespace
 */
var Nop = {
	active: true,
	notifications: jn
};

/**
 * Displays a notification informing the user that a popup has ben blocked.
 */
Nop.showPopupNotification = function() {
	new HtmlNotification("block-notification.html", 2);
}

/**
 * Notifies all content scripts of a state change
 */
Nop._notify = function() {
	chrome.windows.getAll({populate: true}, function(windows) {
		windows.forEach(function(window) {
			window.tabs.forEach(function(tab) {
				chrome.tabs.sendRequest(tab.id, {"active": Nop.active});
			});
		});
	});
}

/**
 * Disables/Enables the popup blocker
 * @param active
 *            New state
 */
Nop.setActive = function(active) {
	if (!active) {
		Nop.notifications.hideAll();
	}
	
	// Update state
	Nop.active = active;
	Nop._notify();
}

/**
 * Disables the popup blocker for the specified amount of time.
 * 
 * @param minutes
 *             Defaults to 5 minutes
 */
Nop.disableTemporarily = function(minutes) {
	if (typeof minutes === "undefined") {
		minutes = 5;
	}
	// Disable the popup blocker
	Nop.setActive(false);
	// Re-enable after the requested amount of minutes
	setTimeout(function() { Nop.setActive(true); }, minutes * 60 * 1000);
}