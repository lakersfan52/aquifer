// @ts-check
import { key } from './Key';
import { log } from './AquiferLog';
import { UiContainer } from './UiContainer';
import { AquiferFunctionalPersister } from './AquiferFunctionalPersister';

const timeoutWdio = require('../wdio-conf/wdio.conf').config.waitforTimeout;

/**
 * WebElement wrapper - allows for:
 * 1.  custom actions (click, hover, etc) to wait for target before attempting action.
 * 2.  custom logging per relevant action
 * 3.  child web elements
 */
export class UiElement extends UiContainer {
  static $(selector) {
    return new UiElement(selector);
  }

  /**
     * @param {String} selector - xpath or css selector
     */
  constructor(selector) {
    super();
    this.selector = selector;
    this.isLoadCriterion = false;
    this.parentPage = undefined;
  }

  setName(name) {
    return super.setName(name);
  }

  /**
   * Marks the given UiElement as being a critical component of its parent container.  Absence of this item in the DOM means the parent container is not loaded.
   */
  tagAsLoadCriterion() {
    this.isLoadCriterion = true;
    return this;
  }

  /* eslint class-methods-use-this: "off" */
  getWebElement(timeout = timeoutWdio) {
    this.waitForExist(timeout);
    return browser.element(this.selector);
  }

  getWebElements(timeout = timeoutWdio) {
    this.waitForExist(timeout);
    return $$(this.selector);
  }

  getHtml(timeout = timeoutWdio) {
    return new AquiferFunctionalPersister(timeout)
      .setPrecondition(() => this.waitForExist(timeout))
      .setGoal(() => this.getWebElement().getHTML())
      .failfastWithMessage(`timeout trying to get html for ${this.selector}`)
      .start();
  }

  /**
   * Returns a child UiElement component with the given relative selector.
   * @param {string} selector must match parent selector style (xpath vs css-selector)
   */
  get(selector) {
    if (this.selector.startsWith('/') && selector.startsWith('/')) {
      return new UiElement(this.selector + selector);
    }
    if (!this.selector.startsWith('/') && !selector.startsWith('/')) {
      return new UiElement(`${this.selector} ${selector}`);
    }

    throw new Error(
      `Parent and child elements must have selectors of the same type. Parent: <${this.selector}>, Child: <${selector}>.`,
    );
  }

  getChildren(selector) {
    if (this.selector.startsWith('/') && selector.startsWith('/')) {
      return this.findWebElements(this.selector + selector);
    }
    if (!this.selector.startsWith('/') && !selector.startsWith('/')) {
      return this.findWebElements(`${this.selector} ${selector}`);
    }

    throw new Error(
      `Parent and child elements must have selectors of the same type. Parent: <${this.selector}>, Child: <${selector}>.`,
    );
  }


  /** Returns an array of text values of all web elements currently matching the given UiElement's selector. */
  getTexts() {
    const wes = this.getWebElements();

    const texts = [];

    wes.forEach((we) => {
      texts.push(we.getText());
    });
    return texts;
  }

  getText(timeout = timeoutWdio) {
    return this.getWebElement(timeout).getText();
  }

  click({ doLogAndWait = true, timeout = timeoutWdio } = {}) {
    if (doLogAndWait) {
      this.logAndWait([
        { text: '👇 ', style: log.style.emoji },
        { text: 'Click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: `${this.selector}`, style: log.style.selector }], timeout);
    }
    browser.click(this.selector);
  }

  click_ifExists(timeout = timeoutWdio) {
    if (this.isExisting()) {
      this.logAndWait([
        { text: '👇 ', style: log.style.emoji },
        { text: 'Click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: `${this.selector}`, style: log.style.selector }], timeout);
      browser.click(this.selector);
    }
  }

  doubleClick({ doLog = true, timeout = timeoutWdio } = {}) {
    if (doLog) {
      this.logAndWait([
        { text: '👇👇 ', style: log.style.emoji },
        { text: 'Double-click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: `${this.selector}`, style: log.style.selector }], timeout);
    }
    browser.click(this.selector);
  }

  /**
   * I think this places the mouse over the center of the element and scrolls the page so the entire element is within view.
   */
  hover({ doLog = true, timeout = timeoutWdio } = {}) {
    if (doLog) {
      this.logAndWait([
        { text: '🕴  ', style: log.style.emoji },
        { text: 'Hover ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: `${this.selector}`, style: log.style.selector }], timeout);
    }
    browser.moveToObject(this.selector);
    return this;
  }

  scroll(timeout = timeoutWdio) {
    return this.hover({ doLog: false, timeout });
  }

  click_waitForChange({ indicatorSelector = '//body', doLog = true, timeout = timeoutWdio } = {}) {
    const initialIndicatorElementHtml = browser.element(indicatorSelector).getHTML();
    doLog
      && this.logAndWait([
        { text: '👇 ', style: log.style.emoji },
        { text: 'Click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: 'then wait for change in ', style: log.style.filler },
        { text: indicatorSelector, style: log.style.selector },
        { text: ' target: ', style: log.style.filler },
        { text: `${this.selector} `, style: log.style.selector }], timeout);

    browser.click(this.selector);

    const goal = () => browser.element(indicatorSelector).getHTML() !== initialIndicatorElementHtml;

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .setConsequence(() => log.saveScreenshotWhileWaiting())
      .start();

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .failfastWithMessage(`Timeout waiting ${timeout} ms for ${indicatorSelector} to change after clicking ${this.selector}`)
      .start();
  }

  click_waitForExisting(indicatorSelector, timeout = timeoutWdio) {
    if (browser.isExisting(indicatorSelector)) {
      throw new Error(`Element already exists: ${indicatorSelector}`);
    }
    this.logAndWait([
      { text: '👇 ', style: log.style.emoji },
      { text: 'Click ', style: log.style.verb },
      { text: `${this.stuartname} `, style: log.style.object },
      { text: 'then wait for element to exist: ', style: log.style.filler },
      { text: indicatorSelector, style: log.style.selector },
      { text: ' target: ', style: log.style.filler },
      { text: `${this.selector} `, style: log.style.selector }, timeout]);

    browser.click(this.selector);

    const goal = () => browser.isExisting(indicatorSelector);

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .setConsequence(() => log.saveScreenshotWhileWaiting())
      .start();

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .failfastWithMessage(`Timeout waiting ${timeout} ms for ${indicatorSelector} to exist after clicking ${this.selector}`)
      .start();
  }

  /**
   * Clicks each instance of the given webelement assuming it disappears upon click.
   */
  clickAll_disappearing(timeout = timeoutWdio) {
    this.logAndWait([
      { text: '👇 ', style: log.style.emoji },
      { text: 'Click to remove all instances of ', style: log.style.verb },
      { text: `${this.stuartname} `, style: log.style.object },
      { text: this.selector, style: log.style.selector }, timeout]);

    this.click_waitForChange({ doLog: false });

    while (this.isExisting()) {
      this.click_waitForChange({ doLog: false });
    }
  }


  click_waitForNotExisting({ indicatorSelector = this.selector, timeout = timeoutWdio } = {}) {
    if (indicatorSelector === this.selector) {
      this.logAndWait([
        { text: '👇 ', style: log.style.emoji },
        { text: 'Click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: 'then wait for target to disappear ', style: log.style.filler },
        { text: indicatorSelector, style: log.style.selector }, timeout]);
    } else {
      this.logAndWait([
        { text: '👇 ', style: log.style.emoji },
        { text: 'Click ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: 'then wait for element to disappear: ', style: log.style.filler },
        { text: indicatorSelector, style: log.style.selector },
        { text: ' target: ', style: log.style.filler },
        { text: `${this.selector} `, style: log.style.selector }, timeout]);
    }
    browser.click(this.selector);

    browser.waitUntil(() => !browser.isExisting(indicatorSelector), timeout);
  }

  setValue(value, { maskTextInLogs = false, timeout = timeoutWdio } = {}) {
    if (typeof value === 'number') {
      throw new Error('input can be string or array, not number');
    }
    this.logAndWait([
      { text: '⌨  ', style: log.style.emoji },
      { text: 'Set value ', style: log.style.verb },
      { text: 'of ', style: log.style.filler },
      { text: `${this.stuartname} `, style: log.style.object },
      { text: 'to ', style: log.style.filler },
      { text: `${value} `, style: maskTextInLogs ? log.style.password : log.style.object },
      { text: `${this.selector} `, style: log.style.selector }], timeout);

    /* note: browser.setValue doesn't work with the WS editor in branch rules. */

    this.clear({ doLog: false, timeout });
    this.keys(value, 1, false);
  }

  /**
   * Deletes all values in a field using backspace and delete keys.
   */
  clear({ doLog = true, timeout = timeoutWdio } = {}) {
    doLog
      && this.logAndWait([
        { text: '✨ ', style: log.style.emoji },
        { text: 'Clear ', style: log.style.verb },
        { text: `${this.stuartname} `, style: log.style.object },
        { text: `${this.selector} `, style: log.style.selector }], timeout);

    this.click({ doLogAndWait: false, timeout });
    this.sleep(100);
    this.keys(key.DELETE, 20, key.BACKSPACE, 40, false);
  }

  /** If event screenshots are being saved, attempt to hover over an object prior to interacting with it so that the mouse-over state is captured in the image.  */
  failSafeHover(timeout = timeoutWdio) {
    try {
      browser.waitUntil(() => (browser.isExisting(this.selector)), timeout);
      browser.moveToObject(this.selector);
    } catch (err) {
      // do nothing.
    }
  }

  logAndWait(messages, timeout = timeoutWdio) {
    if (!this.name) {
      throw new Error(`Found ${this.constructor.name} with no name.  Make sure that the constructor for each class extending UiContainer ends with super.nameElements(). selector: ${this.selector}`);
    }
    if (log.doSaveEventScreenshots) {
      this.failSafeHover(timeout);
    }
    const screenshotId = log.logRichMessages(messages);

    log.saveEventScreenshot(screenshotId);

    this.waitForExist(timeout);
  }

  clickAndType(value, timeout = timeoutWdio) {
    this.logAndWait([
      { text: '👇 ', style: log.style.emoji },
      { text: 'Click ', style: log.style.verb },
      { text: this.stuartname, style: log.style.object },
      { text: ' and ', style: log.style.filler },
      { text: 'type ', style: log.style.verb },
      { text: value, style: log.style.object },
      { text: ` ${this.selector}`, style: log.style.selector }], timeout);

    browser.click(this.selector);

    browser.keys(value);
  }

  /**
   *
   * @param {UiElement} destination
   */
  dragAndDropTo(destination, timeout = timeoutWdio) {
    this.logAndWait([
      { text: '🏎  ', style: log.style.emoji },
      { text: 'Drag ', style: log.style.verb },
      { text: this.stuartname, style: log.style.object },
      { text: ' to ', style: log.style.filler },
      { text: destination.stuartname, style: log.style.object },
      { text: ' [', style: log.style.filler },
      { text: this.selector, style: log.style.selector },
      { text: '], [', style: log.style.filler },
      { text: destination.selector, style: log.style.selector },
      { text: ']', style: log.style.filler }], timeout);

    browser.dragAndDrop(this.selector, destination.selector);
  }

  uploadFile(filePath, timeout = timeoutWdio) {
    this.logAndWait([
      { text: '📂 ', style: log.style.emoji },
      { text: 'Upload file ', style: log.style.verb },
      { text: `${filePath} `, style: log.style.object },
      { text: 'to ', style: log.style.filler },
      { text: `${this.stuartname} `, style: log.style.object },
      { text: `${this.selector} `, style: log.style.selector }], timeout);

    browser.chooseFile(this.selector, filePath);
  }

  waitForText(text, timeout = timeoutWdio) {
    super.waitForLoad(timeout);
    const screenshotId = log.logRichMessages([
      { text: '🤔 ', style: log.style.emoji },
      { text: 'Assert ', style: log.style.verb },
      { text: this.stuartname, style: log.style.object },
      { text: "'s text is ", style: log.style.filler },
      { text, style: log.style.object },
      { text: ` ${this.selector}`, style: log.style.selector }]);

    this.waitForExist(timeout);

    const goal = () => text === this.getWebElement(timeout).getText();

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .setConsequence(() => log.saveScreenshotWhileWaiting())
      .start();

    new AquiferFunctionalPersister(timeout / 2)
      .setGoal(goal)
      .failfastWithMessageRunner(() => `Element "${this.stuartname}"'s text is "${this.getWebElement(timeout).getText()}" after ${timeout} ms.  Expected: "${text}". Selector: ${this.selector}`)
      .start();

    log.saveEventScreenshot(screenshotId);
  }

  waitForNotExist(timeout = timeoutWdio) {
    try {
      browser.waitUntil(() => !browser.isExisting(this.selector), Math.round(timeout / 2));
    } catch (err) {
      log.saveScreenshotWhileWaiting();
    }
    try {
      browser.waitUntil(() => !browser.isExisting(this.selector), timeout);
    } catch (err) {
      throw new Error(`Error waiting for ${this.stuartname} to not exist within ${timeout} ms. Selector: ${this.selector}.  Original error: ${err} `);
    }
  }

  /**
   * Doesn't log.
   * @param {Number} timeout in milliseconds
   */
  waitForExist(timeout = timeoutWdio) {
    try {
      browser.waitUntil(() => browser.isExisting(this.selector), Math.round(timeout / 2));
    } catch (err) {
      log.saveScreenshotWhileWaiting();
    }

    try {
      browser.waitUntil(() => browser.isExisting(this.selector), Math.round(timeout / 2));
    } catch (err) {
      throw new Error(`Error finding ${this.stuartname} within ${timeout} ms. Selector: ${this.selector}.  Original error: ${err} `);
    }
    return true;
  }

  /**
   * This is not a super reliable function since selenium isn't 100% accurate at determining visibility.
   * @param {Number} timeout in milliseconds
   */
  waitForVisible(timeout = timeoutWdio) {
    try {
      browser.waitUntil(() => browser.isVisible(this.selector), Math.round(timeout / 2));
    } catch (err) {
      log.saveScreenshotWhileWaiting();
    }
    try {
      browser.waitUntil(() => browser.isVisible(this.selector), timeout);
    } catch (err) {
      throw new Error(`Error finding visible ${this.stuartname} within ${timeout} ms. Selector: ${this.selector}.  Original error: ${err} `);
    }
  }

  isExisting() {
    return browser.isExisting(this.selector);
  }

  /* eslint guard-for-in: "off", no-restricted-syntax: "off" */
  /**
   * This adds a custom name parameter to each element object so that the variable's name
   * can be displayed in the ui test logs instead of just a potentially cryptic selector.
   *
   * This was inspired by the idea that maybe we should avoid using visible values in selectors to prepare for multi-language support
   */
  nameElements() {
    for (const propName in this) {
      const propValue = this[propName];
      if (propValue instanceof UiElement) {
        propValue.setName(propName);
      }
    }
  }
}
