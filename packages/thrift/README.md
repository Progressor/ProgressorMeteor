# Executor Connection Using Apache Thrift

This package contains a dependency to the [*Apache Thrift*](https://thrift.apache.org/) [*npm*](https://www.npmjs.com/) package
and the generated sources to connect to the **Executor** service.

## Instructions

The *Thrift* generator generates [*Node.js*](https://nodejs.org/) code which needs to be transformed into valid [*Meteor*](https://www.meteor.com/) code in 5 simple steps.

1. Generate the *Node.js* code as described in the **Executor** project.

   * [*Maven*](https://maven.apache.org/) will generate the code for you.

2. Copy the generated files to the correct locations.

   * Copy `ExecutorService.js` to `.\packages\thrift`.
   * Copy `executor_types.js` to `.\packages\thrift\lib`.
   * This forces Meteor to load the types before the service.

3. Replace all `require(...)` calls by `Npm.require(...)`.

   * *npm* calls are encapsulated by *Meteor*.

4. Change variable declarations in `executor_types.js`.

   * Remove the keyword `var` for the declarations `var thrift = ...`, `var Thrift = ...`, `var Q = ...` and `var ttypes = ...`.
   * Replace `module.exports` by `ttypes`.
   * These changes allow the variables to be accessible in other code files of the same package and to be exported for futher use outside the package.

4. Change variable declarations in `ExecutorService.js`.

   * Remove the declarations `var thrift = ...`, `var Thrift = ...`, `var Q = ...` and `var ttypes = ...`.
   * This allows the code to use the variables already declared in the file above.
   * Add a declaration `Executor = {}` before any code.
   * Replace `exports` by `Executor`.
   * These changes allow the variables to be accessible in other code files of the same package and to be exported for futher use outside the package.
