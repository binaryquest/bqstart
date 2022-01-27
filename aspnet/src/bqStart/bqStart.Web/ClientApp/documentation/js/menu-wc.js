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
                    <a href="index.html" data-type="index-link">BQ Start Prime Angular Documents</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/BQStartPrimeModule.html" data-type="entity-link" >BQStartPrimeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' : 'data-target="#xs-components-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' :
                                            'id="xs-components-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                            <li class="link">
                                                <a href="components/AppLayout.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppLayout</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BaseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BaseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BaseFormView.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BaseFormView</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BaseListView.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BaseListView</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BqDropdownField.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BqDropdownField</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BqForm.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BqForm</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BqPasswordField.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BqPasswordField</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BqTextArea.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BqTextArea</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BqTextField.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BqTextField</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Breadcrumb.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Breadcrumb</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChipsMenu.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChipsMenu</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CustomFilter.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomFilter</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DynamicLoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DynamicLoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DynamicMDILoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DynamicMDILoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterBar.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterBar</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormBlock.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormBlock</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MDIComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MDIComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MDILayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MDILayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuBar.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MenuBar</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Table.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Table</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableColumn.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableColumn</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableFilter.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableFilter</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableFilters.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableFilters</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopBar.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TopBar</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopMenuBar.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TopMenuBar</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewWrapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewWrapper</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' : 'data-target="#xs-directives-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' :
                                        'id="xs-directives-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                        <li class="link">
                                            <a href="directives/BQTemplate.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BQTemplate</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/CompareDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompareDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ControlContainerDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ControlContainerDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DynamicHostDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DynamicHostDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' : 'data-target="#xs-injectables-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' :
                                        'id="xs-injectables-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                        <li class="link">
                                            <a href="injectables/AppInitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppInitService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthorizeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthorizeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DialogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocaleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocaleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogPublishersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogPublishersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MainRegionAdapterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainRegionAdapterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MetaDataService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetaDataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NavigationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavigationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RouterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ViewWrapperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewWrapperService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' : 'data-target="#xs-pipes-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' :
                                            'id="xs-pipes-links-module-BQStartPrimeModule-f8c79c0006275f0ab2de05d9a9ae248347d320a6d62c32eb89b60e8cb986d9080e35659b78db414d572ca7c3445328fc88e783e7c567157c01c011ac7eb05c64"' }>
                                            <li class="link">
                                                <a href="pipes/BoolToYesNoPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoolToYesNoPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ModelValuePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelValuePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PasswordPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordPipe</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/BaseField.html" data-type="entity-link" >BaseField</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppInjector.html" data-type="entity-link" >AppInjector</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseMenu.html" data-type="entity-link" >BaseMenu</a>
                            </li>
                            <li class="link">
                                <a href="classes/BQConfigData.html" data-type="entity-link" >BQConfigData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataServiceOptions.html" data-type="entity-link" >DataServiceOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterByClause.html" data-type="entity-link" >FilterByClause</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocaleId.html" data-type="entity-link" >LocaleId</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogConsole.html" data-type="entity-link" >LogConsole</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogEntry.html" data-type="entity-link" >LogEntry</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogLocalStorage.html" data-type="entity-link" >LogLocalStorage</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogPublisher.html" data-type="entity-link" >LogPublisher</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogPublisherConfig.html" data-type="entity-link" >LogPublisherConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageBusPayLoad.html" data-type="entity-link" >MessageBusPayLoad</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetadataField.html" data-type="entity-link" >MetadataField</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModelMetadata.html" data-type="entity-link" >ModelMetadata</a>
                            </li>
                            <li class="link">
                                <a href="classes/OAuthConfig.html" data-type="entity-link" >OAuthConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/ODataResponse.html" data-type="entity-link" >ODataResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderByClause.html" data-type="entity-link" >OrderByClause</a>
                            </li>
                            <li class="link">
                                <a href="classes/PredefinedFilter.html" data-type="entity-link" >PredefinedFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Predicate.html" data-type="entity-link" >Predicate</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrimaryKey.html" data-type="entity-link" >PrimaryKey</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouteData.html" data-type="entity-link" >RouteData</a>
                            </li>
                            <li class="link">
                                <a href="classes/RunningConfigHelper.html" data-type="entity-link" >RunningConfigHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/Subscription.html" data-type="entity-link" >Subscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableParams.html" data-type="entity-link" >TableParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypeSystem.html" data-type="entity-link" >TypeSystem</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewOptionalData.html" data-type="entity-link" >ViewOptionalData</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewRunningData.html" data-type="entity-link" >ViewRunningData</a>
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
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppInitService.html" data-type="entity-link" >AppInitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorizeService.html" data-type="entity-link" >AuthorizeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DialogService.html" data-type="entity-link" >DialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GenericDataService.html" data-type="entity-link" >GenericDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InternalLogService.html" data-type="entity-link" >InternalLogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocaleService.html" data-type="entity-link" >LocaleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogPublishersService.html" data-type="entity-link" >LogPublishersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogService.html" data-type="entity-link" >LogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MainRegionAdapterService.html" data-type="entity-link" >MainRegionAdapterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetaDataService.html" data-type="entity-link" >MetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RouterService.html" data-type="entity-link" >RouterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ViewWrapperService.html" data-type="entity-link" >ViewWrapperService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthorizeInterceptor.html" data-type="entity-link" >AuthorizeInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthorizeGuard.html" data-type="entity-link" >AuthorizeGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MetaDataResolver.html" data-type="entity-link" >MetaDataResolver</a>
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
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ApplicationPathsType.html" data-type="entity-link" >ApplicationPathsType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dictionary.html" data-type="entity-link" >Dictionary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnumItem.html" data-type="entity-link" >EnumItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FailureAuthenticationResult.html" data-type="entity-link" >FailureAuthenticationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseEvents.html" data-type="entity-link" >IBaseEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseFormViewEvents.html" data-type="entity-link" >IBaseFormViewEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseListViewEvents.html" data-type="entity-link" >IBaseListViewEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseView.html" data-type="entity-link" >IBaseView</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEditFormViewEvents.html" data-type="entity-link" >IEditFormViewEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INavigationState.html" data-type="entity-link" >INavigationState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INavigationState-1.html" data-type="entity-link" >INavigationState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuData.html" data-type="entity-link" >MenuData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RedirectAuthenticationResult.html" data-type="entity-link" >RedirectAuthenticationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SuccessAuthenticationResult.html" data-type="entity-link" >SuccessAuthenticationResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationData.html" data-type="entity-link" >ValidationData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ViewData.html" data-type="entity-link" >ViewData</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
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
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});