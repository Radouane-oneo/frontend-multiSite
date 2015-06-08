$(window).load(function() { 
    $(".block-loader").find('img').animate({opacity:0},8000);
    $(".block-loader").delay(3000).slideUp();    
});
$(function(){ 

  function switchblocktoshow(parent,toshow,tohide,hideme){  
       $("#"+parent+" ."+toshow).show();
       $("#"+parent+" ."+tohide).hide(); 
       if(hideme!=""){
        $("#"+parent+" ."+hideme).hide(); 
       }
  }

  function switchsecondaire(parent,secondaire){ 
    $("#"+parent+" ."+secondaire).show();
  }

  function validateEmail(email) {
    var emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$/;
    return emailReg.test(email);
  } 

  function validateNumber(number) {
    var numberReg =  /[0-9]/;
    return numberReg.test(number);
  }

  function validatechar(valeur) {
    var charReg =  /[a-zA-Z]/;
    return charReg.test(valeur);
  }

  function validatePhone(numTel){  
    var rgxPhone = /(([0-9]{2})[-. ]?){5}/  
      return rgxPhone.test(numTel);   
  } 

  function validatecomme(commentaire){   
    var status;
    if(commentaire.length < 10) 
    {
      status= false;
    } 
    else {
      status=true;
    }   
    return status;
  } 

          
var reloadslider = function(){
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    autoplay:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        320:{
            items:1,
            nav:true
        },
        480:{
            items:2,
            nav:true
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
            loop:false
        }
    }
}); 
}
   
/**** Function Slide Page *****/
var inverseslidePagination=function(pagetoslide,index){
 
  $("."+pagetoslide).css({
    '-webkit-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-moz-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-ms-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    'transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-webkit-transition': 'all 0.6s', 
    '-moz-transition': 'all 0.6s', 
    '-ms-transition': 'all 0.6s', 
    '-o-transition': 'all 0.6s', 
    'transition': 'all 0.6s', 
  });
}
var slidePagination=function(pagetoslide,index){
 
  $("."+pagetoslide).css({
    '-webkit-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-moz-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-ms-transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    'transform' : 'translate3d(0, -' + (index*100) + '%, 0)',
    '-webkit-transition': 'all 0.6s', 
    '-moz-transition': 'all 0.6s', 
    '-ms-transition': 'all 0.6s', 
    '-o-transition': 'all 0.6s', 
    'transition': 'all 0.6s', 
  });
}
$(".toTop").on("click",function(){  
   var pagetoslide=$(this).attr("data-slideto");
   var pagetohide="mobile-block";
   index1=0;
   index2=1;
   inverseslidePagination(pagetohide,index1);
   slidePagination(pagetoslide,index2);
});

$(".btn-menu")
  .on("click",function(){
    $(this).find(".cbutton--effect-boris").addClass("click");
  })
  .on('mouseup',function(){ 
    $(this).find(".cbutton--effect-boris").removeClass("click");
     var pagetoslide=$(this).attr("data-slideto"); 
    index=$("."+pagetoslide).index()-1;
    slidePagination(pagetoslide,index);
    if (pagetoslide == 'page-3') {
        reloadslider();
    }; 
  });










 reloadslider();
$(".btn-down").on("click",function(){
  var pagetoslide=$(this).attr("data-slideto"); 
  index=$("."+pagetoslide).index()-1;
  slidePagination(pagetoslide,index);
  
  if (pagetoslide == 'page-3') {
      reloadslider();
  };
});

$(".btn-up").on("click",function(){ 
  var pagetoslide=$(this).attr("data-slideto");
  index=0;//$("."+pagetoslide).index()-2;
  slidePagination(pagetoslide,index);
}); 
/**** End Function *****/

/* script Block topvente ****/
$(".form-topvente .btn").click(function(){
    var thisbtn=$(this);
    var isvalidateb = false;
    var email =jQuery(".form-topvente input[name='email']"); 
   
    if(!validateEmail(email.val())) { 
      
      email.addClass("msgerror").attr("placeholder"," Veuillez saisir une adresse e-mail valable."); 
    }
    else{
      email.removeClass("msgerror"); 
      switchblocktoshow("block-topvente",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"));
    }  
    return isvalidateb; 
}); 

$("#block-topvente .btn-step1").on("click",function(){
   var thisbtn=$(this); 
   switchblocktoshow("block-topvente",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
});
 $("#block-topvente .step-4 .msg .close").on("click",function(){
   var thisbtn=$(this); 
   switchblocktoshow("block-topvente",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme"));
   switchsecondaire("block-topvente",thisbtn.attr("data-showsecondaire"));
});

/* END Pagination Block topvente ****/ 
     
/* script Block sampleflip */
$(".form-find-sampleflip  .btn-step1").click(function(){
  var thisbtn=$(this);
  var isvalidateb = false;
  var codepostal =$(".form-find-sampleflip input[name='codepostal']"); 
 
  if(!validateNumber(codepostal.val())) {  
    codepostal.addClass("msgerror").attr("placeholder"," Veuillez saisir un code postal valable."); 
  }
  else{
    codepostal.removeClass("msgerror"); 
    switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
  }  
  return isvalidateb; 
});


$(".send-mail-sampleflip .btn").click(function(){
  var count=0;
  var thisbtn=$(this);
  var isvalidateb = false;
  var email =$(".send-mail-sampleflip input[name='email']");
  var nom =$(".send-mail-sampleflip input[name='nom']");  
  var phone =$(".send-mail-sampleflip input[name='phone']");
  var commentaire =$(".send-mail-sampleflip input[name='commentaire']"); 

  if(!validateEmail(email.val())) {             
    email.addClass("msgerror").empty().attr("placeholder","Adresse e-mail non valable"); 
  }
  else{
    email.removeClass("msgerror"); count++; 
  }  

  if(!validatechar(nom.val())){
    nom.addClass("msgerror").empty().attr("placeholder","Nom non valable"); 
  }
  else{
    nom.removeClass("msgerror"); count++; 
  }  

  if(!validatePhone(phone.val())){
     phone.addClass("msgerror").empty().attr("placeholder"," Téléphone non valable"); 
  }
  else{
    phone.removeClass("msgerror");count++;
  }

  if(!validatecomme(commentaire.val())) {
     commentaire.addClass("msgerror").empty().attr("placeholder","Le commentaire est tres court"); 
  }
  else{
    commentaire.removeClass("msgerror");count++;
  } 

  if(count==4)
  {
    switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
  }
  return isvalidateb; 
});

$("#block-sampleflip .step-1 .btn-step1").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
});
$("#block-sampleflip .step-1 .btn-step2").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
});

$("#block-sampleflip .step-3 .btn-map-sampleflip").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
 return false;
});

$("#block-sampleflip .step-4 .link-contact").on("click",function(){
  var thisbtn=$(this); 
  switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
  return false;
}); 
$("#block-sampleflip .step-6-2 .msg .close").on("click",function(){
  var thisbtn=$(this); 
  switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
});

$("#block-sampleflip .msg .close").on("click",function(){
  var thisbtn=$(this); 
  switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme"));
  switchsecondaire("block-sampleflip",thisbtn.attr("data-showsecondaire"));
});



$("#block-sampleflip .step-8-2 .msg .close").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
});

$("#block-sampleflip .step-5 .annuler").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
});
$("#block-sampleflip  .wrap-contact .close").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
});

$(".form-commander .btn").click(function(){
  var count=0;
  var thisbtn=$(this);
  var isvalidateb = false;
  var email =$(".form-commander input[name='email']");
  var nom   =$(".form-commander input[name='nom']");  
  var adresse =$(".form-commander input[name='adresse']"); 
   
  if(adresse.val().length==0){
    adresse.addClass("msgerror").attr("placeholder","champ obligatoire"); 
  }
  else{
    adresse.removeClass("msgerror"); count++; 
  }

  if(!validatechar(nom.val())){
    nom.addClass("msgerror").attr("placeholder","Nom non valable"); 
  }
  else{
    nom.removeClass("msgerror"); count++; 
  } 
   
  if(email.val().length>0){
    if(!validateEmail(email.val())){
      email.addClass("msgerror").attr("placeholder","Adresse e-mail non valable"); 
    }
    else{
      email.removeClass("msgerror"); 
    }
  }  

  if(count==2)
  { 
    switchblocktoshow("block-sampleflip",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
  }
  return isvalidateb; 
});
/* end Block sampleflip */
/* script Block Flyerstore*/
$("#block-flyerstore .step-1 .btn").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
});
$(".form-find-flyerstore .btn-step1").click(function(){
  var thisbtn=$(this);
  var isvalidateb = false;
  var codepostal =$(".form-find-flyerstore input[name='codepostal']"); 
 
  if(!validateNumber(codepostal.val())) {  
    codepostal.addClass("msgerror").attr("placeholder"," Veuillez saisir un code postal valable."); 
  }
  else{
    codepostal.removeClass("msgerror"); 
    switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
  }  
  return isvalidateb; 
});


$("#block-flyerstore .step-3 .btn-map-flyerstore").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
 return false;
});

$("#block-flyerstore .step-4 .link-contact").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
 return false;
}); 
$("#block-flyerstore  .wrap-contact .close").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
});
$("#block-flyerstore .step-6-2 .msg .close").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
 switchsecondaire("block-flyerstore",thisbtn.attr("data-showsecondaire"));
});

$("#block-flyerstore .step-5 .annuler").on("click",function(){
 var thisbtn=$(this); 
 switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
});


$(".send-mail-flyerstore .btn").click(function(){
  var count=0;
  var thisbtn=$(this);
  var isvalidateb = false;
  var email =$(".send-mail-flyerstore input[name='email']");
  var nom =$(".send-mail-flyerstore input[name='nom']");  
  var phone =$(".send-mail-flyerstore input[name='phone']");
  var commentaire =$(".send-mail-flyerstore input[name='commentaire']"); 

  if(!validateEmail(email.val())) {             
    email.addClass("msgerror").empty().attr("placeholder","Adresse e-mail non valable"); 
  }
  else{
    email.removeClass("msgerror"); count++; 
  }  

  if(!validatechar(nom.val())){
    nom.addClass("msgerror").empty().attr("placeholder","Nom non valable"); 
  }
  else{
    nom.removeClass("msgerror"); count++; 
  }  

  if(!validatePhone(phone.val())){
     phone.addClass("msgerror").empty().attr("placeholder"," Téléphone non valable"); 
  }
  else{
    phone.removeClass("msgerror");count++;
  }

  if(!validatecomme(commentaire.val())) {
     commentaire.addClass("msgerror").empty().attr("placeholder","Le commentaire est tres court"); 
  }
  else{
    commentaire.removeClass("msgerror");count++;
  } 

  if(count==4)
  {
    switchblocktoshow("block-flyerstore",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
  }
  return isvalidateb; 
}); 
/*end block flyerstore */
/* Script  block newsletter */
 $(".form-newsletter .btn").click(function(){
  var thisbtn=$(this);
  var isvalidateb = false;
  var email =$(".form-newsletter input[name='email']");
 
  if(!validateEmail(email.val())) {             
    email.addClass("msgerror").empty().attr("placeholder","Adresse e-mail non valable"); 
  }
  else{
    email.removeClass("msgerror");
    switchblocktoshow("block-newsletter",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
  }   
  return isvalidateb; 
});

$("#block-newsletter .step-1-2 .msg .close").on("click",function(){
  var thisbtn=$(this); 
  switchblocktoshow("block-newsletter",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),''); 
  switchsecondaire("block-newsletter",thisbtn.attr("data-showsecondaire"));
});

/* End block newsletter */
/*Script block contact */
  $("#block-contact .link-contact").on("click",function(){
   var thisbtn=$(this); 
   switchblocktoshow("block-contact",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
   return false;
}); 

$("#block-contact .step-1-2 .annuler").on("click",function(){
   var thisbtn=$(this); 
   switchblocktoshow("block-contact",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
   switchsecondaire("block-contact",thisbtn.attr("data-showsecondaire"));
});

$(".send-mail-contact .btn").click(function(){
    var count=0;
    var thisbtn=$(this);
    var isvalidateb = false;
    var email =$(".send-mail-contact input[name='email']");
    var nom =$(".send-mail-contact input[name='nom']");  
    var phone =$(".send-mail-contact input[name='phone']");
    var commentaire =$(".send-mail-contact input[name='commentaire']"); 

    if(!validateEmail(email.val())) {             
      email.addClass("msgerror").empty().attr("placeholder","Adresse e-mail non valable"); 
    }
    else{
      email.removeClass("msgerror"); count++; 
    }  

    if(!validatechar(nom.val())){
      nom.addClass("msgerror").empty().attr("placeholder","Nom non valable"); 
    }
    else{
      nom.removeClass("msgerror"); count++; 
    }  

    if(!validatePhone(phone.val())){
       phone.addClass("msgerror").empty().attr("placeholder"," Téléphone non valable"); 
    }
    else{
      phone.removeClass("msgerror");count++;
    }

    if(!validatecomme(commentaire.val())) {
       commentaire.addClass("msgerror").empty().attr("placeholder","Le commentaire est tres court"); 
    }
    else{
      commentaire.removeClass("msgerror");count++;
    } 

    if(count==4)
    {
      switchblocktoshow("block-contact",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),'');
    }
    return isvalidateb; 
}); 

 $("#block-contact .step-2-2 .msg .close").on("click",function(){
    var thisbtn=$(this); 
    switchblocktoshow("block-contact",thisbtn.attr("data-toshow"),thisbtn.attr("data-tohide"),thisbtn.attr("data-hideme")); 
    switchsecondaire("block-contact",thisbtn.attr("data-showsecondaire"));
  });
/* End block contact */


     $("#owl-demo").owlCarousel({
 
      navigation : true, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      singleItem:true
 
      // "singleItem:true" is a shortcut for:
      // items : 1, 
      // itemsDesktop : false,
      // itemsDesktopSmall : false,
      // itemsTablet: false,
      // itemsMobile : false
 
  });    
});