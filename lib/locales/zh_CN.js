(function () {
  'use strict';

  i18n.map('zh_CN', {
    layout: {
      title: 'Progressor',
      logo: '<{Progressor}>',
      explanation: 'The Programming Professor',
      homeTitle: 'Home',
      programmingLanguagesTitle: 'Programming Languages',
      mongoDBAdminTitle: 'MongoDB Admin',
      toggleNavigationButton: 'toggle navigation',
      unexpectedErrorMessage: '发生未知错误。\n{$1}'

    }, account: {
      title: '我的账户',
      loginTitle: '登录',
      solvedExercisesSubtitle: '已完成的练习',
      createdExercisesSubtitle: '已创建的练习',
      createdExaminationsSubtitle: '我的测验',
      createdExecutionSubtitle: '已创建的可执行程序',
      archiveSubtitle: '我的存档',
      accountSettingsSubtitle: '账户设置',
      adminSettingsSubtitle: '管理员设置',
      emailLabel: '邮件地址',
      nameLabel: '真实姓名',
      makeAdminLabel: '授权用户',
      archiveButton: '存档',
      unarchiveButton: '读取档案',
      loginButton: '登录',
      registerButton: '注册',
      logoutButton: '登出',
      logoutOtherClientsButton: '推出其他账户',
      makeAdminButton: '授权该用户为管理员',
      isAdminMessage: '您已被授权为管理员',
      verificationSuccessMessage: '邮件地址已成功验证。\n您已自动登录。',
      verificationErrorMessage: '邮件地址验证失败。\n请再次尝试。',
      passwordResetSuccessMessage: '密码已重置。',
      passwordMismatchMessage: '密码输入错误',
      passwordResetErrorMessage: '密码重置失败。\n请再次尝试，您可能需要重新申请一个新的密码重置链接。'

    }, category: {
      createTitle: '创建类型',
      editTitle: "编辑类型 '{$1}'",
      editBreadcrumb: '编辑类型',
      createButton: '创建类型',
      editButton: '编辑类型',
      isNotValidMessage: '无效类型不能被存储。\n请检查所有必填选项 (语言，名称，描述)。'

    }, exercise: {
      title: '练习',
      searchTitle: '练习 {$1}',
      createTitle: '创建练习',
      editTitle: "编辑练习 '{$1}'",
      releaseTitle: '发布练习',
      searchSubtitle: '搜索',
      exerciseSubtitle: '问题',
      categoryDescriptionSubtitle: '练习 {$1} 指南',
      functionsSubtitle: '函数',
      testCasesSubtitle: '测试实例',
      solutionSubtitle: '解决方案',
      optionsSubtitle: '选项',
      releaseRequestedSubtitle: '申请发布',
      releasedSubtitle: '确认发布',
      editBreadcrumb: '编辑练习',
      exercise: '练习',
      exercises: '练习',
      upcoming: '敬请期待...',
      nameLabel: '名称',
      descriptionLabel: '描述',
      typeLabel: '类型',
      typeToCreateLabel: '将要创建练习的类型Type of the Exercise to Create',
      programmingLanguageLabel: '编程语言',
      categoryLabel: '类型',
      difficultyLabel: '难度',
      codeFragmentLabel: '代码',
      templateFragmentLabel: '模版代码',
      solutionFragmentLabel: '答案代码',
      solvedLabel: '已解决',
      answerLabel: '您的回答',
      solutionPatternLabel: '答案 (正则表达式)',
      solutionLabel: '答案',
      codeMirrorThemeLabel: '编辑主题',
      releaseRequestedAtLabel: '发布申请于',
      releaseRequestNotifiedAtLabel: '通知于',
      releasedByLabel: '发布确认',
      releasedAtLabel: '发布确认于',
      multipleSolutionsLabel: '允许多个答案',
      weightLabel: '权重',
      showSolutionLabel: '显示答案举例',
      showReleasedLabel: '显示已发布的练习',
      showUnreleasedLabel: '显示非公开的练习',
      blacklistLabel: '黑名单',
      editButton: '编辑练习',
      duplicateButton: '复制',
      releaseRequestButton: '申请发布',
      releaseButton: '发布',
      unreleaseButton: '隐藏',
      executeTestsButton: '运行测试实例',
      saveAnswerButton: '保存答案',
      showSolutionButton: '显示答案举例',
      closeButton: '关闭',
      blacklistMatchMessage: '验证失败，无效语句: {$1}',
      releasedMessage: '该练习已被发布。',
      releaseRequestedMessage: '该练习已被申请发布。',
      successMessage: '该练习已正确解答。',
      failureMessage: '该练习未被正确解答。',
      unevaluatedMessage: '该练习需要人工验证。',
      executionSuccessMessage: '成功执行所有测试实例。',
      executionFailureMessage: '未成功执行所有测试实例。',
      changedMessage: '该练习已被更新.\n您可能需要查看更新后的版本。',
      isNotValidMessage: '该练习无效，无法存储\n请检查所有必填选项 (语言，类型，难度，名称，描述，函数，测试实例)。\n'
                         + '如果您想发布该练习，请不要选择非公开类型，并保证所有输入有效。',
      isNotTestedMessage: '该练习未通过实例测试，不能被发布。',
      'function': {
        nameLabel: '函数名称',
        namePlaceholder: '函数名称',
        returnTypeLabel: '返回变量类型',
        returnTypePlaceholder: '返回变量类型',
        parameterNameLabel: '参数名称',
        parameterNamePlaceholder: '参数名称',
        parameterTypeLabel: '参数类型',
        parameterTypePlaceholder: '参数类型'
      }, testCase: {
        success: '成功',
        others: '其他测试实例',
        descriptionLabel: '测试实例',
        functionLabel: '函数',
        inputLabel: '输入变量',
        expectedOutputLabel: '期望得到的变量值',
        visibleLabel: '可见',
        resultLabel: '实际结果／误差',
        successMessage: '该测试实例已成功执行',
        failureMessage: '该测试实例未成功执行'
      }, option: {
        descriptionLabel: '描述',
        correctLabel: '正确',
        wrongLabel: '错误'
      }, help: {
        title: '指南',
        showButton: '显示指南',
        types: '请输入正确类型，见如下举例。类型参数本身可以是一个类型。',
        values: '请输入正确的变量值格式。见如下举例，对于文本和数字，请勿添加引号。'
                + '对于集合 collections，请用逗号分隔元素。对于映射maps，请用冒号分隔keys和values，并用逗号分隔key－value组合。',
        blacklist: '代码中不得出现一下语句。',
        testCaseVisibleMessage: '测试实例是否对学生可见',
        solutionVisibleMessage: '答案是否对学生可见',
        versionInformationMessage: '语言版本: {$1}, 编译器: {$2} v{$3}, 编译平台: {$4} v{$5} ({$6})'
      }, type: {
        1: '编程',
        2: '多项选择',
        3: '问答'
      }, difficulty: {
        1: '初学者',
        2: '中阶',
        3: '高阶',
        4: '专家级'
      }

    }, examination: {
      createTemplateTitle: '创建测验',
      createExecutionTitle: '创建可执行程序',
      editTemplateTitle: "编辑测验 '{$1}'",
      editExecutionTitle: "编辑可执行程序 '{$1}'",
      configureExaminationSubtitle: '配置测验',
      configureExecutionSubtitle: '配置可执行程序',
      overviewTitle: "测验预览 '{$1}'",
      selectExercisesSubtitle: '为测验选择习题',
      exercisesSubtitle: '测验中的习题',
      examineesSubtitle: '测验者',
      templateType: '测验',
      executionType: '可执行程序',
      startTimeLabel: '开始时间',
      endTimeLabel: '结束时间',
      durationLabel: '时长',
      durationUnitLabel: '分钟',
      examineesLabel: '测验者',
      examineeViewLabel: '分发给测验者',
      progressLabel: '进度',
      totalWeightLabel: '总权重',
      numberOfExamineesLabel: '测验着数量',
      numberOfExercisesLabel: '练习数量',
      logEvaluationsLabel: '评估',
      logActivityLabel: '执行',
      logDifferenceLabel: '字符',
      createExecutionButton: '创建可执行程序',
      startExecutionButton: '运行可执行程序',
      overviewButton: '测验预览',
      extendDurationButton: '延长测验时间',
      addExerciseButton: '添加习题到测验',
      addExamineeButton: '添加测验者',
      exportPDFEmptyButton: '生成 PDF (不包括答案)',
      exportPDFSolvedButton: '生成 PDF (包括答案)',
      exportCSVButton: '生成结果 （CSV格式）',
      cannotEditMessage: '不能编辑已运行的可执行程序',
      templateIsNotValidMessage: '该测验无效，不能被保存。\n请检查所有必填选项 （名称，时长，练习及其权重）。',
      executionIsNotValidMessage: '该可执行程序无效，不能被保存。\n请检查所有必填选项（名称，描述，时长，练习及其权重）。',
      help: {
        progressTitle: '进度解释',
        logOverviewTitle: 'logging 解释',
        examinees: '如果未选择测验者，该测验未公开测验。任何人都可以参加。',
        progress: '红色：未完成。\n黄色：部分完成。\n绿色：正确完成。\n蓝色：已完成（对不能自动判断正确的习题）。',
        logOverview: '评估: 过去 {$1} 分钟内保存和编译的评估数量。\n行为: 平均每秒的行为数量（按键／鼠标点击）。\n'
                     + '字符: 平均每秒的输入的字符（负值：删除的字符多于输入的字符）。\n红色叉：过去 {$2} 分钟内无用户行为。'
      }

    }, form: {
      notAvailable: 'n/a',
      selectAll: '全部',
      selectPleaseChoose: '请选择一项',
      textFilter: '文本筛选',
      minLength: '请输入至少 {$1} 个字符。',
      supportsMarkdown: '该选项支持Markdown。',
      createdBy: '被创建',
      editedBy: '被最后更改',
      actionAt: '在',
      createdByLabel: '被创建',
      editedByLabel: '被最后更改',
      editedAtLabel: '最后更改于',
      searchButton: '搜索',
      saveButton: '保存',
      cancelButton: '取消',
      deleteButton: '删除',
      addButton: '添加新项目',
      moveUpButton: '上移练习',
      moveDownButton: '下移练习',
      removeButton: '删除该项目',
      togglePanelButton: '切换面板是否可见',
      previousButton: '上一步',
      nextButton: '下一步',
      cannotSaveMessage: '无权保存该文件',
      documentChangedMessage: '当前打开的文件已被更改。\n如果继续，您将覆盖之前的更改。或者您可以刷新已显示更改。',
      noFilterMessage: '请输入至少一项搜索标准。',
      noResultsMessage: '无结果。',
      noSelectionMessage: '无选中选项。',
      saveSuccessfulMessage: '成功保存您的输入。'

    }, email: {
      greeting: '谨启',
      footer: 'Progressor - The Programming Professor\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Switzerland',
      releaseNotifier: {
        subject: 'Progressor - 新的发布申请',
        title: '新的发布申请通知',
        intro: '您好 {$1}\n您有 {$2}练习发布申请。{$3}\n请查阅审核中的发布申请。'
      },
      verifyEmail: {
        subject: 'Progressor - 邮箱地址验证',
        title: '邮箱地址验证',
        intro: '您好 {$1}\n欢迎使用 {$2}Progressor - The Programming Professor.{$3}\n请点击以下链接以验证您的邮箱。',
        info: '在您的个人页面，您可以输入您{$1}的真实姓名{$2}。\n 您可以直接开始解答练习.\n您也可以创建练习并分享给朋友。',
        motivation: '祝您学习愉快！'
      },
      resetPassword: {
        subject: 'Progressor - 重置密码',
        title: '重置密码',
        intro: '您好 {$1}\n请点击以下链接以重置您的密码。'
      }

    }, programmingLanguages: {
      java: {
        name: 'Java',
        description: 'is a general-purpose computer programming language that is concurrent, class-based and object-oriented.'
      }, cpp: {
        name: 'C/C++',
        description: '(pronounced as cee plus plus) is a general-purpose programming language. It has imperative, object-oriented and generic programming features.'
      }, csharp: {
        name: 'C#',
        description: '(pronounced as see sharp) is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.'
      }, python: {
        name: 'Python',
        description: 'is a widely used general-purpose, high-level programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.'
      }, javascript: {
        name: 'JavaScript',
        description: 'is a high-level, dynamic, untyped, and interpreted programming language. Alongside HTML and CSS, it is one of the three essential technologies of World Wide Web content production.'
      }, php: {
        name: 'PHP',
        description: 'is a server-side scripting language designed for web development but also used as a general-purpose programming language. PHP originally stood for Personal Home Page, but it now stands for the recursive backronym PHP: Hypertext Preprocessor.'
      }, kotlin: {
        name: 'Kotlin',
        description: '(named after an island near St. Petersburg) is a statically-typed programming language that runs on the Java Virtual Machine and also can be compiled to JavaScript source code. Kotlin is designed to interoperate with Java code.'
      }, vbnet: {
        name: 'Visual Basic .NET',
        description: 'is a multi-paradigm, high level programming language, implemented on the .NET Framework. Microsoft launched VB.NET in 2002 as the successor to its original Visual Basic language.'
      }, //ruby: {
      //   name: 'Ruby',
      //   description: 'is a dynamic, reflective, object-oriented, general-purpose programming language. It was designed and developed in the mid-1990s by Yukihiro "Matz" Matsumoto in Japan.'
      // }, swift: {
      //   name: 'Swift',
      //   description: 'is a general-purpose, multi-paradigm, compiled programming language created for iOS, OS X, watchOS, tvOS, and Linux developed by Apple Inc.'
      // }, lisp: {
      //   name: 'Lisp',
      //   description: 'is a family of computer programming languages with a long history and a distinctive, fully parenthesized prefix notation. Originally specified in 1958, Lisp is the second-oldest high-level programming language in widespread use today.'
      // }, sql: {
      //   name: 'SQL',
      //   description: '(Structured Query Language) is a special-purpose programming language designed for managing data held in a relational database management system (RDBMS), or for stream processing in a relational data stream management system (RDSMS).'
      // }
      upcoming: {
        name: 'More',
        description: '敬请期待更多的编程语言。我们需要您的加入！'
      }

    }, error: {
      403: {
        name: '禁止',
        message: '您无权查看该页面。'
      }, 404: {
        name: '未找到',
        message: '未找到该页面。'
      },
      notAuthenticated: {
        message: '您需要验证身份以继续该操作。'
      },
      notAdmin: {
        message: '您需要管理员权限以执行该操作。'
      },
      notAuthor: {
        message: '仅所有者有权执行该操作。'
      },
      locked: {
        message: '该文档被锁定。'
      }
    }
  });

  moment.defineLocale('zh_CN', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
      LT: 'Ah点mm分',
      LTS: 'Ah点m分s秒',
      L: 'YYYY-MM-DD',
      LL: 'YYYY年MMMD日',
      LLL: 'YYYY年MMMD日Ah点mm分',
      LLLL: 'YYYY年MMMD日ddddAh点mm分',
      l: 'YYYY-MM-DD',
      ll: 'YYYY年MMMD日',
      lll: 'YYYY年MMMD日Ah点mm分',
      llll: 'YYYY年MMMD日ddddAh点mm分'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
        hour = 0;
      }
      if (meridiem === '凌晨' || meridiem === '早上' ||
          meridiem === '上午') {
        return hour;
      } else if (meridiem === '下午' || meridiem === '晚上') {
        return hour + 12;
      } else {
        // '中午'
        return hour >= 11 ? hour : hour + 12;
      }
    },
    meridiem: function (hour, minute, isLower) {
      var hm = hour * 100 + minute;
      if (hm < 600) {
        return '凌晨';
      } else if (hm < 900) {
        return '早上';
      } else if (hm < 1130) {
        return '上午';
      } else if (hm < 1230) {
        return '中午';
      } else if (hm < 1800) {
        return '下午';
      } else {
        return '晚上';
      }
    },
    calendar: {
      sameDay: function () {
        return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
      },
      nextDay: function () {
        return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
      },
      lastDay: function () {
        return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
      },
      nextWeek: function () {
        var startOfWeek, prefix;
        startOfWeek = moment().startOf('week');
        prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]';
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
      },
      lastWeek: function () {
        var startOfWeek, prefix;
        startOfWeek = moment().startOf('week');
        prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
        return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
      },
      sameElse: 'LL'
    },
    ordinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日';
        case 'M':
          return number + '月';
        case 'w':
        case 'W':
          return number + '周';
        default:
          return number;
      }
    },
    relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年'
    },
    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
  });

})();
