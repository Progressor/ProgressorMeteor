(function () {
	'use strict';

	_.extend(Progressor, {
		showAlert(message, level = 'warning', duration = 5000, $container = $('#global-alerts')) {
			const $alert = $(`<div class="alert alert-${level} pre-line fade" role="alert"></div>`).text(message).appendTo($container);
			Meteor.setTimeout(() => $alert.addClass('in'), 1);
			Meteor.setTimeout(() => $alert.alert('close'), duration);
		},
		handleError(callback = null, rethrow = true) {
			return function (error, result) {
				if (error) Progressor.showAlert(i18n('layout.unexpectedErrorMessage', String(error)), 'danger', 7500);
				if (callback)
					if (rethrow) callback(error, result);
					else if (!error) callback(result);
			};
		}
	});

})();
