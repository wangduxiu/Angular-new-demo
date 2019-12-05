import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {getEnvironment} from 'app/app.settings';
import {AuthorizationMatrix, ContractRestrictions} from '../../core/store/contract-details/contract-details.interface';
import {Definition} from '../../core/store/definitions/definition.interface';
import {util} from '../../core/util/util';
import {Title} from '@angular/platform-browser';

interface Module {
  translationCode: string;
  goto: string | (() => string);
  pathRegexs?: RegExp[];
  disabled?: boolean;
  visible: () => boolean;
  hideOnMobile?: boolean;
}

@Component({
  selector: 'europool-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  animations: [
    trigger('modules', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger(-100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          stagger(-100, [
            animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-50px)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('usermenu', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('500ms 300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(50px)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  private modules: Module[];
  private headerModules: Module[];
  openMobileMenu: boolean = false;

  public visibleModules: Module[];
  public visibleHeaderModules: Module[];
  public visibleMobileModules: Module[];
  public environment: string;

  @Input() firstName: string;
  @Input() initials: string;
  @Input() activeCustomer: Definition;
  @Input() canSwitchCustomer: boolean;
  @Input() path: string;
  @Input() authorized: boolean; // can be undefined, false or true !!!
  @Input() contextLoading: boolean;
  @Input() customerInfoLoaded: boolean;
  @Input() contractDetailsLoading: boolean;
  @Input() authorization: AuthorizationMatrix;
  @Input() contractRestrictions: ContractRestrictions;

  @Output() gotoDashboard: EventEmitter<void> = new EventEmitter<void>();
  @Output() openModule: EventEmitter<string> = new EventEmitter<string>();
  @Output() login: EventEmitter<void> = new EventEmitter<void>();
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectCustomer: EventEmitter<void> = new EventEmitter<void>();

  constructor(private titleService: Title){
  }

  ngOnInit() {
    this.environment = getEnvironment();
    if (this.environment) {
      this.titleService.setTitle(`EPS ${this.environment}`);
    }
    // @formatter:off
    this.modules = [
      { translationCode: 'SHARED.HEADER.ORDERS', goto: '/orders/clear', visible: () => this.isAuthorized('ORDERS') && this.customerInfoLoaded, pathRegexs: [/\/orders(?:\/.*)?/, /\/ccr(?:\/.*)?/] },
      { translationCode: 'SHARED.HEADER.RELOCATIONS', goto: '/relocations', visible: () => (this.authorized && this.authorization.canRelocate) },
      { translationCode: 'SHARED.HEADER.FLOWS', goto: '/flows/clear', visible: () => this.isAuthorized('FLOWS') && this.customerInfoLoaded, pathRegexs: [/\/flows(?:\/.*)?/] },
      { translationCode: 'SHARED.HEADER.CALENDAR', goto: '/calendar/order', visible: () => (this.isAuthorized('CALENDAR') && this.customerInfoLoaded), hideOnMobile: true },
      { translationCode: 'SHARED.HEADER.INVOICES', goto: '/invoices/clear', visible: () => this.isAuthorized('INVOICES') && this.customerInfoLoaded, pathRegexs: [/\/invoices(?:\/.*)?/, /\/descartes-invoices(?:\/.*)?/] },
      { translationCode: 'SHARED.HEADER.REPORT', goto: '/report', visible: () => this.isAuthorized('REPORTS') && this.customerInfoLoaded },
      { translationCode: 'SHARED.HEADER.BLANK', goto: '/blank-receipts', visible: () => this.isAuthorized('BLANK_RECEIPT') && this.contractRestrictions.blankReceiptPossible && this.customerInfoLoaded }
    ];

    this.headerModules = [
      { translationCode: 'ADMIN.SHARED.CLIENTUSERS', goto: '/admin/clientUsers', visible: () => this.authorization && this.authorization.isAdmin },
      { translationCode: 'ADMIN.SHARED.EPSUSERS', goto: '/admin/epsUsers', visible: () => this.authorization && this.authorization.isAdmin },
      { translationCode: 'ADMIN.SHARED.INVITATION_DATES', goto: '/admin/dates', visible: () => this.authorization && this.authorization.isAgent },
      { translationCode: 'ADMIN.I18N.LABEL', goto: '/admin/i18n', visible: () => this.authorization && this.authorization.isAdmin },
      { translationCode: 'SHARED.HEADER.FAQ', goto: '/faq', visible: () => true },
      { translationCode: 'SHARED.HEADER.CONTACT_US', goto: '/contact', visible: () => true },
      { translationCode: 'SHARED.HEADER.EMAIL_ACTORS', goto: '/email-actors', visible: () => this.customerInfoLoaded && this.authorization && this.authorization.useEmailActors },
      { translationCode: 'SHARED.HEADER.TUTORIALS', goto: '/tutorials', visible: () => util.deviceType() === 'desktop' },
    ];
    // @formatter:on
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.visibleModules = (this.modules || []).filter(module => module.visible() && this.loggedIn);
    this.visibleHeaderModules = (this.headerModules || []).filter(module => module.visible());
    this.visibleMobileModules = [...this.visibleModules, ...this.visibleHeaderModules].filter(module => !module.hideOnMobile);
  }

  get loggedIn(): boolean {
    return !!this.firstName || !!this.activeCustomer;
  }

  moduleClicked(module: Module) {
    if (!module.disabled) {
      this.openModule.emit(this.getGoto(module));
    }
  }

  private getGoto(module: Module) {
    if (typeof module.goto === 'function') {
      return module.goto();
    } else {
      return module.goto;
    }
  }

  closeMobileMenu() {
    if (this.openMobileMenu) {
      this.openMobileMenu = !this.openMobileMenu;
    }
  }

  isActive(module: Module, path: string) {
    return path.indexOf(this.getGoto(module)) === 0 || (module.pathRegexs && module.pathRegexs.find(p => {
      const test = p.exec(path);
      return test && test.length === 1 && test[0] === path;
    }));
  }

  private isAuthorized = (screen) => this.authorization && this.authorization.ACCESS[screen];
}
