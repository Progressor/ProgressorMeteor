
// Should we change "caso de prueba" for "prueba"?
// There are some problems in the translation with the singular and plural mode
// ? -> I ´m sure if the translation is good

i18n.map('es', {
  layout: {
    // title: 'Progressor',
    // logo: '<{Progressor}>',
    // explanation: 'The Programming Professor',
    homeTitle: 'Incio',
    programmingLanguagesTitle: 'Lenguajes de programación',
    // adminTitle
    // mongoDBAdminTitle
    toggleNavigationButton: 'Abrir/Cerrar navigación',
    unexpectedErrorMessage: 'Un error inesperado ocurrió.\n{$1}',
  },
  account: {
    title: 'Mi cuenta',
    loginTitle: 'Iniciar sesión',
    solvedExercisesSubtitle: 'Ejercicios resultos', // Mis ?
    createdExercisesSubtitle: 'Ejercicios creados', // Mis ?
    createdExaminationsSubtitle: 'Exámenes creados', // Mis ?
    createdExecutionSubtitle: 'Exámenes realizados', // Mis ?
    archiveSubtitle: 'Mi archivo',
    accountSettingsSubtitle: 'Configuración de la cuenta',
    adminSettingsSubtitle: 'Configuración de la cuenta del Administrator',
    emailLabel: 'Email',
    nameLabel: 'Nombre verdadero',
    makeAdminLabel: 'Autorizar usuario',
    archiveButton: 'Archivo',
    unarchiveButton: 'Restablecer archivo',
    loginButton: 'Iniciar sesión',
    registerButton: 'Registrarse',
    logoutButton: 'Cerrar sesión',
    logoutOtherClientsButton: 'Cerrar la sesión de otros usuarios',
    makeAdminButton: 'Otorgar derechos de administrador',
    isAdminMessage: 'Eres un administrador autorizado.', // autorizado sounds a little weird
    verificationSuccessMessage: 'La dirección electrónica fue verificada exitosamente.\nLa sesión fue iniciada automaticamente.', // ?
    verificationErrorMessage: 'La verificación de la dirección electrónica falló.\nPor favor trate de nuevo.', // ?
    passwordResetSuccessMessage: 'La contraseña fue restablecida exitosamente.',
    passwordMismatchMessage: 'Las contraseñas no coinciden.',
    passwordResetErrorMessage: 'El restablecimiento de la contraseña falló.\nPor favor trate de nuevo; es posible que desee solitar un nuevo link.',
  },
  category: {
    createTitle: 'Creé una categoría',
    editTitle: "Edite la categoría '{$1}'",
    editBreadcrumb: 'Edite la categoría',
    createButton: 'creé una categoría',
    editButton: 'edite la categoría',
    isNotValidMessage: 'Esta categoría no es válida y por lo tanto no se puedo guardar.\nRellene todo los campos requeridos (idioma, nombre(s), descripción).',
  },
  exercise: {
    title: 'Ejercicio',
    searchTitle: '{$1} Ejercicios',
    createTitle: 'Creé un ejercicio',
    editTitle: "Edite el ejercicio '{$1}'",
    releaseTitle: 'Entregue el ejercicio',
    searchSubtitle: 'Busqueda',
    exerciseSubtitle: 'Problema',
    categoryDescriptionSubtitle: 'Instructiones para los {$1} ejercicios',
    functionsSubtitle: 'Funciones',
    testCasesSubtitle: 'Casos de prueba',
    solutionSubtitle: 'Solución',
    optionsSubtitle: 'Opciones',
    releaseRequestedSubtitle: 'Entrega solicitada',
    releasedSubtitle: 'Entrega confirmada',
    editBreadcrumb: 'Edite el ejercicio',
    exercise: 'ejercicio',
    exercises: 'ejercicios',
    upcoming: 'próximamante...', // ?
    nameLabel: 'Nombre',
    descriptionLabel: 'Descripción',
    typeLabel: 'Tipo',
    typeToCreateLabel: 'Tipo the ejercicio para crear', // ?
    programmingLanguageLabel: 'Lenguaje de programación',
    categoryLabel: 'Categoría',
    difficultyLabel: 'Dificultad',
    codeFragmentLabel: 'Solución del código', // ?
    templateFragmentLabel: 'Plantilla del código', // ?
    solutionFragmentLabel: 'Ejemplo de la solución del código', // ?
    solvedLabel: 'Resuelto',
    answerLabel: 'Tu respuesta',
    solutionPatternLabel: 'Solución del Pattern (RegExp)', // ?
    solutionLabel: 'Solución',
    codeMirrorThemeLabel: 'Editor del tema', // ?
    releaseRequestedAtLabel: 'Entraga solicitada a las', // ? a las or a la
    releaseRequestNotifiedAtLabel: 'Notificado a las', // ? a las or a la
    releasedByLabel: 'Entrega confirmada por',
    releasedAtLabel: 'Entrega confirmada a las', // ? a las or a la
    multipleSolutionsLabel: 'Permitir varias respuestas',
    weightLabel: 'Peso',
    showSolutionLabel: 'Mostrar ejemplos de soluciones',
    showReleasedLabel: 'Mostrar ejercicios entregados',
    showUnreleasedLabel: 'Mostrar ejercicios privados',
    blacklistLabel: 'Lista negra',
    editButton: 'editar ejercicio',
    duplicateButton: 'duplicar',
    releaseRequestButton: 'solicitar entrega',
    releaseButton: 'entrega',
    unreleaseButton: 'esconder',
    executeTestsButton: 'ejecutar casos de prueba',
    saveAnswerButton: 'guardar respuesta',
    showSolutionButton: 'mostrar ejemplos de soluciones',
    closeButton: 'Cerrar',
    blacklistMatchMessage: 'Falló la validación, término ilegal: {$1}',
    releasedMessage: 'EL ejercicio ha sido entregado.',
    releaseRequestedMessage: 'Solicitud pedida para entregar este ejercicio.',
    successMessage: 'El ejercicio fue resuelto correctamente.',
    failureMessage: 'El ejercicio no fue resuelto correctamente.',
    unevaluatedMessage: 'Este ejercicio tiene que ser evaluado manualmente.',
    executionSuccessMessage: 'Todos los casos de prueba fueron ejecutados correctamente.',
    executionFailureMessage: 'No todos los casos de prueba fueron ejecutados correctamente.',
    changedMessage: 'Este ejercicio ha sido modificado en comparación con la última vez que lo resolviste.\nTú prodrías ver la nueva version.', // ?
    isNotValidMessage: 'Este ejercicio no es válido y no puede ser guardado.\nRellene todo los campos requeridos (lenguaje, categoría, dificultad, nombre(s), descripción(s), function(s), casos de prueba(s)).\n'
    + 'Si quieres entregar un ejercicio, asegúrate de no haber seleccionado tu categoría privada.\nControlla si los valores introducidos son correctos.',
    isNotTestedMessage: 'Este ejercicio no puede ser publicado porque todavía no se a controlado.',
    function: {
      nameLabel: 'Nombre de la función',
      namePlaceholder: 'nombre de la función',
      returnTypeLabel: 'Tipo de retorno', // ?
      returnTypePlaceholder: 'tipo de retorno', // ?
      parameterNameLabel: 'Nombre del parámetro',
      parameterNamePlaceholder: 'nombre del parámetro',
      parameterTypeLabel: 'Tipo de parámetro',
      parameterTypePlaceholder: 'tipo de parámetro',
    },
    testCase: {
      // success
      others: 'otro caso de prueba', // is it better to use "Prueba" instead of "caso de prueba", the last one sounds weird for me
      descriptionLabel: 'caso de prueba',
      functionLabel: 'Función',
      inputLabel: 'Argumentos',
      expectedOutputLabel: 'Tipo de retorno esperado', // ?
      visibleLabel: 'Visible',
      resultLabel: 'Resultado actual / Error',
      successMessage: 'Este caso de prueba fue ejecutado correctamente.',
      failureMessage: 'Este caso de prueba no pudo ser ejecutado correctamente.',
    },
    option: {
      descriptionLabel: 'Descripción',
      correctLabel: 'Correcto/a',
      wrongLabel: 'Falso/a',
    },
    help: {
      title: 'Instrucciones',
      showButton: 'Mostrar instrucciones',
      types: 'Para los tipos, por favor introduzca uno de los siguientes valores. The type parameters can themselves be replaced by a type.', // I do not understand the las sentence!
      values: 'Para los valores, por favor introduzca un formato válido según las siguientes instrucciones y ejemplos. Para texto y números, simplemente entre el valor sin comillas. '
      + 'Para Collecciones, entre los valores separados por comas. Para Mapas, separe las llaves de los valores con dos puntos y los diferentes pares con comas.',
      blacklist: 'Los siguientes términos están prohibidos y no pueden aparcer en el código.', // ?
      testCaseVisibleMessage: 'El caso de prueba se mostrará o no a los estudiantes.',
      solutionVisibleMessage: 'Las soluciones de los casos de prueba se les mostrará o no a los estudiantes.',
      versionInformationMessage: 'Version del Lenguaje: {$1}, Compiler: {$2} v{$3}, Compilation Platform: {$4} v{$5} ({$6})',
    },
    type: {
      1: 'Programar',
      2: 'Selección Múltiple',
      3: 'Texto Libre',
    },
    difficulty: {
      1: 'Principiante',
      2: 'Intermedio',
      3: 'Avanzado',
      4: 'Experto',
    },
  },
  examination: {
    createTemplateTitle: 'Crear Examen',
    createExecutionTitle: 'Crear Ejecución',
    editTemplateTitle: "Editar Examen '{$1}'",
    editExecutionTitle: "Editar Ejecución '{$1}'",
    configureExaminationSubtitle: 'Configurar Examen',
    configureExecutionSubtitle: 'Configurar Ejecución',
    overviewTitle: "Resumen del Examen '{$1}'",
    selectExercisesSubtitle: 'Seleccionar ejercicos para el examen',
    exercisesSubtitle: 'Ejercicios del examen',
    examineesSubtitle: 'Examinados',
    templateType: 'Examen',
    executionType: 'Ejecución',
    startTimeLabel: 'Hora de inicio',
    endTimeLabel: 'Hora de finalización',
    durationLabel: 'Duración',
    // durationUnitLabel
    examineesLabel: 'Examinados',
    examineeViewLabel: 'Link para distribuirlo a los examinados',
    progressLabel: 'Progreso',
    totalWeightLabel: 'Peso total',
    numberOfExamineesLabel: 'Número de examinados',
    numberOfExercisesLabel: 'Número de ejercicios',
    logEvaluationsLabel: 'Evaluaciones',
    logActivityLabel: 'Actiones',
    logDifferenceLabel: 'Caracteres',
    createExecutionButton: 'Crear ejecución',
    startExecutionButton: 'Iniciar ejecución',
    overviewButton: 'resumen del Examen',
    extendDurationButton: 'prolongar duración',
    addExerciseButton: 'Añadir ejercio al examen',
    addExamineeButton: 'Añadir participante al examen',
    exportPDFEmptyButton: 'Exportar PDF (vacio)',
    exportPDFSolvedButton: 'Exportar PDF (incl. respuestas)',
    exportCSVButton: 'Exportar resultados en CSV',
    cannotEditMessage: 'No puedes modificar una ejecución que ha sido inicializada.', // ?
    templateIsNotValidMessage: 'El examen no es válido y no se puede guardar.\nRellene todo los campos requeridos (nombre(s), duración, ejercicios incl. peso).',
    executionIsNotValidMessage: 'Esta ejecución no es válida y no se puede guardar.\nRellene todo los campos requeridos (nombre(s), descripción(s), duración, ejercicios incl. peso).',
    help: {
      progressTitle: 'Progress Explicaciones',
      logOverviewTitle: 'Iniciar Sesión Explicaciones',
      examinees: 'Si no se seleccionan participantes para el examen, entonces será público. Cualquier persona podrá hacer en el examen.',
      progress: 'Rojo: Todavía no ha sido contestado\nAmarillo: Parcialmente solicionado\nVerde: Exitosamente solucionado\nAzul: Contestado (no hay ninguna ninguna corrección automática visible)', // ?
      logOverview: 'Evaluaciones: Número de evaluaciones (guardar / compilar) en el/los último/s {$1} minuto(s)\nAcciones: Promedio de acciones (key stroke / mouse click) por segundo\n'
      + 'Caracteres: Promedio de caracteres introducidos por segundo (número negativo: más caracteres borrados que introducidos)\nCruz roja: No ha habido actividad al menos durante {$2} minute(s)',
    },
  },
  form: {
    // notAvailable
    selectAll: 'todo',
    selectPleaseChoose: 'por favor seleccione una opción',
    textFilter: 'Filtrar texto',
    minLength: 'Tienes que introducir al menos {$1} caracteres.',
    supportsMarkdown: 'Este campo es compatible con Markdown.',
    createdBy: 'creado por',
    editedBy: 'editado la última vez por',
    actionAt: 'at',
    createdByLabel: 'Creado Por',
    editedByLabel: 'Editado la última vez por',
    editedAtLabel: 'editado la última vez a la/s',
    searchButton: 'buscar',
    saveButton: 'guardar',
    cancelButton: 'cancelar',
    deleteButton: 'borrar',
    addButton: 'añadir un nuevo elemento',
    moveUpButton: 'Mueve el ejercicio hacia arriba',
    moveDownButton: 'Mueve el ejercicio hacia abajo',
    removeButton: 'borra este elemento',
    togglePanelButton: 'Cambiar la visibilidad del panel', // ?
    previousButton: 'anterior',
    nextButton: 'próximo',
    cannotSaveMessage: 'No estás autorisado a guardar este documento.',
    documentChangedMessage: 'El documento ha sido modificado.\nSi continuas, sobreescribiras las modificaciones hechas. Deseas recargarlo en vez de eso.',
    noFilterMessage: 'Tienes que especificar el menos un criterio de búsqueda.',
    noResultsMessage: 'No se encontraron resultados.',
    noSelectionMessage: 'No ha selecionado ningún elemento.',
    saveSuccessfulMessage: 'Sus datos se han guardado exitosamente',
  },
  email: {
    greeting: 'Atentamente,',
    footer: 'Progressor - El profesor de programación\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Suiza',
    releaseNotifier: {
      subject: 'Progressor - Nuevas solicitudes para la liberación de ejercicios', // ? is "ejercicios and liberación" correct
      title: 'Nuevas solicitudes para la liberación de ejercicios',
      intro: 'Hola {$1}\nTienes {$2} nuevas solicitudes para la liberación de ejercicios.{$3}\nPor favor revise las solicitudes pendientes de liberación.',
    },
    verifyEmail: {
      subject: 'Progressor - Verification de Email',
      title: 'Verification de Email',
      intro: 'Hello {$1}\nBienvenido a {$2}Progressor - El profesor de programación.{$3}\nPara verificar to dirección de email, por favor haga click en el siguiente link.',
      info: 'También puedes especificar tu {$1}verdadero nombre{$2} en la página de tu profil.\nPara comenzar a usar Progressor, simplemente resuelve uno de los ejercicios existentes.\nEn Progressor también puedes crear tus propios ejercicios privados y compartirlos con tus amigos.', // ? página de tu profil
      motivation: 'Diviértete aprendiendo a programar! :-)',
    },
    resetPassword: {
      subject: 'Progressor - Restablecer Contraseña',
      title: 'Restablecer Contraseña',
      intro: 'Hola {$1}\nPara restablecer la contraseña, por favor haga click en el siguiente link y a continuación introduzca su nueva contraseña.',
    },
  },
  programmingLanguages: {
    java: {
      // name
      // description
    },
    cpp: {
      // name
      // description
    },
    csharp: {
      // name
      // description
    },
    python: {
      // name
      // description
    },
    javascript: {
      // name
      // description
    },
    php: {
      // name
      // description
    },
    kotlin: {
      // name
      // description
    },
    vbnet: {
      // name
      // description
    },
    upcoming: {
      name: 'Más',
      description: 'Otros idiomas de programación pueden ser agregados. Necesitamos sus peticiones y apoyo. Involúcrate!', // ?
    },
  },
  error: {
    403: {
      // name
      message: 'No tienes permisos para acceder a la página solicitada.',
    },
    404: {
      // name
      message: 'La página solicitada no se pudo encontrar.',
    },
    notAuthenticated: {
      message: 'Tienes que iniciar sesión para realizar esta acción.',
    },
    notAdmin: {
      message: 'Es necesario tener derechos de administrador para realizar esta acción.',
    },
    notAuthor: {
      message: 'Es necesario ser el propietario del elemento para realizar esta acción.',
    },
    locked: {
      message: 'Este documento está bloqueado.',
    },
  },
});

const monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
const monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

moment.defineLocale('es', {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort(m, format) {
    if (/-MMM-/.test(format)) {
      return monthsShort[m.month()];
    } else {
      return monthsShortDot[m.month()];
    }
  },
  monthsParseExact: true,
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY H:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
  },
  calendar: {
    sameDay() {
      return `[hoy a la${(this.hours() !== 1) ? 's' : ''}] LT`;
    },
    nextDay() {
      return `[mañana a la${(this.hours() !== 1) ? 's' : ''}] LT`;
    },
    nextWeek() {
      return `dddd [a la${(this.hours() !== 1) ? 's' : ''}] LT`;
    },
    lastDay() {
      return `[ayer a la${(this.hours() !== 1) ? 's' : ''}] LT`;
    },
    lastWeek() {
      return `[el] dddd [pasado a la${(this.hours() !== 1) ? 's' : ''}] LT`;
    },
    sameElse: 'L',
  },
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años',
  },
  ordinalParse: /\d{1,2}º/,
  ordinal: '%dº',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
