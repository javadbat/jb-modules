/* TODO
- Add Hash Tag innert Router {#id}
- Add Obj InterPages Router {@objName}
*/
import React            from 'react'
import ReactDOM         from 'react-dom'
import ExceptionHandler from '../ExceptionHandler/ExceptionHandler'

/**
 ** Absolute Path:   /Panel/storeconfirmation
 ** Normalized Path: /storeconfirmation
 */

//the defualt instance in singleton pattern
var instance = [];
//to make loadSate private cycle
let _loadStateKey =  Symbol();
class Router {

    //Contaien All Tree Base Routes
    treeBaseRoutes = [];

    /**
     * Normalized Routes, Flat
     * @type {Array of Obejcts}
     */
    routes = [];

    /**
     * Route Groups Name
     */
    routeGroupsName = [];



    /**
     * Base Path
     */
    basePath;


    /**
     * Match Route Object
     */
    matchedRoute = {};


    /**
     * Components Path Prefix
     */
    componentsPathPrefix = '/';


    /**
     * HTML Element that any Component Will be Loaded In
     */
    pageContainerTagId;

    /**
     * Router is able to Load Components When Page container
     * is Mounted To DOM Actually
     * So when Page Container doesn't Mounted, loadPage Method Will Prevent
     * @type {Boolean}
     */
    isPageContainerMounted = false;


    /**
     * Contains Path Parameters to use in page
     */
    params = {};


    /**
     * the current page is the page that already loaded and initiated
     */
    currentPage = {
        routeDataObject:{},
        //the url params we want to pass
        params:{},
        //the es6,7 class of page that loaded
        jsClass: null
    }


    /**
     * Pages Title Prefix
     */
    pagesTitlePrefix = "";

    // to find is page under load 
    /*
    * 0 is page under load
    * -1 is fail in load
    * null for no route is loaded yet in this instance
    * 1 is page loaded but not initaited
    * 2,3,4 is reserved for future use in between 
    * 5 is page initated and router is done completely done
    * 6-9 is used for inner page ajax loading and initiating level for page developer to use
    * 10 mean completly done and everything is ready 
    * @type {number}
    * 0-5 state cant be change by user and user is prevented to change state if its before 5 or change it to less than 5 
    */
    loadState ;
    
    /**
     * Configuration
     */
    config = {
        //we can have multiple instance of routes and get them by name
        instanceName:'defualt',
        events:{
            onLoadStateChange:null
        },
    }

    constructor(config) {

        if(typeof config == "object") {
            Object.assign(this.config , config);
        }

        if(!instance[this.config.instanceName]) {
            instance[this.config.instanceName] = this;

        }else{
            //if we created the instance with the same name before it will return prev one
            return instance[this.config.instanceName]
        }
        this.treeBaseRoutes       = this.config.routes;
        this.basePath             = this.config.basePath;
        this.pageContainerTagId   = this.config.pageContainerTagId;
        this.componentsPathPrefix = this.config.componentsPathPrefix;
        this.pagesTitlePrefix       = this.config.pagesTitlePrefix;
        //to keep plugin current load state
        this.initLoadState();
        this.normalizeAndOptimazeRoutes();
        window.addEventListener('popstate', (e)=>this.onBrowserPopState(e));
        return instance[this.config.instanceName];
    }
    initLoadState(){
        this[_loadStateKey] = null;
    }
    get loadState(){
        return( this[_loadStateKey]);
    }
    set loadState(newValue){
        if(newValue>4 && newValue <10){
            this.callLoadStateChange(this[_loadStateKey],newValue)
            this[_loadStateKey] = newValue;
           
        }else{
            ExceptionHandler.newException({invalidValue: newValue},"مقدار ست شده برای وضعیت لودینگ نمیتواند کمتر پنج و بیشتر از ده باشد \n")
        }
    }
    callLoadStateChange(oldValue,newValue){
        if(this.config.events.onLoadStateChange){
            this.config.events.onLoadStateChange( oldValue,newValue); 
        }
    }
    onBrowserPopState(event){

        //on browser back or forward btn clicked
        var state = event.state;
        if(state && state.pushedByJBRouter){
            this.loadPage(state.absolutePath,false);
        }
        return true;
    }


    /**
     ** Optimize And Normalized Routes
     ** Add Computed Param Of Path
     ** Add Route Regex For Faster Matching
     */
    normalizeAndOptimazeRoutes() {

        var param,
            getParamRegex = new RegExp(/\{(\w+)\}/g);


        var treeRouteTraverse = (routes, urlPrefix, settings) => {

            for(let route of routes) {

                //add this computed data to orginal data
                route['isRoot'] = route.url == "/" ? true : false;
                route['params'] = {};

                //Add Route Group Name
                route['settings'] = Object.assign(route.settings || {}, settings);

                //Add UrlPrefix
                route['url']    = urlPrefix + route['url'];

                //add $ symbol make regx to detect exact url (make it equal not include)
                route['regex']  = new RegExp(route.url.concat("$").toLowerCase().replace(/\{\w+\}/g, '([\\w-]+)'));

                //Get Param Of each Route
                while(param = getParamRegex.exec(route.url)) {
                    route.params[param[1]] = null;
                }

                //Add To Routes
                this.routes.push(route);
                
                if(route.childRoutes) {
                    treeRouteTraverse(route.childRoutes, route.url, route.settings);
                }
            }

        };

        treeRouteTraverse(this.treeBaseRoutes, "", {});


    }


    /**
     ** Normalize Path
     ** /Panel/StoreConfirmation/ => /storeconfirmation
     */
    normalizePath(path) {

        var currentAbsolutePath = path.toLowerCase();
        var basePathStartIndex  = currentAbsolutePath.indexOf(this.basePath.toLowerCase());

        //if We Dont Have Base Path In Absolute Path
        if(basePathStartIndex == -1) {
            return -1;

        }else {

            //Handle Slash At the Of URL
            var currentPath = currentAbsolutePath.substring(this.basePath.length, currentAbsolutePath.length);

            //Remove Trailing Slash From end Of Path
            if(currentPath[currentPath.length - 1 ] == "/" && currentPath != "/")
            {
                currentPath = currentPath.substring(0, currentPath.length - 1);

            }else if(currentPath == "")
            {
                currentPath = "/";
            }
            //remove page parameter from path 
            //this parameter dont seprate our route but just use in page for example search and filter query ro page index of table in pages
            if(currentPath.lastIndexOf('?')!= -1){
                currentPath = currentPath.slice(0,currentPath.lastIndexOf('?'));
            }
            return currentPath;

        }

    }


    /**
     * Match Current Path To Route Path
     * @return { Matched Route }
     */
    matchPathToOneRoute(normalizedPath) {
        var routeMatcher, match;

        //Iterate Through All Routes To
        for(let route of this.routes) {

            //Handle Root Path
            if(normalizedPath == "/" && route.isRoot) {

                match = route;
                break;

            //Check Other routes
            }else if(normalizedPath != "/" && !route.isRoot){

                //If Current Route Matched
                match = normalizedPath.match(route.regex)
                if(match){

                    var i = 1;
                    //extract Params
                    for(let param in route.params)
                    {
                        route.params[param] = match[i++];
                    }

                    match = route;

                    //Assign Route Parameter
                    this.params = route.params;
                    break;
                }
            }

        }
        if(match){
            this.matchedRoute = match;
        }else{
            this.matchedRoute = this.config.standardPageRoutes[404];
        }
        return this.matchedRoute;
    }


    /**
     ** Load Page Base On Path
     */
    loadPage(absolutePath , updateHistory) {
        //update history is false when we dont want t update browserHistory on rout like when browser back button clicked
        //If Page Container does'nt Mounted
        if(!this.isPageContainerMounted) {

            return false;
        }

        //Remove Base Path From Absolute Path
        var normalizedPath = this.normalizePath(absolutePath);

        if(normalizedPath != -1) {

            var matchedRoute = this.matchPathToOneRoute(normalizedPath);

            if(matchedRoute) {

                //check matched route valid state to load
                var matchedRouteBasicValidity = true;

                if(!(matchedRoute.reactComponentPath != null && matchedRoute.reactComponentPath != undefined)){

                    //if we dont have react component path in data
                    matchedRouteBasicValidity = false;
                    ExceptionHandler.newException(new Error(matchedRoute),"در هنگام پیدا کردن آبجکت مسیر دهی مسیر مشخص شده حاوی آدرس کامپوننت نمیباشد")
                }
                if(matchedRouteBasicValidity){
                    this.callLoadStateChange(this[_loadStateKey],0)
                    this[_loadStateKey] = 0;
                    this.loadReactComponent(matchedRoute.reactComponentPath);
                    this.setPageAttributes(matchedRoute.title, absolutePath,updateHistory);

                    return matchedRoute;
                }

            }else {

                ExceptionHandler.newException(new Error(absolutePath),"آدرس وارد شده یافت نشد");
            }

        }else {

            ExceptionHandler.newException(new Error(absolutePath,"آدرس وارد شده یافت نشد"));
        }

    }


    /**
     ** Load Dedicated Component After Route Matching
     */
    loadReactComponent(reactComponentPath) {
        
        //Get Components
        SystemJS.import(this.componentsPathPrefix + reactComponentPath).then( (componentClass) => {
            this.callLoadStateChange(this[_loadStateKey],1)
            this[_loadStateKey] = 1;
            if(componentClass.default == undefined || componentClass.default == null){
                this.callLoadStateChange(this[_loadStateKey],-1)
                this[_loadStateKey] = -1;
                ExceptionHandler.newException(new Error(componentClass),"the react component you want to load and initiate does not export defualt class to initiate. please add <export defualt ClassName> in your js file");
            }else {

                //Remove Current Component From pageContainer
                ReactDOM.unmountComponentAtNode(this.containerDom);

                //initiate react component to its place in page
                ReactDOM.render(React.createElement(componentClass.default , null), this.containerDom,this.onPageLoadComplete(componentClass));
            }

        }).catch((e)=>{
            ExceptionHandler.newException(e,"در هنگام لود کامپوننت مشکلی پیش آمده است");
            if(!this.loadComponentTryCount){
                this.loadComponentTryCount = 1;
            }else{
                this.loadComponentTryCount++;
            }
            if(this.loadComponentTryCount <6){
                //try to load it again 
                setTimeout(()=>{
                    this.loadReactComponent(reactComponentPath);
                },this.loadComponentTryCount * 2000);
            }else{
                //when we disapoint to try to load again
                //we show 424 error page

                this.loadReactComponent(this.config.standardPageRoutes[424].reactComponentPath);
            }

        });
    }


    /**
     ** Set Page Attr such As Page Title and Url
     ** HTML5 History
     */
    setPageAttributes(title, absolutePath, updateHistory =true) {

        //Set Document Title
        document.title = title + " | " + this.pagesTitlePrefix ;
        //Update URL
        //fill route state to manage events
        //in case of popstate event we dont update history
        if(updateHistory){
            var historyState =  {
                pushedByJBRouter : true,
                routeObject: this.matchedRoute,
                absolutePath : absolutePath

            }
            window.history.pushState(historyState, this.pagesTitlePrefix + title, absolutePath);
        }

    }


    /**
     * This method will call when Page Container is Mounted
     */
    pageContainerDidMount() {

        //Get Page Container Element
        this.containerDom = document.getElementById(this.pageContainerTagId);

        this.isPageContainerMounted = true;

    }


    onPageLoadComplete(jsClass){
        //when page loaded successffully and placed successfully on page and rendered
        // {...obect} make clone of orginal object
        this.currentPage.routeDataObject = {...this.matchedRoute};
        this.currentPage.jsClass = {...jsClass};
        this.currentPage.params = {...this.params};
        this.callLoadStateChange(this[_loadStateKey],5)
        this[_loadStateKey] = 5;
    }


}
export default Router;
