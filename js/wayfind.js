setInterval(function(){
    var urlSplit = window.location.href.split("#", 2);
    var wayFind = urlSplit[1];

    var menuList = document.querySelectorAll("#menu ul a li");
//    console.log(menuList[0].textContent.toLowerCase());
    for(var li of menuList){
        if (li.textContent.toLowerCase() == wayFind){
            li.classList.add('active');
        }else{
            li.classList.remove('active');
            if (wayFind == undefined || wayFind == null || wayFind == 'p' || wayFind == '' || wayFind == 'pa'){
                menuList[0].classList.add('active');
            }
        }
    }
},400);
