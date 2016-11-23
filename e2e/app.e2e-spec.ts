import { NgTerminalPage } from './app.po';

describe('ng-terminal App', function() {
  let page: NgTerminalPage;

  beforeEach(() => {
    page = new NgTerminalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
