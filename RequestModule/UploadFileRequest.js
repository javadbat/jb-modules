class UploadFileRequest {

    //Ajax Http Request
    http = null;
    //Data To Send
    data = null;



    constructor({url, file, onSuccess, onProgress, onError, authentication=true,formKey=UploadFileRequest.defaults.formKey,AuthManagerBridge=UploadFileRequest.defaults.AuthManagerBridge}) {

        //Set Variables
        this.url        = url;
        this.file       = file;
        this.onSuccess  = onSuccess;
        this.onProgress = onProgress;
        this.onError    = onError;
        this.authentication = authentication;
        this.AuthManagerBridge = AuthManagerBridge;
        this.formKey = formKey;
        //Initialize Request
        this.createRequest();
        //Initialize Data To Send
        this.createData();
        //Finaly Upload File
        this.uploadFile();
    }


    //Upload File
    uploadFile() {
        //Send Data
        this.http.open("POST", this.url, true);
        if(this.authentication){
            var authObj = this.AuthManagerBridge.getAuthHeaderProperty();
            this.http.setRequestHeader(authObj.key,authObj.value)
        }
        this.http.send(this.data);
    }

    //Create XMLHttpRequest Object
    createRequest() {
        this.http = new XMLHttpRequest();
        //add authenthication header
        
        this.registerOnReadyStateChange();
        this.registerOnProgressUplaod();
    }
    //Create FormData Object
    createData() {
        this.data = new FormData();
        this.data.append(this.formKey, this.file);
    }

    //Listen For Request State Change
    registerOnReadyStateChange() {

        this.http.onreadystatechange = () => {
            //On Success
            if(this.http.readyState == 4 && this.http.status == 200) {

                this.registerOnSuccessRequest();
            }else if(this.http.readyState == 4 && this.http.status != 200) {

                this.registerOnErrorRequest();
            }
        };
    }

    //On Success Request Response
    registerOnSuccessRequest() {
        //If Response Type is Json
        if(this.http.getResponseHeader("Content-Type").indexOf('json')) {
            this.onSuccess(JSON.parse(this.http.responseText));
        }
    }

    //On Error Request Response
    registerOnErrorRequest() {
        //If Response Type is Json
        if(this.http.getResponseHeader("Content-Type").indexOf('json')) {
            this.onError(JSON.parse(this.http.responseText));
        }
    }

    //File Upload Progess Percentage
    registerOnProgressUplaod() {
        this.http.upload.addEventListener("progress", (e) => {
            if(e.lengthComputable) {
                let percent = Math.round(e.loaded / e.total * 100);
                this.onProgress(percent, e.loaded, e.total, e);
            }
        },false);
    }


}
UploadFileRequest.defaults = {
    AuthManagerBridge : undefined,
    formKey:undefined
}

export default UploadFileRequest;
