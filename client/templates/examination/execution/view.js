(function () {
	'use strict';

	const ACTIVITY_INTERVAL_MINUTES = 1, EVALUATION_INTERVAL_MINUTES = 5;

	function tmpl() {
		return Template.instance();
	}

	function getExecution() {
		return Progressor.executions.findOne();
	}

	function getExercise(_id) {
		return Progressor.exercises.findOne({ _id: _id });
	}

	function getResultByExaminee(user_id, exercise) {
		return Progressor.results.findOne({ user_id: user_id, exercise_id: exercise.exercise_id });
	}

	function getResultsByExaminee(user_id, exercise) {
		const result = getResultByExaminee(user_id, exercise);
		if (result) return result.results;
	}

	function getResultLogs(userId, logTimeoutSeconds, ...logTypes) {
		const logFilter = new Date(new Date().getTime() - logTimeoutSeconds * 1000);
		const results = Progressor.results.find({ exercise_id: { $in: _.pluck(getExecution().exercises, 'exercise_id') }, user_id: userId }).fetch();
		return _.chain(results).pluck('log').flatten().filter(l => _.contains(logTypes, l.type) && logFilter <= l.timestamp).value();
	}

	function getResultLog(userId, logTimeoutSeconds, ...logTypes) {
		return Progressor.getNewestResultLog(getResultLogs(userId, logTimeoutSeconds, ...logTypes), ...logTypes);
	}

	Template.examinationExecutionView.onCreated(function () {
		this.extendDuration = new ReactiveVar(false);
		this.intervalDependency = new Tracker.Dependency();
		this.interval = Meteor.setInterval(() => this.intervalDependency.changed(), 15 * 1000);
	});

	Template.examinationExecutionView.onDestroyed(function () {
		Meteor.clearInterval(this.interval);
	});

	Template.examinationExecutionView.helpers(
		{
			exercises: () => _.map(getExecution().exercises, (e, i) => _.extend({ name: i18n.getName(getExercise(e.exercise_id)), type: getExercise(e.exercise_id).type }, e)),
			nameOfExaminee: user_id => Progressor.getUserName(Meteor.users.findOne({ _id: user_id }), true) || Progressor.getUserEmail(Meteor.users.findOne({ _id: user_id })),
			numberOfResults: (u) => Progressor.results.find({ user_id: u }).fetch().length,
			totalWeight: () => _.reduce(getExecution().exercises, (w, e) => w + e.weight, 0),
			totalExaminees: () => getExecution().examinees.length,
			endTime: (t, d) => new Date(t.getTime() + d * 60 * 1000),
			hasResult: (u, e) => getResultByExaminee(u, e),
			evaluated: (u, e) => e.type === 1 && Progressor.isExerciseEvaluated(e, getResultsByExaminee(u, e)),
			success: (u, e) => Progressor.isExerciseSuccess(e, getResultsByExaminee(u, e)),
			successPercentage: (user_id, exercise) => Progressor.getExerciseSuccessPercentage(exercise, getResultsByExaminee(user_id, exercise)),
			extendDuration: () => tmpl().extendDuration.get(),
			hasActivity(userId) {
				tmpl().intervalDependency.depend();
				return getResultLogs(userId, ACTIVITY_INTERVAL_MINUTES * 60, Progressor.RESULT_LOG_STARTED_TYPE, Progressor.RESULT_LOG_EVALUATED_TYPE, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE).length;
			},
			logEvaluations(userId) {
				tmpl().intervalDependency.depend();
				return getResultLogs(userId, EVALUATION_INTERVAL_MINUTES * 60, Progressor.RESULT_LOG_EVALUATED_TYPE).length;
			},
			logActivity(userId) {
				tmpl().intervalDependency.depend();
				const log = getResultLog(userId, 30, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE);
				return log ? log.intervalSeconds ? log.activities / log.intervalSeconds : log.activities : 0;
			},
			logDifference(userId) {
				tmpl().intervalDependency.depend();
				const log = getResultLog(userId, 30, Progressor.RESULT_LOG_EVALUATED_TYPE, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE);
				return log ? log.intervalSeconds ? log.difference / log.intervalSeconds : log.difference : 0;
			},
			activityIntervalMin: () => ACTIVITY_INTERVAL_MINUTES,
			evaluationsIntervalMin: () => EVALUATION_INTERVAL_MINUTES
		});

	Template.examinationExecutionView.events(
		{
			// 'click *': () => tmpl().extendDuration.set(false),
			'click #input-extend-duration': e => e.stopPropagation(),
			'click #show-extend-duration'(event, template) {
				tmpl().extendDuration.set(true);
				Meteor.setTimeout(() => template.$('#input-extend-duration').focus(), 1);
			},
			'click #extend-duration'(event, template) {
				const extendByMinutes = parseInt(template.$('#input-extend-duration').val());
				tmpl().extendDuration.set(false);
				if (extendByMinutes) {
					const execution = getExecution();
					execution.durationMinutes += extendByMinutes;
					Meteor.call('saveExecution', execution, Progressor.handleError(() => Progressor.showAlert(`Successfully extended examination time by ${extendByMinutes} min`, 'success'), false));
				} else
					Progressor.showAlert(`Examination time not extended`, 'info');
			}
		});

})();
