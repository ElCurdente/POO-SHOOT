console.log('sex')
let svg = d3.select("svg");
let compteur=0;
function entierAlea(n) {
    return Math.floor(Math.random()*n);
}
svg.style("background-color", "cyan");

let coordonnees=[];

function update_DOM() {
    
    let update=
    svg
        .selectAll("circle.actif")
        .data(coordonnees,d=>d.id);
    update.exit()        //transition de sortie
        .attr("class","inactif") 
        .transition()
        .duration(2500)
        .style("fill","white")
        .attr("r",0)
        .remove();
        
    update.enter()
        .append("circle")    
        .attr("class","actif")
        .attr("r", 0)
        .style("fill","black")
        .transition()
        .duration(500)
        .attr("r", 2)
    update_coords();
}
function update_coords() {
    svg
        .selectAll("circle")
        .attr("cx", d=>d.x)
        .attr("cy", d=>d.y) ;     
}
// test pour savoir si une goute a terminÃ© sa chute
function chute_en_cours(d) {
    return d.y<90;
}


// initialement: update complÃ¨te
update_DOM();



//toutes les 50ms: les goutes tombent un peu
setInterval(function(){
    if (coordonnees.length==0) return;
    coordonnees.forEach(function(d) {
        d.vitesse+=2; //la vitesse augmente (accÃ©lÃ©ration pendant la chute)
        d.y+=d.vitesse/20;  //y augmente en fonction de la vitesse 
    });
    
    if (coordonnees.every(chute_en_cours))
        update_coords();
    else {
        coordonnees=coordonnees.filter(chute_en_cours);
        update_DOM();
    }

}, 50);


//toutes les 100ms: une nouvelle goutte est ajoutÃ©e en haut
setInterval(function(){
    compteur++;
    coordonnees.push({x:entierAlea(100),y:0, vitesse:entierAlea(40)+20, id:compteur});
    update_DOM();
}, 100);