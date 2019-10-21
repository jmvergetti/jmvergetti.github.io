var canvas = document.querySelector('footer canvas');
var ctx = canvas.getContext("2d");
ctx.font = '24px Charm, cursive';
ctx.fillStyle = 'orange';
ctx.textAlign = 'center';
ctx.fillText("Thank you for use our app. =)", canvas.width/2, canvas.height/2);
ctx.fillText("Merry Christmas!", canvas.width/2, canvas.height-10);