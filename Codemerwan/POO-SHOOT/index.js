let svg = d3.select("svg");
let compteur = 0;
let compteurvies = 3;
var bg_decallage = 0;
function entierAlea(n) {
    return Math.floor(Math.random() * n);
}
svg.style("background-image", "url('Images/citybg.png')");
svg.style("background-size", "cover");

setInterval(function () {
    svg.style("background-position", bg_decallage + "px 0px");
    bg_decallage = bg_decallage + 1;
}, 15);
// svg.animate([
//     //keyframes
//     { transform: 'translateX(0px)' },
//     { transform: 'translateX(-100%)' }
// ], {
//     //timing option
//     duration: 1000,
//     iterations: Infinity
// });



let coordonnees = [];
let coordonneesperso = [];

function update_DOM() {

    let update =
        svg
            .selectAll("circle.actif")
            .data(coordonnees, d => d.id);

    update.exit()        //transition de sortie
        .attr("class", "inactif")
        .transition()
        .duration(2500)
        .style("fill", "white")
        .attr("r", 0)
        .remove();

    update.enter()
        .append("circle")
        .attr("class", "actif")
        .attr("r", 0)
        .style("fill", "black")
        .transition()
        .duration(500)
        .attr("r", 2)
    update_coords();
}
function update_coords() {
    svg
        .selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}
// test pour savoir si une goute a terminÃ© sa chute
function chute_en_cours(d) {
    return d.x < 90;
}


// initialement: update complÃ¨te
update_DOM();



//toutes les 20ms: les goutes tombent un peu
setInterval(function () {
    if (coordonnees.length == 0) return;
    coordonnees.forEach(function (d) {
        d.vitesse += 0; //la vitesse augmente (accÃ©lÃ©ration pendant la chute)
        d.x += d.vitesse / 50;  //y augmente en fonction de la vitesse 
    });

    if (coordonnees.every(chute_en_cours))
        update_coords();
    else {
        coordonnees = coordonnees.filter(chute_en_cours);
        update_DOM();
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


//toutes les 2sec: une nouvelle goutte est ajoutÃ©e à gauche
setInterval(function () {
    compteur++;
    coordonnees.push({ y: entierAlea(100), x: -15, vitesse: entierAlea(10) + 20, id: compteur });
    update_DOM();
}, 1500);



//Souris
let mainlayer = svg.append("g")

//puis un fantome, qui sera toujours au premier plan (initialement invisible)
svg.append("use")
    .attr("id","fantome")
    .attr("href", "#spirale")
    .style("z-index",2)
        .attr("x","110")
    .attr("y","50")

// mouvements de la souris: entrÃ©e, dÃ©placement, sortie. On gÃ¨re la visibilitÃ© et la position du fantome
// fonction annexe pour gÃ©rer la position
let rectanglejeu = d3.select("#rectanglejoueur")

function positionFantome(e) {
    let pointer = d3.pointer(e);
    d3.select("#fantome")
        .attr("x", pointer[0])
        .attr("y", pointer[1])
    xdujoueur = pointer[0]
    ydujoueur = pointer[1]
    console.log(xdujoueur)
    console.log(ydujoueur)
}

rectanglejeu.on("mousemove", function (e) {
    positionFantome(e)
})




// <---------------------------------------------------->
// Tirs du joueur
// <---------------------------------------------------->



var tirjoueur = []; //variable du tir
var xdujoueur = 20;
var ydujoueur = 50;

function creationdutirjoueur(){
    let lien = svg
        .selectAll(".tirjoueur")
        .data(tirjoueur);

        lien.enter()
        .append("use")
        .attr("class", "tirjoueur")
        .attr("href", "#tirjoueur");

    lien.exit()
        .remove();    
    placementdutir();
}

function placementdutir() {
    svg.selectAll(".tirjoueur") 
        .attr("transform", d=>`translate(${d.x},${d.y})`);
}


function mouvementdutirjoueur() {
    tirjoueur.forEach(d=>{        
        //chaque tir se déplace de sa vitesse en x
        d.x+=d.vx;
    })}


    function tirdujoueur (){
        tirjoueur.push( {x:xdujoueur,y:ydujoueur, vx:-1, vy:0})
        creationdutirjoueur();
        }

setInterval(tirdujoueur, 1200);
setInterval(mouvementdutirjoueur, 60)