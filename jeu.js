
//<!-- Zone de jeu -->
let svg = d3.select("svg");
let jeu = d3.select("#interface_jeu");


// <!-- Varibles récupérés du code HTML -->
var joueur = d3.select("#joueur")
let rect = d3.select("#espace_joueur"); // terrain du joueur


// <!-- Déclaration de variables -->
var joueur_x; // joueur_x est la position x du joueur
var joueur_y; // joueur_y est la position y du joueur
var joueur = d3.select("#joueur"); // Joueur
var score = 150; //compteur score
let compteurvies = 3; //compteur vie
let tirjoueur = []; //attaque du joueur
let tirennemi = []; //attaque de l'ennemi
let ennemis = []; //ennemi
let coordonnees = [];
let adv = []; //attaque de l'ennemi

// let mainlayer = svg.append("g")



//Joueur au premier plan 
svg.append("use")
    .attr("id", "avatar")
    .attr("href", "#joueur")
    .style("z-index", 2)

function positionAvatar(e) {
    let pointer = d3.pointer(e);
    d3.select("#avatar")
        .attr("x", pointer[0])
        .attr("y", pointer[1])
    joueur_x = pointer[0]
    joueur_y = pointer[1]
}

rect.on("mousemove", function (e) {
    positionAvatar(e);
    joueur = [{ x: joueur_x, y: joueur_y }];
})


// <---------------------------------------------------->
// Tir du joueur
// <---------------------------------------------------->

function tir_attaques() {
    tirjoueur.push({ x: joueur_x-1, y: joueur_y-4.5, vx: -1, vy: 0 })
    creation_attaques();
}

function creation_attaques() {
    let lien = svg
        .selectAll(".tirjoueur")
        .data(tirjoueur);

    lien.enter()
        .append("use")
        .attr("class", "tirjoueur")
        .attr("href", "#tir_joueur");

    lien.exit()
        .remove();
    place_attaques();
}

function place_attaques() {
    svg.selectAll(".tirjoueur")
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function mouvement_attaques() {
    tirjoueur.forEach(d => {
        //chaque tit se déplace de sa vitesse en x
        d.x += d.vx;
    })

    //fonction qui retirent les ennemis lorsque les tirs du joueur les touchent
    if (suppressionDansTableau(tirjoueur, attaque =>
        suppressionDansTableau(ennemis, ennemi => distance(attaque, ennemi) < 5))) {  // test de collision entre le tir et l'ennemi
        //suppression de l'ennemi
        creation_attaques();
        creation_ennemis();
        // <---------------------------------------------------->
        // Score
        // <---------------------------------------------------->
        document.querySelector('#points').innerHTML = score;
        score += 150;

    } else {
        //uniquement les coordonnées des tirs ont été modifiées, on fait la mise à jour correspondante
        place_attaques();
    }
}

setInterval(tir_attaques, 600);
setInterval(mouvement_attaques, 15);


// <---------------------------------------------------->
// Ennemis
// <---------------------------------------------------->

//on veut qu'ils spawn en x-18 et entre 0 et 95 en y et se déplacent sur x de 1 et sur y de 0
function ennemiss() {
    ennemis.push({ x: -18, y: entierAleatoire(0,95)-6, vx: 1, vy: 0 })
    creation_ennemis();
}

function creation_ennemis() {
    let lien2 = svg
        .selectAll(".ennemi")
        .data(ennemis);

    lien2.enter()
        .append("use")
        .attr("class", "ennemi")
        .attr("href", "#ennemis");
    // update_coords();

    lien2.exit()
        .remove();
    place_ennemis();
}


// test pour savoir si une goute a terminÃ© sa chute
function chute_en_cours(d) {
    return d.x < 90;
}

function place_ennemis() {
    svg.selectAll(".ennemi")
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function mouvement_ennemis() {
    ennemis.forEach(d => {
        //chaque tire se déplace de sa vitesse en x
        d.x += d.vx;
    })
    place_ennemis();
}

setInterval(function () {

    if (ennemis.every(chute_en_cours))
        console.log("ça marche");
    else {
        ennemis = ennemis.filter(chute_en_cours);
        compteurvies--;
    }

    if (compteurvies == 2) {
        d3.select(".vie3").remove();
    }
    else if (compteurvies == 1) {
        d3.select(".vie2").remove()
    }
    else if (compteurvies == 0) {
        compteurvies = -1;
        d3.select(".vie1").remove();
        setTimeout(() => { alert("Ton score est de : **** points    Recommence"); window.location.reload() }, 0);
    }
}, 20);

setInterval(ennemiss, 1000);
setInterval(mouvement_ennemis, 40);


///////////////////////////////////////////////

// Ici on veut que les ennemis apparaissent à partir de min et de max (interval fermé)
function entierAleatoire(min, max)
{
 return Math.floor(Math.random() * (max - min + 1)) + min;
}


function angle(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}
function distance(a, b) {
    let dx = a.x - b.x;
    let dy = (a.y - b.y)*2;
    return Math.sqrt(dx * dx + dy * dy);
}


function suppressionDansTableau(tableau, critere) {

    let suppression = false;
    for (let i = tableau.length - 1; i >= 0; i--) {
        if (critere(tableau[i])) {
            tableau.splice(i, 1);
            suppression = true;
        }
    }
    return suppression;
}



// Tir ennemis

function tir_ennemis() {
    ennemis.forEach(function (e){
        tirennemi.push({ x: e.x-5, y: e.y-3.5, vx: 1, vy: 0 })
    
    })
    creation_attaques_ennemis();
}

function creation_attaques_ennemis() {
    let lien = svg
        .selectAll(".tirennemis")
        .data(tirennemi);

    lien.enter()
        .append("use")
        .attr("class", "tirennemis")
        .attr("href", "#tir_ennemi");

    lien.exit()
        .remove();
    place_attaques_ennemis();
}

function place_attaques_ennemis() {
    svg.selectAll(".tirennemis")
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function mouvement_attaques_ennemis() {
    tirennemi.forEach(d => {
        //chaque tit se déplace de sa vitesse en x
        d.x += d.vx;
    })

    //fonction qui retirent les ennemis lorsque les tirs du joueur les touchent
    if (suppressionDansTableau(tirennemi, attaquemechante =>
        suppressionDansTableau(joueur, mechant => distance(attaquemechante, mechant) < 7.2))) {  // test de collision entre le tir et l'ennemi
        //suppression de l'ennemi
        creation_attaques_ennemis();
        compteurvies--;

    } else {
        //uniquement les coordonnées des tirs ont été modifiées, on fait la mise à jour correspondante
        place_attaques_ennemis();
    }
}

setInterval(tir_ennemis, entierAleatoire(3000,4000));
setInterval(mouvement_attaques_ennemis, entierAleatoire(28,32));





