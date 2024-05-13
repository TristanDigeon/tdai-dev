/* ////////////////////////////////////////////////////////
//                                                    //
// boite à outils - scripts modulaires génériques     //
//                                                    //      
//////////////////////////////////////////////////////// */

//pour remonter au début de la page
function scrollToTop () {
    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
    }); 
}

//pour remonter à l'ancre
function scrollTo(data) {
  location.hash = "#" + data;
}

//pour scroller au top
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  let contensuap = document.getElementById("main");
  contensuap.scrollTop = 0;
}
    
//pour reloader la page
function restart() {
    // console.log("restart");
    document.location.reload();
}

//pour afficher un bloc masqué ou masquer un bloc avec un ajout de class -->>> VIA ID des blocs
//------> on peut passer plusieurs arguments dans tier2open pour modifier la visibilité de plusieurs blocs simultanément
  function tier2open(data) {
      
    //mémo/test d'utilisation des arugments
    // console.log(arguments.length+" nb arguments"); 
    // console.log(arguments[0]);  
    // console.log(arguments[1]);  
    // console.log(arguments[2]);     
    // if(arguments[2] === undefined){console.log("croquette"); }
    // for(let i = 0; i < arguments.length; i++){console.log("argument " + (i+1) + " : " + arguments[i]); }

    /* console.log(data); */

    for(let i = 0; i < arguments.length; i++){        
        document.getElementById(arguments[i]).classList.toggle("unshow");                
    }  
  }

//pour afficher un bloc masqué ou maquer un bloc avec un ajout de class -->>> VIA les class des blocs
//argument unique
function tier2openclass(data) {     

  var t1 = document.getElementsByClassName(data);
  /* console.log('classes'+ t1);   */

  for(let i = 0; i < t1.length; i++){        
      t1[i].classList.toggle("unshow");                
  }      

}


//pour forcer l'affichage d'un ou plusieurs blocs (ajout seul) -->>> VIA ID des blocs
//------> on peut passer plusieurs arguments dans tier2open pour modifier la visibilité de plusieurs blocs simultanément
  function tier2openOnce(data) {

    /* console.log(data+" open once"); */

    for(let i = 0; i < arguments.length; i++){   
  
            let a = document.getElementById(arguments[i]);             
  
            if(a.classList.contains("unshow")){              
              a.classList.remove("unshow");                
            }
    }  
  }



//pour forcer l'affichage d'un ou plusieurs blocs (ajout seul) -->>> VIA class des blocs
//argument unique
function tier2openOnceclass(data) {

var t1 = document.getElementsByClassName(data);
/* console.log('classes'+ t1 +" open once");       */

for(let i = 0; i < t1.length; i++){ 

        if(t1[i].classList.contains("unshow")){              
          t1[i].classList.remove("unshow");                
        }
}  
}

//pour forcer le masquage d'un ou plusieurs blocs -->>> VIA ID des blocs
//------> on peu passer plusieurs arguments dans tier2open pour modifier la visibilité de plusieurs blocs simultanément
  function tier2close(data) {

    console.log(data);

    for(let i = 0; i < arguments.length; i++){   

            let a = document.getElementById(arguments[i]); 

            if(!a.classList.contains("unshow")){
            a.classList.add("unshow");                
            }
    }  
  }


//pour forcer le masquage d'un ou plusieurs blocs -->>> VIA class des blocs
//argument unique
function tier2closeclass(data) {

  var t1 = document.getElementsByClassName(data);
  /* console.log('classes'+ t1 +" close once"); */
  console.log('classes'+ t1 +" close");

  for(let i = 0; i < t1.length; i++){            

          if(!t1[i].classList.contains("unshow")){
            t1[i].classList.add("unshow");                
          }
  }  
}




//pour affichier un bloc masqué ou maquer un bloc avec un ajout de class
//------> on peu passer plusieur arguments
//------> le premier argument correspont à l'ID de l'objet, les autres au norm des classes à toggle -> exemple switcher('IDobjet', 'classe1', classe2',...)
  function switcher(data){

    console.log(data + " switcher");
    
    for(let i = 1; i < arguments.length; i++){        
        console.log(arguments[i]);
        document.getElementById(arguments[0]).classList.toggle(arguments[i]);                
    }  

}

function switcherRemove(data){
    console.log(data + " remove");
    
    for(let i = 1; i < arguments.length; i++){        
        console.log(arguments[i]);

        let a = document.getElementById(arguments[0]); 

        if(a.classList.contains(arguments[i])){
            a.classList.remove(arguments[i]);                
        }
    }  
}


//pour afficher le sous-menu outils
function showmenumodule(data){
    console.log(data);
    document.getElementById(data).classList.toggle("showmenu");
}


//pour afficher les blocs infos
function infoBlocShow(data){
    console.log(data);
    document.getElementById(data).classList.toggle("showInfo");
}








