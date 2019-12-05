import { Component } from '@angular/core';


/**
 * Component used for redirecting iframe calls.  Will never be initialized since canActivate will always return false (see route-config & oauth-callback.reducer)
 */
@Component({
  template: '<div>DUMMY COMPONENT</div>',
})
export class IframeDummyComponent {
}
