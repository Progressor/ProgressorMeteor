(function () {
	'use strict';

	const languages = ['java', 'cpp', 'csharp', 'kotlin'];

	const exercise = {
		functions: [
			{ name: 'helloWorld', inputNames: [], inputTypes: [], outputNames: ['return'], outputTypes: ['string'] },
			{ name: 'sumInt32Array', inputNames: ['a', 'l'], inputTypes: ['array<int32>', 'int32'], outputNames: ['return'], outputTypes: ['int32'] },
			{ name: 'getMapEntry', inputNames: ['m', 'k'], inputTypes: ['map<int32,string>', 'int32'], outputNames: ['return'], outputTypes: ['string'] }
		],
		testCases: [
			{ functionName: 'helloWorld', inputValues: [], expectedOutputValues: ['Hello, World!'] },
			{ functionName: 'sumInt32Array', inputValues: ['', '0'], expectedOutputValues: ['0'] },
			{ functionName: 'sumInt32Array', inputValues: ['0', '1'], expectedOutputValues: ['0'] },
			{ functionName: 'sumInt32Array', inputValues: ['2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97', '25'], expectedOutputValues: ['1060'] },
			{ functionName: 'sumInt32Array', inputValues: ['1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765,10946,17711,28657,46368,75025,121393,196418,317811,514229', '28'], expectedOutputValues: ['1346267'] },
			{ functionName: 'getMapEntry', inputValues: ['1:strut1', '1'], expectedOutputValues: ['strut1'] },
			{ functionName: 'getMapEntry', inputValues: ['1:strut1,2:touwm1,3:weidj1', '2'], expectedOutputValues: ['touwm1'] },
			{ functionName: 'getMapEntry', inputValues: ['2:touwm1,3:weidj1,1:strut1', '3'], expectedOutputValues: ['weidj1'] }
		]
	};

	const fragments = {
		java: 'public String helloWorld() { return "Hello, World!"; } public int sumInt32Array(int[] a, int l) { return Arrays.stream(a).sum(); } public String getMapEntry(Map<Integer, String> m, int k) { return m.get(k); }',
		kotlin: 'fun helloWorld() = "Hello, World!"; fun sumInt32Array(a: Array<Int>, l: Int) = a.sum(); fun getMapEntry(m: Map<Int, String>, k: Int) = m[k]',
		cpp: 'string helloWorld() { return "Hello, World!"; } int32_t sumInt32Array(int32_t* a, int32_t l) { int32_t s = 0; for (int i = 0; i < l; i++) s += a[i]; return s; } string getMapEntry(map<int32_t, string> m, int k) { return m[k]; }',
		csharp: 'public string helloWorld() => "Hello, World!"; public int sumInt32Array(int[] a, int l) => a.Sum(); public string getMapEntry(Dictionary<int, string> d, int k) => d[k];'
	};

	meteorDown.init(Meteor => {

		const language = languages[Math.floor(Math.random() * languages.length)];

		Meteor.call('getBlacklist', language, (error, result) => {

			if (error) {
				console.log('error in getBlacklist: ' + error);
				Meteor.kill();
			}

			(function getFragment(idx) {
				Meteor.call('getFragment', language, exercise, (error, result) => {

					if (error) {
						console.log('error in getFragment: ' + error);
						Meteor.kill();
					}

					if (idx < 5)
						getFragment(idx + 1);
					else
						(function execute(idx) {
							Meteor.call('execute', language, exercise, fragments[language], (error, result) => {

								if (error) {
									console.log('error in execute: ' + error);
									Meteor.kill();
								}

								if (idx < 15)
									execute(idx + 1);
								else
									Meteor.kill();
							});
						})(0);
				});
			})(0);
		});
	});

	meteorDown.run(
		{
			concurrency: 75,
			url: 'http://localhost:3000/'
		});

})();
