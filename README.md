# Progressor - Meteor

This is the web component of the project **Progressor - The Programming Professor**.

## Meteor

This repository contains a reactive [*Meteor*](https://www.meteor.com/) web application created using [*WebStorm*](https://www.jetbrains.com/webstorm/).

### Introduction

*Meteor* is an app platform.
Web application run on a [*Node.js*](https://nodejs.org/) web server and use a [*MongoDB*](https://www.mongodb.org/) document-oriented database.

*Meteor* applications require activated *JavaScript* on the client side (in the web browser).

### Dependencies

You need to install *Meteor* to develop this website.
You can download the latest version from [their website](https://www.meteor.com/install).

This application depends on the official packages
`mongo`, `blaze-html-templates`, `session`, `tracker`, `ecmascript`, `es5-shim`, `standard-minifiers`,
`random`, `check`, `audit-argument-checks`, `reactive-var`, `reactive-dict`, `iron:router`,
`accounts-password`, `accounts-ui`, `underscore`, `jquery` and `less`.

It also depends on a number of third-party *Meteor* packages.

1. [anti:i18n](https://atmospherejs.com/anti/i18n)
   for internationalisation (translation)
2. [momentjs:moment](https://atmospherejs.com/momentjs/moment)
   for internationalisation (date & time formatting)
3. [alanning:roles](https://atmospherejs.com/alanning/roles)
   for role-based authorisation
4. [zimme:iron-router-auth](https://atmospherejs.com/zimme/iron-router-auth)
   for authentication- and authorisation-based routing
5. [huttonr:bootstrap3](https://atmospherejs.com/huttonr/bootstrap3)
   for the newest highly configurable `less` version of [Bootstrap](http://getbootstrap.com/)
   * The [Flatly](http://bootswatch.com/flatly/) design is provided by [Bootswatch](http://bootswatch.com/).
6. [useraccounts:bootstrap](https://atmospherejs.com/useraccounts/bootstrap)
   for the unified design of the login & register page
7. [sacha:spin](https://atmospherejs.com/sacha/spin)
   for the loading spinner
8. [chuangbo:marked](https://atmospherejs.com/chuangbo/marked)
   for [GitHub Flavoured Markdown](https://guides.github.com/features/mastering-markdown/)
9. [houston:admin](https://atmospherejs.com/houston/admin)
   for the *MongoDB* admin frontend

### Configuration

The configuration is stored in the file `private/config.json` which is loaded in `server/config.json`.

### Monitoring

The tool [*Kadira*](https://kadira.io/) is used to monitor the application performance.
More information can be found in the official [academy page](https://kadira.io/academy/meteor-performance-101/content/getting-started-with-kadira).

### Load Testing

This application can be tested under heavy load using [*MeteorDown*](https://github.com/meteorhacks/meteor-down).

#### Instructions

To run a load test, please follow these simple steps:

1. Install the latest version of [*Node.js*](https://nodejs.org/) (if needed).
2. Install the [*meteor-down*](https://www.npmjs.com/package/meteor-down) *npm* package using `npm install --global meteor-down`.
3. Inside the directory `.meteor-down`, execute `meteor-down <filename>` to run a specific load test.

There is also a [*Meteor* package](https://atmospherejs.com/meteorhacks/meteor-down) which is not currently used in this project.

#### Available Tests

The available test files (to use in place of `<filename>`) are:

* `executor.js`

The available tests are documented in our project documentation.

### Deployment

The application can be deployed using [*Meteor Up X*](https://github.com/arunoda/meteor-up/tree/mupx) (short: *mupx*),
which is the current stable version of the tool [*Meteor UP*](https://github.com/arunoda/meteor-up) (short: *mup*).

It is planned for the two versions to be merged at some point both at *GitHub* and in *npm*.

#### Instructions

To deploy, please follow these simple steps:

1. Install the latest version of [*Node.js*](https://nodejs.org/) (if needed).
2. Install [*Meteor Up X*](https://www.npmjs.com/package/mupx) using `npm install --global mupx`
3. Inside the directory `.meteor-up`, execute `mupx deploy`

Please note that the mentioned steps only work if you have already configured your server.
For instruction how to configure your server, please refer to our project documentation.

## Apache Thrift

[*Thrift*](https://thrift.apache.org/) is a software framework for scalable cross-language services development.

It is used for the communication with the **Executor** component.
The corresponding interface definition file is included in the **Executor** project.

A custom *Meteor* package called `thrift` wraps the [*npm*](https://www.npmjs.com/) package `thrift` ([source](https://www.npmjs.com/package/thrift)).
The [package documentation](packages/thrift/README.md) contains the instructions to update the package.

## MongoDB

This application uses the included *MongoDB* engine.

The default / example documents are [included](server/example-data.js) in the application.
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

## Executor

You need to run the **Executor** to be able to solve exercises.

* You can either clone the repository and build the project yourself
* or simply execute the [*JAR* file](bin/ProgressorExecutor.jar) included in the directory `bin`.
  * In this case, run the **Executor** with a working directory outside the *Meteor* projects,
    otherwise *Meteor* will recognise the files temporarily created and continuously restart the server.
