'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//باگ اول اینکه هنگام تبدیل میلادی به شمسی در سال های کبیسه یک روز کم میکند و در سال بعد کبیسه یک روز زیاد
//import ExceptionHandler from '../ExceptionHandler/ExceptionHandler'
var DateTimeConverter =
/*#__PURE__*/
function () {
  function DateTimeConverter() {
    _classCallCheck(this, DateTimeConverter);

    _defineProperty(this, "weekDayNames", ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه"]);

    _defineProperty(this, "monthNames", ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]);
  }

  _createClass(DateTimeConverter, [{
    key: "convertGregorianToJalali",
    value: function convertGregorianToJalali(year, month, day) {
      var _this = this;

      this.gregorianYear = parseInt(year);
      this.gregorianMonth = parseInt(month);
      this.gregorianDay = parseInt(day);
      this.jalaliYear = this.gregorianYear - 621; //بررسی اینکه آیا سال کبیسه است یا خیر

      this.IsKabisehYear = this.isJalaliKabisehYear(this.jalaliYear); //حالا محاسبه میکنیم از ابتدای سال میلادی تا تاریخ گفته شده چند روز گذشته است

      var yearPassedDay = (this.gregorianYear - 1) * 365; //محاسبه تعداد روز های گذشته از ماه مطابق جدول زیر بر حسب شماره ماه و تعداد روز های آن ماه محاسبه میشود

      this.gregorianMonthData = [{
        name: 'January',
        monthNumber: 1,
        dayCount: 31,
        sumDay: 31
      }, {
        name: 'February',
        monthNumber: 2,
        dayCount: this.IsKabisehYear ? 29 : 28,
        sumDay: 31 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'March',
        monthNumber: 3,
        dayCount: 31,
        sumDay: 62 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'April',
        monthNumber: 4,
        dayCount: 30,
        sumDay: 92 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'May',
        monthNumber: 5,
        dayCount: 31,
        sumDay: 123 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'June',
        monthNumber: 6,
        dayCount: 30,
        sumDay: 153 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'July',
        monthNumber: 7,
        dayCount: 31,
        sumDay: 184 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'August',
        monthNumber: 8,
        dayCount: 31,
        sumDay: 215 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'September',
        monthNumber: 9,
        dayCount: 30,
        sumDay: 245 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'Octobr',
        monthNumber: 10,
        dayCount: 31,
        sumDay: 276 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'November',
        monthNumber: 11,
        dayCount: 30,
        sumDay: 306 + (this.IsKabisehYear ? 29 : 28)
      }, {
        name: 'December',
        monthNumber: 12,
        dayCount: 31,
        sumDay: 337 + (this.IsKabisehYear ? 29 : 28)
      }];
      /* check validity 
      var testCount = 0;
      for(var month of  this.gregorianMonthData){
          testCount += month.dayCount;
          console.log("-"+month.sumDay+"-"+testCount);
      }
       end of check validity*/

      var monthPassedDay = 0;

      for (var i = 1; i < this.gregorianMonth; i++) {
        monthPassedDay += this.gregorianMonthData.find(function (x) {
          return x.monthNumber == i;
        }).dayCount;
      } //از مبدا تاریخ چند روز میلادی سپری شده


      var gregorianPassedDay = yearPassedDay + monthPassedDay + this.gregorianDay; //از اول تاریخ شمسی چند روز سپری شده

      var jalaliPassedDay = gregorianPassedDay - 226744;
      this.jalaliYear = Math.floor(jalaliPassedDay / 365);

      if (Math.floor(jalaliPassedDay / 365) != jalaliPassedDay / 365) {
        //اگر دقیقا اول سال نبود
        this.jalaliYear++;
      }

      var jalaliMonthDayRemain = jalaliPassedDay - (this.jalaliYear - 1) * 365; //روز های سپری شده برای هر ماه به صورت تجمعی در این تابع وجود دارد

      this.jalaliMonthData = [{
        monthNumber: 1,
        DayCount: 31,
        sumDay: 31
      }, {
        monthNumber: 2,
        DayCount: 31,
        sumDay: 62
      }, {
        monthNumber: 3,
        DayCount: 31,
        sumDay: 93
      }, {
        monthNumber: 4,
        DayCount: 31,
        sumDay: 124
      }, {
        monthNumber: 5,
        DayCount: 31,
        sumDay: 155
      }, {
        monthNumber: 6,
        DayCount: 31,
        sumDay: 186
      }, {
        monthNumber: 7,
        DayCount: 30,
        sumDay: 216
      }, {
        monthNumber: 8,
        DayCount: 30,
        sumDay: 246
      }, {
        monthNumber: 9,
        DayCount: 30,
        sumDay: 276
      }, {
        monthNumber: 10,
        DayCount: 30,
        sumDay: 306
      }, {
        monthNumber: 11,
        DayCount: 30,
        sumDay: 336
      }, {
        monthNumber: 12,
        DayCount: this.IsKabisehYear ? 30 : 29,
        sumDay: 336 + (this.IsKabisehYear ? 30 : 29)
      }];
      var prevMonthSumDay;
      this.JalaliMonth = this.jalaliMonthData.find(function (x, y) {
        if (x.sumDay >= jalaliMonthDayRemain) {
          if (_this.jalaliMonthData[y - 1]) {
            prevMonthSumDay = _this.jalaliMonthData[y - 1].sumDay;
          } else {
            //اگر ماه پیدا شده فروردین بود که ماه قبل نداشت
            prevMonthSumDay = 0;
          }

          return x;
        }
      }); //ابتدا روز شروع ماه را محاسبه میکنیم

      this.jalaliDay = jalaliMonthDayRemain - prevMonthSumDay;
      this.JalaliMonthNumber = this.JalaliMonth.monthNumber;
      return this.DateResponse(this.jalaliYear, this.JalaliMonthNumber, this.jalaliDay);
    }
  }, {
    key: "convertJalaliToGregorian",
    value: function convertJalaliToGregorian(year, month, day) {
      //ابتدا تعداد روز های سپری شده در تاریخ فعلی شمسی از ابتدا تا کنون را محاسبه میکنیم
      this.jalaliYear = parseInt(year);
      this.jalaliMonth = parseInt(month);
      this.jalaliDay = parseInt(day);
      this.gregorianYear = this.jalaliYear + 621; //بررسی اینکه آیا سال کبیسه است یا خیر

      this.IsKabisehYear = false;

      if (this.gregorianYear % 100 == 0 && this.gregorianYear % 400 == 0 || this.gregorianYear % 100 > 0 && this.gregorianYear % 4 == 0) {
        this.IsKabisehYear = true;
      }

      var marchDayDifferent; //اگر سال کبیسه نباشد اول فروردین را بیست مارچ قرار میدهیم

      if (this.IsKabisehYear == true) {
        marchDayDifferent = 12;
      } else {
        marchDayDifferent = 11;
      }

      var dayCount;

      if (this.jalaliMonth < 7) {
        dayCount = (this.jalaliMonth - 1) * 31 + this.jalaliDay;
      } else {
        dayCount = 6 * 31 + (this.jalaliMonth - 7) * 30 + this.jalaliDay;
      }

      if (dayCount < marchDayDifferent) {
        this.gregorianDay = dayCount + (31 - marchDayDifferent);
        this.gregorianMonth = 3; //this.gregorianYear   در بالا محاسبه شده است
      } else {
        var remainDay = dayCount - marchDayDifferent;
        var miladiMonth = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31];
        var miladiMonthLeap = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 29, 31];
        var i = 0;

        if (!this.isKabiseh(this.gregorianYear + 1)) {
          while (remainDay > miladiMonth[i]) {
            remainDay = remainDay - miladiMonth[i];
            i++;
          }
        } else {
          while (remainDay > miladiMonthLeap[i]) {
            remainDay = remainDay - miladiMonthLeap[i];
            i++;
          }
        }

        this.gregorianDay = remainDay;

        if (i > 8) {
          this.gregorianYear++;
          this.gregorianMonth = i - 8;
        } else {
          this.gregorianMonth = i + 4;
        }
      }

      return this.DateResponse(this.gregorianYear, this.gregorianMonth, this.gregorianDay);
    }
  }, {
    key: "isKabiseh",
    value: function isKabiseh(year) {
      //سال میلادی کبیسه را تشخیص میدهد
      var isKabiseYear = false;

      if (year % 100 == 0 && year % 400 == 0 || year % 100 > 0 && year % 4 == 0) {
        isKabiseYear = true;
      }

      return isKabiseYear;
    }
  }, {
    key: "isJalaliKabisehYear",
    value: function isJalaliKabisehYear(year) {
      //الگوریتم محاسبه سال کبیسه در تقویم جلالی
      var eightYearFlag = 0; //a

      var kabisehYearStart = 1309; //b

      for (var i = 1309; i <= year - 4; i += 4) {
        // اضافه کردن یک دوره سال کبیسه
        kabisehYearStart += 4; // اضافه کردن یک دوره برای برسی دوره ۸ ساله

        eightYearFlag += 1; //  

        if (eightYearFlag % 8 == 0) kabisehYearStart++;
      }

      if (year == kabisehYearStart) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "DateResponse",
    value: function DateResponse(year, month, day) {
      //تمام مقایر بازگشتی تبع از اینجا بازگشت داده میشود چرا که بعدا ممکن است فرمت بندی اضافه شود
      return {
        year: year,
        month: month,
        day: day
      };
    }
  }]);

  return DateTimeConverter;
}();

var DateTimeConverter$1 = new DateTimeConverter();

module.exports = DateTimeConverter$1;
