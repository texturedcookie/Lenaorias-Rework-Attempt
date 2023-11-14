imageURLMap = new Map();
imageUrl;
var theCurrentlyClickedCharacter;
var Name;

function onSubmit(clickedCharecter, cID) {

    //e.preventDefault();
    //var isfirstClick = true;
  document.querySelector('.msg').textContent = '';
  document.querySelector('#image').src = '';
  populationfile = d3.json("newpopulation.json").then( function(data){

  var locationHistory =[];
locationHistory = data.location_history;
//console.log("LOCATION STUFF", locationHistory)


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
      data.relations = newRelations;
      //console.log('RELATIONS', newRelations[0+1]);

var differentTypeRelations =[];
     for(let j =0; j < newRelations.length;j++){
      
      let currentRelation = newRelations[j].relation_name;
    
      let inString = currentRelation; 

      if( currentRelation.includes(inString) == true){
        differentTypeRelations.push(newRelations[j].relation_name);
      }
     }
//CREATES LIST OF 
     console.log("ALL RELATION NAMES",differentTypeRelations);
     differentTypeRelations = removeDuplicates(differentTypeRelations);
     console.log(differentTypeRelations );
     function removeDuplicates(arr) { 
      return arr.filter((item, 
          index) => arr.indexOf(item) === index); 
      }
    

    /*Goes through relations data and checks for the keyword "likes"
     if it is there add to array newRelationship*/
     for(let i =0; i < data.relations.length;i++){
      let currentRelation = data.relations[i].relation_name;
      const inString = 'likes'; 

      if( currentRelation.includes(inString) == true){
        likesRelations.push(data.relations[i]);
      }
     }
     //console.log("Likes",likesRelations);
     

     

//Change character index to current charecters index position in the array
console.log("THE CHARACTER ID THAT WAS JUST CLICKED",cID);
theCurrentlyClickedCharacter = cID;
console.log("THE ID GLOBAL VARIABLE",theCurrentlyClickedCharacter)

//loop through the characters and find what index matches with the ID selcted
let currentCharacterIndex;
for (let x = 0; x < data.characters.length; x++) {
  if (data.characters[x].id === cID) {
    currentCharacterIndex = x;
  }
  
}


    let cCharacter =  data.characters[currentCharacterIndex];
    console.dir('Character that was clicked on:',cCharacter);
    let currentCharacterId = data.characters[currentCharacterIndex].id;
    console.log('That Characters INDEX', currentCharacterIndex);
    console.log('That Characters ID:', currentCharacterId);
     historyList.push(currentCharacterId);

    let currentCharacterName = data.characters[currentCharacterIndex].name;
    console.log('That Characters NAME:', currentCharacterName);
    
  //historyList.push(currentCharacterName);
  console.log(historyList);

//Create variables from data that are physical traits of charecters
  //For age the array index varies for each character, so age needs to be found and saved
  let statuslength = data.characters[currentCharacterIndex].statuses.length; 
  let cAge;
  let cPurpose;
  let homeTown;
  let nonConstantStatusMap = new Map();

  //store the previous character in temp variable
  //check if the current charecter is not the previous charecter
  //if that is the case
  // empty the map

  //nonConstantStatusMap.clear();
  //Iterate through the array of statuses to find and set age, purpose and hometown
  for(let i =0; i < statuslength;i++){
    let currentStatusName = data.characters[currentCharacterIndex].statuses[i].status_name;
    //console.log(currentStatusName);
    const statusAge = 'age';
    //if the status name is age, return the status value and exit the loop
    if( currentStatusName == statusAge){
      cAge = data.characters[currentCharacterIndex].statuses[i].status_value;
      i == statuslength+1; 
    } 
    else if (currentStatusName !== 'last_birthday' && currentStatusName !== 'skin' && currentStatusName !== "hair" && currentStatusName !== "eye" && currentStatusName !== "presentation" && currentStatusName !=="pronouns" && currentStatusName !="age" ) {
       // console.log("THIS IS NOT A BASIC STATUS")

        nonConstantStatusMap.set(currentStatusName,data.characters[currentCharacterIndex].statuses[i].status_value)
    }
  }
  console.log(data.characters[currentCharacterIndex]);


//Update the current charecter constant statuses 
  let cPronouns = data.characters[currentCharacterIndex].statuses[5].status_value;
  let lastBirthday = data.characters[currentCharacterIndex].statuses[0].status_value;
  //Is a status in every character
  document.getElementById("c1").innerHTML = currentCharacterName;
  document.getElementById("p1").innerHTML = cPronouns;
  document.getElementById("p2").innerHTML = cAge;
  document.getElementById("p3").innerHTML = lastBirthday;

//TRAITS ARRAY LIST RENDERING FOR HTML
//console.log(data.characters[currentCharacterIndex].traits);
let text = "";
let cTraits = data.characters[currentCharacterIndex].traits;
cTraits.forEach(myFunction);
document.getElementById("trait").innerHTML = text;
//Display the list of traits as a list with a new line
function myFunction(item) {
  text += item + "<br>"; 
}

//Is not a constant status mapped to HTML table
//console.log(" MAP OF NON CONSTANT STATUSES", nonConstantStatusMap);

let text1 = "";
// cNonConstantStatus = nonConstantStatusMap.get(key);
// console.log(cNonConstantStatus);

// Get a reference to the table element
const table = document.getElementById("myTable");


// nonConstantStatusMap.forEach(myFunction1);
// document.getElementById("p4").innerHTML = text1;
// function myFunction1(item) {
//   console.log(item);
//   text1 += item + "<br>"; 
// }

const tbody = document.querySelector("#myTable tbody");
//🟨if it is a new charecter, clear and run the for loop


const x = document.getElementsByClassName("non const statusesr");
  //console.log(x);
 // console.log(x.length);

 //console.log("LIST OF VISITED CHARACTERS",historyList);
// console.log(historyList.length);

let prevCharacterindex = historyList.length -2;
//console.log(historyList[prevCharacterindex]);


// if you are visting a nth character that has a previous character
// if (historyList.length > 1) {
  // console.log("INSIDE HISTORY LIST ")
  //if the last character visited is diffent from the newest character visited
  if ( currentCharacterId != historyList[prevCharacterindex]) {
    // console.log("INSIDE NEW CHARACTER ")
// let ogLength = x.length - pre;

//This loop is removing all the even number indexes
for (let i=0 ; i < x.length; i++){
  console.log("INSIDE HISTORY LIST, NEW CHARACTER FOR LOOP ")

  //console.log("x length ", x.length);
 // console.log("x index value ", x[i]);
  x[i].remove();
 // console.log("removed from index ", i);
  i--;
}

}
//}


// Loop through the Map and create rows with 2 columns for each key-value pair
for (const [key, value] of nonConstantStatusMap) {
   // console.log("Enter loop that maps stats and values");
    // Create a new table row
    const row = document.createElement("tr");
    row.className = "non const statusesr";
    // Create the first column for the key
    const col1 = document.createElement("td");
    col1.className = "non const statuses";
    col1.textContent = key;
    row.appendChild(col1);
    // Create the second column for the value
    const col2 = document.createElement("td");
    col2.className = "non const statuses";
    col2.textContent = value;
    row.appendChild(col2);
    // Append the row to the table
    tbody.appendChild(row);
}





//need to loop through traits the statuses to find the ones that are not "GENERAL" and add them to a list to be displayed else where
//PROMPT TRAITS NEEDED FOR DALLE
    let cPresentation = data.characters[currentCharacterIndex].statuses[4].status_value;
    let cHair = data.characters[currentCharacterIndex].statuses[2].status_value;
    let cEye = data.characters[currentCharacterIndex].statuses[3].status_value;
    let cSkin = data.characters[currentCharacterIndex].statuses[1].status_value;

   let prompt =  'create portrait of a '+ cAge + ' year old person who is '+ cPresentation +' presenting and has '+ cHair +' hair,'+ cEye +' eyes and '+ cSkin +' skin, comic book digital art';
console.log('The prompt:', prompt);
/* Prompt CHANGED INTO DYNAMIC STRING  ^
 * a [age] year old person who is [presentation] with [hair] hair, [eye] eyes, and [skin] skin, comic book digital art 
 * Json data to include in string in order:
 * "status_name": "age",
 * "status_name": "presentation",
 * "status_name": "hair",
 * "status_name": "eye",
 * "status_name": "skin",
 * 
 */
prevMapSize = nonConstantStatusMap.size ;


const width = 500;
const height = 500;

minidata = createView(newRelations, likesRelations, historyList, data.characters);

miniChart = ForceGraph(minidata, { 
  nodeId: d => d.id,
  nodeGroup: d => d.group,
  nodeTitle: d => `${d.id}\n${d.group}`,
  linkStrokeWidth: l => Math.sqrt(l.value),
  width: width,
  height: height,
// invalidation // a promise to stop the simulation when the cell is re-run
})
console.log("The Mini Chart",miniChart);
document.getElementById("theMiniGraph").append(miniChart);

//SAVE CHART IN A MAP SAVING THE STRING OF THE LAST 2 CHARECTERS TOUCHED
//Map the   Characters  >  SVG Chart
//console.log("THE PREVIOUS MAPS SIZE", prevMapSize);
  generateImageRequest(prompt, currentCharacterId);
});

}

function returnName(id){
  let cCharacter
populationfile = d3.json("newpopulation.json").then( function(data){
//loop through the characters and find what index matches with the ID selcted
var currentCharacterIndex;
for (let x = 0; x < data.characters.length; x++) {
  if (data.characters[x].id === id) {
    currentCharacterIndex = x;
    
  }
}
    cCharacter =  data.characters[currentCharacterIndex];
    console.log('Character that was found through their ID:',cCharacter.name);
   
    Name = cCharacter.name;        
        });       
    return Name;
}


function removeDuplicatesFromArray(arrayWithDuplicates){
  return arrayWithDuplicates.filter(  (item, index) => {
    return arrayWithDuplicates.indexOf(item) === index;
  }
)};

function createView(relationshipData, likesData, listOfCharacters, characterData) {
console.log("INSIDE CREATE VIEW FUNCTION")
console.log(relationshipData);
console.log(likesData);
console.log(listOfCharacters);

const  connectionObj = new Object();
connectionObj.characters =[];
connectionObj.relations =[];


connectionsList = [];

//look at the relationships of the last 2 characters clicked
if (listOfCharacters.length > 1) {
 //if there are relationships that are not explored go through all the visisted characters
      for(let y = 0; y < listOfCharacters.length; y++){
        characterThatHasBeenVisted = listOfCharacters[y];

        //go through all the relationships that say likes
        for (let index = 0; index < likesData.length; index++) {
          let sourceL = likesData[index].source;
          let targetL = likesData[index].target;
           
          //If that character is in the source or target
          if (characterThatHasBeenVisted == sourceL || characterThatHasBeenVisted == targetL) 
          {//create a list that only contains those connetions
          
            //relations
            //console.log("RELATIONSHIP FOUND!!!!!!!!!!!!!!!!!!")
            //console.log(likesData[index]);
            connectionObj.relations.push(likesData[index]);
           // console.log(connectionObj.relations)
          
            //Light up the view connections button
            //add an onclick listener to the view connections button
          //add all the listed charecters to connections list
          //create a map containing only those relationships and display it in a modal with a close and save button

          }
      }

}//1st loop

//characters 
            //look at the sources add them to the list
            //console.log(connectionObj.relations[0].source)
            //console.log(characterData)
        for (let index = 0; index < connectionObj.relations.length; index++) {
              sourceCharacter = connectionObj.relations[index].source;
              targetCharacter = connectionObj.relations[index].target;

          for (let x = 0; x < characterData.length; x++) {
              ccID = characterData[x].id;
              
            if (sourceCharacter == ccID || targetCharacter == ccID){
                connectionObj.characters.push(characterData[x]);
                console.log("FOUND THE CHARACTER FROM SOURCE OBJECT");

            } 
          }
        }

        console.log(connectionObj.characters)

        let tempArray = ["apple", "banana", "apple"];
        tempArray = removeDuplicatesFromArray(tempArray);
        console.log(tempArray); //would expect this to be ["apple", "banana"];

        let characterTempArray = removeDuplicatesFromArray(connectionObj.characters);
       // console.log(characterTempArray);
        connectionObj.characters = characterTempArray;

  
            console.log(connectionObj.characters)
            return connectionObj;
            //look at the target add them top the list if not already listed

}//if block
}




async function generateImageRequest(prompt, cID) {
  try {
    const response = await fetch('/openai/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt
      }),
    });

    if (!response.ok) {
    
      throw new Error('That image could not be generated');
    }

    const data = await response.json();
    // console.log(data);

      imageUrl = data.data;
      console.log('Link to image displayed:',imageUrl);


    document.querySelector('#image').src = imageUrl;

    //Save imageURL for this charecter and access it everytime on click happens
  } catch (error) {
    document.querySelector('.msg').textContent = error;
  }

//Save the ID(key) and URL in the map
let imageToSave = imageUrl; //image URL
console.log(imageUrl);
let keyCharacterId = cID;//characterID

  //SAVES first generated image of charecter
  console.log(imageToSave);
  //console.log('Image has been saved');


imageURLMap.set(keyCharacterId, imageToSave);
console.log('character stored in MAP',imageURLMap);
}

//Looks a heroid/ charecter number, then gets url for that charecter and diplays it
function getSavedImage(key){
  console.log('Loading saved image');

//Get the charecters id (key from Map)
gettingMapKey = imageURLMap.get(key);
console.log('Getting the value for the key that was entered',gettingMapKey);
document.querySelector('#image').src = gettingMapKey;

//Get the URL (value of Key inside the map)
//Display URL in HTML
  
}

function relationshipOpacity(mag){

  let currentRelation = data.relations.likes[i];


  let relationshipMag = mag / 100;
  relations.style('linkStrokeOpacity', relationshipMag);
  }


  






  

//CODE GRAVEYARD OF UNUSED CODE

  //remove duplicates
//loop through character list, 
//if the last element added, already exists in the list
//then remove it from the array

/*
        let wN =1;
        let eN =2;
        for (let z= connectionObj.characters.length -1; z > 0; z--){
          
        //last index
         let last= connectionObj.characters[connectionObj.characters.length-1].name;
         //second last index
         let temp= connectionObj.characters[z-1].name;

         console.log("COMPARE")
         console.log(last);
         console.log(temp);


         if (temp == last){
               //remove the element
               console.log("DUPLICATE. OLD LENGTH OF CHARACTERS IS " + connectionObj.characters.length)
               connectionObj.characters.splice(connectionObj.characters.length-wN,1);
               console.log("SPLICE OCCURED. NOW LENGTH IS "  + connectionObj.characters.length);
               console.log(connectionObj.characters);
              }
        eN++
        wN++
       }
*/