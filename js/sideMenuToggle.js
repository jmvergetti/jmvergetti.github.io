function sideBarShow(){
   var sideBar = document.getElementById('menu');
   sideBar.style.transform = 'translateX(0px)';
}
function closeSideMenu(){
   var sideBar = document.getElementById('menu');
   sideBar.style.transform = 'translateX(-1024px)';
}
function backMenu(){

   //Getting the options menu and setting them back
   var searchResults = document.getElementById('searchResults');
   searchResults.style.transform = 'translateX(1024px)';

   var favority = document.querySelector('#divFavority');
   favority.style.transform = 'translateX(1024px)';

   var footer = document.querySelector('footer');
   footer.style.transform = 'translateX(1024px)'; 

   //set display none to them all.
   setTimeout(function(){
      footer.style.display = 'none'; 
      searchResults.style.display = 'none';
      favority.style.display = 'none';
   }, 300);

   //restoring url
   var winUrl = window.location.href;
   var prodPos = winUrl.search("age_product");
   if (prodPos == -1){
      prodPos = winUrl.search("#");
   }
   window.location.href = winUrl.substr(0, prodPos+1);
   document.getElementById('loading').style.display = 'none';
}
function showAbout(){
   var footer = document.querySelector('footer');
   footer.style.display = 'block';  
   setTimeout(function(){
      footer.style.transform = 'translateX(0px)';  
   }, 300);
}
function showFavority(){
   var favority = document.querySelector('#divFavority');
   favority.style.display = 'block';  
   setTimeout(function(){
      favority.style.transform = 'translateX(0px)';  
   }, 300);
}

//close side menu when touch some other area.
var body = document.body;
var html = body.parentNode;
var nav = document.querySelector('nav');
var header = document.querySelector('header');
var searchContainer = document.querySelector('#search');

nav.addEventListener('touchstart', closeSideMenu, false);
header.addEventListener('touchstart', closeSideMenu, false);
searchContainer.addEventListener('touchstart', closeSideMenu, false);

