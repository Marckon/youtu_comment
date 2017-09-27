function getHTTPObject() {
    if (typeof XMLHttpRequest == "undefined") {
        XMLHttpRequest = function () {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            }
            catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            }
            catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
            }
            return false;
        }
    }
    return new XMLHttpRequest();
}

function getNewContent() {
    var request=getHTTPObject();
    if(request){
        request.open("GET","ajax_txt",true);
        request.onreadystatechange=function () {
            if(request.readyState==4){
                var para=document.createElement("p");
                var txt=document.createTextNode(request.responseText);
                para.appendChild(txt);
                document.getElementById("new").appendChild(para);
            }
        };
        request.send();
    }else {
        alert("error")
    }
}

window.onload=getNewContent;