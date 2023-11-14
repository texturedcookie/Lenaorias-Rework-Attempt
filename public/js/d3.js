historyList = new Array();
prevMapSize =0;
function main(){

    populationfile = d3.json("newpopulation.json").then( function(data){
        console.log("Hey hey hey! The data finished loading population!");
        console.dir(data);
        console.log("people:", data.characters);
        console.log("links: " , data.relations);
        

      var newRelations =[];      
      /*Goes through relations data and checks for the keyword "character"
       if it is there add to array newRelations*/
        for(let i =0; i < data.relations.length;i++){
          let currentSource = data.relations[i].source;
          let currentTarget = data.relations[i].target;
          const inString = 'character';

          if( currentSource.includes(inString) && currentTarget.includes(inString) == true){
            newRelations.push(data.relations[i]);
          } 
        }
        console.log("PeopleArray:", newRelations);
        data.relations = newRelations;
   
        const width = document.getElementById("graph-container").clientWidth;
        const height = document.getElementById("graph-container").clientHeight;
        //document.getElementById("theGraph").attr("width", width).attr("height", height);
//var nodes are the charecter names
//var links are the relations
    chart = ForceGraph(data, { 
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: width,
        height: height,
      // invalidation // a promise to stop the simulation when the cell is re-run
      })
      
     
     document.getElementById("theGraph").append(chart);
     console.log("Chart is: " , chart);

    });

}



function ForceGraph({
    characters, // an iterable of node objects (typically [{id}, …])
    relations // an iterable of link objects (typically [{source, target}, …])
  }, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeName = d => d.name,
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 2, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 8, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  // linkValue = ({value}) => value, //BEN TEST given d in links, returns the value of the link, i.e. strength of likes
    // link stroke color
    linkStroke = (linkObject) => {
      //  console.log('Link value is ' , linkValue);
     // console.log("different link value is " , linkObject.value, "and for fun the name is " , linkObject.relation_name);
      if (linkObject.value < 0) {
        //linkStroke = 
        return "#f00";
      }
      else{
        return "#0f0";
      }
    },
    linkStrokeOpacity = ({value}) => {
      //console.log('Opacity value:', value);
      absVal = Math.abs(value);
      opacityLevel = absVal / 5;
      return opacityLevel;
    }, 
    linkStrokeWidth = 2000, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
   // invalidation // when this promise resolves, stop the simulation
  } = {}) {

    // Compute values.
    const N = d3.map(characters, nodeId).map(intern); 
    const LS = d3.map(relations, linkSource).map(intern);
    const LT = d3.map(relations, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(characters, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(characters, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(relations, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(relations, linkStroke);
    const A = typeof linkStrokeOpacity !== "function" ? null : d3.map(relations, linkStrokeOpacity); //test

  
    // Replace the input nodes and links with mutable objects for the simulation.
    characters = d3.map(characters, (_, i) => ({id: N[i]}));
    relations = d3.map(relations, (_, i) => ({source: LS[i], target: LT[i]}));
  
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(relations).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);

    var svg ; //
    var link;  //= 

    // Create the simulation
    const simulation = d3.forceSimulation(characters)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center",  d3.forceCenter())
        .on("tick", ticked);
  
    //Create an SVG container for HTML document where the graph will be displayed
    svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "graphClass")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: 100%; height: intrinsic;");
  
    link = svg.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", typeof linkStrokeOpacity !== "function" ? linkStrokeOpacity : "0.2") /*, datum)  => {
          linkStrokeOpacity = (datum.id.target.x - datum.id.source.x) /100;
       
        })*/
        .style("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
      .selectAll("line")
      .data(relations)
      .join("line");
 
   
     // WORKS BUT HAS NO TEXT
      var node = svg.append('g')
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
      .selectAll("circle")
      .data(characters)
      .join("circle")
        .attr("r", nodeRadius)
        .call(drag(simulation))
        .on("click", function (characters, datum, event, d) {
          //highlight the current node 
          const clickedNode = d3.select(this);
          // Change the fill color
          clickedNode.attr("fill", "white");

            //create a charecter
          let dID = datum.id;
          console.log('DATUM',dID);
      
            //if this is the first time the user has clicked this specific node, load image
          if(imageURLMap.get(dID) != null){
            getSavedImage(dID);
            //load the saved image from the first time clicking the node
          } 
          //Else create and save a image for that node
          else {
            let characterIndex = datum.index;
            //console.log('Characters index in People array',characterIndex);
            onSubmit(characterIndex, dID);
            console.log("THE CHARACTER CLICKED INDEX",characterIndex);
          }
         
        })
        .on("contextmenu", function(event, d) {
          // Prevent the default context menu from showing     
          event.preventDefault();
          
          console.log("Right-clicked!"); });

      // var node = svg.append('g')
      //   .attr("fill", nodeFill)
      //   .attr("stroke", nodeStroke)
      //   .attr("stroke-opacity", nodeStrokeOpacity)
      //   .attr("stroke-width", nodeStrokeWidth)
      // .selectAll("circle")
      // .data(characters)
      // .join("circle")
      //   .attr("r", nodeRadius)
      //   .append("text").text(function(d) {return "Hello";})
      //   .call(drag(simulation))
      //   .on("click", function (characters, datum, event, d) {
      //     //highlight the current node 
      //     const clickedNode = d3.select(this);
      //     // Change the fill color
      //     clickedNode.attr("fill", "white");

      //       //create a charecter
      //     let dID = datum.id;
      //     console.log('DATUM',dID);
      
      //       //if this is the first time the user has clicked this specific node, load image
      //     if(imageURLMap.get(dID) != null){
      //       getSavedImage(dID);
      //       //load the saved image from the first time clicking the node
      //     } 
      //     //Else create and save a image for that node
      //     else {
      //       let characterIndex = datum.index;
      //       //console.log('Characters index in People array',characterIndex);
      //       onSubmit(characterIndex, dID);
      //       console.log("THE CHARACTER CLICKED INDEX",characterIndex);
      //     }
         
      //   })
      //   .on("contextmenu", function(event, d) {
      //     // Prevent the default context menu from showing     
      //     event.preventDefault();
          
      //     console.log("Right-clicked!"); });


//       var node = svg.append("g")
//       .attr("class", "nodes")
//       .selectAll("g")
//       .data(characters)
//       .enter()
//       .append("g");

//       node.append('circle').attr('r', nodeRadius)
//        .call(drag(simulation))
//         .on("click", function (characters, datum, event, d) {
//           //highlight the current node 
//           const clickedNode = d3.select(this);
//           // Change the fill color
//           clickedNode.attr("fill", "white");

//             //create a charecter
//           let dID = datum.id;
//           console.log('DATUM',dID);
      
//             //if this is the first time the user has clicked this specific node, load image
//           if(imageURLMap.get(dID) != null){
//             getSavedImage(dID);
//             //load the saved image from the first time clicking the node
//           } 
//           //Else create and save a image for that node
//           else {
//             let characterIndex = datum.index;
//             //console.log('Characters index in People array',characterIndex);
//             onSubmit(characterIndex, dID);
//             console.log("THE CHARACTER CLICKED INDEX",characterIndex);
//           }
         
//         })
//         .on("contextmenu", function(event, d) {
//           // Prevent the default context menu from showing     
//           event.preventDefault();
          
//           console.log("Right-clicked!"); });
      
//       node.append('text').text(function(d) {
//         thename = returnName(d.id);
// console.log("DDDDDD",d.id);
// console.log("NAMEEEE",returnName(d.id));

//         return thename;
    
//       });


      // .each("circle")
      //     .append("text").text(function(d) {return "Hello";});
   
       //.append("text")
       //.text(function(d) { return "Hello"; });




    if (W) link.attr("stroke-width", ({index: i}) => W[i]);
    if (L) link.attr("stroke", ({index: i}) => L[i]);
    if (A) link.attr("stroke-opacity",({index: i}) => A[i]);  //test!
    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (T) node.append("title").text(({index: i}) => T[i]);
    //node.append("text").text(function(){return "Hello";});
    //if (invalidation != null) invalidation.then(() => simulation.stop());
  
    function intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

 
//Connects all the nodes together
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);

    }

    // node
    // .attr("cx", d => d.x)
    // .attr("cy", d => d.y);


  
    function drag(simulation) {    
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }


    
    

  
    return Object.assign(svg.node(), {scales: {color}});
  }


