
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
    unexpectedErrorMessage: '{$1} \n .حدث خطأ غير متوقع',
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
    isAdminMessage: '.أنت مدير غير مسموح',
    verificationSuccessMessage: '.تم التحقق من عنوان البريد الإلكتروني بنجاح.\nلقد تم إدخالك ألياً',
    verificationErrorMessage: '.فشل التحقق من عنوان البريد الإلكتروني.\n يرجى المحاولة مرة أخرى',
    passwordResetSuccessMessage: '.قد تم بنجاح إعادة تعيين كلمة المرور',
    passwordMismatchMessage: '.كلمات السر التي ادخلت لا تتطابق',
    passwordResetErrorMessage: 'فشل إعادة تعيين كلمة المرور.\n ; يرجى المحاولة مرة أخرى ; قد ترغب في طلب رابط جدي',
  },
  category: {
    createTitle: 'إنشاء الفئة',
    editTitle: " '{$تحيين الفئة {1'",
    editBreadcrumb: 'تحيين الفئة',
    createButton: 'إنشاء الفئة',
    editButton: 'تحيين الفئة',
    isNotValidMessage: '.هذه الفئة غير صالحة ولا يمكن تسجيلها.\n (تعبئة جميع الحقول المطلوبة (اللغة والأسماء والأوصاف',
  },
  exercise: {
    title: 'تمرين',
    searchTitle: '{$1} تمارين',
    createTitle: 'إنشاء تمرين',
    editTitle: "'{$تحيين تمرين {1'",
    releaseTitle: 'تحرير تمرين',
    searchSubtitle: 'بحث',
    exerciseSubtitle: 'مسألة',
    categoryDescriptionSubtitle: '{$تعليمات للتمارين {1 ',
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
    solutionPatternLabel: '(RegExp) نمط الحل',
    solutionLabel: 'حل',
    codeMirrorThemeLabel: 'محرر الموضوع',
    releaseRequestedAtLabel: 'طلب تحرير في',
    releaseRequestNotifiedAtLabel: 'إبلاغ في',
    releasedByLabel: 'تحرير مصادق عليه من',
    releasedAtLabel: 'تحرير مصادق عليه في',
    multipleSolutionsLabel: 'السماح باجوبة متعددة',
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
    blacklistMatchMessage: '{$المصادقة فشلت، مصطلح غير شرعي: {1', // TODO: translate
    releasedMessage: '.تم إصدار هذا التمرين',
    releaseRequestedMessage: 'طلب اصادر هذا التمرين.',
    successMessage: '.تم حل هذا التمرين بشكل صحيح',
    failureMessage: 'لم يتم حل هذا التمرين بشكل صحيح.',
    unevaluatedMessage: '.هذا التمرين لابد من تقييمها يدويا',
    executionSuccessMessage: '.نفذت بنجاح جميع حالات الاختبار',
    executionFailureMessage: '.ليست كل حالات الاختبار نفذت بنجاح',
    changedMessage: '.تم تغيير هذه العملية منذ أن حللتها.\nقد ترغب في عرض إصدار نسخة محينة',
    isNotValidMessage: 'هذا التمرين ليس صالح ولا يمكن حفظه.\nتعبئة جميع الحقول إلزامية (language, category, difficulty, name(s), description(s), function(s), test case(s)).\n'
    + 'If you want to release an exercise, make sure you have not selected your private category.\nCheck if all the entered values are valid.',
    isNotTestedMessage: '.لا يمكن نشر هذا التمرين لأنه لم يختبر',
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
      resultLabel: 'النتيجة الفعلية / خطأ',
      successMessage: '.لقد تم تنفيذ هذه الحالة من الاختبار بنجاح',
      failureMessage: '.لا يمكن تنفيذ حالة الاختبار بنجاح',
    },
    option: {
      descriptionLabel: 'وصف',
      correctLabel: 'صحيح',
      wrongLabel: 'خاطئ',
    },
    help: {
      title: 'تعليمات',
      showButton: 'عرض التعليمات',
      types: 'بالنسبة للأنواع، من فضلك أدخل أحد القيم التالية. يمكن استبدال  نوع المعلمات أنفسهم بنوع أخر',
      values: 'بالنسبة إلى قيم، يرجى إدخال شكل صحيح وفقا للتعليمات والأمثلة التالية. للنصوص والأرقام، ما عليك سوى إدخال القيمة بدون أي علامات اقتباس. '
      + 'بالنسبة للمجموعات، أدخل القيم مفصولة بفواصل. للخرائط  فصل المفاتيح والقيم التي كتبها بكولون وأزواج مختلفة من الفواصل',
      blacklist: 'يحظر المصطلحات التالية من الظهور في أي مكان في جزء التعليمات البرمجية.',
      testCaseVisibleMessage: '.ما إذا أو لا سيتم عرض حالة اختبار للطلاب',
      solutionVisibleMessage: '.ما إذا أو لا سيتم عرض حل المثال للطلاب',
      versionInformationMessage: 'Language Version: {$1}, Compiler: {$2} v{$3}, Compilation Platform: {$4} v{$5} ({$6})',
    },
    type: {
      1: 'برمجة',
      2: 'اختيار متعدد',
      3: 'كتابة حرة',
    },
    difficulty: {
      1: 'مبتدئ',
      2: 'متوسط',
      3: 'متقدم',
      4: 'خبير',
    },
  },
  examination: {
    createTemplateTitle: 'إنشاء امتحان',
    createExecutionTitle: 'إنشاء امتحان تشغيل',
    editTemplateTitle: "'{$تحرير امتحان {1'",
    editExecutionTitle: "'{$تحرير تشغيل امتحان {1'",
    configureExaminationSubtitle: 'تكوين امتحان',
    configureExecutionSubtitle: 'تكوين امتحان تشغيل',
    overviewTitle: "'{$نظرة عامة الامتحان {1'",
    selectExercisesSubtitle: 'اختر تمارين للامتحان',
    exercisesSubtitle: 'تمارين في الامتحان',
    examineesSubtitle: 'الممتحنين',
    templateType: 'امتحان',
    executionType: 'امتحان تشغيل',
    startTimeLabel: 'وقت البدء',
    endTimeLabel: 'وقت النهاية',
    durationLabel: 'مدة',
    durationUnitLabel: 'دقيقة',
    examineesLabel: 'الممتحنين',
    examineeViewLabel: 'رابط لتوزيعها على الممتحنين',
    progressLabel: 'تقدم',
    totalWeightLabel: 'الوزن الكلي',
    numberOfExamineesLabel: 'عدد المتقدمين للامتحان',
    numberOfExercisesLabel: 'عدد التمارينs',
    logEvaluationsLabel: 'التقييمات',
    logActivityLabel: 'الإجراءات',
    logDifferenceLabel: 'الأحرف',
    createExecutionButton: 'إنشاء إمتحان التشغيل',
    startExecutionButton: 'بدء إمتحان التشغيل',
    overviewButton: 'نظرة عامة الامتحان',
    extendDurationButton: 'تمديد مدة',
    addExerciseButton: 'إضافة ممارسة للفحص',
    addExamineeButton: 'إضافة الممتحن',
    exportPDFEmptyButton: '(فارغة) PDF تصدير',
    exportPDFSolvedButton: '(بما في ذلك الأجوبة) PDF تصدير',
    exportCSVButton: 'CVS تصدير النتائج إلى',
    cannotEditMessage: 'لا يمكنك تحرير تشغيل الفحص البادية',
    templateIsNotValidMessage: '(هذا الفحص غير صالح ولا يمكن حفظه.  في كافة الحقول المطلوبة (اسم/ أسماء، المدة، بما في ذلك الوزن',
    executionIsNotValidMessage: 'هذا التشغيل الفحص غير صالح ولا يمكن حفظها.  في كافة الحقول المطلوبة (اسم /أسماء ،الوصف/أوصاف، المدة، بما في ذلك الوزن).',
    help: {
      progressTitle: 'تفسيرات التقدم',
      logOverviewTitle: 'تفسيرات التسجيل',
      examinees: '.إذا يتم اختيار أي الممتحنين، فإن امتحان علنية. سيتمكن أي شخص من إجراء الامتحان',
      progress: '(غير آلي \ تقييم ألي) \n الأخضر: حلت بنجاح \n الأصفر: حلت جزئيا \n الأحمر: لم ترد بعد ',
      logOverview: 'Evaluations: Number of evaluations (save / compile) in last {$1} minute(s)\nActions: Average number of actions (key stroke / mouse click) per second\n'
      + 'Characters: Average number of entered characters per second (negative number: more characters deleted than entered)\nRed cross: No activity for at least {$2} minute(s)',
    },
  },
  form: {
    notAvailable: 'n/a',
    selectAll: 'جميع',
    selectPleaseChoose: 'الرجاء تحديد خيار',
    textFilter: 'تصفية النص',
    minLength: 'عليك إدخال ما لا يقل عن {$1} حرف ',
    supportsMarkdown: 'يدعم هذا المجال تخفيض السعر.',
    createdBy: 'أنشأتها',
    editedBy: 'آخر تحرير بواسطة',
    actionAt: 'في',
    createdByLabel: 'تم إنشاؤها بواسطة',
    editedByLabel: 'التعديل الأخير تم بواسطة',
    editedAtLabel: 'التعديل الأخير تم في',
    searchButton: 'بحث',
    saveButton: 'حفظ',
    cancelButton: 'إلغاء',
    deleteButton: 'حذف',
    addButton: 'إضافة عنصر جديد',
    moveUpButton: 'نقل التمرين أعلى',
    moveDownButton: 'نقل التمرين أسفل',
    removeButton: 'إزالة هذا العنصر',
    togglePanelButton: 'رؤية لوحة تبديل',
    previousButton: 'سابق',
    nextButton: 'التالى',
    cannotSaveMessage: '.غير مصرح لك بحفظ هذه الوثيقة',
    documentChangedMessage: 'إذا واصلت سيتم كتابة التغيير الجديد. قد ترغب إعادة التحميل \n.تم تغيير الوثيقة المفتوحة',
    noFilterMessage: '.تحتاج إلى تحديد معيار بحث واحد على الأقل',
    noResultsMessage: '.لم يتم العثور على نتيجة',
    noSelectionMessage: '.لم يتم اختيار العنصر',
    saveSuccessfulMessage: '.حفظ بنجاح المدخلات الخاصة بك',
  },
  email: {
    greeting: 'صديقك المخلص،',
    footer: 'Progressor - The Programming Professor\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Switzerland',
    releaseNotifier: {
      subject: 'Progressor - طلبات الإصدار الجديدة',
      title: 'ممارسة الإصدار طلب الإشعار',
      intro: '{$1} مرحبا',
    },
    verifyEmail: {
      subject: 'Progressor - التحقق من العنوان البريد الإلكتروني',
      title: 'التحقق من العنوان البريد الإلكتروني',
      intro: 'Hello {$1}\nWelcome to {$2}Progressor - The Programming Professor.{$3}\nTo verify your Email address, please click the link below.',
      info: 'On your account page, you can enter your {$1}real name{$2}.\nTo start using Progressor, simply solve an existing exercise.\nYou can also create your own private exercises and share them with your friends.',
      motivation: ':-) نتمنى لك المتعة في تعلم اللغة ',
    },
    resetPassword: {
      subject: 'Progressor - اعادة تعيين كلمة السر',
      title: 'اعادة تعيين كلمة السر',
      intro: 'مرحبا {$1} لإعادة تعيين كلمة المرور الخاصة بك، يرجى الضغط على الرابط أدناه وأدخل كلمة المرور الجديدة',
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
      description: '!يمكن إضافة البرمجة أو لغة البرمجة. لكننا نحتاج طلبك أو دعمك. انخرط',
    },
  },
  error: {
    403: {
      name: 'ممنوع',
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
