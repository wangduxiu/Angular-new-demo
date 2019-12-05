import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInAnimation =
  trigger('fadeInAnimation', [
    // route 'enter' transition
    transition(':enter', [

      // styles at start of transition
      style({ display:'none', position:'absolute', opacity: 0, transform: 'translateX(50px)' }),

      // animation and styles at end of transition
      animate('300ms ease-out', style({ display:'block', position:'relative', opacity: 1, transform: 'translateX(0px)' }))
    ]),
  ]);


export function easeInOutTrigger(name = 'easeInOut', padding = 24, timing = '0.5s') {
  return trigger(name, [
    transition(':enter', [
      style({ height: 0, overflow: 'hidden', maxHeight: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }),
      animate(timing + ' ease-in-out', style({ height: '*', maxHeight: 999, overflow: 'hidden', opacity: 1, paddingTop: padding, paddingBottom: padding }))
    ]),
    transition(':leave', [
      animate(timing + ' ease-in-out', style({ height: 0, maxHeight: 999, overflow: 'hidden', opacity: 0, paddingTop: 0, paddingBottom: 0 }))
    ])
  ]);
}
