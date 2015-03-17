function uniqueID() {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};
var mailList = [];
function run(){
    startServlet();
    window.setInterval(connectServ,500);
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
    var nameSecond = document.getElementsByClassName("partner")[0].textContent;
    var e =document.getElementsByClassName("mailHistory")[0];
    var dialogID = document.getElementsByClassName("partner")[0].getAttribute("dialogID");
    var task = createTask(name,s,nameSecond,dialogID);
    var m = createItem(task);
    sendServlet(task);
    mailList.push(task);
    e.appendChild(m);
    e.scrollTop = e.scrollHeight;
    var messages = document.getElementsByClassName("mail");
    messages[messages.length-1].addEventListener("mouseover",mouseOver);
    messages[messages.length-1].addEventListener("mouseout", mouseOut);
    messages[messages.length-1].addEventListener("click", renameEmail);
    store(mailList);
}
function sendServlet(task){
    var req = new XMLHttpRequest();
    req.open("POST","/ChatListener");
    var id =  document.getElementsByClassName("partner")[0].getAttribute("dialogID");
    if(id == -1){
        req.onreadystatechange = function(){
            location.reload();
        }
    }
    req.send(JSON.stringify(task));
}
function createItem(task){
    var temp = document.createElement('div');
    temp.innerHTML = '<div class="mail" data-task-id="id">\
    <div class="nameUser">sadasd</div>\
    <img class="rec" onclick="renameEmail()" \
    src = "styles/rec.gif"> </img>\
    <img class="del" src = "styles/del.png"> </img>\
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
function createTask(user,mailText, nameSecond, ID){
    return {
        text:mailText,
        name:user,
        nameSecond:nameSecond,
        id:uniqueID(),
        dialogID:ID
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
function upload(allMail){
    var e =document.getElementsByClassName("mailHistory")[0];
    var t = document.getElementsByClassName("partner")[0].getAttribute("dialogID");
    for(var i=0;i<allMail.length;i++){
        mailList.push(allMail[i]);
        if(allMail[i].dialogID == t){
            var m = createItem(allMail[i]);
            e.appendChild(m);
            m.addEventListener("mouseover",mouseOver);
            m.addEventListener("mouseout", mouseOut);
            m.addEventListener("click", renameEmail);
        }
    }
    e.scrollTop = e.scrollHeight;
}
function uploadAllDial(allMail){
    var mass = document.getElementsByClassName("mailHistory")[0]
    mass.innerHTML = "";
    var e =document.getElementsByClassName("mailHistory")[0];
    var t = document.getElementsByClassName("partner")[0].getAttribute("dialogID");
    for(var i=0;i<allMail.length;i++){
        if(allMail[i].dialogID == t){
            var m = createItem(allMail[i]);
            e.appendChild(m);
            m.addEventListener("mouseover",mouseOver);
            m.addEventListener("mouseout", mouseOut);
            m.addEventListener("click", renameEmail);
        }
    }
    e.scrollTop = e.scrollHeight;
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
function connectServ(){
    var req = new XMLHttpRequest();
    req.open("GET","/ChatListener");
    req.send();
    req.onreadystatechange = function(){
        if(req.readyState == 4){
            if(req.status == 200)
            {
                var elem = document.getElementsByClassName("circle")[0];
                elem.style.backgroundColor = 'green';
                var items = JSON.parse(req.responseText);
                if(items != null){
                    mailList.push(items);
                    upload(items)
                }
            }
            else {
                var elem = document.getElementsByClassName("circle")[0];
                elem.style.backgroundColor = 'red';
            }
        }
    }
}
function startServlet(){
    var req = new XMLHttpRequest();
    req.open("POST","/ChatListener");
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send("flag=1");
    req.onreadystatechange = function(){
        if(req.readyState == 4)
            if(req.status == 200){
                var r = req.responseText;
                var items = JSON.parse(r);
                updateFriend(items);
            }
    }
    var reqSecond = new XMLHttpRequest();
    reqSecond.open("POST","/ChatListener");
    reqSecond.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    reqSecond.send("flag=2");
    reqSecond.onreadystatechange = function(){
        if(reqSecond.readyState == 4)
            if(reqSecond.status == 200){
                var r = reqSecond.responseText;
                var allMail = JSON.parse(r);
                if(allMail!=null)
                {
                    upload(allMail);
                }
            }
    }
}
function updateFriend(mass){
    var flag = true;
    var list = document.getElementsByClassName("friendList")[0];
    list.innerHTML ="";
    for(var i = 0; i<mass.length;i++){
        if(mass[i].flag == '0'){
            createFriend(mass[i].name, mass[i].dialogID);
            if(flag){
                var freind = document.getElementsByClassName("partner")[0];
                freind.setAttribute("dialogID",mass[i].dialogID);
                freind.innerHTML = mass[i].name;
                flag = false;
            }
        }
        else{
            var user = document.getElementById("nameUser");
            user.innerHTML = mass[i].name;
        }
    }
}
function createFriend(name,id){
    var elem = document.createElement("div");
    elem.innerHTML = name;
    elem.setAttribute("dialogID",id);
    var mass = document.getElementsByClassName("friendList")[0];
    elem.addEventListener("click",selectFrend)
    mass.appendChild(elem);
}
function selectFrend(event){
    var freind = document.getElementsByClassName("partner")[0];
    freind.innerHTML = this.innerText;
    freind.setAttribute("dialogID",this.getAttribute("dialogID"));
    uploadAllDial(mailList);
}