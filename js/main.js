/*global Snap */

(function(){
  'use strict';

  var $           = Snap.select,
      $$          = Snap.selectAll,
      ang         = 0,
      danceDelay  = 3000,
      prevScrollX = 0,
      foodPoints  = [],
      isScrollingForward, food, initSkate, lookTimer, dancing, danceTimer, scrollTimer, hairTimer;

  var fancypants  = $('.fp'),
      head        = $('#Face'),
      eyes        = $$('#Right_eye,#Left_eye'),
      smile       = $('#Smile'),
      mouth       = $('#Open_mouth_1_'),
      spine       = $('#Spine'),
      hand1       = $('#Left_hand'),
      hand2       = $('#Right_hand'),
      belt        = $('#Belt_1_'),
      pant1       = $('#Left_leg'),
      pant2       = $('#Right_leg'),
      legCrack    = $('#Leg_crack'),
      leftFolds   = $('#Left_pant_folds'),
      rightFolds  = $('#Right_pant_folds'),
      pants       = $$('#Right_leg,#Left_leg'),
      wheels      = $$('#wheel,#wheel_1_'),
      eatables    = $$('.eatable'),
      hairFront   = document.getElementById('hair-front'),
      hairBack    = document.getElementById('hair-back');

  var pivots = {
    'spine':[spine.attr('x1'),spine.attr('y1')],
    'hand1':[hand1.attr('x1'),hand1.attr('y1')],
    'hand2':[hand2.attr('x1'),hand2.attr('y1')],
    'hair':[head.attr('cx'),head.attr('cy')],
    'folds': [legCrack.attr('x2'), legCrack.attr('y2')]
  };

  var init = function(){
    eatables.forEach(function(el){
      foodPoints.push({'el':el,'isEaten': false});
    });

    setTimeout(function(){
      lookLeft();
      initSkate = setInterval(function(){skate('front');},20);
      fancypants.attr('class','fp');
      setTimeout(function(){
        clearTimeout(initSkate);
        lookStraight();
        setTimeout(blinkEyes,500);
      },1000);
    },1000);

    document.addEventListener('scroll',function(){ onScroll(); });
    //setInterval(onScroll, 10);

    danceTimer = setTimeout(function(){
      dancing = setInterval(dance,500);
    }, danceDelay);
  };

  window.addEventListener('load', init, false);
  var scrollHelper = document.querySelector('.scroll-helper');

  function onScroll(){
    scrollHelper.style.display = 'none';

    if (danceTimer)  {
      clearInterval(dancing);
      resetFancyPants();
      clearTimeout(danceTimer);
    }

    danceTimer = setTimeout(function(){
      dancing = setInterval(dance,500);
    },danceDelay);

    isScrollingForward = window.scrollX - prevScrollX > 0;
    prevScrollX = window.scrollX;

    if(isScrollingForward) {
      skate('front');
      hairBack.beginElement();
      lookLeft();
    } else {
      skate('back');
      hairFront.beginElement();
      lookRight();
    }

    //if (scrollTimer) { clearTimeout(scrollTimer); }
    if (hairTimer) { clearTimeout(hairTimer); }

    hairTimer = setTimeout(function(){
      hairFront.beginElement();
    }, 100);

    //scrollTimer = setTimeout(function(){
      eat();
    //}, 1);

    if(lookTimer) { clearTimeout(lookTimer); }
    lookTimer = setTimeout(lookStraight,100);
  }

  function skate(dir){
    wheels.forEach(function(el){
      ang = (dir === 'front' ? ang+1 : ang-1);
      el.transform('r'+[10*ang]);
    });
  }

  function eat(){
    for (var i = foodPoints.length - 1; i >= 0; i--) {
      food = foodPoints[i];
      if(window.scrollX > food.el.node.offsetLeft - 250 && !food.isEaten){
        openMouth();
      }
      if(window.scrollX > food.el.node.offsetLeft - 170 && !food.isEaten){
        foodPoints.splice(i,1);
        food.el.node.style.display = 'none';
        closeMouth();
        changePants(food.el.node.getAttribute('color'));
        food.isEaten = true;
      }
    }
  }

  function blinkEyes(){
    eyes.forEach(function(el){
      el.attr({'r':0});
    });
    setTimeout(function(){
      eyes.forEach(function(el){
        el.attr({'r':4.08});
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
      el.animate({transform:'t'+[10,0]},50);
    });
  }

  function lookRight(){
    eyes.forEach(function(el){
      el.animate({transform:'t'+[-10,0]},50);
    });
  }

  function openMouth(){
    smile.attr('display','none');
    mouth.attr('display','inline').animate({transform:'t'+[-26,0]},20);
  }

  function closeMouth(){
    smile.attr('display','inline');
    mouth.attr('display','none').animate({transform:'t'+[0,0]},20);
  }

  function lookStraight(){
    eyes.forEach(function(el){
      el.animate({transform:'t'+[0,0]},50);
    });
  }

  function dance(){
    pant1.animate({transform:'t'+[-7,0]},200);
    pant2.animate({transform:'t'+[-7,0]},200);
    spine.animate({transform:'r'+[5,pivots.spine]},200);
    legCrack.animate({transform:'t'+[-7,0]+'r'+[-10,pivots.folds]},200);
    leftFolds.animate({transform:'t'+[-7,0]+'r'+[-10,pivots.folds]},200);
    rightFolds.animate({transform:'t'+[-7,0]+'r'+[-10,pivots.folds]},200);
    hand1.animate({transform:'r'+[-7,pivots.spine]},200);
    hand2.animate({transform:'r'+[-7,pivots.spine]},200);
    belt.animate({transform:'t'+[-7,0]},200);
    setTimeout(function(){
      pant1.animate({transform:'t'+[7,0]},200);
      pant2.animate({transform:'t'+[7,0]},200);
      spine.animate({transform:'r'+[-5,pivots.spine]},200);
      legCrack.animate({transform:'t'+[7,0]+'r'+[15,pivots.folds]},200);
      leftFolds.animate({transform:'t'+[7,0]+'r'+[15,pivots.folds]},200);
      rightFolds.animate({transform:'t'+[7,0]+'r'+[15,pivots.folds]},200);
      hand1.animate({transform:'r'+[7,pivots.spine]},200);
      hand2.animate({transform:'r'+[7,pivots.spine]},200);
      belt.animate({transform:'t'+[7,0]},200);
    }, 250);
  }

  function resetFancyPants(){
    pant1.animate({transform:'t'+[0,0]},200);
    pant2.animate({transform:'t'+[0,0]},200);
    spine.animate({transform:'r'+[0,pivots.spine]},200);
    legCrack.animate({transform:'t'+[0,0]+'r'+[0,pivots.folds]},200);
    leftFolds.animate({transform:'t'+[0,0]+'r'+[0,pivots.folds]},200);
    rightFolds.animate({transform:'t'+[0,0]+'r'+[0,pivots.folds]},200);
    hand1.animate({transform:'r'+[0,pivots.spine]},200);
    hand2.animate({transform:'r'+[0,pivots.spine]},200);
    belt.animate({transform:'t'+[0,0]},200);
  }

})(Snap);