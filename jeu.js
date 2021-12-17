
//<!-- Zone de jeu -->
let svg = d3.select("svg");
let jeu = d3.select("#interface_jeu");


// <!-- Varibles récupérés du code HTML -->
var joueur = d3.select("#joueur")
let rect = d3.select("#espace_joueur"); // terrain du joueur


// <!-- Déclaration de variables -->
var joueur_x = 0; // joueur_x est la position x du joueur
var joueur_y = 0; // joueur_y est la position y du joueur
var joueur = d3.select("#joueur"); // Joueur
var score = 150; //compteur score
let compteurvies = 3; //compteur vie
let tirjoueur = []; //attaque du joueur
let tirennemi = []; //attaque de l'ennemi
let ennemis = []; //ennemi
let coordonnees = [];
let adv = []; //attaque de l'ennemi
var paused = false;
var reprendre = document.getElementById('reprendre');
var recommencer = document.getElementById('recommencer');

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
        .attr("y", pointer[1] + 4)
    joueur_x = pointer[0]
    joueur_y = pointer[1]
}

rect.on("mousemove", function (e) {
    if (paused)
        return;
    positionAvatar(e);
    joueur = [{ x: joueur_x, y: joueur_y }];
})

function espace() {
    d3.select(".espace").style("display", "none");
}
setTimeout(espace, 5000);

// <---------------------------------------------------->
// Tir du joueur
// <---------------------------------------------------->

function tir_attaques() {
    if (paused != true) {
        tirjoueur.push({ x: joueur_x - 1, y: joueur_y - 4.5, vx: -1, vy: 0 })
    }
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
    if (paused != true) {
        tirjoueur.forEach(d => {
            //chaque tit se déplace de sa vitesse en x
            d.x += d.vx;
        })
    }

    //fonction qui retirent les ennemis lorsque les tirs du joueur les touchent
    if (suppressionDansTableau(tirjoueur, attaque =>
        suppressionDansTableau(ennemis, ennemi => distance(attaque, ennemi) < 7.4))) {  // test de collision entre le tir et l'ennemi
        //suppression de l'ennemi
        creation_attaques();
        creation_ennemis();
        // <---------------------------------------------------->
        // Score
        // <---------------------------------------------------->
        document.querySelectorAll('#points').forEach(e => {
            e.innerHTML = score;

        })
        score += 150;

    } else {
        //uniquement les coordonnées des tirs ont été modifiées, on fait la mise à jour correspondante
        place_attaques();
    }
}

var init_tir;
var vit_joueur = 400;

function vague_tir(freq) {
    vit_joueur = freq;
    init_tir = setInterval(tir_attaques, freq);
}
vague_tir(400)

function ModifInterval() {
    clearInterval(init_tir);
}

setInterval(mouvement_attaques, 15);

// <---------------------------------------------------->
// Ennemis
// <---------------------------------------------------->

//on veut qu'ils spawn en x-18 et entre 0 et 95 en y et se déplacent sur x de 1 et sur y de 0
function ennemiss() {
    if (paused != true && score <= 1500) {
        ennemis.push({ x: -18, y: entierAleatoire(5, 95), vx: 0.45, vy: 0 })
        creation_ennemis();
    } else if (paused != true && score >= 1500 && score <= 4000) {
        ennemis.push({ x: -18, y: entierAleatoire(5, 95), vx: 0.55, vy: 0 })
        creation_ennemis();
    } else if (paused != true && score >= 4000) {
        ennemis.push({ x: -18, y: entierAleatoire(5, 95), vx: 0.63, vy: 0 })
        creation_ennemis();
    }
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

function chute_en_cours(d) {
    return d.x < 90;
}

function place_ennemis() {
    svg.selectAll(".ennemi")
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function mouvement_ennemis() {
    if (paused != true) {
        ennemis.forEach(d => {
            //chaque tire se déplace de sa vitesse en x
            d.x += d.vx;
        })
    }
    place_ennemis();
}

setInterval(function () {

    if (ennemis.every(chute_en_cours));

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
        setTimeout(() => { d3.select('#fin').style('display', 'flex'); paused = true; d3.select('#bg').style('animation-play-state', 'paused'); }, 0);
    }

    //vague tir joueur
    if (score >= 1500 && score <= 4000 && vit_joueur == 400) {
        ModifInterval();
        vague_tir(250);
    }

    if (score >= 4000 && vit_joueur == 400) {
        ModifInterval();
        vague_tir(10);
    }

    //vague ennemis
    if (score >= 4000 && vit_enn == 1000) {
        ModifInterval2();
        vague_enn(600);
    }

}, 20);

var init_enn;
var vit_enn = 1000;

function vague_enn(freq2) {
    vit_enn = freq2;
    init_enn = setInterval(ennemiss, freq2);
}
vague_enn(1000)

function ModifInterval2() {
    clearInterval(init_enn);
}
setInterval(mouvement_ennemis, 15);

///////////////////////////////////////////////

// Ici on veut que les ennemis apparaissent à partir de min et de max (interval fermé)
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function angle(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}
function distance(a, b) {
    let dx = a.x - b.x;
    let dy = (a.y - b.y) * 2;
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

// <---------------------------------------------------->
// Tir ennemi
// <---------------------------------------------------->

function tir_ennemis() {
    if (paused != true && score <= 1500) {
        ennemis.forEach(function (e) {
            tirennemi.push({ x: e.x - 5, y: e.y - 3.5, vx: 0.8, vy: 0 })
        })
        creation_attaques_ennemis();
    } else if (paused != true && score >= 1500 && score <= 4000) {
        ennemis.forEach(function (e) {
            tirennemi.push({ x: e.x - 5, y: e.y - 3.5, vx: 1.05, vy: 0 })
        })
        creation_attaques_ennemis();
    }
    else if (paused != true && score >= 4000) {
        ennemis.forEach(function (e) {
            tirennemi.push({ x: e.x - 5, y: e.y - 3.5, vx: 1.25, vy: 0 })
        })
        creation_attaques_ennemis();
    }
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
    if (paused != true) {
        tirennemi.forEach(d => {
            //chaque tit se déplace de sa vitesse en x
            d.x += d.vx;
        })
    }

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

setInterval(tir_ennemis, entierAleatoire(3000, 4000));
setInterval(mouvement_attaques_ennemis, entierAleatoire(15, 20));



function togglePause() {
    if (!paused) {
        paused = true;
        d3.select('#pause').style('display', 'flex');
        d3.select('#bg').style('animation-play-state', 'paused');
    } else if (paused) {
        paused = false;
        d3.select('#pause').style('display', 'none');
        d3.select('#bg').style('animation-play-state', 'running');
    }

}

window.addEventListener('keyup', function (e) {
    var key = e.keyCode;
    if (key === 32)// touche espace
    {
        togglePause();
    }
});

function btn_reprendre() {
    reprendre.addEventListener("click", togglePause());
}

function reload() {
    recommencer.addEventListener("click", window.location.reload(false));
}


function fin() {
    if (compteurvies == 0) {
        d3.select('#fin').style('display', 'flex');
    } else {
        d3.select('#fin').style('display', 'none');
    }
}