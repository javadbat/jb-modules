'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ExceptionHandler =
/*#__PURE__*/
function () {
  function ExceptionHandler() {
    _classCallCheck(this, ExceptionHandler);
  }

  _createClass(ExceptionHandler, [{
    key: "newException",
    value: function newException(exception, message) {
      var ErrorPrefix = []; //NetWork Error

      if (exception && exception.header != undefined && exception.status != undefined && exception.url != undefined) {
        ErrorPrefix.push('Network Error happend');
      }

      if (exception && exception.message == "Failed to fetch") {
        //در این حالت اصلا به سرور متصل نشدیم که میتواند دلایل گوناگونی داشته باشد
        ErrorPrefix.push('we cant connect to server');

        if (!navigator.onLine) {
          //اگر اتصالات شبکه قطع باشند این پیام ارسال میشود
          ErrorPrefix.push('please check your internet connection');
          alert('لطفا اتصال اینترنت خود را بررسی نمایید');
        }
      }

      if (exception && exception.errorCode == 1015) {
        ErrorPrefix.push({
          message: 'your specified address with specified method is not exist',
          requestAddress: exception.path
        });
      }

      console.error(message, ErrorPrefix, exception);
    }
  }]);

  return ExceptionHandler;
}();

var ExceptionHandler$1 = new ExceptionHandler();

module.exports = ExceptionHandler$1;
