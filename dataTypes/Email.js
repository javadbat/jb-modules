
    function Email(input){
        if(this == undefined){
           return new Email(input);
        }
        this.setValue(input);
    }
    Email.prototype = new Object;
    Email._regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    Email.validate =  function(input){
        return Email._regex.test(input);

    }
    Email.prototype.getPremitiveValue = function(){
        return(this.value);
    }
    Email.prototype.valueOf =  function(input){
        return(this.getPremitiveValue());
    }
    Email.prototype.toString = function(input){
        return (this.getPremitiveValue());
    }
    Email.prototype.setValue = function(input){
        var result = Email.validate(input);
        if(result){
            var parts = Email._regex.exec(input);
            this.value = parts[0];
            this.localPart = parts[1];
            this.domain = parts[5];
            [,this.providerName,this.topLevelDomain]=/(.+?)\.(.+)/.exec(this.domain);
            return(this);
        }else{
            return NaN;
        }
    }
export{Email}