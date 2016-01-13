# Progressor - Meteor

This is the *Meteor* website of the project **Progressor - The Programming Professor**.

## Instructions

This repository contains an *WebStorm* project.

### Meteor

You need to install *Meteor* to run this website.
You can download the latest version from [their website](https://www.meteor.com/install).

This application depends on the official packages
`mongo`, `blaze-html-templates`, `session`, `tracker`, `ecmascript`, `es5-shim`,
`check`, `accounts-password`, `accounts-ui`, `underscore`, `jquery`, `less` and `markdown`.

It also depends on a number of third-party *Meteor* packages.

1. [iron:router](https://atmospherejs.com/iron/router)
   for routing
2. [anti:i18n](https://atmospherejs.com/anti/i18n)
   for internationalisation (translation)
3. [momentjs:moment](https://atmospherejs.com/momentjs/moment)
   for internationalisation (date & time formatting)
4. [huttonr:bootstrap3](https://atmospherejs.com/huttonr/bootstrap3)
   for the newest highly configurable `less` version of [Bootstrap](http://getbootstrap.com/)
   * The [Flatly](http://bootswatch.com/flatly/) design is provided by
     [Bootswatch](http://bootswatch.com/)
5. [useraccounts:bootstrap](https://atmospherejs.com/useraccounts/bootstrap)
   for the unified design of the login & register page

### Apache Thrift

A custom package called `thrift` is included as well itself depending on the *npm* package `thrift`
for the communication with the **Executor** component.

The corresponding interface definition file is included in the **Executor** project.
The [package documentation](packages/thrift/README.md) contains the instructions to update the package.

### MongoDB

This application uses the included *MongoDB* engine.

The default / sample documents are [included](server/startup.js) in the application.
To initialise and inspect the database, simply perform the following steps.

1. Run the *Meteor* application.
   1. Go the the login page and register yourself.
   2. Stop the application.
2. Run the application again.
   1. This time, the documents get inserted into the database;
      they will reference the user you just created.
   2. Go the *MongoDB* admin page (`<root>/admin`) and claim administrator rights for your user.
      You are now the administrator of your own local *MongoDB*.
      You can log in at any time and view, edit or remove documents and whole collections.

### Executor

You need to run the **Executor** to be able to solve exercises.

* You can either clone the repository and build the artifact yourself
* or simply execute the [*JAR* file](bin/ProgressorExecutor.jar) included in the package `thrift`.
