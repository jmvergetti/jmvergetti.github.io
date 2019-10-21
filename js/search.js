var loadmorelinkHref = '';
var loadBool = true;
var loadLinkClick = 0;  //if 0, it will update the div content, and not the ul
var findLoadInter = setInterval(getLoadHref, 300);

function getLoadHref(){

   if (loadBool || loadmorelinkHref.search('index.html#') > -1){
      loadmorelinkHref = document.getElementById('loadmorelink').href;

      document.getElementById('loadmorelink').href = '#';
      loadBool = false;
      clearInterval(findLoadInter);
   }
}

function searchResults(){
   var searchContainer = document.getElementById('searchResults');
   searchContainer.style.transform = 'translateX(0px)';
}

function requestJSON(element){

   //close fav tab, if it is opened
   var fav = document.querySelector('#divFavority');
   fav.style.transform = 'translateX(1024px)';

   var loading = document.getElementById('loading');
   loading.style.display = 'block';

   var url = window.location.href;
   var urlSplit;
   if (element.tagName == 'A' && element.id != 'loadmorelink'){

      url += element.getAttribute("href");
      urlSplit = url.split('?',2);
   }else if(url.includes("?")){
      urlSplit = url.split('?',2);
      urlSplit[1] = urlSplit[0];
      window.location.href = urlSplit[0];
   }else{
      url = window.location.href;
   }

   var codeParam;
   var codeText;
   var codeNumb;
   var requestURL;
   var productRequested = false;

   if(urlSplit != undefined){
      codeParam = urlSplit[1];
      codeText = codeParam.substr(0,4);
      codeNumb = codeParam.substr(5);
   }
   //request food from the li clicked
   if (codeText == 'code'){
      requestURL = 'https://us.openfoodfacts.org/api/v0/product/' + codeNumb + '.json';
      productRequested = true;

   }
   //load more link
   else if(element.id == 'loadmorelink'){
      requestURL = loadmorelinkHref;
      loadmorelinkHref = '';
      loadBool = true;
      loadLinkClick = 1;
      findLoadInter = setInterval(getLoadHref, 300);
   }
   else{
      //food search button
      loadmorelinkHref = '';
      loadBool = true;
      loadLinkClick = 0;
      findLoadInter = setInterval(getLoadHref, 300);
      var txtFood = document.getElementById("txtSearch").value;
      requestURL = 'https://us.openfoodfacts.org/cgi/search.pl?search_terms='+ txtFood + '&search_simple=1&jqm=1';
   }
   var request = new XMLHttpRequest();
   request.open('GET', requestURL);
   request.responseType = 'json';
   request.send();

   request.onload = function(){
      if (productRequested == false){
         var food = request.response;
         printJSONSearch(food);
      }
      else{
         var product = request.response;
         printJSONProduct(product);
      }
   }
   request.onloadend = function(){

      if (productRequested == false){
         var imgs = document.getElementsByTagName('img');
         var a = document.getElementsByTagName('a');

         //calling the function if link clicked
         for(var i = 0; i < a.length; i++) {
            a[i].setAttribute("onclick","requestJSON(this)");
         }

         var imgLoading = document.getElementById('loading');
         //loading imgs in data-src
         for(var i = 1; i < imgs.length; i++) {
            if (imgs[i].getAttribute('id') != 'star'){
               var dataSrc = imgs[i].getAttribute('data-src');
               imgs[i].setAttribute('src',''); // remove old src data 
               imgs[i].setAttribute('src', dataSrc);
               imgLoading.setAttribute('src', 'img/loading.png');
            }
         }

         // retrieved from https://stackoverflow.com/questions/29578186/use-javascript-to-write-src-attribute-as-data-src-as-page-is-loading

         imgLoading.style.display = 'none';
      }
   }
}
//print search
function printJSONSearch(json){
   if (loadLinkClick == 0){
      var result = document.getElementById('result');
      if (typeof result !== 'undefined'){
         result.innerHTML = json.jqm;
      }else{
         var result = document.createElement('div');
         result.setAttribute('id', 'result');
         result.innerHTML = json.jqm;
         document.getElementsByTagName('main')[0].appendChild(result);
      }
   } else{
      var result = document.querySelector('#result ul');
      if (typeof result !== 'undefined'){
         var jsonFilter = json.jqm.substr(9);
         result.innerHTML = jsonFilter;
      }else{
         var result = document.createElement('div');
         result.setAttribute('id', 'result');
         result.innerHTML = json.jqm;
         document.getElementsByTagName('main')[0].appendChild(result);
      }
   }
}
//print products
function printJSONProduct(productJSON){
   var product = productJSON.product;
   var result = document.getElementById('productContent');
   if (typeof result !== 'undefined'){
      //        console.log(product);
      var productName = document.getElementById('productName');

      productName.textContent = product.product_name;

      result.innerHTML = "<img src='" + product.image_url + "' alt='Food Picture'>";

      //Get nutrition levels
      var nutrientsRates = '<h3>Nutrient Levels</h3>';
      nutrientsRates += '<ul id="nutrientList">';
      for (var nutrient in product.nutrient_levels){
         nutrientsRates += '<li>' + nutrient+': '+product.nutrient_levels[nutrient] + '</li>';
      }
      nutrientsRates += '</ul>';
      result.innerHTML += nutrientsRates;

      //Get nutrition info
      var nutritionData = '' ;
      nutritionData += "<h3>Nutrition Data (per 100g)</h3>";
      nutritionData += "<ul id='nutritionData'>";
      nutritionData += "<li>Carbohydrates: " + product.nutriments.carbohydrates_100g + "</li>";
      nutritionData += "<li>Fat: " + product.nutriments['fat_100g'] + "</li>";
      nutritionData += "<li>Satureted Fat: " + product.nutriments['saturated-fat_100g'] + "</li>";
      nutritionData += "<li>Proteins: " + product.nutriments.proteins_100g + "</li>";
      nutritionData += "<li>Salt: " + product.nutriments.salt_100g + "</li>";
      nutritionData += "<li>Sodium: " + parseFloat(product.nutriments.sodium_100g).toFixed(2) + "</li>";
      nutritionData += "<li>Sugar: " + product.nutriments.sugars_100g + "</li>";
      nutritionData += "</ul>";
      result.innerHTML += nutritionData;

      //Get ingredients
      result.innerHTML += "<h3>Ingredients</h3>"+"<p>" + product.ingredients_text + "</p>";

      var imgLoading = document.getElementById('loading');
      imgLoading.style.display = 'none';

      var searchResults = document.getElementById('searchResults');

      searchResults.style.display = 'block'; 

      //move to the main screen.
      setTimeout(function(){
         searchResults.style.transform = 'translateX(0px)';  
      }, 300); 

      //---------------------BEGIN IMAGE FAVORITY RECOGNITION---------------------------------------------
      var prodCode = getProdCode();
      var star = document.getElementById('star');
      //        console.log('product code: ' + prodCode);

      //create array of products from localstorage
      var products = [];
      populateProductArray(products);
      //        console.log('products: ',  products);

      //see if the actual product is actualy saved
      for (var i = 0; i < products.length; i++){
         if (products[i].code == prodCode){
            star.src = 'img/star-yellow.png';
            break;
         }else{
            star.src = 'img/star-void.png';
         }  
      }
      //---------------------END IMAGE FAVORITY RECOGNITION---------------------------------------------
   }else{
      //        console.log(product);
      var result = document.createElement('div');
      result.setAttribute('id', 'productContent');
      result.innerHTML = "<img src='" + product.image_url + "' alt='Food Picture'>";

      //Get nutrition rates
      var nutrientsRates = '<h3>Nutrient Levels</h3>';
      nutrientsRates += '<ul id="nutrientList">';
      for (var nutrient in product.nutrient_levels){
         nutrientsRates += '<li>' + nutrient+': '+product.nutrient_levels[nutrient] + '</li>';
      }
      nutrientsRates += '</ul>';
      result.innerHTML += nutrientsRates;

      //Get nutrition info
      result.innerHTML += "<h3>Nutrition Data (per 100g)</h3>";
      result.innerHTML += "<ul id='nutritionData'>";
      result.innerHTML += "<li>Carbohydrates: " + product.nutriments.carbohydrates_100g + "</li>";
      result.innerHTML += "<li>Fat: " + product.nutriments['fat_100g'] + "</li>";
      result.innerHTML += "<li>Satureted Fat: " + product.nutriments['saturated-fat_100g'] + "</li>";
      result.innerHTML += "<li>Proteins: " + product.nutriments.proteins_100g + "</li>";
      result.innerHTML += "<li>Salt: " + product.nutriments.salt_100g + "</li>";
      result.innerHTML += "<li>Sodium: " + parseFloat(product.nutriments.sodium_100g).toFixed(2) + "</li>";
      result.innerHTML += "<li>Sugar: " + product.nutriments.sugars_100g + "</li>";
      result.innerHTML += "</ul>";

      //Get ingredients
      result.innerHTML += "<h3>Ingredients</h3>"+"<p>" + product.ingredients_text + "</p>";

      document.getElementsByTagName('main')[0].appendChild(result);

      var imgLoading = document.getElementById('loading');
      imgLoading.style.display = 'none';

      var searchResults = document.getElementById('searchResults');

      searchResults.style.display = 'block';  
      setTimeout(function(){
         searchResults.style.transform = 'translateX(0px)';  
      }, 300);
   }
}
