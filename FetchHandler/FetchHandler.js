
var fetchResponseHandlerInstance =  function fetchResponseHandler(request) {
    var refreshToken = function(){

            return new Promise((resolve, reject)=>{
            fetchResponseHandler.defaults.AuthManagerBridge.refreshToken().then((response)=>{
                //refresh-token-interval-number5
                //we refresh request so it get new auth value if refreshed token
                request.refresh();
                //resend request to get response
                fetch(request.request).then((response)=>{
                    //refresh-token-interval-number6
                    resolve(response);
                }).catch((e)=>{
                    reject(e);
                })
            }).catch((e)=>{
                fetchResponseHandlerInstance.defaults.AuthManagerBridge.logout();
            });
        });
    }
    var handleExpiredToken = function(response){
        return new Promise((resolve, reject)=>{
            //refresh-token-interval-number2
            if(response.status == 401){
                //if we had a expierd token
                //we refresh the request token 
                //resend the request to server
                //return response
                console.log('token is refreshed in'+ (new Date));
                refreshToken().then((responseOfRefreshedTokenRequest)=>{
                    //refresh-token-interval-number7
                    response = responseOfRefreshedTokenRequest;
                    resolve(response)
                }).catch((e)=>{
                    reject(e);
                });
                
            }else{
                resolve(response);
            }
        });
    }
    return (response) => {
        return new Promise((mainResolve,mainReject)=>{
            //refresh-token-interval-number1
        var isExpiredTokenHandeled = handleExpiredToken(response);
            Promise.all([isExpiredTokenHandeled]).then(([response])=>{
                //refresh-token-interval-number3
                if(response.ok) {
                    var contentType = response.headers.get('content-type')
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        //refresh-token-interval-number4
                        mainResolve( response.json());
                    }else{
                        //if response is not json and mostly empty
                        if(contentType &&  contentType.indexOf("image/") !== -1){
                            //if response is image file
                            //we retuarn image base64 data
                            response.arrayBuffer().then((data)=>{
                                var base64 = btoa(
                                    new Uint8Array(data)
                                      .reduce((data, byte) => data + String.fromCharCode(byte), '')
                                  );
                                  mainResolve(`data:${contentType};base64,`+base64);
                            })
                           // mainResolve( response.arrayBuffer());
                        }else{
                            mainResolve({});
                        }
                        
                    }
                    
                }else{
                    if(response.status == 502){
                      return mainReject({errorMessage:'خطای 502  ، سرور یا در حال به روز رسانی است یا دچار اشکال شده است'});
                    }
                    return response.json().then((e) => {
                        mainReject(e);
                    });
                }
    
            });
        })

    }


}
fetchResponseHandlerInstance.defaults = {
    AuthManagerBridge : undefined
}
export {fetchResponseHandlerInstance as fetchResponseHandler}
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
