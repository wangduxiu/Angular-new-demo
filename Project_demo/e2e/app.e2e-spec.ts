import { EuropoolWebportalPage } from './app.po';

describe('europool-webportal App', () => {
  let page: EuropoolWebportalPage;

  beforeEach(() => {
    page = new EuropoolWebportalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
