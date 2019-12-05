# AngularTemplate Delaware

## What's in the box

- Angular 7.2.7
- Sandboxes architecture
- Redux (ngrx)
- ngx-translate
- Lazy loading modules
- RxJS
- SASS
- Check & reformat on commit

## Dependencies

### Node

Version `^8.5.0`

### Angular cli

Make sure you have installed **Angular cli**: `npm install -g @angular/cli`

## Getting up and running

Create a fork and clone repo to your local machine.

- Run `npm install` or `yarn` to install all dependencies.
- Run `yarn json-server` to run the mock server
- Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
- Run `npm run doc` to generate documentation of the template

## Common used and working scripts

- `yarn run start` - run the project
- `yarn run start-prod` - run the project in production mode with ahead of time compilation
- `yarn run build` - build the project in /dist
- `yarn run build-prod` - build the project in production mode in /dist
- `yarn run lint` - run linting on the whole project
- `yarn run prettify` - automatically makes your code in /src prettier on the whole project
- `yarn run precommit` - run `lint` & `prettify` only on staged files
- `yarn run e2e` - run end to end testing with protractor
- `yarn run test` - run store unit- and integrationtesting
- `yarn run doc` - generate documentation
- `yarn run json-server` - run the mock server on /src/app/shared/mockdata/db.json

## Lazy loading

Lazy loading modules will bootstrap your application much faster.
You can find all modules that are beeing lazy loaded in the 'modules/lazy-loaded'-folder
Have a look https://angular.io/guide/lazy-loading-ngmodules on how to implement lazy loading.

## Angular Style Guide

The template is created with the style guide in mind. Please have a look at https://angular.io/guide/styleguide
