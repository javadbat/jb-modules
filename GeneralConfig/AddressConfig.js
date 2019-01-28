class AddressConfig {

    //the envirement we execute the code
    currentMode = "develop"

    //its private dont use it in your code
    _bidopinServiceURL = {
        beta:"https://j-beta.bidopin.com",
        userAcceptanceTest:"https://erebus.bidopin.com",
        realDataTest:"https://realDataTest.bidopin.com",
        production:"https://aether.bidopin.com"
    }

    get bidopinServiceURL() {

        switch(this.currentMode){
            case  "develop":
            return this._bidopinServiceURL.beta
            break;
            case "uat":
            return this._bidopinServiceURL.userAcceptanceTest
            break;
            case "deploy":
            return this._bidopinServiceURL.production 
            break;
            case "realDataTest":
            return this._bidopinServiceURL.realDataTest 
            break;
        }

    }
}

var addressConfiginstance = new AddressConfig();

export default addressConfiginstance;
