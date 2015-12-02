# Executor Connection using Apache Thrift

This package contains a dependency to the *Apache Thrift* *npm*-package and the generated sources to connect to the *Executor* service.

## Instructions

The *Thrift* generator generate *node.js* code which needs to be transformed into valid *Meteor* code in 5 simple steps.

1. generate *node.js* code as described in the executor project

2. copy the generated files to the correct locations

   * `ExecutorService.js` to `.\packages\thrift`
   * `executor_types.js` to `.\packages\thrift\lib`
   * this forces Meteor to load the types before the service

3. replace all `require(...)` calls by `Npm.require(...)`

   * *npm* calls are encapsulated by *Meteor*

4. change variable declarations in `executor_types.js`

   * remove the keyword `var` for the declarations `var thrift = ...`, `var Thrift = ...` and `var Q = ...`
   * remove the keyword `var` for the declaration `var ttypes = ...`
   * replace `module.exports` by `ttypes`
   * these changes allow the variables to be accessible in other code files of the same package and to be exported for futher use outside the package

4. change variable declarations in `ExecutorService.js`

   * remove the declarations `var thrift = ...`, `var Thrift = ...`, `var Q = ...` and `var ttypes = ...`
   * this allows the code to use the variables already declared in the file above
   * add a declaration `Executor = {}` before any code
   * replace `exports` by `Executor`
   * these changes allow the variables to be accessible in other code files of the same package and to be exported for futher use outside the package
