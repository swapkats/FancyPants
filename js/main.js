var k           = false;
var j           = false;
var i           = 0;
var ang         = 0;
var looking     = null;
var scrollTimer = null;
var danceTimer  = null;
var lookTimer   = null;
var dancing     = null;
var danceDelay  = 5000;
var prevScrollX = 0;
var foodPoints  = [];
var windowWidth = window.outerWidth;

var cloud       = Snap.select('.cloud');
var fancypants  = Snap.select('.fp');
var hair        = Snap.select('#Hair');
var head        = Snap.select('#Face');
var eyes        = Snap.selectAll('#Right_eye,#Left_eye');
var smile       = Snap.select('#Smile');
var mouth       = Snap.select('#Open_mouth_1_');
var spine       = Snap.select('#Spine');
var hand1       = Snap.select('#Left_hand');
var hand2       = Snap.select('#Right_hand');
var belt        = Snap.select('#Belt_1_');
var pant1       = Snap.select('#Left_leg');
var pant2       = Snap.select('#Right_leg');
var wheels      = Snap.selectAll('#wheel,#wheel_1_');
var legCrack    = Snap.select('#Leg_crack');
var leftFolds   = Snap.select('#Left_pant_folds');
var rightFolds  = Snap.select('#Right_pant_folds');
var pants       = Snap.selectAll('#Right_leg,#Left_leg');
var wheels      = Snap.selectAll('#wheel,#wheel_1_');
var eatables    = Snap.selectAll('.eatable');

var pivots = {
  'spine':[spine.attr('x1'),spine.attr('y1')],
  'hand1':[hand1.attr('x1'),hand1.attr('y1')],
  'hand2':[hand2.attr('x1'),hand2.attr('y1')],
  'hair':[head.attr('cx'),head.attr('cy')],
  'folds': [legCrack.attr('x2'), legCrack.attr('y2')]
};


//moveClouds();
var init = function(){
  eatables.forEach(function(el){
    var point = {'el':el,'isEaten': false};
    foodPoints.push(point);
  });

  setTimeout(function(){
    lookLeft();
    initSKate = setInterval(function(){skate('front');},20);
    fancypants.attr('class','fp');
    setTimeout(function(){
      clearTimeout(initSKate);
      lookStraight();
      setTimeout(blinkEyes,1000);
    },1500);
  },1000);

  document.addEventListener('scroll',function(e){
    e.preventDefault();
    onScroll();
  });

  danceTimer = setTimeout(function(){
    dancing = setInterval(dance,500);
  }, danceDelay);

};

window.addEventListener('load', init, false);

function onScroll(){
  
  clearInterval(dancing);
  
  if (danceTimer)  {
    resetFancyPants();
    clearTimeout(danceTimer);
  }
  
  danceTimer = setTimeout(function(){
    dancing = setInterval(dance,500);
  },danceDelay);

  var isScrollingForward = window.scrollX - prevScrollX > 0;
  prevScrollX = window.scrollX;

  if(isScrollingForward) {
    skate('front');
    moveHair(-10);
    lookLeft();
  } else {
    skate('back');
    moveHair(10);
    lookRight();
  }

  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  scrollTimer = setTimeout(function(){
    moveHair(0);
    eat();
    scrollContent(window.pageXOffset);
  }, 1);

  if(lookTimer)
    clearTimeout(lookTimer);

  lookTimer = setTimeout(lookStraight,100);
};

var listItems = document.querySelectorAll('.story li');

function scrollContent(pos){
  var activeIndex = Math.floor(pos/windowWidth)+1;
  for ( i in listItems) {
    listItems[i].className = '';
  }
  document.querySelector('.story li:nth-child('+activeIndex+')').className = 'active';
}

function skate(dir){
  wheels.forEach(function(el){
    ang = (dir == 'front' ? ang+1 : ang-1);
    el.transform("r"+[10*ang]);
  });
}

function moveHair(angle){
  hair.animate({transform: "r"+[angle,pivots.hair]},10);
}

function eat(){
  for (var i = foodPoints.length - 1; i >= 0; i--) {
    var food = foodPoints[i];
    if(window.scrollX > food.el.node.offsetLeft - 330 && !food.isEaten){
      //lookLeft();
      openMouth();
    }
    if(window.scrollX > food.el.node.offsetLeft - 150 && !food.isEaten){
      food.el.node.style.display = 'none';
      closeMouth();
      changePants(food.el.node.getAttribute('color'));
      //lookStraight();
      food.isEaten = true;
    }
  }
}

function blinkEyes(){
  eyes.forEach(function(el){
    el.attr({"r":0});
  });
  setTimeout(function(){
    eyes.forEach(function(el){
      el.attr({"r":4.08});
    });
  },100);
}

function changePants(color){
  pants.forEach(function(el){
    el.animate({'fill': color},200);
  });
}

function lookLeft(){
  eyes.forEach(function(el){
    el.animate({transform:"t"+[10,0]},50);
  });
}

function lookRight(){
  eyes.forEach(function(el){
    el.animate({transform:"t"+[-10,0]},50);
  });
}

function openMouth(){
  smile.attr('display','none');
  mouth.attr('display','inline').animate({transform:"t"+[-26,0]},20);//.attr({mask: head})
}

function closeMouth(){
  smile.attr('display','inline');
  mouth.attr('display','none').animate({transform:"t"+[0,0]},20);
}

function lookStraight(){
  eyes.forEach(function(el){
    el.animate({transform:"t"+[0,0]},50);
  });
}

function moveClouds() {
  setInterval(function () {
    cloud.transform("t"+[i++,0]);
  },200);
}

function dance(){
  pant1.animate({transform:"t"+[-7,0]},200);
  pant2.animate({transform:"t"+[-7,0]},200);
  spine.animate({transform:"r"+[5,pivots.spine]},200);
  legCrack.animate({transform:"t"+[-7,0]+"r"+[-10,pivots.folds]},200);
  leftFolds.animate({transform:"t"+[-7,0]+"r"+[-10,pivots.folds]},200);
  rightFolds.animate({transform:"t"+[-7,0]+"r"+[-10,pivots.folds]},200);
  hand1.animate({transform:"r"+[-7,pivots.spine]},200);
  hand2.animate({transform:"r"+[-7,pivots.spine]},200);
  belt.animate({transform:"t"+[-7,0]},200);
  setTimeout(function(){
    pant1.animate({transform:"t"+[7,0]},200);
    pant2.animate({transform:"t"+[7,0]},200);
    spine.animate({transform:"r"+[-5,pivots.spine]},200);
    legCrack.animate({transform:"t"+[7,0]+"r"+[15,pivots.folds]},200);
    leftFolds.animate({transform:"t"+[7,0]+"r"+[15,pivots.folds]},200);
    rightFolds.animate({transform:"t"+[7,0]+"r"+[15,pivots.folds]},200);
    hand1.animate({transform:"r"+[7,pivots.spine]},200);
    hand2.animate({transform:"r"+[7,pivots.spine]},200);
    belt.animate({transform:"t"+[7,0]},200);
  }, 250);
}

function resetFancyPants(){
  pant1.animate({transform:"t"+[0,0]},200);
  pant2.animate({transform:"t"+[0,0]},200);
  spine.animate({transform:"r"+[0,pivots.spine]},200);
  legCrack.animate({transform:"t"+[0,0]+"r"+[0,pivots.folds]},200);
  leftFolds.animate({transform:"t"+[0,0]+"r"+[0,pivots.folds]},200);
  rightFolds.animate({transform:"t"+[0,0]+"r"+[0,pivots.folds]},200);
  hand1.animate({transform:"r"+[0,pivots.spine]},200);
  hand2.animate({transform:"r"+[0,pivots.spine]},200);
  belt.animate({transform:"t"+[0,0]},200);
}