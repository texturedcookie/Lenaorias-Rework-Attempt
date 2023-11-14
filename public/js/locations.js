subCityMap = new Map();
var locationList =[];


function main(){
    populationfile = d3.json("newpopulation.json").then( function(data){
        // console.log("Hey hey hey! The data finished loading population!");
        // console.dir(data);
        // console.log("Character Array:", data.characters);
         console.log("Relations Array: " , data.relations);

        // console.log("Location status h:" , data.locations[0].status.h);
        // console.log(data.history[0].actions[0].action_name);
        // console.log(data.history[0].actions[0].arguments);

//Loop through actions 
//Look at the charecters listed
    //if the characters listed is also in the current map
    //add the action to the list of current actions
        //render that list in the event log panel

//TODO  keeps track of curent season and time========================================================================================================================
var moveTime = 0;
let season = data.times[moveTime][0][1];
let time = data.times[moveTime][1][1];  
currentTime = time;
currentSeason = season;  
let timePeriod = "The " + season + " of " + time;
//console.log(timePeriod);    
document.getElementById('season').innerHTML= timePeriod ;
document.getElementById("backwardButton").addEventListener("click", () => {changeTime("backwards")});
document.getElementById("forwardButton").addEventListener("click",  () => {changeTime("forwards")});
function changeTime(direction){

  switch(direction) {
    case "backwards":
      console.log("Back");
      if (moveTime > 0){
      moveTime = moveTime -1;
season = data.times[moveTime][0][1];
time = data.times[moveTime][1][1];  
currentTime = time;
currentSeason = season;  
timePeriod = "The " + season + " of " + time;
//console.log(timePeriod);    
document.getElementById('season').innerHTML= timePeriod ;
//locationsCatagorized(season, time);
      }
      break;

    case "forwards":
if (moveTime < data.times.length){
      console.log("Front");
      moveTime = moveTime +1;
      season = data.times[moveTime][0][1];
time = data.times[moveTime][1][1];  
currentTime = time;
currentSeason = season;  
timePeriod = "The " + season + " of " + time;
//console.log(timePeriod);    
document.getElementById('season').innerHTML= timePeriod ;
//locationsCatagorized(season, time);
}
      break;
    default:
      console.log("BUTTON IS WORKING");
  } 


}

//TODO  This function creates all the buttons for all the cites========================================================================================================================
locationsCatagorized(season, time);
// TODO Filter relations data ========================================================================================================================
      var newRelations =[];      
      var likesRelations =[];    
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
       // console.log("Relationships that map character to character Array:", newRelations);
        data.relations = newRelations;
 /*Goes through relations data and checks for the keyword "likes"
     if it is there add to array newRelationship*/
     for(let i =0; i < data.relations.length;i++){
        let currentRelation = data.relations[i].relation_name;
        const inString = 'likes'; 
  
        if( currentRelation.includes(inString) == true){
          likesRelations.push(data.relations[i]);
        }
       }
      // console.log("Like Relationships that map character to character Array:",likesRelations);
//*This function creates all the buttons for all the large cites
function locationsCatagorized(seasons, timess){

  if (locationList.length != 0) {
  const container1 = document.getElementById("location");
  const roomButtonss = container1.getElementsByClassName("locButtons");
 // console.log(roomButtons);
  const elementsArray1 = Array.from(roomButtonss);
  elementsArray1.forEach(element => {
   element.remove();
 });
  }


//var locationList =[];
        //!create list of cities 
        console.log(locationList.length)
       
        for(let i =0; i < data.locations.length;i++){
            let location = data.locations[i].status.h;
            locationList.push(data.locations[i].status.h);
        }
     
        //!remove dupes
        locationList = removeDuplicatesFromArray(locationList);
       // console.log(locationList);
      
     
        //!create a button for each city
        for(let i =0; i < locationList.length;i++){
        //!create a button for each city
       var button = document.createElement("button");
       //!set button properties
       button.innerHTML = locationList[i];  // Button text
       button.id = "location";         // Button ID
       button.className = "locButtons";  // Button class
       button.addEventListener("click", function () {
      const buttons = document.getElementsByClassName("locButtons");
      // Remove the "highlight" class from all buttons
      for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("highlight");
      } // Add the "highlighted" class to the clicked button
      this.classList.add("highlight");


        //*When a city button  is clicked, show buttons of all the sublocations
           createLocationNameButtons(seasons, timess, locationList[i]);

        //*CLEAR THE GRAPH
         //clear the graph svg
         const graphContainer = document.getElementById("theGraph");
         const graphRoom = graphContainer.getElementsByClassName("graphClass");
         //console.log(graphRoom);
          const elementsArray1 = Array.from(graphRoom);
          elementsArray1.forEach(element => {
           element.remove();
         });

//TODO========================================================================================================================
         //returns character IDs of the characters at the specific location in time
         let characterIDs =  findCharactersAtRegion(locationList[i],data.times); 
         console.log("REGION CLICKED",locationList[i])
         console.log("THE IDDDDSSSSS",characterIDs);

          //call the createviewlocal function
          localData = createViewLocal(newRelations,likesRelations, characterIDs, data.characters);

          //*NEW
         //regionalData = createRegionalView(newRelations,likesRelations, characterIDs, data.characters );
 
    //*This function should return only the connections between the people at the location
    const width = document.getElementById("graph-container").clientWidth;
    const height = document.getElementById("graph-container").clientHeight;
           miniChart = ForceGraph(localData, { 
            nodeId: d => d.id,
            nodeGroup: d => d.group,
            nodeTitle: d => `${d.id}\n${d.group}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            width: width,
            height: height,
          //   // invalidation // a promise to stop the simulation when the cell is re-run
             })
           //*RENDER A GRAPH OF EVERONE IN THE CITY
            document.getElementById("theGraph").append(miniChart);
//TODO========================================================================================================================
       });
        
       var container = document.getElementById("locationB");
       container.appendChild(button);
        }
}

//*Creating  the buttons for every sub location
  function createLocationNameButtons(t,s, statusCity){
          const container1 = document.getElementById("roomB");
          const roomButtons = container1.getElementsByClassName("locroomButtons");
         // console.log(roomButtons);
          const elementsArray = Array.from(roomButtons);
          elementsArray.forEach(element => {
           element.remove();
         });

            //loop through the locations
        for(let i =0; i < data.locations.length;i++){
          if (statusCity == data.locations[i].status.h) {    //if the sublocation is in the city
            //  console.log("ENTERED IF")
            //create a button for each sublocation
           var button2 = document.createElement("button");
           //set button properties
           button2.innerHTML = data.locations[i].name;  // Button text with location name
           button2.id = "locationroom";         // Button ID
           button2.className = "locroomButtons";  // Button class
           button2.addEventListener("click", function () {     
            //*When this button is clicked we want to display the people at this location in a forced direct graph
            const buttonss = document.getElementsByClassName("locroomButtons");
            // Remove the "highlight" class from all buttons
            for (let j = 0; j < buttonss.length; j++) {
              buttonss[j].classList.remove("highlight");
            } // Add the "highlighted" class to the clicked button
            this.classList.add("highlight");
            //*clear the graph svg
            const graphContainer = document.getElementById("theGraph");
            const graphRoom = graphContainer.getElementsByClassName("graphClass");
            //console.log(graphRoom);
             const elementsArray1 = Array.from(graphRoom);
             elementsArray1.forEach(element => {
              element.remove();
            });

              // console.log(data.locations[i].name);
              //Check for what specific time period it is
              //console.log(data.location_history[i]); //replace 0 with i

              //returns character IDs of the characters at the specific location in time
              let characterIDs =  findCharactersAtLocation(data.locations[i].name,data.times); 
             // console.log("THE IDDDDSSSSS",characterIDs);

              localData = createViewLocal(newRelations,likesRelations, characterIDs, data.characters );

     

                //call the createviewlocal function
                  //*This function should return only the connections between the people at the location
                //call the forcedDirect graph funtion to create the chart
console.log("LOCAL DATA",localData);
        const width = document.getElementById("graph-container").clientWidth;
        const height = document.getElementById("graph-container").clientHeight;
               miniChart = ForceGraph(localData, { 
                nodeId: d => d.id,
                nodeGroup: d => d.group,
                nodeTitle: d => `${d.id}\n${d.group}`,
                linkStrokeWidth: l => Math.sqrt(l.value),
                width: width,
                height: height,
              //   // invalidation // a promise to stop the simulation when the cell is re-run
                 })
                document.getElementById("theGraph").append(miniChart);

let newActions = [];

         //Loop through actions 
        for (let e = 0; e < data.history[0].actions.length; e++){
         //Loop through at the characters listed in the action
       //  console.log("GOING THROUGH ACTIONS");
            for (let c = 0; c < data.history[0].actions[e].arguments.length; c++){ 
              //console.log("GOING THROUGH ACTIONS CHARACTERS");
              
              for (let d = 0; d < characterIDs.length; d++){
             //if the characters listed in the action and is in the current map of CHARACTER ids
                if (characterIDs[d] == data.history[0].actions[e].arguments[c]){
                //console.log("Character found!");
                //add the action to the list of current actions
                newActions.push(data.history[0].actions[e])

                } else {
                //console.log("Character not found!")
                }
              }
          }
        }
//console.log("NEW ACTIONS", newActions)

//HELPER METHOD TO CHANGE THE CHARACTER IDS TO THE NAME OF THE CHARACTE
changeCharactersToNames(newActions, data.characters);
  //remove dupes
  newActions = removeDuplicatesFromArray(newActions);
  //console.log("NEW ACTIONS NO DUPES",newActions);


//render that list in the event log panel
for (let act = 0; act < newActions.length; act++) {
//create a button for each city
var actionlist = document.createElement("text");

let eventText = newActions[act].arguments[0] + " " + newActions[act].action_name + " "+ newActions[act].arguments[1] + "<br>";
//set button properties
actionlist.innerHTML = eventText;  // Button text
const event = document.getElementById("EventLog");
event.appendChild(actionlist);


}

//*Save the chart in a Map
              });           
           container1.appendChild(button2);
          }
            }           
  }   
//*Returns the charater IDs of the people at a specific location 
  function findCharactersAtLocation(locationClicked,timeData){
          //Go to that location during that time period (this is in location history)
          //console.log(data.location_history[0].locationsAtTime[0]);
         
          let locIndex = 0;
          for (let a = 0; a < timeData.length; a++) {
              if ( timeData[a][0][1] == season && timeData[a][1][1] == time){
                    //save the index value 
                    locIndex = a;
                    //console.log("TimePeriod Array index== ", locIndex);
              }
          }
        
          //get the names at that location in a list
          //console.log(data.location_history[0].locationsAtTime[17].characters); 
          let tempCharacterList = [];
          let tempCharacterIdList = [];
          let locAtTime = data.location_history[locIndex].locationsAtTime;
         // console.log(locAtTime);
         // console.log(locationClicked);
         
          for (let b = 0; b < locAtTime.length; b++) {
            if (locationClicked == locAtTime[b].location_name){
             // console.log(locAtTime[b].location_name);
              tempCharacterList = data.location_history[locIndex].locationsAtTime[b].characters;
            }
          }
          //tempCharacterList = data.location_history[locIndex].locationsAtTime[0].characters;
         //console.log(tempCharacterList);
        
          //get their character ids in a list
            for (let index = 0; index < tempCharacterList.length; index++) {
           // console.log(data.characters[index].name);
            for (let y = 0; y < data.characters.length; y++) {
              if(tempCharacterList[index] == data.characters[y].name ){
              tempCharacterIdList.push(data.characters[y].id);                  
              }                        
            } 
          }
            //console.log("Character IDs",tempCharacterIdList);
         return tempCharacterIdList;
         
  }
//*Returns the charater IDs of the people at a specific REGION
function findCharactersAtRegion(locationClicked,timeData){
  //Go to that location during that time period (this is in location history)
  //console.log(data.location_history[0].locationsAtTime[0]);
 
  let locIndex = 0;
  for (let a = 0; a < timeData.length; a++) {
      if ( timeData[a][0][1] == season && timeData[a][1][1] == time){
            //save the index value 
            locIndex = a;
            //console.log("TimePeriod Array index== ", locIndex);
      }
  }

  //get the names at that location in a list
  //console.log(data.location_history[0].locationsAtTime[17].characters); 
  let tempCharacterList = [];
  let tempCharacterIdList = [];
  let locAtTime = data.location_history[locIndex].locationsAtTime;
  console.log("REGION FUNCTION",locAtTime);
  console.log("REGION FUNCTION",locationClicked);
 
  for (let n = 0; n < locAtTime.length; n++) {
   // console.log("REGION FUNCTION FOR LOOP",locAtTime[n].location_name);
    let insideName = locAtTime[n].location_name.includes(locationClicked);
    if (insideName == true){
      console.log("REGION FUNCTION IF",locAtTime[n].location_name);

     // tempCharacterList.push(locAtTime[n].characters);
      for (let l = 0; l < locAtTime[n].characters.length; l++) {
        tempCharacterList.push(locAtTime[n].characters[l]);
        
      }
    }
  }
  //tempCharacterList = data.location_history[locIndex].locationsAtTime[0].characters;
 console.log(tempCharacterList);

  //get their character ids in a list
    for (let index = 0; index < tempCharacterList.length; index++) {
   // console.log(data.characters[index].name);
    for (let y = 0; y < data.characters.length; y++) {
      if(tempCharacterList[index] == data.characters[y].name ){
      tempCharacterIdList.push(data.characters[y].id);                  
      }                        
    } 
  }
    //console.log("Character IDs",tempCharacterIdList);
 return tempCharacterIdList;
 
}

//TODO Family friends loves and rivals buttons
var allButton;
document.getElementById("buttonAll").addEventListener("click", () => { 
  const buttonsAll = document.getElementsByClassName("rButtons");
  // Remove the "highlight" class from all buttons
  for (let j = 0; j < buttonsAll.length; j++) {
    buttonsAll[j].classList.remove("highlight");
  } // Add the "highlighted" class to the clicked button
  allButton = document.getElementById("buttonAll") ;
  allButton.classList.add("highlight");
  All(theCurrentlyClickedCharacter); 
});
  var friendButton;
document.getElementById("buttonFriends").addEventListener("click", () => {
  const buttonsF = document.getElementsByClassName("rButtons");
  // Remove the "highlight" class from all buttons
  for (let j = 0; j < buttonsF.length; j++) {
    buttonsF[j].classList.remove("highlight");
  } // Add the "highlighted" class to the clicked button
  friendButton = document.getElementById("buttonFriends") ;
  friendButton.classList.add("highlight");
  friends(theCurrentlyClickedCharacter);
});
var rivalButton;
document.getElementById("buttonRivals").addEventListener("click", () => {
  const buttonsR = document.getElementsByClassName("rButtons");
  // Remove the "highlight" class from all buttons
  for (let j = 0; j < buttonsR.length; j++) {
    buttonsR[j].classList.remove("highlight");
  } // Add the "highlighted" class to the clicked button
  rivalButton = document.getElementById("buttonRivals") ;
  rivalButton.classList.add("highlight");
  rivals(theCurrentlyClickedCharacter);
});
var nemesisButton;
document.getElementById("buttonNemesis").addEventListener("click", () => {
  const buttonsN = document.getElementsByClassName("rButtons");
  // Remove the "highlight" class from all buttons
  for (let j = 0; j < buttonsN.length; j++) {
    buttonsN[j].classList.remove("highlight");
  } // Add the "highlighted" class to the clicked button
  nemesisButton = document.getElementById("buttonNemesis") ;
  nemesisButton.classList.add("highlight");
  nemesis(theCurrentlyClickedCharacter);
});
var mutualLoveButton;
document.getElementById("buttonMutalLove").addEventListener("click", () => {
  const buttonsM = document.getElementsByClassName("rButtons");
  // Remove the "highlight" class from all buttons
  for (let j = 0; j < buttonsM.length; j++) {
    buttonsM[j].classList.remove("highlight");
  } // Add the "highlighted" class to the clicked button
  mutualLoveButton = document.getElementById("buttonMutalLove") ;
  mutualLoveButton.classList.add("highlight");
  mutualLove(theCurrentlyClickedCharacter);
});
function All(id){
    console.log("ALL FUNCTION ID",id);
    console.log("Relations Array: " , data.relations);
    console.log("Character Array:", data.characters);
  /*Goes through relations data and checks for the keyword "likes"
       if it is there add to array newRelationship*/
       const  connectionObj = new Object();
       connectionObj.characters =[];
       connectionObj.relations =[];
     
        for(let i =0; i < data.relations.length;i++){
        let currentRelation = data.relations[i].relation_name;
        //includes ALL
        const inString = 'likes'; 
        const inString2 = 'loves'; 
        let value = data.relations[i].value;
        if(currentRelation.includes(inString) == true || currentRelation.includes(inString2) == true){
          if(id == data.relations[i].source ||id == data.relations[i].target){
            connectionObj.relations.push(data.relations[i]);
          }
        }
       }
       console.log("Friend Relationships that map character to character Array:",connectionObj.relations);
  
       //loop characters
       //loop through the ids in relations
       //if the id is in the relations add it to the characters list
       for (let i = 0; i < data.characters.length; i++) {
        let ccID = data.characters[i].id;
          for (let j=0 ;j<connectionObj.relations.length;j++ ) {
            let cSource = connectionObj.relations[j].source;
            let cTarget = connectionObj.relations[j].target;
            if ( cSource== ccID || cTarget == ccID ){
            connectionObj.characters.push(data.characters[i]);
            //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
            } 
          }
      }
      connectionObj.characters = removeDuplicatesFromArray(connectionObj.characters);
  
  
    console.log("CONNECTION OBJ FRIENDS",connectionObj);
  
  //*CLEAR THE GRAPH
           //clear the graph svg
           const graphContainer = document.getElementById("theGraph");
           const graphRoom = graphContainer.getElementsByClassName("graphClass");
           //console.log(graphRoom);
            const elementsArray1 = Array.from(graphRoom);
            elementsArray1.forEach(element => {
             element.remove();
           });
  
  
       const width = document.getElementById("graph-container").clientWidth;
       const height = document.getElementById("graph-container").clientHeight;
       miniChart = ForceGraph(connectionObj, { 
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: width,
        height: height,
      // invalidation // a promise to stop the simulation when the cell is re-run
      })
      console.log("The Mini Chart",miniChart);
      document.getElementById("theGraph").append(miniChart);
       
}
function friends(id){
  console.log("ALL FUNCTION ID",id);
  console.log("Relations Array: " , data.relations);
  console.log("Character Array:", data.characters);
/*Goes through relations data and checks for the keyword "likes"
     if it is there add to array newRelationship*/
     const  connectionObj = new Object();
     connectionObj.characters =[];
     connectionObj.relations =[];
   
      for(let i =0; i < data.relations.length;i++){
      let currentRelation = data.relations[i].relation_name;
      const inString = 'likes'; 
      let value = data.relations[i].value;
      if(currentRelation.includes(inString) == true && value > 0){
        if(id == data.relations[i].source ||id == data.relations[i].target){
          connectionObj.relations.push(data.relations[i]);
        }
      }
     }
     console.log("Friend Relationships that map character to character Array:",connectionObj.relations);

     //loop characters
     //loop through the ids in relations
     //if the id is in the relations add it to the characters list
     for (let i = 0; i < data.characters.length; i++) {
      let ccID = data.characters[i].id;
        for (let j=0 ;j<connectionObj.relations.length;j++ ) {
          let cSource = connectionObj.relations[j].source;
          let cTarget = connectionObj.relations[j].target;
          if ( cSource== ccID || cTarget == ccID ){
          connectionObj.characters.push(data.characters[i]);
          //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
          } 
        }
    }
    connectionObj.characters = removeDuplicatesFromArray(connectionObj.characters);


  console.log("CONNECTION OBJ FRIENDS",connectionObj);

//*CLEAR THE GRAPH
         //clear the graph svg
         const graphContainer = document.getElementById("theGraph");
         const graphRoom = graphContainer.getElementsByClassName("graphClass");
         //console.log(graphRoom);
          const elementsArray1 = Array.from(graphRoom);
          elementsArray1.forEach(element => {
           element.remove();
         });


     const width = document.getElementById("graph-container").clientWidth;
     const height = document.getElementById("graph-container").clientHeight;
     miniChart = ForceGraph(connectionObj, { 
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: width,
      height: height,
    // invalidation // a promise to stop the simulation when the cell is re-run
    })
    console.log("The Mini Chart",miniChart);
    document.getElementById("theGraph").append(miniChart);
     
}
function rivals(id){
  const  connectionObj = new Object();
  connectionObj.characters =[];
  connectionObj.relations =[];

  for(let i =0; i < data.relations.length;i++){
   let currentRelation = data.relations[i].relation_name;
   const inString = 'likes'; 
   let value = data.relations[i].value;

   if(currentRelation.includes(inString) == true && value < 0  && value > -3){
     if(id == data.relations[i].source ||id == data.relations[i].target){
      connectionObj.relations.push(data.relations[i]);
     }
   }
  }
  console.log("Friend Relationships that map character to character Array:",connectionObj.relations);
      //loop characters
     //loop through the ids in relations
     //if the id is in the relations add it to the characters list
     for (let i = 0; i < data.characters.length; i++) {
      let ccID = data.characters[i].id;
        for (let j=0 ;j<connectionObj.relations.length;j++ ) {
          let cSource = connectionObj.relations[j].source;
          let cTarget = connectionObj.relations[j].target;
          if ( cSource== ccID || cTarget == ccID ){
          connectionObj.characters.push(data.characters[i]);
          //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
          } 
        }
    }
    connectionObj.characters = removeDuplicatesFromArray(connectionObj.characters);


  console.log("CONNECTION OBJ FRIENDS",connectionObj);

//*CLEAR THE GRAPH
         //clear the graph svg
         const graphContainer = document.getElementById("theGraph");
         const graphRoom = graphContainer.getElementsByClassName("graphClass");
         //console.log(graphRoom);
          const elementsArray1 = Array.from(graphRoom);
          elementsArray1.forEach(element => {
           element.remove();
         });


     const width = document.getElementById("graph-container").clientWidth;
     const height = document.getElementById("graph-container").clientHeight;
     miniChart = ForceGraph(connectionObj, { 
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: width,
      height: height,
    // invalidation // a promise to stop the simulation when the cell is re-run
    })
    console.log("The Mini Chart",miniChart);
    document.getElementById("theGraph").append(miniChart);





}
function nemesis(id){
  const  connectionObj = new Object();
  connectionObj.characters =[];
  connectionObj.relations =[];
 
  for(let i =0; i < data.relations.length;i++){
   let currentRelation = data.relations[i].relation_name;
   const inString = 'likes'; 
   let value = data.relations[i].value;

   if(currentRelation.includes(inString) == true && value < -3){
     if(id == data.relations[i].source ||id == data.relations[i].target){
      connectionObj.relations.push(data.relations[i]);
     }
   }
  }
  console.log("Friend Relationships that map character to character Array:",connectionObj.relations);
       //loop characters
     //loop through the ids in relations
     //if the id is in the relations add it to the characters list
     for (let i = 0; i < data.characters.length; i++) {
      let ccID = data.characters[i].id;
        for (let j=0 ;j<connectionObj.relations.length;j++ ) {
          let cSource = connectionObj.relations[j].source;
          let cTarget = connectionObj.relations[j].target;
          if ( cSource== ccID || cTarget == ccID ){
          connectionObj.characters.push(data.characters[i]);
          //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
          } 
        }
    }
    connectionObj.characters = removeDuplicatesFromArray(connectionObj.characters);


  console.log("CONNECTION OBJ FRIENDS",connectionObj);

//*CLEAR THE GRAPH
         //clear the graph svg
         const graphContainer = document.getElementById("theGraph");
         const graphRoom = graphContainer.getElementsByClassName("graphClass");
         //console.log(graphRoom);
          const elementsArray1 = Array.from(graphRoom);
          elementsArray1.forEach(element => {
           element.remove();
         });


     const width = document.getElementById("graph-container").clientWidth;
     const height = document.getElementById("graph-container").clientHeight;
     miniChart = ForceGraph(connectionObj, { 
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: width,
      height: height,
    // invalidation // a promise to stop the simulation when the cell is re-run
    })
    console.log("The Mini Chart",miniChart);
    document.getElementById("theGraph").append(miniChart);



}
function mutualLove(id){
  const  connectionObj = new Object();
  connectionObj.characters =[];
  connectionObj.relations =[];

  for(let i =0; i < data.relations.length;i++){
   let currentRelation = data.relations[i].relation_name;
   const inString = 'loves'; 
   let value = data.relations[i].value;

   if(currentRelation.includes(inString) == true){
     if(id == data.relations[i].source ||id == data.relations[i].target){
      connectionObj.relations.push(data.relations[i]);
     }
   }
  }
  console.log("Friend Relationships that map character to character Array:", connectionObj.relations);
      //loop characters
     //loop through the ids in relations
     //if the id is in the relations add it to the characters list
     for (let i = 0; i < data.characters.length; i++) {
      let ccID = data.characters[i].id;
        for (let j=0 ;j<connectionObj.relations.length;j++ ) {
          let cSource = connectionObj.relations[j].source;
          let cTarget = connectionObj.relations[j].target;
          if ( cSource== ccID || cTarget == ccID ){
          connectionObj.characters.push(data.characters[i]);
          //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
          } 
        }
    }
    connectionObj.characters = removeDuplicatesFromArray(connectionObj.characters);


  console.log("CONNECTION OBJ FRIENDS",connectionObj);

//*CLEAR THE GRAPH
         //clear the graph svg
         const graphContainer = document.getElementById("theGraph");
         const graphRoom = graphContainer.getElementsByClassName("graphClass");
         //console.log(graphRoom);
          const elementsArray1 = Array.from(graphRoom);
          elementsArray1.forEach(element => {
           element.remove();
         });


     const width = document.getElementById("graph-container").clientWidth;
     const height = document.getElementById("graph-container").clientHeight;
     miniChart = ForceGraph(connectionObj, { 
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: width,
      height: height,
    // invalidation // a promise to stop the simulation when the cell is re-run
    })
    console.log("The Mini Chart",miniChart);
    document.getElementById("theGraph").append(miniChart);
     
}

});

  //*Returns an object that contains the characters and their relationships to one another
  function  createViewLocal(relationshipData, likesData, listOfCharacters, characterData) {
       // console.log("INSIDE CREATE VIEW FUNCTION")
        //All relationships data
        //console.log("relationshipData",relationshipData);
         //All "like" relationship data
        //console.log("likesData",likesData);
        //All the charecters apart of the map
        //console.log("listOfCharacters",listOfCharacters);
        
        const  connectionObj = new Object();
        connectionObj.characters =[];
        connectionObj.relations =[];
        
        
        connectionsList = [];
        
        //look at the relationships of the last 2 characters clicked
        if (listOfCharacters.length > 1) {
         //if there are relationships that are not explored go through all the visisted characters
              for(let y = 0; y < listOfCharacters.length; y++){

                //!Character objects
                for (let x = 0; x < characterData.length; x++) {
                  ccID = characterData[x].id;
                  
                if (listOfCharacters[y] == ccID ){
                    connectionObj.characters.push(characterData[x]);
                    //console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");
                } 
              }



                characterThatHasBeenVisted = listOfCharacters[y];

                otherCharacters = listOfCharacters[y+1];
        
                //go through all the relationships that say likes
                for (let index = 0; index < likesData.length; index++) {
                  let sourceL = likesData[index].source;
                  let targetL = likesData[index].target;
                   
                  //If that character is in the source 
                  if (characterThatHasBeenVisted == sourceL && targetL == otherCharacters ) 
                  { //create a list that only contains those connetions
                    //relations
                    //console.log("RELATIONSHIP FOUND!!!!!!!!!!!!!!!!!!")
                    //console.log(likesData[index]);
                    connectionObj.relations.push(likesData[index]);
                   // console.log(connectionObj.relations)
                  } //If that character is in the target 
                  else if (characterThatHasBeenVisted == targetL && sourceL == otherCharacters) 
                  {
                    connectionObj.relations.push(likesData[index]);
                  }
              }
        
        }//1st loop
            //console.log(connectionObj.characters)
        
               // let tempArray = ["apple", "banana", "apple"];
                //tempArray = removeDuplicatesFromArray(tempArray);
                //console.log(tempArray); //would expect this to be ["apple", "banana"];
        
                let characterTempArray = removeDuplicatesFromArray(connectionObj.characters);
               // console.log(characterTempArray);
                connectionObj.characters = characterTempArray;
        
          
                  //  console.log(connectionObj.characters)
                  //  console.log(connectionObj)
                    return connectionObj;
                    //look at the target add them top the list if not already listed
        
        }//if block
  }
  function changeCharactersToNames(newActionList, characters){
         
            for (let g = 0; g < newActionList.length; g++) {
            //console.log(newActionList[g]);
            let arguments = newActionList[g].arguments;
           // console.log(arguments);
                for (let h = 0; h < arguments.length; h++) {
                  //console.log(arguments[h]);
                  for (let f = 0; f < characters.length; f++) {
                   // console.log(characters[f].id)
                   //console.log("idddddd FOUND");
                if (arguments[h] == characters[f].id){
                   //console.log("NAME FOUND");
                   newActionList[g].arguments[h] = characters[f].name;
                }
                }
              }
            }
          //console.log(newActionList);
  };


  

}
