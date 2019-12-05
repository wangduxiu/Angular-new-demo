# EuropoolWebportal

# Installation and deployment
## Prerequisites

* Install node on from https://nodejs.org/en/.
  * LTS version is recommended
* Restart terminal or command prompt
  * Check if npm is correctly installed, `npm -v` should print the version number
* Global install yarn with: `npm install -g yarn`
* Install typescript <2.5 (restriction angular 4)
* Only chrome, firefox & safari are supported

## First installation of dependencies

* Navigate to client folder by `cd client`
* Execute `yarn`

## Run locally

* Navigate to client folder by `cd client`
* Execute: `yarn startJit`.  It will start the app in 'jit'-mode, which is 'just in time' compilation.  Deployment is faster, but in production, we deploy with AOT (ahead of time).
* Surf to <http://localhost:4200>

## Build project

* Go to root folder of the project
* To test your version, it's best to build with AOT enabled.  This is how you do it: 'yarn buildProd'

## package-json scripts

name | description 
---: | --- 
start | Update node_modules, generate environment.ts, start reverseproxy connecting to DEV and start angular in AoT mode
startQas | Update node_modules, generate environment.ts, start reverseproxy connecting to QAS and start angular in AoT mode
startJit | Update node_modules, generate environment.ts, start reverseproxy connecting to DEV and start angular in JiT mode
startJit | Update node_modules, generate environment.ts, start reverseproxy connecting to Niels' computer and start angular in JiT mode
startJitQas | Update node_modules, generate environment.ts, start reverseproxy connecting to QAS and start angular in JiT mode
build | build angular project in prod mode (aot)
buildDev | generate environment.ts & build angular project in dev mode (jit) 
buildProd | generate environment.ts & build angular project in prod mode (aot)
buildDeployLocal | generate environment.ts & build angular project in prod mode (aot) tot DIST mode and start local HTTP server
test | run tests 
test:watch | run tests and watch for changes
lint | do linting
buildstats |  build stats for analyzing size footprint 
bundle-report | Use stats for analyzing size footprint

### Some concepts explained
Concept | Explanation
---: | ---
AOT | Ahead of time.  Angular templates are compiled into JS-code during build.  Web app will be faster.  More errors will be detected during runtime (used variables in templates are checked against the component
JIT | Just in time.  Angular templates are not compiled during build-time.  The templates are deployed, together with a JIT-compiler.  So, the templates are converted into JS-code in the client's browser. Faster deployment, slower web app and more errors are allowed by the browser

## Translations
Translations must be maintained by the EPS administrator.  Not by delaware.  We deliver a built-in translation in /assets/i18n/default.json.  The eps-user can then manage and adapt the different translations in the web application itself: admin - translations

# Used libraries
## ngrx
Ngrx is preferred over redux because it uses rxjs (the observable pattern) so that the angular components can subscribe to the state object.  That way, change detection can be switched off for these components, which is a big performance gain in large projects.

source: https://github.com/ngrx/store/issues/16 (post of robwormald commented on Jan 15 2016)

### More info
- part 1: [Adding redux with ngrx/store to Angular 2](http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/)
- part 2: [Angular 2, Ngrx/Store & Ngrx/Effects – Intro To Functional Approach For A Chain Of Actions](http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions)
- [Other blogs](http://www.wisdomofjim.com/blog/category/angular-2)
- [Example app](https://github.com/ngrx/example-app)
- [Multi-module big example app](https://github.com/dancancro/great-big-example-application/tree/master/src/main/webapp/app)

### Brief introduction
- Actions are classes with a predefined type that are also exported as const.  These types are used in the switch in reducers
- Actions are triggered by
  - feature components
  - effects (used for async operations)
- Model objects defines the interfaces of the model, and is used to build up the state and initial state
- Reducers processes actions.  It can get a payload as input and will create a new version of its part of the state.  State itself is immutable!
- Reducers are combined into 1 and is used in the core module to create a storeProvider.
- Effects are used for async processes.  It continually listens for action events and processes them in a reactive way.  At the end, it will asynchronously fire a new action so that reducers can pick it up to change the state
- Feature components that uses the store as sole input can disable change detection.  This improves significantly the performance.

## Grid layout System
We use a row-column based framework based on bootstrap.
All info can be found on **[their website](http://getbootstrap.com/) **

## adal
npm install typings --global
typings install -GD github:DefinitelyTyped/DefinitelyTyped/adal-angular/adal.d.ts#53347571e6f44ed9a961b569bb81893fde4789c1

# Code structure
- UI is structured in modules (eg: app/modules/orders/order-list/order-list.component.ts, .../order-details/order-details.component.ts, .../order-edits/order-edit.component.ts, ...)
- Entities are stored in the core directory (eg: app/core/store/order/order.model.ts, ...-interface.ts, ...-effect.ts, ...-state.ts, ...-reducers.ts, ...-actions.ts)
- Good discussion: https://github.com/ngrx/example-app/issues/52
- Since working with ngrx effects is cumbersome, for some features, we started using sandboxes.  It shields NGRX from the containers, and takes away the need for effects. (eg invoices.sandbox.ts)
- Containers are store & actions aware.  They communicate with the store state and will trigger actions.  In case a sandbox is used (invoices) it will have the sandbox injected and will use that service to interact with the state.
- Components are simple and will only have @inputs and @outputs.  There will be no injection of services or stores in components.  And async properties / functions are avoided as much as possible
- Orders, flows, CCR and relocations all look similar.  When the project was started, only orders & flows were defined in the specs.  So a parent 'florder' was introduced to reuse as much as possible.  Later during development, it proved not to be such a good decision, but we're stuck with it.  
- Most components can be used in view / edit and create mode.  For orders, flows, florders, a complicated state object (view-state) is defined in the container to centralize the behaviour & characteristics of the component views, based on the state in the store (mode-object).  It takes lot of debugging and analysis to understand how it's used and how to change this.  Be careful.
- Authorization comes from an authorization matrix from the MW.  It's used to show/hide menus & buttons, but also to prevent the user to browse to certain pages.  This is done with the 'authorizationGuard'.  
- Pre-loading stuff before showing a page is also implemented as a guard.  Some guards expect that other data is already present in the store.  If not, it will fail and go to a fallback page. 

# Known bugs & workarounds

## Jest bug detected
When running tests, you'll run into an issue that it can't find files that need to be imported, starting with @app.  
It has been logged twice, once for [jest-preset-angular](https://github.com/thymikee/jest-preset-angular/issues/37), but also for [jest](https://github.com/facebook/jest/issues/3565) itself, which is actually the cause of this bug.
We need to wait for a bugfix, or fix it yourself in the binary of your jest-resolver.

Bugfix is underway.  For now, please fix it yourself
jest-config/build/normalize.js line 79

fix:

    options.moduleNameMapper = Object.assign(
      {},
      options.moduleNameMapper
      preset.moduleNameMapper,
    )
