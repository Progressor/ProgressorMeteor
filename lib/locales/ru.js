i18n.map('ru', {
	layout: {
		title: 'Прогрессор',
		logo: '<{Прогрессор}>',
		explanation: 'Профессор программирования',
		homeTitle: 'На главную',
		programmingLanguagesTitle: 'Языки программирования',
		mongoDBAdminTitle: 'Администрирование MongoDB',
		toggleNavigationButton: 'смена навигации',
		unexpectedErrorMessage: 'Ошибка:\n{$1}'

	}, account: {
		title: 'Профиль',
		loginTitle: 'Вход',
		solvedExercisesSubtitle: 'Пройденные упражнения',
		createdExercisesSubtitle: ‘Созданные упражнения',
		createdExaminationsSubtitle: 'Созданные экзамены',
		createdExecutionSubtitle: 'Исполняемые задачи',
		archiveSubtitle: 'Архив',
		accountSettingsSubtitle: 'Настройки профиля',
		adminSettingsSubtitle: 'Настройки администратора',
		emailLabel: 'Почтовый адрес',
		nameLabel: 'Полное имя (ФИО)',
		makeAdminLabel: 'Авторизуемый пользователь',
		archiveButton: 'заархивировать',
		unarchiveButton: 'отменить архивацию',
		loginButton: 'войти',
		registerButton: 'зарегистрироваться',
		logoutButton: 'выйти',
		logoutOtherClientsButton: 'принудительно выход остальных пользователей',
		makeAdminButton: 'сделать администратором',
		isAdminMessage: 'Вы являетесь администратором.',
		verificationSuccessMessage: 'Почтовый адрес подтверждён.\nВыполнен автоматический вход в систему.',
		verificationErrorMessage: 'Почтовый адрес не был подтверждён.\nПожалуйста, повторите попытку.',
		passwordResetSuccessMessage: 'Пароль успешно изменён.',
		passwordMismatchMessage: 'Некорректное подтверждение пароля.',
		passwordResetErrorMessage: 'Пароль не был изменён.\nПожалуйста, повторите попытку; можете запросить новую ссылку.'

	}, category: {
		createTitle: 'Создать категорию',
		editTitle: "Редактировать категорию '{$1}'",
		editBreadcrumb: ‘Редактировать категорию',
		createButton: 'создать категорию',
		editButton: 'редактировать категорию',
		isNotValidMessage: 'Категория не корректна и не может быть сохранена.\nЗаполните все обязательные поля (язык, имя, описание).'

	}, exercise: {
		title: 'Упражнение',
		searchTitle: '{$1} Упражнения',
		createTitle: ‘Создать упражнение',
		editTitle: "Редактировать упражнение '{$1}'",
		releaseTitle: 'Опубликовать упражнение',
		searchSubtitle: 'Поиск',
		exerciseSubtitle: 'Задача',
		categoryDescriptionSubtitle: 'Инструкции к {$1} упражнениям(ю)',
		functionsSubtitle: 'Функции',
		testCasesSubtitle: 'Тесты',
		solutionSubtitle: 'Ответ',
		optionsSubtitle: 'Опции',
		releaseRequestedSubtitle: 'Публикация запрошена',
		releasedSubtitle: 'Публикация подтверждена',
		editBreadcrumb: 'Редактировать упражнение',
		exercise: 'упражнение',
		exercises: 'упражнения',
		upcoming: 'вскоре будет доступно...',
		nameLabel: 'Имя',
		descriptionLabel: 'Описание',
		typeLabel: 'Тип',
		typeToCreateLabel: 'Тип создаваемого упражнения',
		programmingLanguageLabel: 'Язык программирования',
		categoryLabel: 'Категория',
		difficultyLabel: 'Сложность',
		codeFragmentLabel: 'Ответ (исходный код)',
		templateFragmentLabel: 'Шаблон (исходный код)',
		solutionFragmentLabel: 'Привет решения (исходный код)',
		solvedLabel: 'Выполнено',
		answerLabel: 'Ваш ответ',
		solutionPatternLabel: 'Шаблон ответа (RegExp)',
		solutionLabel: 'Ответ',
		codeMirrorThemeLabel: 'Тема редактора',
		releaseRequestedAtLabel: 'Публикация запрошена в',
		releaseRequestNotifiedAtLabel: 'Оповещение в',
		releasedByLabel: 'Публикация подтверждена',
		releasedAtLabel: 'Публикация подтверждена в',
		multipleSolutionsLabel: 'Разрешить несколько ответов',
		weightLabel: 'Вес',
		showSolutionLabel: 'Показать пример решения',
		showReleasedLabel: 'Показать опубликованные упражнения',
		showUnreleasedLabel: 'Показать неопубликованные упражнения',
		blacklistLabel: 'Чёрный список',
		editButton: 'редактировать упражнение',
		duplicateButton: 'дублировать',
		releaseRequestButton: 'запросить публикацию',
		releaseButton: 'опубликовать',
		unreleaseButton: 'скрыть',
		executeTestsButton: 'выполнить тесты',
		saveAnswerButton: 'сохранить ответ',
		showSolutionButton: 'показать пример решения',
		closeButton: 'Закрыть',
		blacklistMatchMessage: 'проверка не пройдена, некорректный термин: {$1}',
		releasedMessage: 'Упражнение опубликовано.',
		releaseRequestedMessage: 'Упражнение запрошено к публикации.',
		successMessage: 'Упражнение выполнено корректно.',
		failureMessage: 'Упражнение выполнено некорректно.',
		unevaluatedMessage: 'Упражнение должно быть проверено вручную.',
		executionSuccessMessage: 'Все тесты пройдены успешно.',
		executionFailureMessage: 'Тесты провалены.',
		changedMessage: 'Упражнение изменено после решения.\nВам может быть интересна обновлённая версия.',
		isNotValidMessage: 'Упражнение не корректно и не может быть сохранено.\nЗаполните все обязательные поля (язык, категория, сложность, имя, описание, функции, тесты).\n'
							+ 'Если вы собираетесь опубликовать упражнение, удостоверьтесь что неактивен флаг частной категории.\nПроверьте правильны ли введённые данные.',
		isNotTestedMessage: 'Это упражнение не может быть опубликовано, т.к. оно не было протестировано.',
		'function': {
			nameLabel: 'Имя функции',
			namePlaceholder: 'имя функции',
			returnTypeLabel: 'Возвращаемый тип',
			returnTypePlaceholder: 'возвращаемый тип',
			parameterNameLabel: 'Имя параметра',
			parameterNamePlaceholder: 'имя параметра',
			parameterTypeLabel: 'Тип параметра',
			parameterTypePlaceholder: 'тип параметра'
		}, testCase: {
			success: 'Успешно',
			others: 'иные тесты',
			descriptionLabel: 'Тест',
			functionLabel: 'Функция',
			inputLabel: 'Аргументы',
			expectedOutputLabel: 'Ожидаемое возвращаемое значение',
			visibleLabel: 'Видимый',
			resultLabel: 'Полученный результат / Ошибка',
			successMessage: 'Этот тест успешно выполнен.',
			failureMessage: 'Тест провален.'
		}, option: {
			descriptionLabel: 'Описание',
			correctLabel: 'Правильно',
			wrongLabel: 'Неправильно'
		}, help: {
			title: 'Инструкции',
			showButton: 'показать инструкции',
			types: 'Для типов, пожалуйста, введите одно из следующих значений. Параметры типа могут быть заменены самим типом.',
			values: 'Для значений, пожалуйста, введите корректный формат в соответствии со следующими инструкциями и примерами. Для текста и чисел просто введите значение без кавычек. '
							+ 'Для коллекций введите значения разделённые запятыми. Для словарей разделяйте ключи от значений двоеточием, а пары ключ: значение - запятыми.',
			blacklist: 'Следующие термины запрещены в коде.',
			testCaseVisibleMessage: 'Будет ли тест показан студентам.',
			solutionVisibleMessage: 'Будет ли пример решения показан студентам.',
			versionInformationMessage: 'Версия языка: {$1}, Compiler: {$2} v{$3}, Платформа компиляции: {$4} v{$5} ({$6})'
		}, type: {
			1: 'Программирование',
			2: 'Множественный выбор',
			3: 'Свободный текст'
		}, difficulty: {
			1: 'Начинающий',
			2: 'Средний',
			3: 'Продвинутый',
			4: 'Эксперт'
		}

	}, examination: {
		createTemplateTitle: 'Создать экзамен',
		createExecutionTitle: 'Создать исполняемую задачу',
		editTemplateTitle: "Редактировать экзамен '{$1}'",
		editExecutionTitle: "Редактировать исполняемую задачу '{$1}'",
		configureExaminationSubtitle: 'Настроить экзамен',
		configureExecutionSubtitle: 'Настроить исполняемую задачу',
		overviewTitle: "Обзор экзамена '{$1}'",
		selectExercisesSubtitle: 'Выбрать упражнения для экзамена',
		exercisesSubtitle: 'Упражнения на экзамене',
		examineesSubtitle: 'Examinees',
		templateType: 'Экзамен',
		executionType: 'Execution',
		startTimeLabel: 'Start Time',
		endTimeLabel: 'End Time',
		durationLabel: 'Duration',
		durationUnitLabel: 'min',
		examineesLabel: 'Экзаменуемые',
		examineeViewLabel: 'Ссылка для распространения экзаменуемым',
		progressLabel: 'Прогресс',
		totalWeightLabel: 'Общий вес',
		numberOfExamineesLabel: 'Число экзаменуемых',
		numberOfExercisesLabel: 'Число упражнений',
		logEvaluationsLabel: 'Оценки',
		logActivityLabel: 'Действия',
		logDifferenceLabel: 'Символы',
		createExecutionButton: 'создать исполняемую задачу',
		startExecutionButton: 'запустить исполняемую задачу',
		overviewButton: 'обзор экзамена',
		extendDurationButton: 'продлить',
		addExerciseButton: 'добавить упражнение в экзамен',
		addExamineeButton: 'добавить экзаменуемого',
		exportPDFEmptyButton: 'экспортировать в PDF (пустой)',
		exportPDFSolvedButton: 'экспортировать в PDF (с ответами)',
		exportCSVButton: 'экспортировать результаты в CSV',
		cannotEditMessage: 'Запущенная исполняемая задача не может быть отредактирована.',
		templateIsNotValidMessage: 'Этот экзамен не корректен и не может быть сохранён.\nЗаполните все обязательные поля (имя, длительность, упражнения с весами).',
		executionIsNotValidMessage: 'Эта исполняемая задача не корректна и не может быть сохранена.\nЗаполните все обязательные поля (имя, описание, длительность, упражнения с весами).',
		help: {
			progressTitle: 'Прогресс объяснений',
			logOverviewTitle: 'Протоколирование объяснений',
			examinees: 'Если экзаменуемые не выбраны, то экзамен будет публичным. Каждый сможет экзаменироваться.',
			progress: 'Красный: пока не отвечено\nЖёлтый: частично решено\nЗелёный: успешно решено\nСиний: отвечено (нет автоматической / видимой оценки)',
			logOverview: Оценивания: количество оцениваний (сохранить / откомпилировать) за последние {$1} минут(у)\nДействия: Среднее количество действий (нажатий клавиш / щелчков мыши) в секунду\n'
									 + Символы: среднее количество введённых символов в секунду (отрицательное число: больше удалённых символов чем введённых)\nКрасный крестик: Нет активности последние {$2} минут(ы)'
		}

	}, form: {
		notAvailable: '–',
		selectAll: 'всё',
		selectPleaseChoose: 'пожалуйста, выберите опцию',
		textFilter: 'фильтр текста',
		minLength: 'Необходим ввести как минимум {$1} символов.',
		supportsMarkdown: 'Это поле поддерживает Markdown.',
		createdBy: 'создал',
		editedBy: 'редактировал',
		actionAt: 'в',
		createdByLabel: 'Создал',
		editedByLabel: 'Редактировал',
		editedAtLabel: 'Редактировал в ',
		searchButton: 'поиск',
		saveButton: 'сохранить',
		cancelButton: 'отменить',
		deleteButton: 'удалить',
		addButton: 'добавить элемент',
		moveUpButton: 'Переместить упражнение выше',
		moveDownButton: 'Переместить упражнение ниже',
		removeButton: 'удалить элемент',
		togglePanelButton: 'изменить видимость панели',
		previousButton: 'предыдущее',
		nextButton: 'следующее',
		cannotSaveMessage: 'Вы не авторизованы для сохранения этого документа.',
		documentChangedMessage: 'Текущий документ был изменён.\nЕсли вы продолжите, то перезапишите изменения. Возможно, вы предпочтёте перезагрузить документ.',
		noFilterMessage: 'Необходимо указать критерий поиска.',
		noResultsMessage: 'Ничего не найдено.',
		noSelectionMessage: 'Элементы не выбраны.',
		saveSuccessfulMessage: 'Ваш ввод успешно сохранён.'

	}, email: {
		greeting: 'С уважением,',
		footer: 'Progressor - профессор программирования\nБернский университет прикладных наук, кафедра инженерии и информационных технологий\nQuellgasse 21 - CH-2501 Biel/Bienne - Швейцария',
		releaseNotifier: {
			subject: 'Progressor - новые запросы публикации',
			title: 'Оповещение запросов публикации упражнений',
			intro: 'Здравствуйте, {$1}\nУ вас {$2}запросов публикации упражнений.{$3}\nПожалуйста, просмотрите ожидающие запросы публикации.'
		},
		verifyEmail: {
			subject: 'Progressor - проверка почтового адреса',
			title: 'Проверка почтового адреса',
			intro: 'Здравствуйте,  {$1}\nДобро пожаловать в {$2}Progressor - профессор программирования.{$3}\nДля проверки вашего почтового адреса, пожалуйста, перейдите по ссылке.',
			info: 'На странице профиля вы можете ввести ваше {$1}настоящее имя{$2}.\nДля начала использования Progressor-а просто решите упражнение.\nТакже вы можете создать собственные упражнения и поделиться ими с друзьями.',
			motivation: 'Приятного изучения программирования! :-)'
		},
		resetPassword: {
			subject: 'Progressor - сброс пароля',
			title: 'Сброс пароля',
			intro: 'Здравствуйте {$1}\nДля сброса пароля, пожалуйста, перейдите по ссылке и введите новый пароль.'
		}

	}, programmingLanguages: {
		java: {
			name: 'Java',
			description: '(джава / ява) является объектно-ориентированным языко программирования общего назначения, исполняемым виртуальной машиной.'
		}, cpp: {
			name: 'C++',
			description: '(си плюс плюс) является высокоэффективным объектно-ориентированным языком программирования общего назначения. Имеет императивную парадигму, возможность процедурного и элементы функционального программирования, строгую типизацию и возможность обобщённого программирования (шаблоны).'
		}, csharp: {
			name: 'C#',
			description: '(си шарп) является объектно ориентированным  мультипарадигменным (императивный и декларативный) языком программирования общего назначения, имеющим возможность функционального, обобщённого (шаблоны) и компонентно-ориентированного программирования.'
		}, python: {
			name: 'Python',
			description: '(питон) является широко используемым скриптовым (динамическим) языком программирования общего назначения. Его философией является читабельность кода, лаконичность и краткость.'
		}, javascript: {
			name: 'JavaScript',
			description: '(джаваскрипт) является стандартным скриптовым (динамическим) языком программирование Web приложений (и клиентской, и серверной части). Обычно применяется совместно с HTML и CSS.'
		}, php: {
			name: 'PHP',
			description: '(пи аш пи) является широко используемым скриптовым языком программирования серверной части Web приложений. PHP является аббревиатурой Personal Home Page (Персональная домашняя страница),  так же PHP: Hypertext Preprocessor (Пи аш пи: гипертекст процессор).'
		}, kotlin: {
			name: 'Kotlin',
			description: '(назван в честь острова возле Санкт Петербурга) является статически типизированным языком программирования, исполняющимся на виртуальной машине JVM, который так же может быть статически скомпилирован в исходный код JavaScript. Kotlin разработан с учетом эффективного взаимодействия с Java кодом.'
		}, vbnet: {
			name: 'Visual Basic .NET',
			description: '(визуал бейсик дот нэт) является мультипарадигменным высокоуровневым языком программирования, потомком Visual Basic реализованном на базе Microsoft .NET Framework.'
		}, //ruby: {
		// 	name: 'Ruby',
		// 	description: 'is a dynamic, reflective, object-oriented, general-purpose programming language. It was designed and developed in the mid-1990s by Yukihiro "Matz" Matsumoto in Japan.'
		// }, golang: {
		// 	name: 'Go',
		// 	description: 'is a general-purpose, object oriented, compiled programming language that makes it easy to build simple, reliable, and efficient software. It is created by Google to make network and parallel programming simple and efficient at once.'
		// }, swift: {
		// 	name: 'Swift',
		// 	description: 'is a general-purpose, multi-paradigm, compiled programming language created for iOS, OS X, watchOS, tvOS, and Linux developed by Apple Inc.'
		// }, lisp: {
		// 	name: 'Lisp',
		// 	description: 'is a family of computer programming languages with a long history and a distinctive, fully parenthesized prefix notation. Originally specified in 1958, Lisp is the second-oldest high-level programming language in widespread use today.'
		// }, sql: {
		// 	name: 'SQL',
		// 	description: '(Structured Query Language) is a special-purpose programming language designed for managing data held in a relational database management system (RDBMS), or for stream processing in a relational data stream management system (RDSMS).'
		// }
		upcoming: {
			name: 'Ещё',
			description: 'языки программирования могут быть добавлены. Но нам нужны ваши пожелания и помощь. Подключайтесь!'
		}

	}, error: {
		403: {
			name: 'Завпрещено',
			message: 'Недостаточно полномочий для доступа к запрашиваемой странице.'
		}, 404: {
			name: 'Не найдено',
			message: 'Запрашиваемая страница не найдена.'
		},
		notAuthenticated: {
			message: 'Только аутентифицированные  пользователи могут выполнить это действие.'
		},
		notAdmin: {
			message: 'Только администратор может выполнить  это действие.'
		},
		notAuthor: {
			message: 'Только владелец элемента может выполнить это действие.'
		},
		locked: {
			message: 'Этот документ заблокирован.'
		}
	}
});
