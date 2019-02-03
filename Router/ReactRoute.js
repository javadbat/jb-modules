import React            from 'react'
import ReactDOM         from 'react-dom'
import Route            from './Route'
class ReactRoute extends Route{

    componentPath=null;
    constructor(inputObj){
        super(inputObj);
        this.componentPath = inputObj.reactComponentPath;
    }
  
    load(){
        return new Promise((resolve,reject)=>{
            this._loadResource(this.componentPath).then((component)=>{
                if(component.default){
                    resolve(component.default);
                }else{
                    reject({message:'the react component you want to load and initiate does not export defualt class to initiate. please add <export defualt ClassName> in your js file'});
                }
                
            }).catch((e)=>{
                reject(e);
            });
        })
    }
    loadge(componentClass,containerDom){
        return new Promise((resolve,reject)=>{
            
            //Remove Current Component From pageContainer
            ReactDOM.unmountComponentAtNode(containerDom);
            //initiate react component to its place in page
            ReactDOM.render(React.createElement(componentClass , null), containerDom,function(){resolve(componentClass)});
        })
        
    }
}
export default ReactRoute;