//
// Autogenerated by Thrift Compiler (0.9.3)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
thrift = Npm.require('thrift');
Thrift = thrift.Thrift;
Q = thrift.Q;

ttypes = {};
VersionInformation = ttypes.VersionInformation = function (args) {
	this.languageVersion = null;
	this.compilerName = null;
	this.compilerVersion = null;
	this.platformName = null;
	this.platformVersion = null;
	this.platformArchitecture = null;
	if (args) {
		if (args.languageVersion !== undefined && args.languageVersion !== null) {
			this.languageVersion = args.languageVersion;
		}
		if (args.compilerName !== undefined && args.compilerName !== null) {
			this.compilerName = args.compilerName;
		}
		if (args.compilerVersion !== undefined && args.compilerVersion !== null) {
			this.compilerVersion = args.compilerVersion;
		}
		if (args.platformName !== undefined && args.platformName !== null) {
			this.platformName = args.platformName;
		}
		if (args.platformVersion !== undefined && args.platformVersion !== null) {
			this.platformVersion = args.platformVersion;
		}
		if (args.platformArchitecture !== undefined && args.platformArchitecture !== null) {
			this.platformArchitecture = args.platformArchitecture;
		}
	}
};
VersionInformation.prototype = {};
VersionInformation.prototype.read = function (input) {
	input.readStructBegin();
	while (true) {
		var ret = input.readFieldBegin();
		var fname = ret.fname;
		var ftype = ret.ftype;
		var fid = ret.fid;
		if (ftype == Thrift.Type.STOP) {
			break;
		}
		switch (fid) {
			case 1:
				if (ftype == Thrift.Type.STRING) {
					this.languageVersion = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 2:
				if (ftype == Thrift.Type.STRING) {
					this.compilerName = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 3:
				if (ftype == Thrift.Type.STRING) {
					this.compilerVersion = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 4:
				if (ftype == Thrift.Type.STRING) {
					this.platformName = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 5:
				if (ftype == Thrift.Type.STRING) {
					this.platformVersion = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 6:
				if (ftype == Thrift.Type.STRING) {
					this.platformArchitecture = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			default:
				input.skip(ftype);
		}
		input.readFieldEnd();
	}
	input.readStructEnd();
	return;
};

VersionInformation.prototype.write = function (output) {
	output.writeStructBegin('VersionInformation');
	if (this.languageVersion !== null && this.languageVersion !== undefined) {
		output.writeFieldBegin('languageVersion', Thrift.Type.STRING, 1);
		output.writeString(this.languageVersion);
		output.writeFieldEnd();
	}
	if (this.compilerName !== null && this.compilerName !== undefined) {
		output.writeFieldBegin('compilerName', Thrift.Type.STRING, 2);
		output.writeString(this.compilerName);
		output.writeFieldEnd();
	}
	if (this.compilerVersion !== null && this.compilerVersion !== undefined) {
		output.writeFieldBegin('compilerVersion', Thrift.Type.STRING, 3);
		output.writeString(this.compilerVersion);
		output.writeFieldEnd();
	}
	if (this.platformName !== null && this.platformName !== undefined) {
		output.writeFieldBegin('platformName', Thrift.Type.STRING, 4);
		output.writeString(this.platformName);
		output.writeFieldEnd();
	}
	if (this.platformVersion !== null && this.platformVersion !== undefined) {
		output.writeFieldBegin('platformVersion', Thrift.Type.STRING, 5);
		output.writeString(this.platformVersion);
		output.writeFieldEnd();
	}
	if (this.platformArchitecture !== null && this.platformArchitecture !== undefined) {
		output.writeFieldBegin('platformArchitecture', Thrift.Type.STRING, 6);
		output.writeString(this.platformArchitecture);
		output.writeFieldEnd();
	}
	output.writeFieldStop();
	output.writeStructEnd();
	return;
};

FunctionSignature = ttypes.FunctionSignature = function (args) {
	this.name = null;
	this.inputNames = null;
	this.inputTypes = null;
	this.outputNames = null;
	this.outputTypes = null;
	if (args) {
		if (args.name !== undefined && args.name !== null) {
			this.name = args.name;
		}
		if (args.inputNames !== undefined && args.inputNames !== null) {
			this.inputNames = Thrift.copyList(args.inputNames, [null]);
		}
		if (args.inputTypes !== undefined && args.inputTypes !== null) {
			this.inputTypes = Thrift.copyList(args.inputTypes, [null]);
		}
		if (args.outputNames !== undefined && args.outputNames !== null) {
			this.outputNames = Thrift.copyList(args.outputNames, [null]);
		}
		if (args.outputTypes !== undefined && args.outputTypes !== null) {
			this.outputTypes = Thrift.copyList(args.outputTypes, [null]);
		}
	}
};
FunctionSignature.prototype = {};
FunctionSignature.prototype.read = function (input) {
	input.readStructBegin();
	while (true) {
		var ret = input.readFieldBegin();
		var fname = ret.fname;
		var ftype = ret.ftype;
		var fid = ret.fid;
		if (ftype == Thrift.Type.STOP) {
			break;
		}
		switch (fid) {
			case 1:
				if (ftype == Thrift.Type.STRING) {
					this.name = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 2:
				if (ftype == Thrift.Type.LIST) {
					var _size0 = 0;
					var _rtmp34;
					this.inputNames = [];
					var _etype3 = 0;
					_rtmp34 = input.readListBegin();
					_etype3 = _rtmp34.etype;
					_size0 = _rtmp34.size;
					for (var _i5 = 0; _i5 < _size0; ++_i5) {
						var elem6 = null;
						elem6 = input.readString();
						this.inputNames.push(elem6);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			case 3:
				if (ftype == Thrift.Type.LIST) {
					var _size7 = 0;
					var _rtmp311;
					this.inputTypes = [];
					var _etype10 = 0;
					_rtmp311 = input.readListBegin();
					_etype10 = _rtmp311.etype;
					_size7 = _rtmp311.size;
					for (var _i12 = 0; _i12 < _size7; ++_i12) {
						var elem13 = null;
						elem13 = input.readString();
						this.inputTypes.push(elem13);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			case 4:
				if (ftype == Thrift.Type.LIST) {
					var _size14 = 0;
					var _rtmp318;
					this.outputNames = [];
					var _etype17 = 0;
					_rtmp318 = input.readListBegin();
					_etype17 = _rtmp318.etype;
					_size14 = _rtmp318.size;
					for (var _i19 = 0; _i19 < _size14; ++_i19) {
						var elem20 = null;
						elem20 = input.readString();
						this.outputNames.push(elem20);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			case 5:
				if (ftype == Thrift.Type.LIST) {
					var _size21 = 0;
					var _rtmp325;
					this.outputTypes = [];
					var _etype24 = 0;
					_rtmp325 = input.readListBegin();
					_etype24 = _rtmp325.etype;
					_size21 = _rtmp325.size;
					for (var _i26 = 0; _i26 < _size21; ++_i26) {
						var elem27 = null;
						elem27 = input.readString();
						this.outputTypes.push(elem27);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			default:
				input.skip(ftype);
		}
		input.readFieldEnd();
	}
	input.readStructEnd();
	return;
};

FunctionSignature.prototype.write = function (output) {
	output.writeStructBegin('FunctionSignature');
	if (this.name !== null && this.name !== undefined) {
		output.writeFieldBegin('name', Thrift.Type.STRING, 1);
		output.writeString(this.name);
		output.writeFieldEnd();
	}
	if (this.inputNames !== null && this.inputNames !== undefined) {
		output.writeFieldBegin('inputNames', Thrift.Type.LIST, 2);
		output.writeListBegin(Thrift.Type.STRING, this.inputNames.length);
		for (var iter28 in this.inputNames) {
			if (this.inputNames.hasOwnProperty(iter28)) {
				iter28 = this.inputNames[iter28];
				output.writeString(iter28);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	if (this.inputTypes !== null && this.inputTypes !== undefined) {
		output.writeFieldBegin('inputTypes', Thrift.Type.LIST, 3);
		output.writeListBegin(Thrift.Type.STRING, this.inputTypes.length);
		for (var iter29 in this.inputTypes) {
			if (this.inputTypes.hasOwnProperty(iter29)) {
				iter29 = this.inputTypes[iter29];
				output.writeString(iter29);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	if (this.outputNames !== null && this.outputNames !== undefined) {
		output.writeFieldBegin('outputNames', Thrift.Type.LIST, 4);
		output.writeListBegin(Thrift.Type.STRING, this.outputNames.length);
		for (var iter30 in this.outputNames) {
			if (this.outputNames.hasOwnProperty(iter30)) {
				iter30 = this.outputNames[iter30];
				output.writeString(iter30);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	if (this.outputTypes !== null && this.outputTypes !== undefined) {
		output.writeFieldBegin('outputTypes', Thrift.Type.LIST, 5);
		output.writeListBegin(Thrift.Type.STRING, this.outputTypes.length);
		for (var iter31 in this.outputTypes) {
			if (this.outputTypes.hasOwnProperty(iter31)) {
				iter31 = this.outputTypes[iter31];
				output.writeString(iter31);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	output.writeFieldStop();
	output.writeStructEnd();
	return;
};

TestCase = ttypes.TestCase = function (args) {
	this.functionName = null;
	this.inputValues = null;
	this.expectedOutputValues = null;
	if (args) {
		if (args.functionName !== undefined && args.functionName !== null) {
			this.functionName = args.functionName;
		}
		if (args.inputValues !== undefined && args.inputValues !== null) {
			this.inputValues = Thrift.copyList(args.inputValues, [null]);
		}
		if (args.expectedOutputValues !== undefined && args.expectedOutputValues !== null) {
			this.expectedOutputValues = Thrift.copyList(args.expectedOutputValues, [null]);
		}
	}
};
TestCase.prototype = {};
TestCase.prototype.read = function (input) {
	input.readStructBegin();
	while (true) {
		var ret = input.readFieldBegin();
		var fname = ret.fname;
		var ftype = ret.ftype;
		var fid = ret.fid;
		if (ftype == Thrift.Type.STOP) {
			break;
		}
		switch (fid) {
			case 1:
				if (ftype == Thrift.Type.STRING) {
					this.functionName = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 2:
				if (ftype == Thrift.Type.LIST) {
					var _size32 = 0;
					var _rtmp336;
					this.inputValues = [];
					var _etype35 = 0;
					_rtmp336 = input.readListBegin();
					_etype35 = _rtmp336.etype;
					_size32 = _rtmp336.size;
					for (var _i37 = 0; _i37 < _size32; ++_i37) {
						var elem38 = null;
						elem38 = input.readString();
						this.inputValues.push(elem38);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			case 3:
				if (ftype == Thrift.Type.LIST) {
					var _size39 = 0;
					var _rtmp343;
					this.expectedOutputValues = [];
					var _etype42 = 0;
					_rtmp343 = input.readListBegin();
					_etype42 = _rtmp343.etype;
					_size39 = _rtmp343.size;
					for (var _i44 = 0; _i44 < _size39; ++_i44) {
						var elem45 = null;
						elem45 = input.readString();
						this.expectedOutputValues.push(elem45);
					}
					input.readListEnd();
				} else {
					input.skip(ftype);
				}
				break;
			default:
				input.skip(ftype);
		}
		input.readFieldEnd();
	}
	input.readStructEnd();
	return;
};

TestCase.prototype.write = function (output) {
	output.writeStructBegin('TestCase');
	if (this.functionName !== null && this.functionName !== undefined) {
		output.writeFieldBegin('functionName', Thrift.Type.STRING, 1);
		output.writeString(this.functionName);
		output.writeFieldEnd();
	}
	if (this.inputValues !== null && this.inputValues !== undefined) {
		output.writeFieldBegin('inputValues', Thrift.Type.LIST, 2);
		output.writeListBegin(Thrift.Type.STRING, this.inputValues.length);
		for (var iter46 in this.inputValues) {
			if (this.inputValues.hasOwnProperty(iter46)) {
				iter46 = this.inputValues[iter46];
				output.writeString(iter46);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	if (this.expectedOutputValues !== null && this.expectedOutputValues !== undefined) {
		output.writeFieldBegin('expectedOutputValues', Thrift.Type.LIST, 3);
		output.writeListBegin(Thrift.Type.STRING, this.expectedOutputValues.length);
		for (var iter47 in this.expectedOutputValues) {
			if (this.expectedOutputValues.hasOwnProperty(iter47)) {
				iter47 = this.expectedOutputValues[iter47];
				output.writeString(iter47);
			}
		}
		output.writeListEnd();
		output.writeFieldEnd();
	}
	output.writeFieldStop();
	output.writeStructEnd();
	return;
};

Result = ttypes.Result = function (args) {
	this.success = null;
	this.fatal = null;
	this.result = null;
	this.performance = null;
	if (args) {
		if (args.success !== undefined && args.success !== null) {
			this.success = args.success;
		}
		if (args.fatal !== undefined && args.fatal !== null) {
			this.fatal = args.fatal;
		}
		if (args.result !== undefined && args.result !== null) {
			this.result = args.result;
		}
		if (args.performance !== undefined && args.performance !== null) {
			this.performance = new ttypes.PerformanceIndicators(args.performance);
		}
	}
};
Result.prototype = {};
Result.prototype.read = function (input) {
	input.readStructBegin();
	while (true) {
		var ret = input.readFieldBegin();
		var fname = ret.fname;
		var ftype = ret.ftype;
		var fid = ret.fid;
		if (ftype == Thrift.Type.STOP) {
			break;
		}
		switch (fid) {
			case 1:
				if (ftype == Thrift.Type.BOOL) {
					this.success = input.readBool();
				} else {
					input.skip(ftype);
				}
				break;
			case 2:
				if (ftype == Thrift.Type.BOOL) {
					this.fatal = input.readBool();
				} else {
					input.skip(ftype);
				}
				break;
			case 3:
				if (ftype == Thrift.Type.STRING) {
					this.result = input.readString();
				} else {
					input.skip(ftype);
				}
				break;
			case 4:
				if (ftype == Thrift.Type.STRUCT) {
					this.performance = new ttypes.PerformanceIndicators();
					this.performance.read(input);
				} else {
					input.skip(ftype);
				}
				break;
			default:
				input.skip(ftype);
		}
		input.readFieldEnd();
	}
	input.readStructEnd();
	return;
};

Result.prototype.write = function (output) {
	output.writeStructBegin('Result');
	if (this.success !== null && this.success !== undefined) {
		output.writeFieldBegin('success', Thrift.Type.BOOL, 1);
		output.writeBool(this.success);
		output.writeFieldEnd();
	}
	if (this.fatal !== null && this.fatal !== undefined) {
		output.writeFieldBegin('fatal', Thrift.Type.BOOL, 2);
		output.writeBool(this.fatal);
		output.writeFieldEnd();
	}
	if (this.result !== null && this.result !== undefined) {
		output.writeFieldBegin('result', Thrift.Type.STRING, 3);
		output.writeString(this.result);
		output.writeFieldEnd();
	}
	if (this.performance !== null && this.performance !== undefined) {
		output.writeFieldBegin('performance', Thrift.Type.STRUCT, 4);
		this.performance.write(output);
		output.writeFieldEnd();
	}
	output.writeFieldStop();
	output.writeStructEnd();
	return;
};

PerformanceIndicators = ttypes.PerformanceIndicators = function (args) {
	this.totalCompilationTimeMilliseconds = null;
	this.totalExecutionTimeMilliseconds = null;
	this.testCaseExecutionTimeMilliseconds = null;
	if (args) {
		if (args.totalCompilationTimeMilliseconds !== undefined && args.totalCompilationTimeMilliseconds !== null) {
			this.totalCompilationTimeMilliseconds = args.totalCompilationTimeMilliseconds;
		}
		if (args.totalExecutionTimeMilliseconds !== undefined && args.totalExecutionTimeMilliseconds !== null) {
			this.totalExecutionTimeMilliseconds = args.totalExecutionTimeMilliseconds;
		}
		if (args.testCaseExecutionTimeMilliseconds !== undefined && args.testCaseExecutionTimeMilliseconds !== null) {
			this.testCaseExecutionTimeMilliseconds = args.testCaseExecutionTimeMilliseconds;
		}
	}
};
PerformanceIndicators.prototype = {};
PerformanceIndicators.prototype.read = function (input) {
	input.readStructBegin();
	while (true) {
		var ret = input.readFieldBegin();
		var fname = ret.fname;
		var ftype = ret.ftype;
		var fid = ret.fid;
		if (ftype == Thrift.Type.STOP) {
			break;
		}
		switch (fid) {
			case 1:
				if (ftype == Thrift.Type.DOUBLE) {
					this.totalCompilationTimeMilliseconds = input.readDouble();
				} else {
					input.skip(ftype);
				}
				break;
			case 2:
				if (ftype == Thrift.Type.DOUBLE) {
					this.totalExecutionTimeMilliseconds = input.readDouble();
				} else {
					input.skip(ftype);
				}
				break;
			case 3:
				if (ftype == Thrift.Type.DOUBLE) {
					this.testCaseExecutionTimeMilliseconds = input.readDouble();
				} else {
					input.skip(ftype);
				}
				break;
			default:
				input.skip(ftype);
		}
		input.readFieldEnd();
	}
	input.readStructEnd();
	return;
};

PerformanceIndicators.prototype.write = function (output) {
	output.writeStructBegin('PerformanceIndicators');
	if (this.totalCompilationTimeMilliseconds !== null && this.totalCompilationTimeMilliseconds !== undefined) {
		output.writeFieldBegin('totalCompilationTimeMilliseconds', Thrift.Type.DOUBLE, 1);
		output.writeDouble(this.totalCompilationTimeMilliseconds);
		output.writeFieldEnd();
	}
	if (this.totalExecutionTimeMilliseconds !== null && this.totalExecutionTimeMilliseconds !== undefined) {
		output.writeFieldBegin('totalExecutionTimeMilliseconds', Thrift.Type.DOUBLE, 2);
		output.writeDouble(this.totalExecutionTimeMilliseconds);
		output.writeFieldEnd();
	}
	if (this.testCaseExecutionTimeMilliseconds !== null && this.testCaseExecutionTimeMilliseconds !== undefined) {
		output.writeFieldBegin('testCaseExecutionTimeMilliseconds', Thrift.Type.DOUBLE, 3);
		output.writeDouble(this.testCaseExecutionTimeMilliseconds);
		output.writeFieldEnd();
	}
	output.writeFieldStop();
	output.writeStructEnd();
	return;
};

ttypes.TypeContainerArray = 'array';
ttypes.TypeContainerList = 'list';
ttypes.TypeContainerSet = 'set';
ttypes.TypeContainerMap = 'map';
ttypes.TypeString = 'string';
ttypes.TypeCharacter = 'char';
ttypes.TypeBoolean = 'bool';
ttypes.TypeInt8 = 'int8';
ttypes.TypeInt16 = 'int16';
ttypes.TypeInt32 = 'int32';
ttypes.TypeInt64 = 'int64';
ttypes.TypeFloat32 = 'float32';
ttypes.TypeFloat64 = 'float64';
ttypes.TypeDecimal = 'decimal';
