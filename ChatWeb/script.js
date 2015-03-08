function run(){
    var messages = document.getElementsByClassName("mail");
    for(var i = 0 ; i < messages.length ; i++) {
        messages[i].addEventListener("mouseover",mouseOver);
        messages[i].addEventListener("mouseout", mouseOut);
        messages[i].addEventListener("click", renameEmail);
    }
}
function mouseOut(){
    for(var j =0; j<this.childNodes.length ; j++ ){
        if(this.childNodes[j].className == "rec") {
            this.childNodes[j].style.visibility = "hidden";
        }
        if(this.childNodes[j].className == "del") {
            this.childNodes[j].style.visibility = "hidden";
        }
    }
}
function mouseOver() {
    for(var j =0; j<this.childNodes.length ; j++ ){
        if(this.childNodes[j].className == "rec") {
            this.childNodes[j].style.visibility = "visible";
        }
        if(this.childNodes[j].className == "del") {
            this.childNodes[j].style.visibility = "visible";
        }
    }
}
function renameUser(){
    var text= prompt("Введите имя","");
    document.getElementById("nameUser").innerHTML = text;
}
function renameEmail(event) {
    if(event.target.classList.contains("rec"))
    {
        var mass = this.getElementsByTagName("div")[0];
        mass.innerHTML = prompt("Измените сообщение",mass.innerHTML);
    }
    if(event.target.classList.contains("del"))
    {
        this.parentNode.removeChild(this);
    }
}
function sendEmail() {
    var d = document.createElement("div");
    var s = '';
    var massString = document.getElementsByName("email")[0].value.split('\n');
    for (var i = 0; i < massString.length; i++)
    {
        s +=  massString[i] +"<br>" ;
    }
    document.getElementsByName("email")[0].value = "";
    s+='</div></div>';

    d.innerHTML = '<div class="mail"  >\
    Alex Zapolski\
    <img class="rec" onclick="renameEmail()" src = "rec.gif"> </img>\
    <img class="del" src = "del.png"> </img>\
    <br><br>\
    <div class="emailText" >' + s ;
    var e =document.getElementsByClassName("mailHistory")[0];
    e.appendChild(d);
    var messages = document.getElementsByClassName("mail");
    messages[messages.length-1].addEventListener("mouseover",mouseOver);
    messages[messages.length-1].addEventListener("mouseout", mouseOut);
    messages[messages.length-1].addEventListener("click", renameEmail);
}