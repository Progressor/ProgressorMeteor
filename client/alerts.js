(function () {
	'use strict';

	_.extend(Progressor, {
		showAlert(message, level = 'warning', duration = 5000, $container = $('#global-alerts')) {
			const $alert = $(`<div class="alert alert-${level} pre-line fade" role="alert"></div>`).text(message).appendTo($container);
			Meteor.setTimeout(() => $alert.addClass('in'), 1);
			Meteor.setTimeout(() => $alert.alert('close'), duration);
		},
		handleError(cb = null, rethrow = true) {
			return function (err, res) {
				if (err) Progressor.showAlert(i18n('layout.unexpectedError', String(err)), 'danger', 7500);
				if (cb)
					if (rethrow) cb(err, res);
					else if (!err) cb(res);
			};
		}
	});

})();
