"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AquiferAssert", {
  enumerable: true,
  get: function get() {
    return _AquiferAssert.AquiferAssert;
  }
});
Object.defineProperty(exports, "AquiferFunctionalPersister", {
  enumerable: true,
  get: function get() {
    return _AquiferFunctionalPersister.AquiferFunctionalPersister;
  }
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function get() {
    return _AquiferLog.log;
  }
});
Object.defineProperty(exports, "AquiferTaskPersister", {
  enumerable: true,
  get: function get() {
    return _AquiferTaskPersister.AquiferTaskPersister;
  }
});
Object.defineProperty(exports, "AquiferTimer", {
  enumerable: true,
  get: function get() {
    return _AquiferTimer.AquiferTimer;
  }
});
Object.defineProperty(exports, "AquiferWait", {
  enumerable: true,
  get: function get() {
    return _AquiferWait.AquiferWait;
  }
});
Object.defineProperty(exports, "key", {
  enumerable: true,
  get: function get() {
    return _Key.key;
  }
});
Object.defineProperty(exports, "Page", {
  enumerable: true,
  get: function get() {
    return _Page.Page;
  }
});
Object.defineProperty(exports, "UiContainer", {
  enumerable: true,
  get: function get() {
    return _UiContainer.UiContainer;
  }
});
Object.defineProperty(exports, "UiElement", {
  enumerable: true,
  get: function get() {
    return _UiElement.UiElement;
  }
});
exports.iconDir = void 0;

var fs = _interopRequireWildcard(require("fs"));

var _AquiferAssert = require("./AquiferAssert");

var _AquiferFunctionalPersister = require("./AquiferFunctionalPersister");

var _AquiferLog = require("./AquiferLog");

var _AquiferTaskPersister = require("./AquiferTaskPersister");

var _AquiferTimer = require("./AquiferTimer");

var _AquiferWait = require("./AquiferWait");

var _Key = require("./Key");

var _Page = require("./Page");

var _UiContainer = require("./UiContainer");

var _UiElement = require("./UiElement");

// @ts-check
var iconDir = fs.existsSync('./icon') ? './icon' : './node_modules/aquifer/icon';
exports.iconDir = iconDir;
//# sourceMappingURL=index.js.map