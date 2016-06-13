(function () {
	'use strict';

	_.extend(Progressor, {

		/**
		 * Shows a unobtrusive message.
		 * @param message {string} message to display
		 * @param level {string} Bootstrap contextual style of the message
		 * @param duration {number} number of milliseconds to display the message
		 * @param $container jQuery element to add the message to
		 */
		showAlert(message, level = 'warning', duration = 5000, $container = $('#global-alerts')) {
			const $alert = $(`<div class="alert alert-${level} pre-line fade" role="alert"></div>`).text(message).appendTo($container);
			Meteor.setTimeout(() => $alert.addClass('in'), 1);
			Meteor.setTimeout(() => $alert.alert('close'), duration);
		},

		/**
		 * Generates a callback to handle asynchronous operation errors.
		 * @param callback {function} callback to call after the asynchronous operation finishes
		 * @param rethrow {boolean} whether to call back when an error occurred
		 * @returns {function} callback to be passed to asynchronous operation
		 */
		handleError(callback = null, rethrow = true) {
			return function (error, result) {
				if (error) Progressor.showAlert(i18n('layout.unexpectedErrorMessage', String(error)), 'danger', 7500);
				if (callback)
					if (rethrow) callback.call(this, error, result);
					else if (!error) callback.call(this, result);
			};
		}
	});

})();
