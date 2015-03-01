var messages = document.getElementsByClassName("mail");
for(var i = 0 ; i < messages.length ; i++) {
    messages[i].addEventListener("mouseover", function () {
        for(var j =0; j<this.childNodes.length ; j++ ){
            if(this.childNodes[j].className == "rec") {
                this.childNodes[j].style.visibility = "visible";
            }
            if(this.childNodes[j].className == "del") {
                this.childNodes[j].style.visibility = "visible";
            }
        }
    });
    messages[i].addEventListener("mouseout", function(){
        for(var j =0; j<this.childNodes.length ; j++ ){
            if(this.childNodes[j].className == "rec") {
                this.childNodes[j].style.visibility = "hidden";
            }
            if(this.childNodes[j].className == "del") {
                this.childNodes[j].style.visibility = "hidden";
            }
        }
    })
}