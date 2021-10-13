let svg = d3.select("svg");
let compteur = 0;
let compteurvies = 3;
function entierAlea(n) {
    return Math.floor(Math.random() * n);
}
svg.style("background-color", "cyan");

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
        setTimeout(() => { alert("recommence"); window.location.reload() }, 0);
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
    .attr("id", "fantome")
    .attr("href", "#spirale")
    .style("display", "none")
    .style("z-index", 2)
    .style("opacity", ".5");

// mouvements de la souris: entrÃ©e, dÃ©placement, sortie. On gÃ¨re la visibilitÃ© et la position du fantome
// fonction annexe pour gÃ©rer la position
function positionFantome(e) {
    let pointer = d3.pointer(e);
    d3.select("#fantome")
        .attr("x", "105")
        .attr("y", pointer[1])
}
//entrÃ©e
svg.on("mouseenter", function (e) {
    positionFantome(e);
    d3.select("#fantome")
        .style("display", null)
})
//dÃ©placement
svg.on("mousemove", function (e) {
    positionFantome(e);
})
//sortie
svg.on("mouseleave", function (e) {
    d3.select("#fantome")
        .style("display", "none")
})
