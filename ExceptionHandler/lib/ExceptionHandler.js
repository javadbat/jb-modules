class ExceptionHandler {

     newException(exception , message){
         var ErrorPrefix = [];
        //NetWork Error
        if(exception && exception.header != undefined && exception.status != undefined && exception.url != undefined) {
            ErrorPrefix.push('Network Error happend')
         }
         if(exception && exception.message == "Failed to fetch"){
             //در این حالت اصلا به سرور متصل نشدیم که میتواند دلایل گوناگونی داشته باشد
             ErrorPrefix.push('we cant connect to server');
             if(!navigator.onLine){
                 //اگر اتصالات شبکه قطع باشند این پیام ارسال میشود
                ErrorPrefix.push('please check your internet connection');
                alert('لطفا اتصال اینترنت خود را بررسی نمایید');
             }
         }
         if(exception  && exception.errorCode == 1015){
            ErrorPrefix.push({message:'your specified address with specified method is not exist',requestAddress:exception.path});
         }
         console.error(message, ErrorPrefix, exception);
    }

}
export default new ExceptionHandler();
