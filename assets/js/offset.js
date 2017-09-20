'use strict';

var body,rect,$echoTarget,tops,left,bottom,right,width,Xs,Ys,height,$trigger,$modal;

var ua = function($target){
   ua.naked = window.navigator.userAgent;
   $target.innerHTML += ua.naked;
}


var rerend = function(){
  body = document.body;
  rect = body.getBoundingClientRect();
  tops = rect.top,
  bottom = rect.bottom,
  left= rect.left,
  right= rect.right,
  width= rect.width,
  height= rect.height,
  Xs=rect.x,
  Ys=rect.y;
}
var echo  = function($target){
  $target.innerHTML = '';
  $target.innerHTML += '<p class="pLine"><span class="keys">top</span>' + tops +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">bottom</span>' + bottom +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">left</span>' + left +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">right</span>' + right+'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">width</span>' + width +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">height</span>' + height +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">X</span>' + Xs +'</p>';
  $target.innerHTML += '<p class="pLine"><span class="keys">Y</span>' + Ys +'</p>';
}
window.onload = function(){
  $echoTarget = document.getElementById('offsetList');
  echo($echoTarget);
  ua(document.getElementById('ua'));
  $trigger = document.getElementById('trigger');
  $modal = document.getElementById('modal');
  $trigger.addEventListener('click',function(){
    $modal.classList.toggle('is-visible');
  });
};

window.onscroll = function(){
  rerend($echoTarget);
  echo($echoTarget);
}

window.onresize = function(){
  rerend($echoTarget);
  echo($echoTarget);
}
