"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fastWebpage = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _Page2 = require("aquifer/lib/Page");

// @ts-check
// @ts-check
// import { Page } from 'aquifer/Page';
// @ts-check
// import { Page } from '../../../aquifer/Page';
var fastWebpage = new (
/*#__PURE__*/
function (_Page) {
  (0, _inherits2.default)(FastWebpage, _Page);

  function FastWebpage() {
    var _this;

    (0, _classCallCheck2.default)(this, FastWebpage);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FastWebpage).call(this, 'https://varvy.com/pagespeed/wicked-fast.html'));
    _this.feedTheBotImage = _this.get('.head a').tagAsLoadCriterion();
    _this.nonexistentElement = _this.get('.awefiwefisjdlfis');
    _this.h2 = _this.get('//h2[text()="Gaze at my beauty, humans, but gaze not long"]').tagAsLoadCriterion();
    (0, _get2.default)((0, _getPrototypeOf2.default)(FastWebpage.prototype), "nameElements", (0, _assertThisInitialized2.default)(_this)).call((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  return FastWebpage;
}(_Page2.Page))();
exports.fastWebpage = fastWebpage;
//# sourceMappingURL=fastWebpage.page.js.map