
//<!-- Zone de jeu -->
let svg = d3.select("svg");
let jeu = d3.select("#interface_jeu");


// <!-- Varibles récupérés du code HTML -->
var joueur = d3.select("#joueur")
let rect = d3.select("#espace_joueur"); // terrain du joueur


// <!-- Déclaration de variables -->
var joueur_x; // joueur_x est la position x du joueur
var joueur_y; // joueur_y est la position y du joueur
var score = 150;
let compteur = 0;
let compteurvies = 3;
let tirjoueur = []; //attaque du joueur
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
    positionAvatar(e)
})


// <---------------------------------------------------->
// Tir du joueur
// <---------------------------------------------------->

function tir_attaques() {
    tirjoueur.push({ x: joueur_x, y: joueur_y, vx: -1, vy: 0 })
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

setInterval(tir_attaques, 900);
setInterval(mouvement_attaques, 15);


// <---------------------------------------------------->
// Ennemis
// <---------------------------------------------------->

//on veut qu'ils spawn en x-18 et entre 0 et 95 en y et se déplacent sur x de 1 et sur y de 0
function ennemiss() {
    ennemis.push({ x: -18, y: entierAleatoire(0,95), vx: 1, vy: 0 })
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

// function update_coords() {
//        svg
//             .selectAll(".ennemi")
//             .attr("x", d => d.x)
//             .attr("y", d => d.y);
//     }

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
        update_coords();
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

// function update_DOM() {

//     let update =
//         svg
//             .selectAll("circle.actif")
//             .data(coordonnees, d => d.id);

//     update.exit()        //transition de sortie
//         .attr("class", "inactif")
//         .transition()
//         .duration(2500)
//         .style("fill", "white")
//         .attr("r", 0)
//         .remove();

//     update.enter()
//         .append("circle")
//         .attr("class", "actif")
//         .attr("r", 0)
//         .style("fill", "black")
//         .style("background-image", "url(/Images/drd.png")
//         .transition()
//         .duration(500)
//         .attr("r", 2)
//     update_coords();
// }
// function update_coords() {
//     svg
//         .selectAll("circle")
//         .attr("cx", d => d.x)
//         .attr("cy", d => d.y);
// }
// // test pour savoir si une goute a terminÃ© sa chute
// function chute_en_cours(d) {
//     return d.x < 90;
// }


// // initialement: update complÃ¨te
// update_DOM();



// //toutes les 20ms: les goutes tombent un peu
// setInterval(function () {
//     if (coordonnees.length == 0) return;
//     coordonnees.forEach(function (d) {
//         d.vitesse += 0; //la vitesse augmente (accÃ©lÃ©ration pendant la chute)
//         d.x += d.vitesse / 50;  //y augmente en fonction de la vitesse 
//     });

//     if (coordonnees.every(chute_en_cours))
//         update_coords();
//     else {
//         coordonnees = coordonnees.filter(chute_en_cours);
//         update_DOM();
//         compteurvies--;
//     }

//     if (compteurvies == 2) {
//         d3.select(".vie3").remove();
//     }
//     else if (compteurvies == 1) {
//         d3.select(".vie2").remove()
//     }
//     else if (compteurvies == 0) {
//         compteurvies = -1;
//         d3.select(".vie1").remove();
//         setTimeout(() => { alert("Ton score est de : **** points    Recommence"); window.location.reload() }, 0);
//     }
// }, 20);


// //toutes les 2sec: une nouvelle goutte est ajoutÃ©e à gauche
// setInterval(function () {
//     compteur++;
//     coordonnees.push({ y: entierAlea(100), x: -15, vitesse: entierAlea(10) + 20, id: compteur });
//     update_DOM();
// }, 1500);



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
    let dy = a.y - b.y;
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


