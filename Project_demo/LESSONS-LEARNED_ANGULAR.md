# LESSONS LEARNED angular

Here we will log all our hiccups.

## 1. Importing interfaces gives warnings
When making a file with multiple interfaces to export,
webpacks throws warnings saying:  

> "export 'DeliveryMethod' was not found in '@app/core/store/order-detail/order-detail.model'

But everything works, dispite the errors.

When all interfaces have their own seperate file, there are no errors.

## 2. Barrels not working
[Barrels](https://angular.io/guide/glossary#barrel) (index.ts files) in angular suddenly stopped working / gave a lot of problems. They are no longer angular-specific, they push for modules.

## 3. Build-in way for i18n is way to complex and broken

The build in way for internationalisation is very complex. It's based on a tool who auto generates
the files in a translation file (!== 'classic' json translations). Each translation has an id. But everytime you update/change or ad an translation you need to re-run the tool. The main problem is the following quoted from the [angular 2 docs](https://angular.io/guide/i18n#file-maintenance-and-id-changes)

> Whether you use generated or custom ids, always commit all translation message files to source control, especially the English source messages.xlf. The difference between the old and the new messages.xlf file will help you find and update ids and other changes across your translation files.

Basically you have to manualy change all the id's because the tool  can't.

## 4. ADAL for angular
TODO for paul

## 5. Angular material - UI framework for angular
Badly documented. And hard to implement custom theming.

## 6. Multiple templates on one dom element not possible
*ngIf & *ngFor not possible to combine on same component.  Because they both want to translate into ng-template.
Tried to use ng-template with [ngIf] and [ngForOf] on it, but didn't work.  Created a pipe to use in the ngFor that did the 'if' for me as filter on the array

## 7. Unchecking md-checkbox from component function is not possible
at least not when formcontrol is part of formArray.  I debugged in angular a while. Checked=true works, checked=false doesn't. 
Fixed it by resetting the array with shalow clones of the objects.  Used in flow-list.component


THINGS TO FIND OUT
- How to change store when changing path?  Right way with the guards/resolvers (canActivate) ?
- How to use other parts of state in reducers / effects ?
- Get more in depth knowledge on observables
