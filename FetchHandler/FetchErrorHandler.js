//when fetch response is not ok the catch method will call this function
export function fetchErrorHandler(data) {
    var showMessage = window.showMessage?window.showMessage:null;
    if(!showMessage){
        //if we are not in react panel and show message is invalid (show message is defined in bidopin panel master class)
        var showMessage = function(message){
            //TODO: use exception handler here
            alert(message);
        }
    }
    if(data.errorMessage){
        showMessage(data.errorMessage, 'error', data);
        if(data.errors) {
            for(let i in data.errors) {
                showMessage(data.errors[i]);
            }
        }
    }else{
        if(data.message){
            showMessage(data.message,'error',data);
        }
       
    }
}
