# Progressor - Additional Meteor Configuration Options

## Dependencies

You need to install *Meteor* to develop this website.
You can download the latest version from [their website](https://www.meteor.com/install).

This application depends on the standard [*Atmosphere*](https://atmospherejs.com/) packages.

1. [`meteor-base`](https://atmospherejs.com/meteor/meteor-base)
1. [`mobile-experience`](https://atmospherejs.com/meteor/mobile-experience)
1. [`mongo`](https://atmospherejs.com/meteor/mongo)
1. [`blaze-html-templates`](https://atmospherejs.com/meteor/blaze-html-templates)
1. [`session`](https://atmospherejs.com/meteor/session)
1. [`jquery`](https://atmospherejs.com/meteor/jquery)
1. [`tracker`](https://atmospherejs.com/meteor/tracker)
1. [`shell-server`](https://atmospherejs.com/meteor/shell-server)
1. [`standard-minifier-css`](https://atmospherejs.com/meteor/standard-minifier-css)
1. [`standard-minifier-js`](https://atmospherejs.com/meteor/standard-minifier-js)
1. [`es5-shim`](https://atmospherejs.com/meteor/es5-shim)
1. [`ecmascript`](https://atmospherejs.com/meteor/ecmascript)

In addition, the following officialy *Meteor*-provided *Atmosphere* packages have also been added.

1. [`random`](https://atmospherejs.com/meteor/random)
1. [`check`](https://atmospherejs.com/meteor/check)
1. [`audit-argument-checks`](https://atmospherejs.com/meteor/audit-argument-checks)
1. [`reactive-var`](https://atmospherejs.com/meteor/reactive-var)
1. [`reactive-dict`](https://atmospherejs.com/meteor/reactive-dict)
1. [`iron:router`](https://atmospherejs.com/iron/router)
1. [`accounts-password`](https://atmospherejs.com/meteor/accounts-password)
1. [`underscore`](https://atmospherejs.com/meteor/underscore)
1. [`less`](https://atmospherejs.com/meteor/less)
1. [`email`](https://atmospherejs.com/meteor/email)

As advised, the following [*npm*](https://www.npmjs.com/) paackage has been added to improve performance.

1. [`bcrypt`](https://www.npmjs.com/package/bcrypt)

It also depends on a number of third-party *Atmosphere* packages.

1. [anti:i18n](https://atmospherejs.com/anti/i18n)
   for internationalisation (translation)
1. [momentjs:moment](https://atmospherejs.com/momentjs/moment)
   for internationalisation (date & time formatting)
1. [alanning:roles](https://atmospherejs.com/alanning/roles)
   for role-based authorisation
1. [zimme:iron-router-auth](https://atmospherejs.com/zimme/iron-router-auth)
   for authentication- and authorisation-based routing
1. [huttonr:bootstrap3](https://atmospherejs.com/huttonr/bootstrap3)
   for the newest highly configurable `less` version of [Bootstrap](http://getbootstrap.com/)
   * The [Flatly](http://bootswatch.com/flatly/) design is provided by [Bootswatch](http://bootswatch.com/).
1. [useraccounts:bootstrap](https://atmospherejs.com/useraccounts/bootstrap)
   for the unified design of the login & register page
1. [sacha:spin](https://atmospherejs.com/sacha/spin)
   for the loading spinner
1. [chuangbo:marked](https://atmospherejs.com/chuangbo/marked)
   for [GitHub Flavoured Markdown](https://guides.github.com/features/mastering-markdown/)
1. [houston:admin](https://atmospherejs.com/houston/admin)
   for the *MongoDB* admin frontend
1. [perak:codemirror](https://atmospherejs.com/perak/codemirror)
   for syntax highlighting using *CodeMirror*
1. [meteorhacks:kadira](https://atmospherejs.com/meteorhacks/kadira)
   for monitoring using [*Kadira*](https://kadira.io/) (see Monitoring section)
1. [sergeyt:typeahead](https://atmospherejs.com/sergeyt/typeahead)
   for autocomplete support using *typeahead.js*
1. [percolate:synced-cron](https://atmospherejs.com/percolate/synced-cron)
   for jobs similar to *Cron* (or scheduled tasks)
1. [meteorhacks:ssr](https://atmospherejs.com/meteorhacks/ssr)
   provides Server Side Rendering capabilities in order to send emails
1. [pascoual:pdfkitx](https://atmospherejs.com/pascoual/pdfkitx)
   for generating PDF documents using [PDFKit](http://pdfkit.org/)

To enforce a clean [coding style](https://github.com/airbnb/javascript), [*ESLint*](http://eslint.org/) is used which depends on the following *npm* packages.

1. [`babel-eslint`](https://www.npmjs.com/package/babel-eslint)
1. [`eslint`](https://www.npmjs.com/package/eslint)
1. [`eslint-config-airbnb-base`](https://www.npmjs.com/package/eslint-config-airbnb-base)
1. [`eslint-import-resolver-meteor`](https://www.npmjs.com/package/eslint-import-resolver-meteor)
1. [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import)
1. [`eslint-plugin-meteor`](https://www.npmjs.com/package/eslint-plugin-meteor)

## Configuration

The application can easily be configured by modifying the files `private/config.json` and `private/secret.json` which are loaded in `server/config.json`.

Both the eMail and **Executor** connections should be specified before using **Progressor**. 

## Monitoring

The tool [*Kadira*](https://kadira.io/) can be used to monitor the application performance.
More information can be found in the official [academy page](https://kadira.io/academy/meteor-performance-101/content/getting-started-with-kadira).

## Load Testing

This application can be tested under heavy load using [*MeteorDown*](https://github.com/meteorhacks/meteor-down).

### Instructions

To run a load test, please follow these simple steps:

1. Install the latest version of [*Node.js*](https://nodejs.org/) (if needed).
2. Install the [*meteor-down*](https://www.npmjs.com/package/meteor-down) *npm* package using `npm install --global meteor-down`.
3. Inside the directory `.meteor-down`, execute `meteor-down <filename>` to run a specific load test.

There is also a [*Meteor* package](https://atmospherejs.com/meteorhacks/meteor-down) which is not currently used in this project.

### Available Tests

The available test files (to use in place of `<filename>`) are:

* `executor.js`

The available tests are documented in our project documentation.

## Apache Thrift

[*Thrift*](https://thrift.apache.org/) is a software framework for scalable cross-language services development.

It is used for the communication with the **Executor** component.
The corresponding interface definition file is included in the **Executor** project.

A custom *Meteor* package called `thrift` wraps the [*npm*](https://www.npmjs.com/) package `thrift` ([source](https://www.npmjs.com/package/thrift)).
The [package documentation](packages/thrift/README.md) contains the instructions to update the package.

## MongoDB

This application uses the included *MongoDB* engine.

The default / example documents are [included](server/example-data.js) in the application.
To initialize and inspect the database, simply perform the following steps.

1. Get yourself administrative rights.
   * If you are the first user to register to an installation, you are automatically an administrator.
   * If not, ask an administrator to add you to the administrator's group.
1. Go the *MongoDB* admin page `<root>/admin` view, edit or remove documents and whole collections.
