'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">angular-template documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-b0f494aa7f03dcec37b5a3cc26baaa4b"' : 'data-target="#xs-injectables-links-module-AppModule-b0f494aa7f03dcec37b5a3cc26baaa4b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b0f494aa7f03dcec37b5a3cc26baaa4b"' :
                                        'id="xs-injectables-links-module-AppModule-b0f494aa7f03dcec37b5a3cc26baaa4b"' }>
                                        <li class="link">
                                            <a href="injectables/RouterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RouterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-c9a716fe7ce98c9a9a19ca8d0ff0e5f7"' : 'data-target="#xs-injectables-links-module-CoreModule-c9a716fe7ce98c9a9a19ca8d0ff0e5f7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-c9a716fe7ce98c9a9a19ca8d0ff0e5f7"' :
                                        'id="xs-injectables-links-module-CoreModule-c9a716fe7ce98c9a9a19ca8d0ff0e5f7"' }>
                                        <li class="link">
                                            <a href="injectables/UtilService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UtilService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomeModule-147879c33de09dc7814334a83f1731a6"' : 'data-target="#xs-components-links-module-HomeModule-147879c33de09dc7814334a83f1731a6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-147879c33de09dc7814334a83f1731a6"' :
                                            'id="xs-components-links-module-HomeModule-147879c33de09dc7814334a83f1731a6"' }>
                                            <li class="link">
                                                <a href="components/HomeContainer.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeContainer</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link">HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-d1140f7c9bb32a34cb5f27b23b83f30f"' : 'data-target="#xs-pipes-links-module-SharedModule-d1140f7c9bb32a34cb5f27b23b83f30f"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-d1140f7c9bb32a34cb5f27b23b83f30f"' :
                                            'id="xs-pipes-links-module-SharedModule-d1140f7c9bb32a34cb5f27b23b83f30f"' }>
                                            <li class="link">
                                                <a href="pipes/ShortenPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShortenPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppContainer.html" data-type="entity-link">AppContainer</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractContainer.html" data-type="entity-link">AbstractContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppError.html" data-type="entity-link">AppError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Back.html" data-type="entity-link">Back</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadInputError.html" data-type="entity-link">BadInputError</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseRestService.html" data-type="entity-link">BaseRestService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomRouteSerializer.html" data-type="entity-link">CustomRouteSerializer</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailValidators.html" data-type="entity-link">EmailValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/Forward.html" data-type="entity-link">Forward</a>
                            </li>
                            <li class="link">
                                <a href="classes/Go.html" data-type="entity-link">Go</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundError.html" data-type="entity-link">NotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sandbox.html" data-type="entity-link">Sandbox</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCulture.html" data-type="entity-link">SetCulture</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetLanguage.html" data-type="entity-link">SetLanguage</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetOnline.html" data-type="entity-link">SetOnline</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppSandbox.html" data-type="entity-link">AppSandbox</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RouterService.html" data-type="entity-link">RouterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilService.html" data-type="entity-link">UtilService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RouterStateUrl.html" data-type="entity-link">RouterStateUrl</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link">Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/State.html" data-type="entity-link">State</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});