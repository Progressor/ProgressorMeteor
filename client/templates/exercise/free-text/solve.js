function tmpl() {
  return Template.instance();
}

//////////////////////
// REACTIVE HELPERS //
//////////////////////

function getExercise(forceRefresh = false) {
  return tmpl().isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
}

function getResult() {
  if (tmpl().isResult.get()) {
    return Progressor.results.findOne();
  }
}

function getEvaluationResults() {
  if (tmpl().isResult.get() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime())) {
    return Progressor.results.findOne().results;
  } else {
    return tmpl().evaluationResult.get();
  }
}

function getExecutionExercise(offset) {
  const execution = Progressor.executions.findOne();
  let exerciseIndex = -1;
  if (execution && _.any(execution.exercises, (e, i) => (exerciseIndex = e.exercise_id === getExercise()._id ? i : exerciseIndex) >= 0) && execution.exercises[exerciseIndex + offset]) {
    return { _id: execution.exercises[exerciseIndex + offset].exercise_id };
  }
}

Template.textSolve.onCreated(function () {

  ////////////////////////
  // TEMPLATE VARIABLES //
  ////////////////////////

  this.isResult = new ReactiveVar(false);
  this.validationResult = new ReactiveVar(null);
  this.evaluationResult = new ReactiveVar(null);
  this.showSolution = new ReactiveVar(false);
  this.progressUpdateInterval = -1;
  this.progress = { started: false, activities: 0, length: 0 };

  ////////////////////
  // INITIALISATION //
  ////////////////////

  this.autorun(() => {
    const result = Progressor.results.findOne(), exercise = Tracker.nonreactive(getExercise);
    if (exercise && result && result.answer) {
      this.validationResult.set(new RegExp(`^${exercise.pattern}$`).test(result.answer));
    }
  });

  /////////////
  // LOGGING //
  /////////////

  if (!tmpl().isResult.get()) {
    this.autorun(() => {
      const exercise = getExercise(true);
      if (exercise) {
        Meteor.call('openedExercise', exercise, Progressor.handleError());
      }

      Meteor.clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = Meteor.setInterval(() => {
        if (exercise) {
          const answer = this.$('.control-answer').val();
          Meteor.call('updateExerciseProgress', exercise, {
            activities: this.progress.activities,
            difference: answer.length - this.progress.length,
          }, Progressor.handleError());
          this.progress.activities = 0;
          this.progress.length = answer ? answer.length : 0;
        }
      }, Progressor.RESULT_LOG_PROGRESS_UPDATE_INTERVAL);
    });
  }
});

Template.textSolve.onDestroyed(function () {
  Meteor.clearInterval(this.progressUpdateInterval);
});

/////////////
// HELPERS //
/////////////

Template.textSolve.helpers({
  safeExercise(exerciseOrResult) {
    tmpl().isResult.set(exerciseOrResult.exercise_id);
    return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
  },
  isResult: () => tmpl().isResult.get(),
  canEdit: e => !tmpl().isResult.get() && (e.author_id === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN)),
  exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
  exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
  previousExerciseSolveData: () => getExecutionExercise(-1),
  nextExerciseSolveData: () => getExecutionExercise(+1),
  changedAfterSolved: () => getExercise(true) && getResult() && getExercise(true).lastEdited > getResult().solved,
  resultSolved: () => getResult().solved,
  answer()  {
    const result = Progressor.results.findOne();
    if (result)
      return result.answer;
  },
  validation() {
    const exercise = getExercise();
    if (!exercise.execution_id) {
      if (Progressor.isExerciseEvaluated(exercise, getEvaluationResults()))
        return `has-${Progressor.isExerciseSuccess(exercise, getEvaluationResults()) ? 'success' : 'error'}`;
      else if (tmpl().validationResult.get() === false)
        return 'has-error';
    }
  },
  resultEvaluation() {
    const exercise = getExercise();
    if (!exercise.execution_id && Progressor.isExerciseEvaluated(exercise, getEvaluationResults()))
      return `glyphicon glyphicon-${Progressor.isExerciseSuccess(exercise, getEvaluationResults()) ? 'ok' : 'remove'}`;
  },
  showSolution: () => getExercise().solutionVisible && tmpl().showSolution.get()
});

Template.textSolve.events({

  /////////////
  // LOGGING //
  /////////////

  'keyup .control-answer'(event, template) {
    if (!template.progress.started) {
      template.progress.started = true;
      Meteor.call('startedExercise', getExercise(), Progressor.handleError());
    }
    template.progress.activities++;
  },

  ////////////////
  // VALIDATION //
  ////////////////

  'submit #form-answer': e => e.preventDefault(),
  'change .control-answer': (e, t) => t.validationResult.set(t.$('.control-answer')[0].checkValidity()),

  /////////////////
  // SAVE ANSWER //
  /////////////////

  'click #button-save-answer'(event, template) {
    const $control = template.$('.control-answer');
    if ($control[0].checkValidity()) {
      const exercise = getExercise();
      Meteor.call('evaluateFreeText', exercise, $control.val(), Progressor.handleError((error, result) => {
        template.evaluationResult.set(!error ? result : []);
        if (!error && (exercise.execution_id || !result.length))
          Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'info');
      }));
    }
  },

  //////////////
  // SOLUTION //
  //////////////

  'click #button-solution': (e, t) => t.showSolution.set(true),
  'click #button-close': (e, t) => t.showSolution.set(false)
});
