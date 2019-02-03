import Route       from './Route'
import ReactRoute  from './ReactRoute'
class RouteFactory{
    constructor(inputObj){
        switch(inputObj.type){
            case 'REACT':
            return new ReactRoute(inputObj);
            break;
            case undefined:
            return new Route(inputObj);
            break;
        }
       
    }
}
export default RouteFactory;