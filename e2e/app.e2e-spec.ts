import { LinkrunPage } from './app.po';

describe('linkrun App', function() {
  let page: LinkrunPage;

  beforeEach(() => {
    page = new LinkrunPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
