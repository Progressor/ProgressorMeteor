Meteor.startup(() => {
  const exercises = {
    helloWorld: {
      type: 1,
      difficulty: 1,
      names: [
        { language: 'en', name: 'Hello, World!' }, // TODO: translate
        { language: 'de', name: 'Hallo, Welt!' },
      ],
      descriptions: [
        { language: 'en', description: 'Return **Hello, World!**.' }, // TODO: translate
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
    },
    string: {
      type: 1,
      difficulty: 2,
      names: [
        { language: 'en', name: 'Alternating Concatenation' }, // TODO: translate
        { language: 'de', name: 'Abwechselnde Verkettung' },
      ],
      descriptions: [
        { language: 'en', description: 'Concatenate the 1st character of the 1st string, then the 1st character of the 2nd string, then the 2nd character of the 1st string, and so on. Add the remaining characters of either string to the end.' }, // TODO: translate
        { language: 'de', description: 'Verkette das erste Zeichen des ersten Texts mit dem ersten Zeichen des zweiten Texts, dann das zweite Zeichen des ersten Texts und so weiter. Füge auch allfällige übrigbleibende Zeichen hinzu.' },
      ],
      functions: [
        {
          name: 'alternate',
          inputNames: ['first', 'second'],
          inputTypes: ['string', 'string'],
          outputNames: ['return'],
          outputTypes: ['string'],
        },
      ],
      testCases: [
        {
          functionName: 'alternate',
          inputValues: ['Hlo ol!', 'el,Wrd'],
          expectedOutputValues: ['Hello, World!'],
          visible: true,
        },
      ],
    },
    array: {
      type: 1,
      difficulty: 2,
      names: [
        { language: 'en', name: 'Swapping Encryption/Decryption' }, // TODO: translate
        { language: 'de', name: 'Ver- & Entschlüsselung durch Vertauschung' },
      ],
      descriptions: [
        { language: 'en', description: 'Swap the first two elements, then the third with the forth and so on to create a simple encryption / decryption algorithm.' }, // TODO: translate
        { language: 'de', description: 'Vertausche zuerst die ersten zwei Elemente, dann das dritte mit dem vierten Element, usw. und implementiere so einen einfachen Algorithmus zur Ver- und Entschlüsselung.' },
      ],
      functions: [
        {
          name: 'swapEncrypt',
          inputNames: ['toSwap', 'length'],
          inputTypes: ['array<char>', 'int32'],
          outputNames: ['return'],
          outputTypes: ['array<char>'],
        },
      ],
      testCases: [
        {
          functionName: 'swapEncrypt',
          inputValues: ['{H,e,l,l,o,_,W,o,r,l,d}', '11'],
          expectedOutputValues: ['{e,H,l,l,_,o,o,W,l,r,d}'],
          visible: true,
        },
        {
          functionName: 'swapEncrypt',
          inputValues: ['{e,H,l,l,_,o,o,W,l,r,d}', '11'],
          expectedOutputValues: ['{H,e,l,l,o,_,W,o,r,l,d}'],
          visible: true,
        },
      ],
    },
    loop: {
      type: 1,
      difficulty: 3,
      names: [
        { language: 'en', name: 'Palindrome' }, // TODO: translate
        { language: 'de', name: 'Palindrom' },
      ],
      descriptions: [
        { language: 'en', description: 'Determine whether a string is a palindrome. (Is the same read forwards and backwards.)\nOnly consider the characters A to Z in both upper- and lowercase and ignore any other symbol.' }, // TODO: translate
        { language: 'de', description: 'Überprüfe, ob ein Text ein Palindrom darstellt. Ein Palindrom ist vor- und rückwärts gelesen der selbe Text.\nBerücksichtige nur die Gross- und Kleinuchstaben A bis Z und ignoriere alle anderen Symbole.' },
      ],
      functions: [
        {
          name: 'isPalindrome',
          inputNames: ['palindrome'],
          inputTypes: ['string'],
          outputNames: ['return'],
          outputTypes: ['bool'],
        },
      ],
      testCases: [
        {
          functionName: 'isPalindrome',
          inputValues: ['Hello, World!'],
          expectedOutputValues: ['false'],
          visible: true,
        },
        {
          functionName: 'isPalindrome',
          inputValues: ['A Santa dog lived as a devil God at NASA.'],
          expectedOutputValues: ['true'],
          visible: true,
        },
      ],
    },
    recursion: {
      type: 1,
      difficulty: 3,
      names: [
        { language: 'en', name: 'Fibonacci' }, // TODO: translate
        { language: 'de', name: 'Fibonacci' },
      ],
      descriptions: [
        { language: 'en', description: 'Calculate a specific position in the Fibonacci sequence. Use a recursive algorithm.' }, // TODO: translate
        { language: 'de', description: 'Berechne eine bestimmte Position in der Fibonacci-Sequenz. Implementiere einen rekursiven Algorithmus.' },
      ],
      functions: [
        {
          name: 'fibonacci',
          inputNames: ['num'],
          inputTypes: ['int32'],
          outputNames: ['return'],
          outputTypes: ['int32'],
        },
      ],
      testCases: [
        {
          functionName: 'fibonacci',
          inputValues: ['0'],
          expectedOutputValues: ['0'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['1'],
          expectedOutputValues: ['1'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['2'],
          expectedOutputValues: ['1'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['3'],
          expectedOutputValues: ['2'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['4'],
          expectedOutputValues: ['3'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['5'],
          expectedOutputValues: ['5'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['6'],
          expectedOutputValues: ['8'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['7'],
          expectedOutputValues: ['13'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['8'],
          expectedOutputValues: ['21'],
          visible: true,
        },
        {
          functionName: 'fibonacci',
          inputValues: ['9'],
          expectedOutputValues: ['34'],
          visible: true,
        },
      ],
    },
  };

  const solutions = {
    helloWorld: {
      java: 'public String helloWorld() { return "Hello, World!"; }',
      cpp: 'string helloWorld() { return "Hello, World!"; }',
      csharp: 'public string helloWorld() => "Hello, World!";',
      python: 'def helloWorld(): return "Hello, World!"',
      javascript: 'function helloWorld() { return "Hello, World!"; }',
      php: 'function helloWorld() : string { return "Hello, World!"; }',
      kotlin: 'fun helloWorld() = "Hello, World!"',
      vbnet: 'Public Function helloWorld() As String\n\tReturn "Hello, World!"\nEnd Function',
    },
    string: {
      java: 'public String alternate(String first, String second) {\n\tString result = "";\n\tint i;\n\tfor (i = 0; i < first.length() && i < second.length(); i++)\n\t\tresult += first.substring(i, i + 1) + second.substring(i, i + 1);\n\tresult += first.substring(i) + second.substring(i);\n\treturn result;\n}',
      cpp: 'string alternate(string first, string second) {\n\tstring result;\n\tint i;\n\tfor (i = 0; i < first.length() && i < second.length(); i++)\n\t\tresult += first.substr(i, 1) + second.substr(i, 1);\n\tresult += first.substr(i) + second.substr(i);\n\treturn result;\n}',
      csharp: 'public string alternate(string first, string second) {\n\tvar result = string.Empty;\n\tint i;\n\tfor (i = 0; i < first.Length && i < second.Length; i++)\n\t\tresult += first[i].ToString() + second[i];\n\tresult += first.Substring(i) + second.Substring(i);\n\treturn result;\n}',
      python: "def alternate(first, second):\n\tresult = ''\n\tI = min(len(first), len(second))\n\tfor i in range(I):\n\t\tresult += first[i] + second[i]\n\tresult += first[I:] + second[I:]\n\treturn result",
      javascript: "function alternate(first, second) {\n\tlet result = '', i\n\tfor (i = 0; i < first.length && i < second.length; i++)\n\t\tresult += first[i] + second[i]\n\tresult += first.substr(i) + second.substr(i)\n\treturn result\n}",
      php: "function alternate(string $first, string $second) : string {\n\t$result = '';\n\tfor ($i = 0; $i < strlen($first) && $i < strlen($second); $i++)\n\t\t$result .= $first[$i] . $second[$i];\n\t$result .= substr($first, $i) . substr($second, $i);\n\treturn $result;\n}",
      kotlin: 'fun alternate(first: String, second: String) : String {\n\tvar result = ""\n\tval I = Math.min(first.length, second.length)\n\tfor (i in 0 .. I - 1)\n\t\tresult += first.substring(i, i + 1) + second.substring(i, i + 1)\n\tresult += first.substring(I) + second.substring(I)\n\treturn result\n}',
      vbnet: 'Public Function alternate(first As String, second As String) As String\n\talternate = String.Empty\n\tDim i As Integer\n\tFor i = 0 To Math.Min(first.Length, second.Length) - 1\n\t\talternate += first(i) + second(i)\n\tNext\n\talternate += first.Substring(i) + second.Substring(i)\nEnd Function',
    },
    array: {
      java: 'public char[] swapEncrypt(char[] toSwap, int length) {\n\tfor (int i = 0; i + 1 < length; i += 2) {\n\t\tchar tmp = toSwap[i];\n\t\ttoSwap[i] = toSwap[i + 1];\n\t\ttoSwap[i + 1] = tmp;\n\t}\n\treturn toSwap;\n}',
      cpp: 'char *swapEncrypt(char *toSwap, int length) {\n\tfor (int i = 0; i + 1 < length; i += 2) {\n\t\tchar tmp = toSwap[i];\n\t\ttoSwap[i] = toSwap[i + 1];\n\t\ttoSwap[i + 1] = tmp;\n\t}\n\treturn toSwap;\n}',
      csharp: 'public char[] swapEncrypt(char[] toSwap, int length) {\n\tfor (var i = 0; i + 1 < length; i += 2) {\n\t\tvar tmp = toSwap[i];\n\t\ttoSwap[i] = toSwap[i + 1];\n\t\ttoSwap[i + 1] = tmp;\n\t}\n\treturn toSwap;\n}',
      python: 'def swapEncrypt(toSwap, length):\n\tfor i in range(0, length - 1, 2):\n\t\ttoSwap[i], toSwap[i + 1] = toSwap[i + 1], toSwap[i]\n\treturn toSwap',
      javascript: 'function swapEncrypt(toSwap, length) {\n\tfor (let i = 0, tmp; i + 1 < length; i += 2) {\n\t\ttmp = toSwap[i]\n\t\ttoSwap[i] = toSwap[i + 1]\n\t\ttoSwap[i + 1] = tmp\n\t}\n\treturn toSwap\n}',
      php: 'function swapEncrypt(array $toSwap, int $length) : array {\n\tfor ($i = 0, $tmp; $i + 1 < $length; $i += 2) {\n\t\t$tmp = $toSwap[$i];\n\t\t$toSwap[$i] = $toSwap[$i + 1];\n\t\t$toSwap[$i + 1] = $tmp;\n\t}\n\treturn $toSwap;\n}',
      kotlin: 'fun swapEncrypt(toSwap: CharArray, length: Int) : CharArray {\n\tfor (i in 0 .. length - 2 step 2) {\n\t\tval tmp = toSwap[i]\n\t\ttoSwap[i] = toSwap[i + 1]\n\t\ttoSwap[i + 1] = tmp\n\t}\n\treturn toSwap\n}',
      vbnet: 'Public Function swapEncrypt(toSwap As Char(), length As Integer) As Char()\n\tFor i = 0 to length - 2 Step 2\n\t\tDim tmp = toSwap(i)\n\t\ttoSwap(i) = toSwap(i + 1)\n\t\ttoSwap(i + 1) = tmp\n\tNext\n\tReturn toSwap\nEnd Function',
    },
    loop: {
      java: 'public boolean isPalindrome(String palindrome) {\n\tString clean = Pattern.compile("[^A-Za-z]").matcher(palindrome).replaceAll("").toLowerCase();\n\tfor (int i = 0, j = clean.length() - 1; i < j; i++, j--)\n\t\tif (clean.charAt(i) != clean.charAt(j)) return false;\n\treturn true;\n}',
      cpp: 'bool isPalindrome(string palindrome) {\n\tstring clean = regex_replace(palindrome, regex("[^A-Za-z]"), "", regex_constants::format_default);\n\ttransform(clean.begin(), clean.end(), clean.begin(), ::tolower);\n\tfor (int i = 0, j = clean.length() - 1; i < j; i++, j--)\n\t\tif (clean[i] != clean[j]) return false;\n\treturn true;\n}',
      csharp: 'public bool isPalindrome(string palindrome) {\n\tvar clear = Regex.Replace(palindrome, "[^A-Za-z]", "").ToLower();\n\tfor (int i = 0, j = clear.Length - 1; i < j; i++, j--)\n\t\tif (clear[i] != clear[j]) return false;\n\treturn true;\n}',
      python: "def isPalindrome(palindrome):\n\tclean = re.sub('[^A-Za-z]', '', palindrome).lower()\n\ti = 0; j = len(clean) - 1\n\twhile i < j:\n\t\tif (clean[i] != clean[j]): return False\n\t\ti += 1; j -= 1\n\treturn True",
      javascript: "function isPalindrome(palindrome) {\n\tvar clean = palindrome.replace(/[^A-Za-z]/g, '').toLowerCase()\n\tfor (var i = 0, j = clean.length - 1; i < j; i++ , j--)\n\t\tif (clean[i] !== clean[j]) return false\n\treturn true\n}",
      php: "function isPalindrome(string $palindrome) : bool {\n\t$clean = strtolower(preg_replace('/[^A-Za-z]/', '', $palindrome));\n\tfor ($i = 0, $j = strlen($clean) - 1; $i < $j; $i++ , $j--);\n\t\tif ($clean[$i] !== $clean[$j]) return false;\n\treturn true;\n}",
      kotlin: 'fun isPalindrome(palindrome: String) : Boolean {\n\tval clean = java.util.regex.Pattern.compile("[^A-Za-z]").matcher(palindrome).replaceAll("").toLowerCase()\n\tvar i = 0; var j = clean.length - 1\n\twhile (i < j) {\n\t\tif (clean[i] != clean[j]) return false\n\t\ti++; j--\n\t}\n\treturn true\n}',
      vbnet: 'Public Function isPalindrome(palindrome As String) As Boolean\n\tDim clear = Regex.Replace(palindrome, "[^A-Za-z]", "").ToLower()\n\tDim i = 0, j = clear.Length - 1\n\tWhile i < j\n\t\tIf clear(i) <> clear(j) Then Return False\n\t\ti += 1 : j -= 1\n\tEnd While\n\tReturn True\nEnd Function',
    },
    recursion: {
      java: 'public int fibonacci(int num) {\n\tif (num < 1) return 0;\n\tif (num == 1) return 1;\n\treturn fibonacci(num - 2) + fibonacci(num - 1);\n}',
      cpp: 'int fibonacci(int num) {\n\tif (num < 1) return 0;\n\tif (num == 1) return 1;\n\treturn fibonacci(num - 2) + fibonacci(num - 1);\n}',
      csharp: 'public int fibonacci(int num) {\n\tif (num < 1) return 0;\n\tif (num == 1) return 1;\n\treturn fibonacci(num - 2) + fibonacci(num - 1);\n}',
      python: 'def fibonacci(num):\n\tif (num < 1): return 0\n\tif (num == 1): return 1\n\treturn fibonacci(num - 2) + fibonacci(num - 1)',
      javascript: 'function fibonacci(num) {\n\tif (num < 1) return 0\n\tif (num === 1) return 1\n\treturn fibonacci(num - 2) + fibonacci(num - 1)\n}',
      php: 'function fibonacci(int $num) : int {\n\tif ($num < 1) return 0;\n\tif ($num === 1) return 1;\n\treturn fibonacci($num - 2) + fibonacci($num - 1);\n}',
      kotlin: 'fun fibonacci(num: Int) : Int {\n\tif (num < 1) return 0\n\tif (num == 1) return 1\n\treturn fibonacci(num - 2) + fibonacci(num - 1)\n}',
      vbnet: 'Public Function fibonacci(num As Integer) As Integer\n\tIf num < 1 Then Return 0\n\tIf num = 1 Then Return 1\n\tReturn fibonacci(num - 2) + fibonacci(num - 1)\nEnd Function',
    },
  };

  _.each(Progressor.getProgrammingLanguages(), language => {
    if (!Progressor.categories.find({ programmingLanguage: language._id, private: true }).count()) {
      Progressor.categories.insert({
        programmingLanguage: language._id,
        private: true,
        lastEdited: new Date(),
      });
    }

    if (!Progressor.categories.find({ programmingLanguage: language._id, example: true }).count()) {
      Progressor.categories.insert({
        programmingLanguage: language._id,
        example: true,
        names: [
          { language: 'en', name: 'Basics' }, // TODO: translate
          { language: 'de', name: 'Grundlagen' },
        ],
        descriptions: [
          { language: 'en', description: 'The basic syntax of a programming language is best shown by means of a few simple exercises.' }, // TODO: translate
          { language: 'de', description: 'Die Grundlagen einer Programmiersprache werden am besten mit einigen einfachen Aufgaben gezeigt.' },
        ],
        lastEdited: new Date(),
      });
    }

    _.each(exercises, (exercise, exerciseId) => {
      if (!Progressor.exercises.find({ programmingLanguage: language._id, example: exerciseId }).count()) {
        Progressor.exercises.insert(_.extend({
          programmingLanguage: language._id,
          category_id: Progressor.categories.findOne({ programmingLanguage: language._id, example: true })._id,
          example: exerciseId,
          solution: solutions[exerciseId][language._id],
          solutionVisible: true,
          released: {
            requested: new Date(),
            confirmed: new Date(),
          },
          lastEdited: new Date(),
        }, exercise));
      }
    });
  });

  if (!Progressor.examinations.find().count()) {
    Progressor.examinations.insert({
      example: true,
      names: [
        { language: 'en', name: 'Basics' }, // TODO: translate
        { language: 'de', name: 'Grundlagen' },
      ],
      exercises: _.map(Progressor.exercises.find({ example: { $exists: true } }).fetch(), exercise => ({
        exercise_id: exercise._id,
        weight: Math.floor((Random.fraction() * 12) + 1),
      })),
      durationMinutes: 365 * 24 * 60,
      lastEdited: new Date(),
    });

    _.each(Progressor.examinations.find({ example: true }).fetch(), e => Progressor.executions.insert({
      _id: 'Xh3YGewf9JT5AGoav',
      examination_id: e._id,
      example: true,
      names: [
        { language: 'en', name: `Basics - ${new Date().getFullYear()}` }, // TODO: translate
        { language: 'de', name: `Grundlagen - ${new Date().getFullYear()}` },
      ],
      descriptions: [
        { language: 'en', description: 'The basic syntax of a programming language is best shown by means of a few simple exercises.' }, // TODO: translate
        { language: 'de', description: 'Die Grundlagen einer Programmiersprache werden am besten mit einigen einfachen Aufgaben gezeigt.' },
      ],
      startTime: new Date(new Date().getFullYear(), 0, 1),
      durationMinutes: e.durationMinutes,
      exercises: _.chain(e.exercises).map(exercise => ({
        weight: exercise.weight,
        base_id: exercise.exercise_id,
        exercise_id: Progressor.exercises.insert(_.extend(_.omit(Progressor.exercises.findOne({ _id: exercise.exercise_id }), '_id', 'category_id', 'difficulty', 'released', 'archived'), {
          execution_id: 'Xh3YGewf9JT5AGoav',
        })),
      })).sortBy(() => Random.fraction()).value(),
      lastEdited: new Date(),
    }));
  }
});
