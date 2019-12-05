## Translations

We use [**ngx-translate**](https://github.com/ngx-translate/core) with [**HttpTransporter**](https://github.com/ngx-translate/http-loader) to transport the translations to the page.

### Setup
To use a translation you import the service in the component where it's needed:

>import { TranslateService } from '@ngx-translate/core';


In its constructor set a default language and set the language to use

```javascript
constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
}
```
To make a translation use following syntax:
```html
<div>{{ 'HELLO' | translate }} Admin</div>
 ```
 ### Creating Translations

 Translations are simple **.json** files with there language names in front, example names:

> "**en.json**",
> "**nl.json**",
> "**fr.json**" etc..

The filestructure of a translation files looks as follows:

```json
{
    "HELLO": "hello"
}
```
Nested, only 2 leves (as far as I know of >2 levels won't work) also works:
```html
<div>{{ 'HOME.HELLO' | translate }} Admin</div>
 ```

```json
{
    "HOME": {
        "HELLO": "hello"
    }
}
```

### Usage

There are 3 ways you can use the TranslateService:
* Pipes
* Service
* Directives

**Pipes:**
```javascript
<div>{{ 'HELLO' | translate:param }}</div>
```

**Service:**
```javascript
translate.get('HELLO', {value: 'world'}).subscribe((res: string) => {
    console.log(res);
    //=> 'hello world'
});
```
**Directive:**
```javascript
<div [translate]="'HELLO'" [translateParams]="{value: 'world'}"></div>
```
### Raw html
It's also possible to insert html taggs in the translations:
```json
{
    "HELLO": "Welcome to my Angular application!<br><strong>This is an amazing app which uses the latest technologies!</strong>"
}
```

```html
<div [innerHTML]="'HELLO' | translate"></div>
```
