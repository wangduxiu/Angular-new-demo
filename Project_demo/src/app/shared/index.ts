// this is a barrel file, this file re-exports all exports of this module

// modules
export * from './angular-material/angular-material.module';
export * from './shared.module';

// components
export { PageNotFoundComponent } from './page-not-found/page-not-found.component';
export * from './work-in-progress/work-in-progress.component';
export * from './unsupported-browser/unsupported-browser.component';

// routes
export * from './shared-routing.module';

