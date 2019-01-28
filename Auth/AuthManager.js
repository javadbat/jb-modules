import RequestData from 'Modules/RequestModule/RequestData'
import {fetchResponseHandler,fetchErrorHandler} from 'Modules/FetchHandler/FetchHandler'
import ExceptionHandler from 'Modules/ExceptionHandler/ExceptionHandler'
import GeneralConfig from 'Modules/GeneralConfig/GeneralConfig'
class AuthManager {
//manage authentication of application
    constructor(){

    }

    getUserInfo(){
        //this function return user info when needed include permissions and user attribute and id
        //TODO permission is not implemented by backend 
        var userData= JSON.parse(localStorage.getItem('bidopin_panel_Auth'));
        return userData;
    }
    //return object that indicate header key for auth data and value of that key
    getAuthHeaderProperty(){
        return {
            key:'Authorization',
            value:'Bearer '+this.getUserInfo().accessToken
        }
    }
    _setUserInfo(data){
        //set user information in browser coockie or casche in login or refresh userInfo
        localStorage.setItem('bidopin_panel_Auth',  JSON.stringify(data));
    }
     checkPermission(permissionId){
        //check current user have special permission or not
        //TODO
    }
     login(userName , password){
        
        return new Promise((resolve, reject)=>{
            var request = new RequestData(
                {
                    url:    GeneralConfig.addressConfig.bidopinServiceURL +'/api/v1/auth/admin/login',
                    method: 'POST',
                    body:{
                        "password": password,
                        "username": userName
                    },
                    auth:false
                }
            )
            fetch(request.request).then(fetchResponseHandler(request)).then((data)=>{
                this._setUserInfo(data);
                resolve(true);
                
            }).catch(e=>{
                fetchErrorHandler(e);
                resolve(false);
            })
        });
    }
    refreshToken(){
        ExceptionHandler.newException(null,'start refreshing token');
        return new Promise((resolve, reject)=>{
            var userData = this.getUserInfo();
            if(userData && userData.refreshToken){
                //refresh token
                this._refreshTokenService( userData.refreshToken).then((data)=>{
                    this._setUserInfo(data);
                    ExceptionHandler.newException(null,'token is refreshed');
                    resolve(true);
                });
            }else{
                this.logout();
                reject(false);
            }
        });
    }
    _refreshTokenService(refreshToken){
        return new Promise((resolve, reject)=>{
            var request = new RequestData(
                {
                    url:    GeneralConfig.addressConfig.bidopinServiceURL +'/api/v1/auth/admin/token/refresh',
                    method: 'POST',
                    body:{
                        "refreshToken": refreshToken
                    },
                    auth:false
                }
            )
            fetch(request.request).then(fetchResponseHandler(request)).then((data)=>{
                
                resolve(data);
                
            }).catch(e=>{
                fetchErrorHandler(e);
                resolve(false);
            })
        });
    }
    logout(isRedirect = false){
        //TODO:implement logout 1-clear local storage 2- call server logout the redirect if its true
        localStorage.removeItem('bidopin_panel_Auth');
        if(isRedirect){
            window.location.replace("/login");
        }
        
    }
}

export default new AuthManager();
