import { UiElement }  from '../../../aquifer';
/* eslint no-unused-vars: "off" */

// used for tracking down the wdio memory leak (it's in saving screenshots)

describe('DummyParent', () => {
  before(() => {
    browser.url('https://www.google.com/');
    browser.waitForExist('.RNNXgb', 20000);
  });
  it('dummyit1', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit2', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit3', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit4', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit5', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit6', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit7', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit8', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit9', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit10', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit11', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit12', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit13', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit14', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
  it('dummyit15', () => { browser.click('.RNNXgb'); const asdf = new UiElement('.RNNXgb').setName('x'); });
});
