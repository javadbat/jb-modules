import ExceptionHandler from '../ExceptionHandler/ExceptionHandler'
class RequestData {

    config = {
        url:    null,
        method: 'POST',
        body:   null,
        cache : 'defualt',
        auth: true
    };

    //the request we create
    request  = new Object;
    //row object without coding that we send server
    body = null;
    //transformedData is a object we want to  send to server in stringyfy sendable shape
    transformedData = null;
    //keep cache setting
    cacheSetting = 'defualt';
    requestParameter = {
        method:null,
        mode: null,
        headers: null,
        body:null,
    }
    exceptionHandler =  ExceptionHandler;
    constructor(input){
        if(typeof input == "string"){
            //the condition we get string in constructor mean its url with all defualt config
            this.config.url = input;
        }else if(typeof input == "object"){
            //merge user config to module defualt config
            Object.assign(this.config , input);
        }
        if(!(typeof this.config.url == "string" && this.config.url.length >0)){
        //if we dont have valid url
        ExceptionHandler.newException('invalid url to create request')
        }



        //add request body to request
        this.addBody()


        //finall step create request
        this.createRequest();
          //set cache setting to request
        //  this.configCache();

    }
    createRequest(){

        let url = this.config.url;

        if(this.config.method.toUpperCase() == 'GET'){
            //if we have get method we have to send our param via url
            if(this.body){
                let query = this.objectToQueryString(this.body);
                url+= '?' + query;
            }
        }

        if(this.config.method.toUpperCase() == 'DELETE'){
            if(this.body != null && this.body != undefined){
                if(url.substr(url.length -1)!='/'){
                    url += '/';
                }
                url += this.body;
            }else{
                this.exceptionHandler.newException(this.config,'درخواست حذف شما دارای پارامتر نیست')
            }

        }
        this.initRequestParameter();
        this.request = new Request(url,this.requestParameter);
    }
    refresh(){
        //we rebuild request base on system value use when we change auth setting and want to resend req
        this.createRequest();
    }
    initRequestParameter(){
        var headerConfig = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
        }
        this.requestParameter = {

            method: this.config.method,
            mode: 'cors',
            headers: new Headers(headerConfig)
        }
        //TODO: do not re create header on auth true , just add it in a goodway
        if(this.config.auth){
            var AuthObj = RequestData.defaults.AuthManagerBridge.getAuthHeaderProperty();
            headerConfig[AuthObj.key] = AuthObj.value;
        }
        if(this.config.method.toUpperCase() == 'POST' || this.config.method.toUpperCase() == 'PUT'){
            this.requestParameter.body = this.transformedData ? this.transformedData : this.body;
        }
        this.requestParameter.headers = new Headers(headerConfig);
    }
    configCache(){
        switch(this.config.cache) {
            case 'defualt':
            this.cacheSetting = 'default'
            break;
            case false:
            case 'false':
            this.cacheSetting='no-cache';
            break;
            case true:
            case 'true':
            this.cacheSetting='force-cache';
            break;
            default:
            this.cacheSetting=this.config.cache;
        }
    }
    addBody(){

        if(this.config.body != null){

            this.body = this.config.body;

            if(typeof this.config.body == "object"){

              this.transformedData = JSON.stringify(this.body);
            }
        }
    }

    objectToQueryString(obj) {
        //turn object to query string
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
        return parts.join("&");
    }
}
// define defualt and global config for all instances
//if value changed in program , all instance defualts will change
RequestData.defaults = {
    AuthManagerBridge : undefined
}
export default RequestData;
