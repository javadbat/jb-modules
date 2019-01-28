'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function Email(input) {
  if (this == undefined) {
    return new Email(input);
  }

  this.setValue(input);
}

Email.prototype = new Object();
Email._regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

Email.validate = function (input) {
  return Email._regex.test(input);
};

Email.prototype.getPremitiveValue = function () {
  return this.value;
};

Email.prototype.valueOf = function (input) {
  return this.getPremitiveValue();
};

Email.prototype.toString = function (input) {
  return this.getPremitiveValue();
};

Email.prototype.setValue = function (input) {
  var result = Email.validate(input);

  if (result) {
    var parts = Email._regex.exec(input);

    this.value = parts[0];
    this.localPart = parts[1];
    this.domain = parts[5];

    var _$exec = /(.+?)\.(.+)/.exec(this.domain);

    var _$exec2 = _slicedToArray(_$exec, 3);

    this.providerName = _$exec2[1];
    this.topLevelDomain = _$exec2[2];
    return this;
  } else {
    return NaN;
  }
};

exports.Email = Email;
