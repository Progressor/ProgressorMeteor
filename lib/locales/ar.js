
i18n.map('ar', {
  layout: {
    // title: 'تقدم',
    // logo: '<{تقدم}>',
    // explanation: 'أستاذ البرمجة',
    homeTitle: 'الصفحة الرئيسية',
    programmingLanguagesTitle: 'لغات البرمجة',
    adminTitle: 'إدارة',
    mongoDBAdminTitle: 'MongoDB إدارة',
    toggleNavigationButton: 'تبديل الابحار',
    unexpectedErrorMessage: 'حدث خطأ غير متوقع.\n{$1}',
  },
  account: {
    title: 'حسابي',
    loginTitle: 'دخول',
    solvedExercisesSubtitle: 'تماريني المحلولة',
    createdExercisesSubtitle: 'تماريني المنشأة ',
    createdExaminationsSubtitle: 'امتحاناتي المنشأة',
    createdExecutionSubtitle: 'تنفذاتي المنشات',
    archiveSubtitle: 'أرشيفي',
    accountSettingsSubtitle: 'ضبط الحساب',
    adminSettingsSubtitle: 'حساب الادارة',
    emailLabel: 'عنوان البريد الإلكتروني',
    nameLabel: 'الاسم الحقيقي',
    makeAdminLabel: 'المسثخدم المرخص',
    archiveButton: 'وضع في الأرشيف',
    unarchiveButton: 'العدول عن الأرشيف',
    loginButton: 'دخول',
    registerButton: 'تسجيل',
    logoutButton: 'خروج',
    logoutOtherClientsButton: 'خروج حرفاء اخرين',
    makeAdminButton: 'جعل هذا المستخدم مدير',
    isAdminMessage: 'أنت مدير غير مسموح.',
    verificationSuccessMessage: 'تم التحقق من عنوان البريد الإلكتروني بنجاح.\nلقد تم إدخالك ألياً.',
    verificationErrorMessage: 'Tفشل التحقق من عنوان البريد الإلكتروني.\n يرجى المحاولة مرة أخرى.',
    passwordResetSuccessMessage: 'قد تم بنجاح إعادة تعيين كلمة المرور.',
    passwordMismatchMessage: 'كلمات السر التي ادخلت لا تتطابق.',
    passwordResetErrorMessage: 'فشل إعادة تعيين كلمة المرور.\n ; يرجى المحاولة مرة أخرى ; قد ترغب في طلب رابط جدي',
  },
  category: {
    createTitle: 'إنشاء الفئة',
    editTitle: " '{تحيين الفئة '{$1",
    editBreadcrumb: 'تحيين الفئة',
    createButton: 'إنشاء الفئة',
    editButton: 'تحيين الفئة',
    isNotValidMessage: 'هذه الفئة غير صالحة ولا يمكن تسجيلها.\n (تعبئة جميع الحقول المطلوبة (اللغة والأسماء والأوصاف.',
  },
  exercise: {
    title: 'تمرين',
    searchTitle: '{$1} تمارين',
    createTitle: 'إنشاء تمرين',
    editTitle: "'{تحيين تمرين '{$1",
    releaseTitle: 'تحرير تمرين',
    searchSubtitle: 'بحث',
    exerciseSubtitle: 'مسألة',
    categoryDescriptionSubtitle: '{تعليمات للتمارين {$1 ',
    functionsSubtitle: 'وظائف',
    testCasesSubtitle: 'حالات تجريبية',
    solutionSubtitle: 'حل',
    optionsSubtitle: 'خيارات',
    releaseRequestedSubtitle: 'طلب تحرير',
    releasedSubtitle: 'تحرير مصادق عليه',
    editBreadcrumb: 'تمرين تحيين',
    exercise: 'تمرين',
    exercises: 'تمارين',
    upcoming: '...قادم قريبا',
    nameLabel: 'اسم',
    descriptionLabel: 'وصف',
    typeLabel: 'نوع',
    typeToCreateLabel: 'نوع من التمارين لإنشاء',
    programmingLanguageLabel: 'لغة برمجة',
    categoryLabel: 'فئة',
    difficultyLabel: 'صعوبة',
    codeFragmentLabel: 'كود الحل',
    templateFragmentLabel: 'كود القالب',
    solutionFragmentLabel: 'مثال رمز الحل',
    solvedLabel: 'تم حلها',
    answerLabel: 'اجابتك',
    solutionPatternLabel: 'نمط الحل (RegExp)',
    solutionLabel: 'حل',
    codeMirrorThemeLabel: 'محرر الموضوع',
    releaseRequestedAtLabel: 'طلب تحرير في',
    releaseRequestNotifiedAtLabel: 'إبلاغ في',
    releasedByLabel: 'تحرير مصادق عليه من',
    releasedAtLabel: 'تحرير مصادق عليه في',
    multipleSolutionsLabel: 'Aالسماح باجوبة متعددة',
    weightLabel: 'وزن',
    showSolutionLabel: 'عرض مثال الحل',
    showReleasedLabel: 'عرض التمارين المصدرة',
    showUnreleasedLabel: 'عرض التمارين الخاصة',
    blacklistLabel: 'القائمة السوداء',
    editButton: 'تحرير التمرين',
    // exportButton
    duplicateButton: 'تكرير',
    releaseRequestButton: 'مطلب تحرير',
    releaseButton: ' تحرير',
    unreleaseButton: 'إخفاء',
    executeTestsButton: 'تنفيذ حالات الاختبار',
    saveAnswerButton: 'حفظ الجواب',
    showSolutionButton: 'إظهار مثال الحل',
    closeButton: 'إغلق',
    blacklistMatchMessage: '{المصادقة فشلت، مصطلح غير شرعي: {$1', // TODO: translate
    releasedMessage: 'تم إصدار هذا التمرين.',
    releaseRequestedMessage: 'طلب اصادر هذا التمرين.',
    successMessage: 'تم حل هذا التمرين بشكل صحيح.',
    failureMessage: 'لم يتم حل هذا التمرين بشكل صحيح.',
    unevaluatedMessage: 'This exercise has to be evaluated manually.',
    executionSuccessMessage: 'نفذت بنجاح جميع حالات الاختبار.',
    executionFailureMessage: 'ليست كل حالات الاختبار نفذت بنجاح.',
    changedMessage: 'تم تغيير هذه العملية منذ أن حللتها.\nقد ترغب في عرض إصدار نسخة محينة.',
    isNotValidMessage: 'هذا التمرين ليس صالح ولا يمكن حفظه.\nتعبئة جميع الحقول إلزامية (language, category, difficulty, name(s), description(s), function(s), test case(s)).\n'
    + 'If you want to release an exercise, make sure you have not selected your private category.\nCheck if all the entered values are valid.',
    isNotTestedMessage: 'لا يمكن نشر هذا التمرين لأنه لم يختبر.',
    function: {
      nameLabel: 'اسم الوظيفة',
      namePlaceholder: 'اسم الوظيفة',
      returnTypeLabel: 'إرجاع نوع',
      returnTypePlaceholder: 'إرجاع نوع',
      parameterNameLabel: 'اسم العامل',
      parameterNamePlaceholder: 'اسم العامل',
      parameterTypeLabel: ' نوع العامل',
      parameterTypePlaceholder: ' نوع العامل',
    },
    testCase: {
      success: 'OK',
      others: 'حالات إختبار أخرى',
      descriptionLabel: 'حالة اختبار',
      functionLabel: 'الوظيفة',
      inputLabel: 'الحجج',
      expectedOutputLabel: 'القيمة المتوقعة',
      visibleLabel: 'مرئي',
      resultLabel: 'Actual Result / Error',
      successMessage: 'This test case has been executed successfully.',
      failureMessage: 'Could not successfully execute test case.',
    },
    option: {
      descriptionLabel: 'Description',
      correctLabel: 'Correct',
      wrongLabel: 'Wrong',
    },
    help: {
      title: 'Instructions',
      showButton: 'show instructions',
      types: 'For types, please enter one of the following values. The type parameters can themselves be replaced by a type.',
      values: 'For values, please enter a valid format according to the following instructions and examples. For texts and numbers, simply enter the value without any quotation marks. '
      + 'For collections, enter the values separated by commas.For maps, separate the keys and values by colons and the different pairs by commas.',
      blacklist: 'The following terms are prohibited from appearing anywhere in the code fragment.',
      testCaseVisibleMessage: 'Whether or not the test case will be shown to the students.',
      solutionVisibleMessage: 'Whether or not the example solution will be shown to the students.',
      versionInformationMessage: 'Language Version: {$1}, Compiler: {$2} v{$3}, Compilation Platform: {$4} v{$5} ({$6})',
    },
    type: {
      1: 'Programming',
      2: 'Multiple Choice',
      3: 'Free Text',
    },
    difficulty: {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Expert',
    },
  },
  examination: {
    createTemplateTitle: 'Create Exam',
    createExecutionTitle: 'Create Exam Run',
    editTemplateTitle: "Edit Exam '{$1}'",
    editExecutionTitle: "Edit Exam Run '{$1}'",
    configureExaminationSubtitle: 'Configure Exam',
    configureExecutionSubtitle: 'Configure Exam Run',
    overviewTitle: "Exam Overview '{$1}'",
    selectExercisesSubtitle: 'Select Exercises for the Exam',
    exercisesSubtitle: 'Exercises in Exam',
    examineesSubtitle: 'Examinees',
    templateType: 'Exam',
    executionType: 'Exam Run',
    startTimeLabel: 'Start Time',
    endTimeLabel: 'End Time',
    durationLabel: 'Duration',
    durationUnitLabel: 'min',
    examineesLabel: 'Examinees',
    examineeViewLabel: 'Link to Distribute to Examinees',
    progressLabel: 'Progress',
    totalWeightLabel: 'Total Weight',
    numberOfExamineesLabel: 'Number of Examinees',
    numberOfExercisesLabel: 'Number of Exercises',
    logEvaluationsLabel: 'Evaluations',
    logActivityLabel: 'Actions',
    logDifferenceLabel: 'Characters',
    createExecutionButton: 'create exam run',
    startExecutionButton: 'start exam run',
    overviewButton: 'exam overview',
    extendDurationButton: 'extend duration',
    addExerciseButton: 'add exercise to examination',
    addExamineeButton: 'add examinee',
    exportPDFEmptyButton: 'export PDF (empty)',
    exportPDFSolvedButton: 'export PDF (incl. answers)',
    exportCSVButton: 'export results to CSV',
    cannotEditMessage: 'You cannot edit a started examination run.',
    templateIsNotValidMessage: 'This examination is not valid and cannot be saved.\nFill in all the mandatory fields (name(s), duration, exercises incl. weight).',
    executionIsNotValidMessage: 'This examination run is not valid and cannot be saved.\nFill in all the mandatory fields (name(s), description(s), duration, exercises incl. weight).',
    help: {
      progressTitle: 'Progress Explanations',
      logOverviewTitle: 'Logging Explanations',
      examinees: 'If no examinees are chosen, the exam will be public. Anybody will be able to take the exam.',
      progress: 'Red: Not yet answered\nYellow: Partially solved\nGreen: Successfully solved\nBlue: Answered (no automated / visible evaluation)',
      logOverview: 'Evaluations: Number of evaluations (save / compile) in last {$1} minute(s)\nActions: Average number of actions (key stroke / mouse click) per second\n'
      + 'Characters: Average number of entered characters per second (negative number: more characters deleted than entered)\nRed cross: No activity for at least {$2} minute(s)',
    },
  },
  form: {
    notAvailable: 'n/a',
    selectAll: 'all',
    selectPleaseChoose: 'please choose an option',
    textFilter: 'text filter',
    minLength: 'You have to enter at least {$1} characters.',
    supportsMarkdown: 'This field supports Markdown.',
    createdBy: 'created by',
    editedBy: 'last edited by',
    actionAt: 'at',
    createdByLabel: 'Created By',
    editedByLabel: 'Last Edited By',
    editedAtLabel: 'Last Edited At',
    searchButton: 'search',
    saveButton: 'save',
    cancelButton: 'cancel',
    deleteButton: 'delete',
    addButton: 'add a new element',
    moveUpButton: 'move exercise up',
    moveDownButton: 'move exercise down',
    removeButton: 'remove this element',
    togglePanelButton: 'toggle panel visibility',
    previousButton: 'previous',
    nextButton: 'next',
    cannotSaveMessage: 'You are not authorised to save this document.',
    documentChangedMessage: 'The currently opened document has been changed.\nIf you continue, you will overwrite these changes. You might want want to reload it instead.',
    noFilterMessage: 'You need to specify at least one search criterion.',
    noResultsMessage: 'No results could be found.',
    noSelectionMessage: 'No element was selected.',
    saveSuccessfulMessage: 'Successfully saved your input.',
  },
  email: {
    greeting: 'Sincerely yours,',
    footer: 'Progressor - The Programming Professor\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Switzerland',
    releaseNotifier: {
      subject: 'Progressor - New Release Requests',
      title: 'Exercise Release Request Notifier',
      intro: 'Hello {$1}\nYou have some new {$2}exercise release requests.{$3}\nPlease review the pending release requests.',
    },
    verifyEmail: {
      subject: 'Progressor - Email Address Verification',
      title: 'Email Address Verification',
      intro: 'Hello {$1}\nWelcome to {$2}Progressor - The Programming Professor.{$3}\nTo verify your Email address, please click the link below.',
      info: 'On your account page, you can enter your {$1}real name{$2}.\nTo start using Progressor, simply solve an existing exercise.\nYou can also create your own private exercises and share them with your friends.',
      motivation: 'Have fun learning to program! :-)',
    },
    resetPassword: {
      subject: 'Progressor - Reset Password',
      title: 'Reset Password',
      intro: 'Hello {$1}\nTo reset your password, please click the link below and enter your new password.',
    },
  },
  programmingLanguages: {
    java: {
      // name
      description: 'is a general-purpose computer programming language that is concurrent, class-based and object-oriented.',
    },
    cpp: {
      // name
      description: '(pronounced as cee plus plus) is a general-purpose programming language. It has imperative, object-oriented and generic programming features.',
    },
    csharp: {
      // name
      description: '(pronounced as see sharp) is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.',
    },
    python: {
      // name
      description: 'is a widely used general-purpose, high-level programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.',
    },
    javascript: {
      // name
      description: 'is a high-level, dynamic, untyped, and interpreted programming language. Alongside HTML and CSS, it is one of the three essential technologies of World Wide Web content production.',
    },
    php: {
      // name
      description: 'is a server-side scripting language designed for web development but also used as a general-purpose programming language. PHP originally stood for Personal Home Page, but it now stands for the recursive backronym PHP: Hypertext Preprocessor.',
    },
    kotlin: {
      // name
      description: '(named after an island near St. Petersburg) is a statically-typed programming language that runs on the Java Virtual Machine and also can be compiled to JavaScript source code. Kotlin is designed to interoperate with Java code.',
    },
    vbnet: {
      // name
      description: 'is a multi-paradigm, high level programming language, implemented on the .NET Framework. Microsoft launched VB.NET in 2002 as the successor to its original Visual Basic language.',
    },
    upcoming: {
      // name
      description: 'programming or query languages can be added. But we need your requests and support. Get involved!',
    },
  },
  error: {
    403: {
      name: 'Forbidden',
      message: 'ليس لديك صلاحية الوصول إلى الصفحة المطلوبة.',
    },
    404: {
      name: 'Not Found',
      message: 'الصفحة المطلوبة لا يمكن العثور عليها.',
    },
    notAuthenticated: {
      message: 'تحتاج إلى أن تتم المصادقة لتنفيذ هذا الإجراء.',
    },
    notAdmin: {
      message: 'تحتاج إلى أن تكون مسؤولا لتنفيذ هذا الإجراء.',
    },
    notAuthor: {
      message: 'تحتاج إلى أن تكون صاحب العنصر لتنفيذ هذا الإجراء.',
    },
    locked: {
      message: 'تم تأمين هذا المستند.',
    },
  },
});

const symbolMap = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠',
};
const numberMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0',
};
function pluralForm(n) {
  return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
}
const plurals = {
  s: ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
  m: ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
  h: ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
  d: ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
  M: ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
  y: ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام'],
};
function pluralize(u) {
  return function (number, withoutSuffix) {
    const f = pluralForm(number);
    let str = plurals[u][pluralForm(number)];
    if (f === 2) {
      str = str[withoutSuffix ? 0 : 1];
    }
    return str.replace(/%d/i, number);
  };
}
const months = [
  'كانون الثاني يناير',
  'شباط فبراير',
  'آذار مارس',
  'نيسان أبريل',
  'أيار مايو',
  'حزيران يونيو',
  'تموز يوليو',
  'آب أغسطس',
  'أيلول سبتمبر',
  'تشرين الأول أكتوبر',
  'تشرين الثاني نوفمبر',
  'كانون الأول ديسمبر',
];

moment.defineLocale('ar', {
  months,
  monthsShort: months,
  weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/\u200FM/\u200FYYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  meridiemParse: /ص|م/,
  isPM(input) {
    return input === 'م';
  },
  meridiem(hour) {
    if (hour < 12) {
      return 'ص';
    }
    return 'م';
  },
  calendar: {
    sameDay: '[نفس اليوم عند الساعة ] LT',
    nextDay: '[غدًا عند الساعة] LT',
    nextWeek: 'dddd [الاسبوع القادم عند الساعة] LT',
    lastDay: '[أمس عند الساعة] LT',
    lastWeek: 'dddd [الاسبوع الفارط عند الساعة] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'بعد %s',
    past: 'منذ %s',
    s: pluralize('s'),
    m: pluralize('m'),
    mm: pluralize('m'),
    h: pluralize('h'),
    hh: pluralize('h'),
    d: pluralize('d'),
    dd: pluralize('d'),
    M: pluralize('M'),
    MM: pluralize('M'),
    y: pluralize('y'),
    yy: pluralize('y'),
  },
  preparse(string) {
    return string.replace(/\u200f/g, '').replace(/[١٢٣٤٥٦٧٨٩٠]/g, match => numberMap[match]).replace(/،/g, ',');
  },
  postformat(string) {
    return string.replace(/\d/g, match => symbolMap[match]).replace(/,/g, '،');
  },
  week: {
    dow: 6,  // Saturday is the first day of the week.
    doy: 12, // The week that contains Jan 1st is the first week of the year.
  },
});
