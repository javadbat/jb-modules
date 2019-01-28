'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AddressConfig =
/*#__PURE__*/
function () {
  function AddressConfig() {
    _classCallCheck(this, AddressConfig);

    _defineProperty(this, "currentMode", "develop");

    _defineProperty(this, "_bidopinServiceURL", {
      beta: "https://j-beta.bidopin.com",
      userAcceptanceTest: "https://erebus.bidopin.com",
      realDataTest: "https://realDataTest.bidopin.com",
      production: "https://aether.bidopin.com"
    });
  }

  _createClass(AddressConfig, [{
    key: "bidopinServiceURL",
    get: function get() {
      switch (this.currentMode) {
        case "develop":
          return this._bidopinServiceURL.beta;
          break;

        case "uat":
          return this._bidopinServiceURL.userAcceptanceTest;
          break;

        case "deploy":
          return this._bidopinServiceURL.production;
          break;

        case "realDataTest":
          return this._bidopinServiceURL.realDataTest;
          break;
      }
    }
  }]);

  return AddressConfig;
}();

var addressConfiginstance = new AddressConfig();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GeneralConfig = function GeneralConfig() {
  _classCallCheck$1(this, GeneralConfig);

  _defineProperty$1(this, "addressConfig", addressConfiginstance);
};

var GeneralConfig$1 = new GeneralConfig();

module.exports = GeneralConfig$1;
