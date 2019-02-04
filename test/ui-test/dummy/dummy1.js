// @ts-check
import { AquiferAssert, Page } from '../../../src';


describe('DummyParent1', () => {
  describe('Dummy1', () => {
    it('go home1', () => {
      new Page('https://www1.ticketmaster.com/cher-here-we-go-again-tour/event/2D0055259EAD4279?f_PPL=true&ab=efeat5787v1')
      // new Page('https://www.google.com')
        .load()
        .sleep(10000);
    });

    it('go home2', () => {
      // throw new Error('failing the test');
    });

    it('go home3', () => {
    });
  });
});
