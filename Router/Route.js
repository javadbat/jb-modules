
class Route{
    url=null;
    name=null;
    settings={};
    title="";
    isRoot;
    params;
    regex
    constructor(inputObj){
        
        //set params
        this.url = inputObj.url;
        this.name = inputObj.name;
        this.title = inputObj.title;
        this.settings = inputObj.settings;
        //TODO we must convert childs route before assign them 
        this.isRoot = this.url == "/" ? true : false;
        this.params = {}
        //add $ symbol make regx to detect exact url (make it equal not include)
        this.regex = new RegExp(this.url.concat("$").toLowerCase().replace(/\{\w+\}/g, '([\\w-]+)'));
        //Get Param Of each Route
        this._extractUrlParamsKey();
        
    }
    _extractUrlParamsKey(){
        //define regex to extract param from url
        var param,getParamRegex = new RegExp(/\{(\w+)\}/g);
        while(param = getParamRegex.exec(this.url)) {
            // we define parameter but set them null 
            this.params[param[1]] = null;
        }
    }
    load(){
        alert('not implemented');
    }
    _loadResource(path){
        return new Promise((resolve,reject)=>{
            SystemJS.import(path).then((output)=>{
                resolve(output);
            }).catch((e)=>{
                reject(e);
            });
        });
    }
    
}
export default Route;