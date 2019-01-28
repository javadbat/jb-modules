function JBAlert(message , type="information"){
    JBAlert.initListWrapper();
    JBAlert.addAlertToList(message,type);
}
function closeJBAlertItem(){

this.classList.add('hide');
setTimeout(()=>{
    
    if(this.parentNode){
        this.parentNode.removeChild(this);
    }else{
        //if user close message by click befire timeout
        this.remove();
    }
},1000)
}
JBAlert.addAlertToList = function(message , type){
    //when we want to hide item after show we use this time 
    var closeAlertDuration = 9;
    switch(type){
        case 'success':
        closeAlertDuration = 5;
        break;
    }
    let alertDom = document.createElement('div');
    alertDom.classList.add('jb-alert-wrapper');
    alertDom.classList.add('--'+type);
    var text = document.createTextNode(message);
    var textDom = document.createElement('span');
    textDom.classList.add('alert-text-wrapper');
    textDom.appendChild(text);
    var closeBtnDom = document.createElement('div');
    closeBtnDom.classList.add('alert-close-btn-wrapper')
    closeBtnDom.addEventListener('click',function(){alertDom.close()} );
    closeBtnDom.innerHTML= 
    `<svg x="0px" y="0px" viewBox="0 0 212.982 212.982" style="enable-background:new 0 0 212.982 212.982;" xml:space="preserve" width="16px" height="16px">
        <g id="Close">
            <path style="fill-rule:evenodd;clip-rule:evenodd;" d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312   c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312   l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937   c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z" fill="#FFFFFF"/>
        </g>
    </svg>`;
    alertDom.appendChild(closeBtnDom);
    alertDom.appendChild(textDom);
    alertDom.close = closeJBAlertItem;
    var alertIconDom = JBAlert.createIcon(type,closeAlertDuration);
    alertDom.appendChild(textDom);
    alertDom.appendChild(alertIconDom);
    JBAlert.listWrapperDom.appendChild(alertDom);
    setTimeout(()=>{alertDom.close()},closeAlertDuration *1000 -1000);
}
JBAlert.createIcon = function(type , closeAlertAnimationDuration){
    document.getElementsByClassName('jb-alert-list-wrapper');
    
    let Wrapperdom  = document.createElement('div');
    var innerIconDomString="";
    if(type =="error"){
        innerIconDomString = `<path  d="M24 24 L 40 40"></path>`;
        innerIconDomString+=`<path  d="M40 24 L 24 40"></path>`
    }
    if(type =="information"){
        innerIconDomString = `<path  d="M32 24 L 32 36"></path>`;
        innerIconDomString+=`<path  d="M32 42 L 32 42"></path>`
    }
    if(type =="success"){
        innerIconDomString = `<path  d="M20 36 L 27 42"></path>`;
        innerIconDomString+=`<path  d="M28 42 L 42 22"></path>`;
        
    }
    Wrapperdom.classList.add('alert-svg-icon-wrapper');
    var borderCircleStyleString = `animation:circleAnimation ${closeAlertAnimationDuration}s  ease 0s forwards`;
    var svgString = `<svg class="alert-svg-icon viewbox="0 0 64 64" ${type}" >
        <circle class="bg-circle" cx="32" cy="32" r="20"></circle>
        <circle class="border-circle" cx="32" cy="32" r="26" style="${borderCircleStyleString}"></circle>
        <g class="alert-inner-icon-shape-group --${type}">
            ${innerIconDomString}
        </g>
    </svg>`
    Wrapperdom.innerHTML = svgString;
    return Wrapperdom;
}
JBAlert.initListWrapper = function(){
    var listWrapper = document.getElementsByClassName('jb-alert-list-wrapper');
   if(listWrapper.length==0){
        var WrapperDom = document.createElement('div')
        WrapperDom.classList.add('jb-alert-list-wrapper');
        document.body.appendChild(WrapperDom);
        JBAlert.listWrapperDom = WrapperDom;
   }
}

window.JBAlert = JBAlert;