function changeExercise(callback) {
  return function (event, template) {
    const target = event && event.currentTarget ? $(event.currentTarget) : null;
    const ret = callback.call(this, event, template, target, this);
    template.exercise.dep.changed();
    return ret;
  };
}

function changeExerciseTranslation(translationName) {
  return changeExercise(function (event, template, $this) {
    const value = $this.val();
    const elements = template.exercise.get()[`${translationName}s`];
    const language = this._id;
    let elementIndex = -1;
    const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
    if (!value) {
      elements.splice(elementIndex, 1);
    } else if (element) {
      element[translationName] = value;
    } else {
      elements.push({ language, [translationName]: value });
    }
  });
}

export {
  changeExercise,
  changeExerciseTranslation,
};
