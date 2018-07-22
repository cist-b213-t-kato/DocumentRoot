/** koyamatch.com logo */
$("#logo").lettering();

/** shape */
var ellipseRadius = 150;

var ellipses = [
      {"cx":150,"cy":100 ,"rx":ellipseRadius,"ry":50,"fill":"yellow"},
      {"cx":150,"cy":250,"rx":ellipseRadius,"ry":50,"fill":"lime"}
];

/** svg空間作成 */
var svgContainer =  d3.select("#svg")
                      .append("svg")
                      .attr("width", 400)
                      .attr("height", 400);

/** add ellipses */

//影追加 
var shadows = svgContainer.selectAll(".shadow").data(ellipses);
shadows.enter()
       .append("ellipse");
var shadowAttributes = shadows
       .attr("cx", function (d) { return d.cx+5; })
       .attr("cy", function (d) { return d.cy+10; })
       .attr("rx", function (d) { return d.rx; })
       .attr("ry", function (d) { return d.ry; })
       .attr("class","shadow")
       .attr("id", function(d,i){return "sh" + i})
       .style("fill", "#eee");

// ellipases 
var ellipse = svgContainer.selectAll(".ellipse").data(ellipses);
ellipse.enter()
       .append("ellipse")
       .on("mousedown",  function(d,i){ mousedown(i,"mousedown"); })
       .on("mouseup",    function(d,i){ mouseup(i,"mouseup"); })
       .on("mouseover",  function(d,i){ mouseover(i,"mouseover"); })
       .on("mouseout",   function(d,i){ mouseout(i,"mouseout"); })
       .on("touchstart", function(d,i){ mousedown(i,"touchstart"); })
       .on("touchend",   function(d,i){ mouseup(i,"touchend"); })
       .on("click",      function(d,i){ mouseclick(i,"click"); });

var ellipseAttributes = ellipse
       .attr("cx", function (d) { return d.cx; })
       .attr("cy", function (d) { return d.cy; })
       .attr("rx", function (d) { return d.rx; })
       .attr("ry", function (d) { return d.ry; })
       .style("fill", function(d) { return d.fill;})
       .attr("class","ellipse")
       .attr("id", function(d,i){return "ellipse" + i} );


/** マウス　操作　関数　*/
function mouseclick(i,str){
  var el =  d3.select("#ellipse" + i);
  displayText(el.attr("cx"),el.attr("cy"),str);
  log(str);
}

function mouseover(i,str){
  var el =  d3.select("#ellipse" + i);
  displayText(el.attr("cx"),el.attr("cy"),str);
  log(str);
}

function mouseout(i,str){
  var el =  d3.select("#ellipse" + i);
  displayText(el.attr("cx"),el.attr("cy"),str);
  log(str);
}

function mousedown(i,str) {

  var el =  d3.select("#ellipse" + i);
    el.transition()
      .attr("transform","translate(0,10)");
      displayText(el.attr("cx"),el.attr("cy"),str);

    d3.select("#sh" + i)
      .transition()
      .attr("rx",ellipseRadius -10);  

    log(str);    
}

function mouseup(i, str) {

  var el = d3.select("#ellipse" + i);
      el.transition()
        .attr("transform","translate(0,0)");
    displayText(el.attr("cx"),el.attr("cy"),str);

    d3.select("#sh" + i)
      .transition()
      .attr("rx",ellipseRadius); 

    log(str);  
}

// display text on the element
function displayText(x,y, str) {
  svgContainer.selectAll("text")
              .data([])
              .exit()
              .remove();

  var text = svgContainer.selectAll("text").data([str]);
  text.enter()
      .append("text")
      .transition()
      .attr("x", x/2)
      .attr("y", y)
      .text(function(d){return d;})
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("font-weight", "bolder")
      .attr("fill", "red");
}

// output log
function log(str) {
  $("#log").append(str + "<br>");
  $("#log").scrollTop($("#log").prop("scrollHeight"));
}

// clear log
$("#clearlog").on("click", function(){
  $("#log").empty();
});

/** ドラッグ */
// svg空間作成 
var svg02 =  d3.select("#svg02")
               .append("svg:svg")
               .attr("height", 400);
               /*
               .attr("width", 400)
                */
// variables
var circles = [];
var colors = [];

// click event listner作成
svg02.on("click",function(){
  // accessor function
  var lineFunction 
        = d3.svg.line()
                .x(function(d,i) { return circles[i][0]; })
                .y(function(d,i) { return circles[i][1]; })
                .interpolate("linear");  

  svg02.selectAll("circle")
       .remove();
  svg02.selectAll("path")
       .remove();

  var mousePos = d3.mouse(this);

  circles.push(mousePos);
  var color = d3.rgb(Math.floor(Math.random()*255)+1,
                      Math.floor(Math.random()*255)+1,
                      Math.floor(Math.random()*255)+1
                     );
  colors.push(color);

  svg02.append("path")
       .attr("d", lineFunction(circles))
       .attr("stroke", "grey")
       .attr("stroke-width", 5)
       .attr("fill", "none");          

  svg02.selectAll("circle")
      .data(circles)
       .enter()
       .append("circle")
      .attr("cx",function(d,i){return circles[i][0];})
      .attr("cy",function(d,i){return circles[i][1];})
      .attr("r",15)
      .style("fill",function(d,i){return colors[i];});

}); 

$("#reset02").on("click", function(){
  svg02.selectAll("circle")
       .remove();
  svg02.selectAll("path")
       .remove();

  circles = [];
  colors = [];     
});

/* 
  ****************************************** */
// svg空間作成 
var svg03 =  d3.select("#svg03")
               .append("svg:svg")
               .attr("height", 400);

// click event listner作成
svg03.on("click",function(){
  
  var mousePos = d3.mouse(this);

  for (var l = 0; l < 4; l++) {

  var color = d3.rgb(Math.floor(Math.random()*128)+120,
                      Math.floor(Math.random()*128)+120,
                      Math.floor(Math.random()*128)+120
                     );

  var circle = svg03.append("circle")
                    .attr("cx",mousePos[0])
                    .attr("cy",mousePos[1])
                    .attr("r",5)
                    .attr("stroke",color)
                    .attr("stroke-width",5)
                    .style("fill","none");
  for (var i = 0; i < 11; i++) {
    circle.transition()
          .delay(300*l + 50 * i)
          .duration(50)
          .attr("r",10 + 10*i)
          .attr("opacity",1 - 0.1*i)
          .ease("circle")
          .transition()
          .delay(2000)
          .remove();
  };

  };


});

/*    drag
  ****************************************** */
var rectData = [
  {"x":100,"y":100,"width":150,"height":60,"color":"yellow"},
  {"x":200,"y":200,"width":150,"height":60,"color":"lime"},
  {"x":300,"y":300,"width":150,"height":60,"color":"red"}
];

// svg空間作成 
var svg04 =  d3.select("#svg04")
               .append("svg:svg")
               .attr("height", 400);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);               

var rect = svg04
     .selectAll("rect")
     .data(rectData)
     .enter()
     .append("rect")
     .attr("x",function(d){return d.x;})
     .attr("y",function(d){return d.y;})
     .attr("width",function(d){return d.width;})
     .attr("height",function(d){return d.height;})
     .style("fill",function(d){return d.color;})
     .on("mousedown",function(){
       d3.select(this).attr("opacity",0.7);
     })
     .on("mouseup",function(){
       d3.select(this).attr("opacity",1.0);
     })
     .on("mouseout",function(){
       d3.select(this).attr("opacity",1.0);
     })
     .call(drag);
 
function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("x", d.x = d3.event.x)
                 .attr("y", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

/* ----------------- 
        Zoom         
   -----------------  */

var circleData = [0,1,2,3,4,5];
var inc = Math.PI * 2 / circleData.length;

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

// svg空間作成 
var svg05 =  d3.select("#svg05")
               .append("svg:svg")
               .attr("height", 400);

var container = svg05.append("g")
                  .call(zoom);

container.selectAll("circle")
     .data(circleData)
     .enter()
     .append("circle")
     .attr("transform","translate(200,200)")       
     .attr("cx",function(d,i){ return Math.cos(inc*i) * 30;})
     .attr("cy",function(d,i){ return Math.sin(inc*i) * 30;})
     .attr("r",5)
     .style("fill","gold");

function zoomed() {
  container.attr("transform", 
    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}