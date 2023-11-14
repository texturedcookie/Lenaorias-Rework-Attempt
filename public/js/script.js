





//This script reads in, loads and filters the json file to create checkboxes for all the charecters inside the world
function helloWorld() {
    console.log("hello world");
}
//🟨Passes in population.json file to be read in later methods
function readFiles(){
    files = parse("newpopulation.json", "patterns.json");
}
//🟨LOADS JSON FILE
function loadJson(file) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', file);
        request.responseType = 'json';
        request.onload = function () {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function () {
            reject(Error('There was a network error.'));
        };
        request.send();
    });
}
//🟨LOADS JSON FILE
function parse(newpopulation, patterns) {
    Promise.all([loadJson(newpopulation), loadJson(patterns)]).then(function (responses) {
        // responses contains the parsed JSON objects in the order of requests
       

        console.log("JUST FINISHED READING IN DATA!");
        console.log("population: ");
        console.dir(responses[0]);
        console.log("patterns:");
        console.dir(responses[1]);
        createCheckboxesFromPersonData(responses[0].characters);
        for (let i = 0; i < responses[0].characters.length; i++) {
            masterCharacterList.push(responses[0].characters[i]);
        }
        /*
        for (const patternName in responses[1]) {
            masterPatternList.push(responses[1]);
        }
        */

        data = {};
        data["characters"] = responses[0].characters;
        data["relations"] = responses[0].relations;
        data["patterns"] = responses[1];

        //make a deep copy of all of the data to hold on to forever and ever.
        masterDataObject = JSON.parse(JSON.stringify(data));
        currentWorkingData = JSON.parse(JSON.stringify(data));

        updateData();

        updateD3(currentWorkingData);


        //doD3(responses[0], responses[1]);
    }).catch(function (error) {
        // do error processing here if any promise was rejected
    });
}


//always starts with ALL character data, and, splices 
//not relevant things from there.
function updateData(){
    currentWorkingData = JSON.parse(JSON.stringify(masterDataObject));
    selectedCharacters = []; // empty this out.
    let data = currentWorkingData; // just give it a smaller name for working inside of this function.
    //we want to go through all of the checkmarks.
    //if the character is not present, splice them out of the data.
    let checkboxes = document.getElementsByName("personCheckbox");
    for (let i = 0; i < checkboxes.length; i++) {
        let currentCharacter = checkboxes[i].id;
        if (checkboxes[i].checked) {
            //console.log(currentCharacter + " is selected.");
            selectedCharacters.push(currentCharacter);
        }
        else{
            //console.log(currentCharacter + " is not selected. Splicing them out.");

            //I guess, maybe, loop through the whole array? Most 
            //assured way of ensuring that we find them.?
            for(let j = 0; j < data.characters.length; j++){
                let characterInArray = data.characters[j];
                if (characterInArray.name == currentCharacter){
                    //great, now we do the splicing!
                    data.characters.splice(j, 1);
                    break; // in this situation, we'll only ever splice a singlec haracter.
                }
            }
        }
    }

    //Go through every RELATIONSHIP.
    //splice out relationships that involve characters that aren't present.
    //ALSO splice out relationships whose strength isn't above our relationship magnitude.
    //currently we only have the LIKES relations. Will need to update as new relations exist.
    for(let i = 0; i < data.relations.likes.length; i++){
        let currentRelation = data.relations.likes[i];
        let char1Name = currentRelation[0];
        let char2Name = currentRelation[1];
        let magnitude = Math.abs(currentRelation[2]);
        if (selectedCharacters.indexOf(char1Name) == -1 || selectedCharacters.indexOf(char2Name) == -1){
            //console.log("The following relation involves " + char1Name + " and " + char2Name + " one of whom is not selected");
            //console.dir(currentRelation);
            data.relations.likes.splice(i, 1); // remove the relation
            i = -1; //Things get weird when we splice an array while searching it... go back to the very beginning...?
        }
        else if (magnitude < parseInt(relationshipMagnitudeThreshold)){
            //this doesn't count as a "real" relationship -- get rid of it!
            data.relations.likes.splice(i, 1); // remove the relation
            i = -1; //Things get weird when we splice an array while searching it... go back to the very beginning...?
        }
        else{
            //console.log("The following relation involves " + char1Name + " and " + char2Name + " and it is good");
        }
    }

    //Go through every PATTERN. Remove patterns that don't involve characters we care about.
    for (const patternName in data.patterns) {
        let patternContents = data.patterns[patternName];
        //console.dir(patternContents);
        let patternInstanceArray = patternContents.reified;
        //for each instance, see if it involves a character that we aren't considering right now.
        //if so, toss it.
        for(let i = 0; i < patternInstanceArray.length; i++){
            let currentPatternInstance = patternInstanceArray[i];
            //loop through each name. The first name we find that is missing, toss it out.
            for(let j = 0; j < currentPatternInstance.length; j++){
                let currentCharName = currentPatternInstance[j]
                if(selectedCharacters.indexOf(currentCharName) == -1){
                    patternInstanceArray.splice(i, 1); //get rid of this instance for now.
                    i = -1; // reset the counter because we are splicing the array while we are looping through it.
                    break; // don't need to worry about this instance any more.
                }
            }
        }
    }


    console.dir(data);
}





































/*
function readJSON() {
    //const peopleData = JSON.parse("../data/people.json");
    let requestURL = 'population.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);

    let populationRead = false;
    let patternsRead = false;

    //set the response type to JSON, so XHR knows that
    //JSON is what will be returned.
    request.responseType = 'json';
    request.send();

    //This is what will happen when it returns with the data.
    request.onload = function () {
        console.log("JUST FINISHED READING IN DATA!");
        const content = request.response; // should have all the json data.
        console.dir(content);
        createCheckboxesFromPersonData(content.characters);
        for (let i = 0; i < content.characters.length; i++) {
            masterCharacterList.push(content.characters[i]);
        }
        for (let i = 0; i < content.relations.likes.length; i++) {
            masterLikesList.push(content.relations.likes.length[i]);
        }
        //masterCharacterList = content.characters;
        doD3(content);

    }
}


    function getListOfSelectedCharacters(){
        var selectedCharacters = [];
        let checkboxes = document.getElementsByName("personCheckbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked){
                selectedCharacters.push(checkboxes[i].id);
            }
        }

        //console.log("SELECTED CHARACTERS!");
        for(let i = 0; i < selectedCharacters.length; i++){
            //console.log(selectedCharacters[i]);
        }

        return selectedCharacters;
    }



*/