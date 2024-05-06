/* ////////////////////////////////////////////////////////
//                                                    //
// scripts spécifiques au SUAP                         //
//                                                    //      
//////////////////////////////////////////////////////// */


//gestion du filtrage des profils VSAV/Prompt/Chef-a/Appro depuis la version SUAP gobale
/*création de la variable du profil dans le navigateur*/
function initfiltres(){
  localStorage.setItem('filtre', 'suap');
  console.log('initfiltre');
}

/*modification de la variable du profil dans le navigateur*/
function changefiltre(data){  
  localStorage.removeItem('filtre');
  localStorage.setItem('filtre', data);
  console.log('chanchefiltre local:'+ data);
}

/*vérification de la variable du profil dans le navigateur - vesrion TH*/
function checkfiltre(){

  console.log('checkfiltre');

  const applyfiltre = localStorage.getItem('filtre');

  if(applyfiltre!=null){

  switch (applyfiltre) {
    case 'suap':
      openfiltre();
    break;

    case 'prompt':
      filtreprompt();
    break;

    case 'vsav':
      filtrevsav();
    break;

    case 'chefagres':
      filtrechefagres();
    break;
    
    case 'appro':
      filtreappro();
    break;

    default:
      console.log('erreur filtre SUAP');      

  } 

  console.log('checkfiltresommaire OK');
  console.log('checkfiltre local:'+applyfiltre);

}
}

/*vérification de la variable du profil dans le navigateur - vesrion FT*/
function checkfiltreFT(){

  console.log('checkfiltreFT');

  const applyfiltre = localStorage.getItem('filtre');

  if(applyfiltre!=null){

  switch (applyfiltre) {
    case 'suap':
      openfiltreFT();
    break;

    case 'prompt':
      filtrepromptFT();
    break;

    case 'vsav':
      filtrevsavFT();
    break;

    case 'chefagres':
      filtrechefagresFT();
    break;
    
    case 'appro':
      filtreapproFT();
    break;

    default:
      console.log('erreur filtre SUAP FT');
      

  } 

  console.log('checkfiltresommaire OK FT');
  console.log('checkfiltre local:'+applyfiltre);

}
}

//appication du filtre de profil prompt pour TH
function filtreprompt(){

    console.log('filtre prompt');

    openfiltre();

    tier2closeclass('detail-som-TH');
    tier2closeclass('tag-list');

    tier2closeclass('vsav');
    tier2closeclass('appro');
    tier2closeclass('chefagres');

    /* injectionprompt(); */
    injectionvsav();
    injectionchefagres();    
    injectionappro();

    addnewtop();

    addactive('ctn-prompt');
    removeactive('ctn-vsav');
    removeactive('ctn-chefagres');
    removeactive('ctn-appro');    
    removeactive('ctn-suap')

}

//appication du filtre de profil prompt pour FT
function filtrepromptFT(){

    console.log('filtre prompt-FT');   

    openfiltreFT();

   /*  tier2closeclass('FT-prompt'); */
    tier2closeclass('FT-vsav');
    tier2closeclass('FT-appro');
    tier2closeclass('FT-chef-a'); 
    
    /* injectionpromptFT();  */
    injectionvsavFT();
    injectionapproFT();         
    injectionchefagresFT();    


    /*tags sommaires*/
    /* tier2closeclass('tag-sommaire-FT');
    
    /* tier2close('image-flt-som-prompt','image-flt-som-vsav','image-flt-som-appro','image-flt-som-chef-a'); */
    /* tier2openOnce('image-flt-som-prompt'); */

    /*
    addactive('ctn-prompt');
    removeactive('ctn-vsav');
    removeactive('ctn-chefagres');
    removeactive('ctn-appro');    
    removeactive('ctn-suap') */
}

//appication du filtre de profil vsav pour TH
function filtrevsav(){

    console.log('filtre vsav'); 

    openfiltre();

    tier2closeclass('detail-som-TH');
    tier2closeclass('tag-list');

    tier2closeclass('prompt');    
    tier2closeclass('appro');
    tier2closeclass('chefagres');

    injectionprompt();
    /* injectionvsav(); */
    injectionchefagres();    
    injectionappro();

    addnewtop();

    removeactive('ctn-prompt');
    addactive('ctn-vsav');
    removeactive('ctn-chefagres');
    removeactive('ctn-appro');
    removeactive('ctn-suap')

}

//appication du filtre de profil vsav pour FT
function filtrevsavFT(){

  console.log('filtre chef-a-FT');   

  openfiltreFT();

  tier2closeclass('FT-prompt');
  /* tier2closeclass('FT-vsav'); */
  tier2closeclass('FT-appro');
  tier2closeclass('FT-chef-a'); 
  
  injectionpromptFT(); 
  /* injectionvsavFT(); */
  injectionapproFT();         
  injectionchefagresFT();    

  /*tags sommaires*/
  /* tier2close('image-flt-som-prompt','image-flt-som-vsav','image-flt-som-appro','image-flt-som-chef-a');
  tier2openOnce('image-flt-som-vsav'); */

  /*
  addactive('ctn-prompt');
  removeactive('ctn-vsav');
  removeactive('ctn-chefagres');
  removeactive('ctn-appro');    
  removeactive('ctn-suap') */  

}

//appication du filtre de profil appro pour TH
function filtreappro(){

    console.log('filtre appro'); 

    openfiltre();

    tier2closeclass('detail-som-TH');
    tier2closeclass('tag-list');

    tier2closeclass('prompt');
    tier2closeclass('vsav');    
    tier2closeclass('chefagres');

    injectionprompt();
    injectionvsav();
    injectionchefagres();    
    /* injectionappro(); */

    addnewtop();

    removeactive('ctn-prompt');
    removeactive('ctn-vsav');
    removeactive('ctn-chefagres');
    addactive('ctn-appro');
    removeactive('ctn-suap');

}

//appication du filtre de profil appro pour FT
function filtreapproFT(){

  console.log('filtre chef-a-FT');   

  openfiltreFT();

  tier2closeclass('FT-prompt');
  tier2closeclass('FT-vsav');
  /* tier2closeclass('FT-appro'); */
  tier2closeclass('FT-chef-a'); 
  
  injectionpromptFT(); 
  injectionvsavFT();
  /* injectionapproFT();          */
  injectionchefagresFT();    

  /*tags sommaires*/
 /*  tier2close('image-flt-som-prompt','image-flt-som-vsav','image-flt-som-appro','image-flt-som-chef-a');
  tier2openOnce('image-flt-som-appro'); */

  /*
  addactive('ctn-prompt');
  removeactive('ctn-vsav');
  removeactive('ctn-chefagres');
  removeactive('ctn-appro');    
  removeactive('ctn-suap') */  
}

//appication du filtre de profil chef d'agrès pour TH
function filtrechefagres(){

  console.log('filtre chef agres'); 

  openfiltre();

  tier2closeclass('detail-som-TH');
  tier2closeclass('tag-list');

  tier2closeclass('prompt');
  tier2closeclass('vsav');
  tier2closeclass('appro');

  injectionprompt();
  injectionvsav();
  /* injectionchefagres(); */    
  injectionappro();

  addnewtop();

  removeactive('ctn-prompt');
  removeactive('ctn-vsav');
  addactive('ctn-chefagres');
  removeactive('ctn-appro');
  removeactive('ctn-suap');
  
}

//appication du filtre de profil chef d'agrès pour TH
function filtrechefagresFT(){

console.log('filtre chef-a-FT');   

openfiltreFT();

tier2closeclass('FT-prompt');
tier2closeclass('FT-vsav');
tier2closeclass('FT-appro');
/* tier2closeclass('FT-chef-a');  */

injectionpromptFT(); 
injectionvsavFT();
injectionapproFT();         
/* injectionchefagresFT();     */

/*tags sommaires*/
/* tier2close('image-flt-som-prompt','image-flt-som-vsav','image-flt-som-appro','image-flt-som-chef-a');
tier2openOnce('image-flt-som-chef-a'); */

/*
addactive('ctn-prompt');
removeactive('ctn-vsav');
removeactive('ctn-chefagres');
removeactive('ctn-appro');    
removeactive('ctn-suap') */    
}

//libére tous les filtres pour TH
function openfiltre(){

tier2openOnceclass('detail-som-TH');
tier2openOnceclass('tag-list');
tier2openOnceclass('prompt');
tier2openOnceclass('vsav');
tier2openOnceclass('appro');
tier2openOnceclass('chefagres');

clearmessage();

removenewtop();

removeactive('ctn-prompt');
removeactive('ctn-vsav');
removeactive('ctn-chefagres');
removeactive('ctn-appro');
addactive('ctn-suap');

}

//libére tous les filtres pour FT
function openfiltreFT(){

  tier2openOnceclass('FT-prompt');
  tier2openOnceclass('FT-vsav');
  tier2openOnceclass('FT-appro');
  tier2openOnceclass('FT-chef-a');

  clearmessage();

/* removenewtop(); */

/* removeactive('ctn-prompt');
removeactive('ctn-vsav');
removeactive('ctn-chefagres');
removeactive('ctn-appro');
addactive('ctn-suap');
 */ 
}

//ajout du message d'aletre de contenu filtré prompt pour TH
function injectionprompt(){

    var t1 = document.getElementsByClassName('prompt-t');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau Prompt Secours</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré prompt pour FT
function injectionpromptFT(){

    var t1 = document.getElementsByClassName('bandeau-prompt-FT');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau Prompt Secours</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré vsav pour TH
function injectionvsav(){

    var t1 = document.getElementsByClassName('vsav-t');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau équipier VSAV</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré vsav pour FT
function injectionvsavFT(){

    var t1 = document.getElementsByClassName('bandeau-vsav-FT');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau équipier VSAV</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré chef d'agrès pour TH
function injectionchefagres(){

    var t1 = document.getElementsByClassName('chefagres-t');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau Chef d\'Agrès</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré chef d'agrès pour FT
function injectionchefagresFT(){

    var t1 = document.getElementsByClassName('bandeau-chef-a-FT');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances relevant du niveau Chef d\'Agrès</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré appro pour TH
function injectionappro(){

    var t1 = document.getElementsByClassName('appro-t');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances destinées à l\'approfondissement des compétences du niveau Chef d\'Agrès</em></p></div>' );
  }  

}

//ajout du message d'aletre de contenu filtré appro pour FT
function injectionapproFT(){

    var t1 = document.getElementsByClassName('bandeau-appro-FT');
  /* console.log('classes'+ t1);  */
  
  for(let i = 0; i < t1.length; i++){   
    t1[i].insertAdjacentHTML('afterend','<div class="message"><p style="text-align:right"><em>Connaissances destinées à l\'approfondissement des compétences du niveau Chef d\'Agrès</em></p></div>' );
  }  

}

//suppression du message d'aletre de contenu filtré
function clearmessage(){

    document.querySelectorAll('.message').forEach(e => e.remove());
}

//corrige la hauteur de séparation des contenus filtrés
function addnewtop(){

    var t1 = document.getElementsByClassName('tag-list');
    /* console.log('add-top'+ t1);  */


    for(let i = 0; i < t1.length; i++){  
        if(!t1[i].classList.contains('newtop')){
            t1[i].classList.add('newtop');                
        }
    }

}

//corrige la hauteur de séparation des contenus non-filtrés
function removenewtop(){

    var t1 = document.getElementsByClassName('tag-list');
    /* console.log('remove-top'+ t1);  */

    for(let i = 0; i < t1.length; i++){  
        if(t1[i].classList.contains('newtop')){
            t1[i].classList.remove('newtop');                
        }
    }
}


//ajoute une marque visuelle au boutons de filte actif dans le bloc boutons filtre
function addactive(data){

    var t1 = document.getElementById(data);

    if(!t1.classList.contains('bt-active')){
        t1.classList.add('bt-active');                

}
}

//supprime une marque visuelle au boutons de filte actif dans le bloc boutons filtre
function removeactive(data){

var t1 = document.getElementById(data);

    if(t1.classList.contains('bt-active')){
        t1.classList.remove('bt-active');                

}
}


//affiche le tag de profil dans le menu général
function checkfiltredetsommaire(){
  
  const applyfiltredetsomm = localStorage.getItem('filtre');

  console.log('checkfiltredetsommaire= '+ applyfiltredetsomm);

  if(applyfiltredetsomm!=null){

    switch (applyfiltredetsomm) {
      case 'suap':
        tier2openOnceclass('det-sommaire');
      break;
  
      case 'prompt':
        tier2closeclass('det-sommaire');
      break;
  
      case 'vsav':
        tier2closeclass('det-sommaire');
      break;
  
      case 'chefagres':
        tier2closeclass('det-sommaire');
      break;
      
      case 'appro':
        tier2closeclass('det-sommaire');
      break;
  
      default:
        console.log('erreur filtre SUAP - detail sommaire');
    }
  } else return;
  
} 

//permet la bascule TH/FT dans le menu général
function switchFT(){
  tier2openOnceclass('bloc-TH');
  tier2openOnceclass('bloc-FT');
  tier2closeclass('bloc-TH');
  /* tier2closeclass('bloc-FT'); */

  let FT = document.getElementById('btn-swtch-FT');
  let TH = document.getElementById('btn-swtch-TH');

    if(FT.classList.contains('bt-TH-FT-incanive')){
        FT.classList.remove('bt-TH-FT-incanive'); }

    if(!TH.classList.contains('bt-TH-FT-incanive')){
        TH.classList.add('bt-TH-FT-incanive'); }
}
function switchTH(){
  tier2openOnceclass('bloc-TH');
  tier2openOnceclass('bloc-FT');
  /* tier2closeclass('bloc-TH'); */
  tier2closeclass('bloc-FT');

  let FT = document.getElementById('btn-swtch-FT');
  let TH = document.getElementById('btn-swtch-TH');

    if(TH.classList.contains('bt-TH-FT-incanive')){
        TH.classList.remove('bt-TH-FT-incanive'); }

    if(!FT.classList.contains('bt-TH-FT-incanive')){
        FT.classList.add('bt-TH-FT-incanive'); }
}



//fait disparaitre les 1er icones d'aide à l'utilisation du SUAP au scroll
window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  let icoouv = document.getElementById("picto-ouv");

  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    icoouv.style.display = "none";
  } else {
    icoouv.style.display = "block";
  }
}

});



/*filtrage des contenus********************************/

/*masque/affiche les paragraphes et gére les dynamiques section/sous-section*/
function toggleParagraph(paragraphId) {

  /*inverse l'état du paragraphe en question*/
  var paragraph = document.getElementById(paragraphId);
  paragraph.classList.toggle('hidden');
    
  var checkbox = document.getElementById('chkb-'+paragraphId);
  var label = document.querySelector('label[for="chkb-' + paragraphId + '"]');
  
  if (checkbox.checked) {
    label.classList.add('select-label');
    } else {
    label.classList.remove('select-label');
  }

  /*vérififie si c'est une sous-section ou un section pour les imbications implliquées*/  
  /* if(verifierOccurrences(paragraphId, "-", 3)){
    console.log(paragraphId + " est une sous-section");  
  }else{
    console.log(paragraphId + " est une section");
  } */
  
  /*gére les dynamiques section/sous-section*/
  if(verifierOccurrences(paragraphId, "-", 3)){
    console.log(paragraphId + " est une sous-section");
    /*récupère l'état de la section parent*/
    var idParent = extraireChaineAvantOccurrence(paragraphId,"-",3);
    console.log(idParent + " est son parent");  

    var checkboxParent = document.getElementById('chkb-'+idParent);

    var parentChecked = 0;
    var sousSectionChecked = 0;

    /*vérifie l'état du parent*/
    if(checkboxParent.checked){      
      console.log("Le parent est checked");  
      parentChecked = 1;
      /* if (!checkbox.checked) {
        toggleParagraph(idParent);
      } */
    }else {
      console.log("Le parent n'est pas checked");
      toggleParagraphTrue(idParent);
      console.log("On force le chek parent");
      /* if (checkbox.checked) {
        toggleParagraph(idParent);
      } */
    }
    /*vérifie l'action réalisé en sous-section*/
    if (checkbox.checked) {
      console.log("on viens de checked la sous-section");  
      sousSectionChecked = 1;
    }else{
      console.log("on viens de NONchecked la sous-section");  
    }

  /*   if(parentChecked != sousSectionChecked){
      console.log("etat final diférent");  
      toggleParagraphExtern(idParent);
    } */


  }else{
    console.log(paragraphId + " est une section");

    /*si on décoche une section, ça décoche toutes les sous sections*/
    if(!checkbox.checked) {
      console.log(paragraphId + "décoche toutes les sous sections");
      
      for(i = 0; i <10; i++){
        /*verifie l'existance des sous-section*/
        let sousExist = document.getElementById(paragraphId+"-"+i);
        console.log("sous-section existant:" + sousExist);
        if(sousExist != null){toggleParagraphFalse(paragraphId+"-"+i);}
        
      }

    }

  }
  
  }




/*force l'affichage du pragargraphe*/
function toggleParagraphTrue(paragraphId) {

var paragraph = document.getElementById(paragraphId);

if(paragraph.classList.contains('hidden')){
  paragraph.classList.remove('hidden')
}

var checkbox = document.getElementById('chkb-'+paragraphId);
var label = document.querySelector('label[for="chkb-' + paragraphId + '"]');

checkbox.checked = true;
if(!label.classList.contains('select-label')){
label.classList.add('select-label');
}
}

/*force le masquage du pragargraphe*/
function toggleParagraphFalse(paragraphId) {

var paragraph = document.getElementById(paragraphId);

if(!paragraph.classList.contains('hidden')){
  paragraph.classList.add('hidden')
}

var checkbox = document.getElementById('chkb-'+paragraphId);
var label = document.querySelector('label[for="chkb-' + paragraphId + '"]');

checkbox.checked = false;
if(label.classList.contains('select-label')){
label.classList.remove('select-label');}
}


/*affiche tous les contenus et coche toutes les case*/
function toutAfficher() {
  var checkboxes = document.querySelectorAll('.checkbox-input');
  
  for (var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].checked = true;
  let chkb = checkboxes[i].id;
  let chkbclean = chkb.slice(5); 			
  toggleParagraphTrue(chkbclean);
}
}

/*masque tous les contenus et coche toutes les case*/
function toutMasquer() {
  var checkboxes = document.querySelectorAll('.checkbox-input');
  
  for (var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].checked = true;
  let chkb = checkboxes[i].id;
  let chkbclean = chkb.slice(5); 			
  toggleParagraphFalse(chkbclean); 
}
}

/*positonnne l'état de tous les checkboxe en validées*/
function toutChecker() {
  var checkboxes = document.querySelectorAll('.checkbox-input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;     
  }
  
  var label = document.getElementsByClassName('st-label');

  console.log('lab'+label.length)

  for (var j = 0; j < label.length; j++) {

     if(!label[j].classList.contains('select-label')){
      label[j].classList.add('select-label');
    }
  }
}


/*positonnne l'état de tous les checkboxe en NON validées*/
function toutNONChecker() {
  var checkboxes = document.querySelectorAll('.checkbox-input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}

/*affiche/masue l'UI de filtre*/
function toggleInterface() {		
var interfaceSection = document.getElementById('interface-utilisateur');
var toggleButton = document.getElementById('toggle-interface');
var toggleText = document.getElementById('toggle-text');

console.log('toogleInterface');

interfaceSection.classList.toggle('hidden-interface');
interfaceSection.style.height = interfaceSection.scrollHeight + 'px';
toggleButton.classList.toggle('collapsed');

if (interfaceSection.classList.contains('hidden-interface')) {
  interfaceSection.style.height = '0';
  toggleText.innerText = '► Afficher';
} else {
  interfaceSection.style.height = interfaceSection.scrollHeight + 'px';
  toggleText.innerText = '▼ Masquer';
}
}

  /*déplie/replie le chapitre dans l'UI*/
  function toggleChap(data) {
  //récupére l'interface filtre
  var interfaceSection = document.getElementById('interface-utilisateur');		
  //récupére le bloc de chapitre
  var interfaceChap = document.getElementById('filtre-'+data);
  //récupére la hauteur du bloc de chapitre
  var interfaceChapHeight = interfaceChap.style.height.slice(0,-2);
  //récupére le texte fléche
  var toggleFleche = document.getElementById('toggle-text-filtre-'+data);

  //inverse la visibilité du chapitre
  interfaceChap.classList.toggle('hidden');		
  
  //test si le chapitre est ouvert ou fermé
  if (interfaceChap.classList.contains('hidden')) {
    //si le chapitre est fermé reploie la flèche 
    toggleFleche.innerText = '►';		
    //met à jour la hauteur de l'interface			
    let interA = -1*interfaceChapHeight;
    let interMaj = interfaceSection.scrollHeight + interA;
      interfaceSection.style.height = interMaj + 'px'; 
    //passe la hauteur à 0 pour réinitialisé le prochain déploiement
    interfaceChap.style.height = '0';			

  } else {
    //si le chapitre est ouvert deploie la flèche et ajoutre sa hauteur réelle pour dépliement
    toggleFleche.innerText = '▼';
    interfaceChap.style.height = interfaceChap.scrollHeight + 'px';			
    //met à jour la hauteur de l'interface
      interfaceSection.style.height = interfaceSection.scrollHeight + 'px'; 
  }  
  }

  /*force le déploiement du chapitre dans l'UI*/
  function toggleChapTrue(data) {
  //récupére l'interface filtre
  var interfaceSection = document.getElementById('interface-utilisateur');		
  //récupére le bloc de chapitre
  var interfaceChap = document.getElementById('filtre-'+data);
  //récupére la hauteur du bloc de chapitre
  var interfaceChapHeight = interfaceChap.style.height.slice(0,-2);
  //récupére le texte fléche
  var toggleFleche = document.getElementById('toggle-text-filtre-'+data);

  //inverse la visibilité du chapitre
  if(interfaceChap.classList.contains('hidden')){interfaceChap.classList.remove('hidden')}
    
  toggleFleche.innerText = '▼';
  interfaceChap.style.height = interfaceChap.scrollHeight + 'px';			
  //met à jour la hauteur de l'interface
  interfaceSection.style.height = interfaceSection.scrollHeight + 'px'; 
  }

  
  /*force le repliement du chapitre dans l'UI*/
  function toggleChapFalse(data) {
  //récupére l'interface filtre
  var interfaceSection = document.getElementById('interface-utilisateur');		
  //récupére le bloc de chapitre
  var interfaceChap = document.getElementById('filtre-'+data);
  //récupére la hauteur du bloc de chapitre
  var interfaceChapHeight = interfaceChap.style.height.slice(0,-2);
  //récupére le texte fléche
  var toggleFleche = document.getElementById('toggle-text-filtre-'+data);

  if(!interfaceChap.classList.contains('hidden')){interfaceChap.classList.add('hidden')}
  
  toggleFleche.innerText = '►';		
  
  Number(interfaceChapHeight);
  
  var interA = -1*interfaceChapHeight;
  var interMaj = interfaceSection.scrollHeight + interA;
  
  interfaceSection.style.height = interMaj + 'px'; 		

  interfaceChap.style.height = '0';			
  
  return interfaceChapHeight;	  
  }


  /*déploie tous les chapitres de niv 1*/
  function deploieChap(){
  
  var ligneChap =  document.querySelectorAll('.inter-chap-niv-1');			

   for (var i = 0; i < ligneChap.length; i++) {
    let idLigne = ligneChap[i].id.slice(14);
    toggleChapTrue(idLigne);
  }  		
  }	 

  /*replie tous les chapitres de niv 1*/
  function replieChap(){
  
  var ligneChap =  document.querySelectorAll('.inter-chap-niv-1');			
  var compteHauteurRetire = 0;		

   for (var i = 0; i < ligneChap.length; i++) {
    let idLigne = ligneChap[i].id.slice(14);
    
    toggleChapFalse(idLigne);
    
  }  	          
  }	 
 
  /*sauvegarde de la sélection via un .json*/
  function saveSelection(data) {
  var checkboxes = document.querySelectorAll('.checkbox-input');
  var selection = [];

  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
          
    selection.push({
    id: checkbox.id,
    checked: checkbox.checked
    });
  }

  var jsonData = JSON.stringify(selection);
  var blob = new Blob([jsonData], { type: 'application/json' });

  // Téléchargement du fichier
  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  var nomFichier = 'selection_contenus_'+ data +".json"
  downloadLink.download = nomFichier;
  downloadLink.click();
  }

  

  /*charge un .json de selection*/
  function loadSelection(event) {		

    //fait un RAZ
    toutMasquer();

  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function() {
    var jsonData = reader.result;
    var selection = JSON.parse(jsonData);			

    for (var i = 0; i < selection.length; i++) {
    var item = selection[i];
    var checkbox = document.getElementById(item.id);    

    if (checkbox) {
      checkbox.checked = item.checked;
      
      if(checkbox.checked){
      let chkb2 = item.id;
      let chkbclean2 = chkb2.slice(5);
      toggleParagraphTrue(chkbclean2);
      }     
      
    }
    }
  };

  reader.readAsText(file);
  }



    /*UTILITAIRE*///////////////////////////////////*/
  /*vérifie la présence d'un charactère dans une chaine un certain nombre de fois*/
  function verifierOccurrences(chaine, caractere, nombreOccurrences) {
    // Crée une expression régulière avec le caractère spécifié
    var expression = new RegExp(caractere, 'g');
    
    // Utilise la méthode match() pour trouver toutes les occurrences du caractère dans la chaîne
    var occurrences = chaine.match(expression);
    
    // Vérifie le nombre d'occurrences trouvées
    if (occurrences && occurrences.length === nombreOccurrences) {
      /* console.log("La chaîne contient le caractère spécifié le bon nombre de fois."); */
      return true;
    } else {
      /* console.log("La chaîne ne contient pas le caractère spécifié le bon nombre de fois."); */
      return false;
    }
  }

  /*renvoie la chaine de caractère avant l'occurence donnée d'un charactère donné*/
  function extraireChaineAvantOccurrence(chaine, caractere, nombreOccurrences) {
    var position = -1;
    for (var i = 0; i < nombreOccurrences; i++) {
      position = chaine.indexOf(caractere, position + 1);
      if (position === -1) {
        console.log("Le nombre d'occurrences spécifié n'a pas été trouvé.");
        return;
      }
    }    
    var sousChaine = chaine.substring(0, position);
    /* console.log("La sous-chaîne avant l'occurrence est : " + sousChaine); */
    return sousChaine;
  }
  /*UTILITAIRE*///////////////////////////////////*/


/*filtrage des contenus********************************/