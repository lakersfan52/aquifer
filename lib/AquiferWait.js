"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AquiferWait = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// @ts-check
var AquiferWait =
/*#__PURE__*/
function () {
  function AquiferWait() {
    (0, _classCallCheck2.default)(this, AquiferWait);
  }

  (0, _createClass2.default)(AquiferWait, null, [{
    key: "sleep",
    value: function sleep(timeoutMillis) {
      browser.pause(timeoutMillis);
    }
  }]);
  return AquiferWait;
}();

exports.AquiferWait = AquiferWait;
//# sourceMappingURL=AquiferWait.js.map