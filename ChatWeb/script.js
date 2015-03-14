function uniqueID() {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};
var mailList = [];
function run(){
    var allMail = restore();
    if(allMail!=null)
    {
        upload(allMail);
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
    storeUser(text);
}
function renameEmail(event) {
    if(event.target.classList.contains("rec"))
    {
        var mass = this.getElementsByTagName("div")[1];
        var text = prompt("Измените сообщение",mass.innerHTML);
        mass.innerHTML = text;
        changeMail(this,text);
    }
    if(event.target.classList.contains("del"))
    {
        deleteMail(this);
    }
}
function sendEmail() {
    var s = '';
    var massString = document.getElementsByName("email")[0].value.split('\n');
    for (var i = 0; i < massString.length; i++) {
        s +=  massString[i];
        if(i!= massString.length-1){
            s+="<br>";
        }
    }
    document.getElementsByName("email")[0].value = "";
    var name = document.getElementById("nameUser").textContent;
    var e =document.getElementsByClassName("mailHistory")[0];
    var task = createTask(name,s);
    var m = createItem(task);
    mailList.push(task);
    e.appendChild(m);
    var messages = document.getElementsByClassName("mail");
    messages[messages.length-1].addEventListener("mouseover",mouseOver);
    messages[messages.length-1].addEventListener("mouseout", mouseOut);
    messages[messages.length-1].addEventListener("click", renameEmail);
    store(mailList);
}
function createItem(task){
    var temp = document.createElement('div');
    temp.innerHTML = '<div class="mail" data-task-id="id">\
    <div class="nameUser">sadasd</div>\
    <img class="rec" onclick="renameEmail()" \
    src = "../../../ChatWeb/rec.gif"> </img>\
    <img class="del" src = "../../../ChatWeb/del.png"> </img>\
    <br><br>\
    <div class="emailText"><div>';
    updateMail(temp.firstChild,task);
    return temp.firstChild;
}
function updateMail(divItem,task){
    var text =  divItem.lastChild;
    text.innerHTML = task.text;
    var name = divItem.getElementsByClassName("nameUser")[0];
    name.innerHTML = task.name;
    divItem.setAttribute('data-task-id',task.id);
}
function createTask(user,mailText){
    return {
        text:mailText,
        name:user,
        id:uniqueID()
    };
}
function store(list){
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    localStorage.setItem("taskList", JSON.stringify(list))
}
function storeUser(user){
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    localStorage.setItem("username",user);
}
function restore() {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    var item = localStorage.getItem("taskList");
    return item && JSON.parse(item);
}
function upload(allMail){
    for(var i=0;i<allMail.length;i++){
        var e =document.getElementsByClassName("mailHistory")[0];
        var m = createItem(allMail[i]);
        mailList.push(allMail[i]);
        e.appendChild(m);
        m.addEventListener("mouseover",mouseOver);
        m.addEventListener("mouseout", mouseOut);
        m.addEventListener("click", renameEmail);
    }
    var username = localStorage.getItem("username");
    if(username != null)
    {
        document.getElementById("nameUser").innerHTML = username;
    }
    else{
        document.getElementById("nameUser").innerHTML = "nouser";
    }
}
function deleteMail(mail){
    var index = -1;
    var r =  mail.getAttribute("data-task-id");
    for(var i =0; mailList.length; i++){
        if(mailList[i].id == parseInt(r)){
            index = i;
            break;
        }
    }
    mailList.splice(index,1);
    store(mailList);
    mail.parentNode.removeChild(mail);
}
function changeMail(mail, text){
    var index = -1;
    var r =  mail.getAttribute("data-task-id");
    for(var i =0; mailList.length; i++){
        if(mailList[i].id == parseInt(r)){
            index = i;
            break;
        }
    }
    mailList[index].text = text;
    store(mailList);
}