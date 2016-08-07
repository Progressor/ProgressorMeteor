const ACTIVITY_INTERVAL_MINUTES = 1, EVALUATION_INTERVAL_MINUTES = 5;

function tmpl() {
  return Template.instance();
}

// REACTIVE HELPERS //

function getExecution() {
  return Progressor.executions.findOne();
}

function getResultLogs(user, logTimeoutSeconds, ...logTypes) {
  const logFilter = new Date(new Date().getTime() - logTimeoutSeconds * 1000);
  const results = user ? Progressor.results.find({ exercise_id: { $in: _.pluck(getExecution().exercises, 'exercise_id') }, user_id: user._id }).fetch() : [];
  return _.chain(results).pluck('log').flatten().filter(l => _.contains(logTypes, l.type) && logFilter <= l.timestamp).value();
}

function getResultLog(user, logTimeoutSeconds, ...logTypes) {
  return Progressor.getNewestResultLog(getResultLogs(user, logTimeoutSeconds, ...logTypes), ...logTypes);
}

Template.examinationExecutionView.onCreated(function () {
  // TEMPLATE VARIABLES //

  this.extendDuration = new ReactiveVar(false);
  this.intervalDependency = new Tracker.Dependency();

  // FALLBACK INTERVAL //

  // this interval is needed if there are no more updates to the results
  this.interval = Meteor.setInterval(() => this.intervalDependency.changed(), 15 * 1000);
});

Template.examinationExecutionView.onDestroyed(function () {
  Meteor.clearInterval(this.interval);
});

Template.examinationExecutionView.helpers({
  // GENERIC HELPERS //

  examinationTemplateEditData: () => ({ _id: getExecution().examination_id }),

  // RESULT HELPERS //

  extendDuration: () => tmpl().extendDuration.get(),
  endTime: (t, d) => t ? new Date(t.getTime() + d * 60 * 1000) : t,
  totalWeight: () => _.reduce(getExecution().exercises, (w, e) => w + (e.weight || 0), 0),
  examinees() {
    const execution = getExecution();
    if (execution) {
      if (execution.examinees && execution.examinees.length) {
        return _.map(execution.examinees, e => Meteor.users.findOne({ _id: e }));
      }
      return _.chain(Progressor.results.find({ 'exercise.execution_id': execution._id }).fetch()).groupBy('user_id').map((g, u) => Meteor.users.findOne({ _id: u })).sortBy(u => Progressor.getUserName(u).toLowerCase()).value();
    }
  },
  nofResults: u => u ? Progressor.results.find({ user_id: u._id, solved: { $exists: true } }).count() : 0,
  exercises: user => _.map(getExecution().exercises, exercise => _.extend({
    weight: exercise.weight,
    result: user ? Progressor.results.findOne({ user_id: user._id, exercise_id: exercise.exercise_id }) : null,
  }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: exercise.exercise_id })))),
  exerciseStatus: e => !e.result ? 'not-solved' : !Progressor.isExerciseEvaluated(e, e.result.results) ? 'not-evaluated' : Progressor.isExerciseSuccess(e, e.result.results) ? 'success' : 'partial',
  successPercentage: e => Progressor.getExerciseSuccessPercentage(e, e.result ? e.result.results : null),
  totalSuccessPercentage(user) {
    const execution = getExecution();
    return _.chain(execution.exercises)
             .map(e => _.extend({ exercise: Progressor.exercises.findOne({ _id: e.exercise_id }), result: user ? Progressor.results.findOne({ user_id: user._id, exercise_id: e.exercise_id }) : null }))
             .reduce((p, j) => p + Progressor.getExerciseSuccessPercentage(j.exercise, j.result ? j.result.results : null), 0).value() / execution.exercises.length;
  },

  // LOG HELPERS //

  hasActivity(user) {
    tmpl().intervalDependency.depend();
    return getResultLogs(user, ACTIVITY_INTERVAL_MINUTES * 60, Progressor.RESULT_LOG_STARTED_TYPE, Progressor.RESULT_LOG_EVALUATED_TYPE, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE).length;
  },
  logEvaluations(user) {
    tmpl().intervalDependency.depend();
    return getResultLogs(user, EVALUATION_INTERVAL_MINUTES * 60, Progressor.RESULT_LOG_EVALUATED_TYPE).length;
  },
  logActivity(user) {
    tmpl().intervalDependency.depend();
    const log = getResultLog(user, 30, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE);
    return log && log.activities ? log.intervalSeconds ? log.activities / log.intervalSeconds : log.activities : 0;
  },
  logDifference(user) {
    tmpl().intervalDependency.depend();
    const log = getResultLog(user, 30, Progressor.RESULT_LOG_EVALUATED_TYPE, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE);
    return log && log.difference ? log.intervalSeconds ? log.difference / log.intervalSeconds : log.difference : 0;
  },
  activityIntervalMin: () => ACTIVITY_INTERVAL_MINUTES,
  evaluationsIntervalMin: () => EVALUATION_INTERVAL_MINUTES,
});

Template.examinationExecutionView.events({
  // DURATION //

  // 'click *': () => tmpl().extendDuration.set(false),
  'click #input-extend-duration': e => e.stopPropagation(),
  'click #show-extend-duration': function (event, template) {
    tmpl().extendDuration.set(true);
    Meteor.setTimeout(() => template.$('#input-extend-duration').focus(), 1);
  },
  'click #extend-duration': function (event, template) {
    const extendByMinutes = parseInt(template.$('#input-extend-duration').val());
    tmpl().extendDuration.set(false);
    if (extendByMinutes) {
      const execution = getExecution();
      execution.durationMinutes += extendByMinutes;
      Meteor.call('saveExecution', execution, Progressor.handleError(() => Progressor.showAlert(`Successfully extended examination time by ${extendByMinutes} min`, 'success'), false));
    } else
      Progressor.showAlert('Examination time not extended', 'info');
  },

  // EXPORT EVENTS //

  'click .btn-export-pdf-empty': (e, t) => Progressor.generateExecutionPDF(getExecution()),
  'click .btn-export-pdf-solved': (e, t) => Progressor.generateExecutionPDF(getExecution(), true),
  'click .btn-export-csv': (e, t) => Progressor.generateExecutionCSV(getExecution()),
});
