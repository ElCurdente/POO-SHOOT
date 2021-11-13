
//<!-- Zone de jeu -->
let svg = d3.select("svg"); 
let jeu = d3.select("#jeu");


// <!-- Varibles récupérés du code HTML -->
var joueur = d3.select("#joueur")
let rect = d3.select("#terrain"); // terrain du joueur


// <!-- Déclaration de variables -->
var joueur_x; // joueur_x est la position x du joueur
var joueur_y; // joueur_y est la position y du joueur
let attaques=[]; //attaque du joueur
let ennemis =[]; //ennemi
let adv=[]; //attaque de l'ennemi
// let mainlayer = svg.append("g")



//Joueur au premier plan 
svg.append("use")
    .attr("id","avatar")
    .attr("href", "#joueur")
    .style("z-index",2)





function positionAvatar(e) {
    let pointer = d3.pointer(e);
    d3.select("#avatar")
        .attr("x", pointer[0])
        .attr("y", pointer[1])
    joueur_x = pointer[0]
    joueur_y = pointer[1]
}

rect.on("mousemove", function (e) {
    positionAvatar(e)
})




// <---------------------------------------------------->
// <---------------------------------------------------->
// Tir du joueur
// <---------------------------------------------------->
// <---------------------------------------------------->


function tir_attaques (){
    attaques.push( {x:joueur_x,y:joueur_y, vx:1, vy:1})
    creation_attaques();
    }

function creation_attaques(){
    let lien = svg
        .selectAll(".attaque")
        .data(attaques);

        lien.enter()
        .append("use")
        .attr("class", "attaque")
        .attr("href", "#attaque");

    lien.exit()
        .remove();    
    place_attaques();
}

function place_attaques() {
    svg.selectAll(".attaque") 
        .attr("transform", d=>`translate(${d.x},${d.y})`);
}

function mouvement_attaques() {
    attaques.forEach(d=>{        
        //chaque tit se déplace de sa vitesse en x
        d.x+=d.vx;
    })

//fonction qui retirent les ennemis lorsque les tirs du joueur les touchent
    if (suppressionDansTableau(attaques , attaque=> 
            suppressionDansTableau(ennemis, ennemi => distance(attaque, ennemi) < 7.2))){  // test de collision entre le tir et l'ennemi
        //suppresion de l'ennemi
        creation_attaques();
        creation_ennemis();
        ajout_point()  
        
    }  else {
        //uniquement les coordonnées des oiseaux ont été modifiées, on fait la mise à jour correspondante
        place_attaques();
    }
}
setInterval(tir_attaques, 1000);
setInterval(mouvement_attaques, 20);







///////////////////////////////////////////////

function entierAlea(n) {
    return Math.floor(Math.random()*n);
}


function angle(x,y) {
    return Math.atan2(y,x)*180/Math.PI;
}
function distance(a,b) {
    let dx=a.x-b.x;
    let dy=a.y-b.y;
    return Math.sqrt(dx*dx+dy*dy);
    }


function suppressionDansTableau(tableau, critere) {

    let suppression=false;
    for (let i=tableau.length-1; i>=0; i-- ) {
        if (critere(tableau[i])) {
            tableau.splice(i,1);
            suppression=true;
        }
    }
    return suppression; 
}




