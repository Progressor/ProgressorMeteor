Meteor.startup(() => {
  const solutions = {
    java: 'public String helloWorld() { return "Hello, World!"; }',
    cpp: 'string helloWorld() { return "Hello, World!"; }',
    csharp: 'public string helloWorld() => "Hello, World!";',
    python: 'def helloWorld(): return "Hello, World!"',
    javascript: 'function helloWorld() { return "Hello, World!"; }',
    php: 'function helloWorld() : string { return "Hello, World!"; }',
    kotlin: 'fun helloWorld() = "Hello, World!"',
  };

  _.each(Progressor.getProgrammingLanguages(), l => {
    if (!Progressor.categories.find({ programmingLanguage: l._id, private: true }).count()) {
      Progressor.categories.insert({
        programmingLanguage: l._id,
        private: true,
        lastEdited: new Date(),
      });
    }

    if (!Progressor.categories.find({ programmingLanguage: l._id, private: { $exists: false } }).count()) {
      Progressor.categories.insert({
        programmingLanguage: l._id,
        names: [
          { language: 'en', name: 'Basics' },
          { language: 'de', name: 'Grundlagen' },
        ],
        descriptions: [
          { language: 'en', description: 'The basic syntax of a programming language is shown by means of a simple Hello World exercise.' },
          { language: 'en', description: 'Die Grundlagen einer Programmiersprache werden am besten mit einer einfachen Hallo Welt-Aufgabe gezeigt.' },
        ],
        lastEdited: new Date(),
      });

      Progressor.exercises.insert({
        names: [
          { language: 'en', name: 'Hello, World!' },
          { language: 'de', name: 'Hallo, Welt!' },
        ],
        programmingLanguage: l._id,
        category_id: Progressor.categories.findOne({ programmingLanguage: l._id, private: { $exists: false } })._id,
        difficulty: 1,
        type: 1,
        descriptions: [
          { language: 'en', description: 'Return **Hello, World!**.' },
          { language: 'de', description: 'Gib __Hello, World!__ zurück.' },
        ],
        functions: [
          {
            name: 'helloWorld',
            inputNames: [],
            inputTypes: [],
            outputNames: ['return'],
            outputTypes: ['string'],
          },
        ],
        testCases: [
          {
            functionName: 'helloWorld',
            inputValues: [],
            expectedOutputValues: ['Hello, World!'],
            visible: true,
          },
        ],
        solution: solutions[l._id],
        solutionVisible: true,
        released: {
          requested: new Date(),
          confirmed: new Date(),
        },
        lastEdited: new Date(),
      });
    }
  });

  if (!Progressor.examinations.find().count()) {
    Progressor.examinations.insert({
      names: [
        { language: 'en', name: 'Basics' },
        { language: 'de', name: 'Grundlagen' },
      ],
      exercises: _.map(Progressor.exercises.find().fetch(), exercise => ({
        exercise_id: exercise._id,
        weight: Math.floor((Random.fraction() * 12) + 1),
      })),
      durationMinutes: 365 * 24 * 60,
      lastEdited: new Date(),
    });

    _.each(Progressor.examinations.find().fetch(), e => Progressor.executions.insert({
      _id: 'Xh3YGewf9JT5AGoav',
      examination_id: e._id,
      names: [
        { language: 'en', name: `Basics - ${new Date().getFullYear()}` },
        { language: 'de', name: `Basics - ${new Date().getFullYear()}` },
      ],
      descriptions: [
        { language: 'en', description: 'The basic syntax of a programming language is shown by means of a simple Hello World exercise.' },
        { language: 'en', description: 'Die Grundlagen einer Programmiersprache werden am besten mit einer einfachen Hallo Welt-Aufgabe gezeigt.' },
      ],
      startTime: new Date(new Date().getFullYear(), 0, 1),
      durationMinutes: e.durationMinutes,
      exercises: _.chain(e.exercises).map(exercise => ({
        weight: exercise.weight,
        base_id: exercise.exercise_id,
        exercise_id: Progressor.exercises.insert(_.extend(_.omit(Progressor.exercises.findOne({ _id: exercise.exercise_id }), '_id', 'category_id', 'difficulty', 'released', 'archived'), {
          execution_id: 'Xh3YGewf9JT5AGoav',
        }))
      })).sortBy(() => Random.fraction()).value(),
      lastEdited: new Date(),
    }));
  }
});
