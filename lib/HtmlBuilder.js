"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = void 0;

var _htmlEntities = require("html-entities");

// @ts-check
var entities = new _htmlEntities.AllHtmlEntities();
var html = {
  link: function link(classValue, text) {
    return "<span class=\"".concat(classValue, "\"><a href=").concat(text, ">").concat(entities.encode(text), "</a></span>");
  },
  text: function text(classValue, _text) {
    return "<span class=\"".concat(classValue, "\">").concat(entities.encode(_text), "</span>");
  },
  dblclickableSelector: function dblclickableSelector(classValue, text) {
    return "\n<span class=\"".concat(classValue, " monospace;\"  ondblclick=\"dblclickSelectorSpan(this);\">\n    <span class='selector-text'>").concat(entities.encode(text), "</span>\n    <input onblur=\"blurSelectorInput(this);\" type='text'  value='").concat(entities.encode(text), "'>\n</span>");
  },
  pageInitialize: function pageInitialize(specFileTestlessName, doSaveEventScreenshots, relativeSpecFilePath) {
    return "\n    <!doctype html>\n      <head>\n        <title>".concat(specFileTestlessName, " - aquifer</title>\n        <link rel=\"icon\" href=\"icon/favicon.png\" type=\"image/x-icon\">\n      </head>\n      <style>\n        body {\n          background-color: #f5f5f5\n        }\n        a:link {\n          color: inherit;\n        }\n        a:visited {\n          color: inherit;\n        }\n        a:hover {\n          color: inherit;\n        }\n        a:active {\n          color: inherit;\n        }\n        a:link {\n          text-decoration: none;\n        }\n        a:visited {\n          text-decoration: none;\n        }\n        a:hover {\n          text-decoration: underline;\n        }\n        .selector-text:hover {\n          color: darkgray;\n          background-color: azure !important;\n        }\n        .header img {\n          padding-left: 10px;\n          float: left;\n          width: 50px;\n          height: 50px;\n        }\n        .header h1 {\n          position: relative;\n          top: 8px;\n          left: 10px;\n        }\n        .monospace {font-family: monospace;}\n        input {display:none;font-family:inherit;font-size:inherit;height:12px;margin-left:-3px;margin-right:-4px;}\n        .red {color:red;}\n        .green {color:green;}\n        .blue {color:blue;}\n        .gray {color:#C8C8C8;}\n        .bold {font-weight:bold;}\n        .italic {font-style:italic;}\n        .bold {font-weight:bold;}\n        .gray {color:#C8C8C8;}\n        .emoji {font-size:11px;}\n        .gray {color:#C8C8C8;}\n        .whitespace {white-space:pre;}\n        #eventImage {position:fixed;bottom:0;right:0;width:45%;border:1px solid blue;}\n      </style>\n\n      <script>\n        function dblclickSelectorSpan(e) {\n          e.firstElementChild.style.display = 'none';\n          e.lastElementChild.style.width = ((e.lastElementChild.value.length) * 8) + 'px';\n          e.lastElementChild.style.display = 'inline';\n          // e.lastElementChild.focus();\n          e.lastElementChild.select();\n        }\n        function blurSelectorInput(e) {\n          e.style.display = 'none';\n          e.parentElement.firstElementChild.style.display = 'inline';\n        }\n\n\n        function logEntryMouseover(screenshotId, eventScreenshotFileRelPath) {\n          var elements = document.getElementsByClassName('logline');\n          for (var i = 0; i < elements.length; i++) {\n            elements[i].style.backgroundColor=\"inherit\"; //to undo highlighting of prev log line\n          }\n          ").concat(doSaveEventScreenshots ? 'document.images["eventImage"].src=eventScreenshotFileRelPath;' : '', "\n          document.getElementById('entrySpan'+screenshotId).style.backgroundColor=\"white\";\n        }\n      </script>\n      ").concat(doSaveEventScreenshots ? '<img src="" id="eventImage"/>' : '', "\n      \n      <div class=\"header\">\n        <img src=\"icon/icon.svg\" alt=\"logo\" />\n        <h1>").concat(relativeSpecFilePath, "</h1>\n      </div>\n      ");
  }
};
exports.html = html;
//# sourceMappingURL=HtmlBuilder.js.map