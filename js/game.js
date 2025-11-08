import { showTable } from "./showTable.js";

function fnNavMenus(pgHide, pgShow) {
    console.log("fnNavMenus() is running");
    console.log("Coming from: " + pgHide);
    console.log("Going to: " + pgShow);
    document.querySelector(pgHide).style.display = "none";  
    document.querySelector(pgShow).style.display = "block"; 
}; // END fnNavMenus()

const arrStats = [10, 25, 50, 75, 100];
const arrMoney = ["Gold", "Silver", "Iron", "Bronze", "Seashells", "Copper", "Platinum", "RareEarth"];
const arrWeapons = ["Staff", "Dagger", "Chain", "Katana", "Axe", "Laser", "PitchFork", "FireBomb", "Rocks", "Sword"];
const arrClasses = ["Healer", "Warrior", "Thief", "Knight", "Damsel", "Gnome", "Ninja", "Gladiator", "Farmer"];
const arrFamiliars = ["Capuchin", "Hawk", "Lynx", "Wolf", "Wyvern"];
const arrNames = ["Abakor", "Bandala", "Cartin", "Dariane", "Fezzor", "Gizleeni", "Halor", "Ia", "Jeepenn", "Kalindaa", "Lineuss", "Mordana", "Nazzor", "Ortery"];

// Array to keep track of all Emails associated with each Saved game
let arrEmails = [];

// Global Scope Random Number Generator (min, max) inclusive
function fnRandomNumRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}; // END fnRandomNumRange()

function fnGenArray(anArray){
    console.log("fnGenArray() is running with " + anArray);
    let tmpNumber = Math.floor(Math.random() * anArray.length);
    return anArray[tmpNumber];
}; // END fnGenArray()


function fnCharCreate(){
console.log("fnCharCreate() is running");

let valinCreateGameName = document.querySelector("#inCreateGameName").value;
let valinCreateGameEmail = document.querySelector("#inCreateGameEmail").value;
console.log(valinCreateGameName, valinCreateGameEmail);

// Validate that BOTH name and email have been entered - if not, display a warning message and loop back for input
if ((valinCreateGameName != null && valinCreateGameName !="") &&
    (valinCreateGameEmail != null && valinCreateGameEmail != "")) 
  {
    document.querySelector("#pGameInputWarning").style.display = "none";

    // Create the Main Character
    let tmpMainCharacter = new PartyMember(valinCreateGameName, 
            fnGenArray(arrStats), 
            fnGenArray(arrStats), 
            fnGenArray(arrStats), 
            fnGenArray(arrStats),
            fnGenArray(arrStats),
            fnGenArray(arrWeapons),
            fnGenArray(arrClasses)
        ); // END Main PartyMember() creation

    console.log(tmpMainCharacter, tmpMainCharacter.cTotals());

    // Now generate companions
    let tmpCompanion01 = new PartyMember(fnGenArray(arrNames),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrWeapons),
        fnGenArray(arrClasses)
    ); // END Companion #1 creator
    console.log(tmpCompanion01);

    let tmpCompanion02 = new PartyMember(fnGenArray(arrNames),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrStats),
        fnGenArray(arrWeapons),
        fnGenArray(arrClasses)
    ); // END Companion #2 creator
    console.log(tmpCompanion02);

    document.querySelector("#pCreateGameInputs").style.display = "none";
    document.querySelector("#pCreateGameControls").style.display = "block";

    // "Join" this Party internally
    let tmpParty = {
        "_id" : valinCreateGameEmail,
        "_currentScreen" : "#pgTavern",
        "cMain" : tmpMainCharacter,
        "cComp01" : tmpCompanion01,
        "cComp02" : tmpCompanion02
    }; // END of complete party in JSON
    console.log(tmpParty);

    // Display the party of one main character and two companions in a table format
    const partyTable = showTable(
        [tmpParty.cMain, tmpParty.cComp01, tmpParty.cComp02],
        [
            { label: 'cHP', name: 'Hit Points' },
            { label: 'cStr', name: 'Strength' },
            { label: 'cSpd', name: 'Speed' },
            { label: 'cMp', name: 'Magic' },
            { label: 'cLuck', name: 'Luck' },
            { label: 'cWep', name: 'Weapon' },
            { label: 'cClass', name: 'Class' }
        ],
        'cName', 'name');
    const partyContainer = document.querySelector('#spnCreateGameOutput');
    partyContainer.innerHTML = ''; // clear any existing content
    partyContainer.appendChild(partyTable);


    // Save this new party (Email ONLY) in localStorage, but first check if anything has been previously saved
    let tmpAllEmails =  JSON.parse(localStorage.getItem("allEmails"));
    if(!tmpAllEmails){
        arrEmails.push(tmpParty._id);
        localStorage.setItem("allEmails", JSON.stringify(arrEmails));
        localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        console.log("Success: we saved a game for the first time!");
    } else {
        tmpAllEmails.push(tmpParty._id);
        localStorage.setItem("allEmails", JSON.stringify(tmpAllEmails));
        localStorage.setItem(tmpParty._id, JSON.stringify(tmpParty));
        console.log("Added a new game successfully!");
    }; // END If..Else

    // NEW 10/23/2025 - Add button to move to the next level, dynamically (Start Quest)
    document.querySelector("#spnCreateGameOutput").innerHTML += "<br><button id='btnStartQuest'>Start Quest</button>";
    document.querySelector("#btnStartQuest").addEventListener("click", function(){fnNavQuest("#pgCreateGame", "#pgTavern", tmpParty._id)});

 }
 else {
    document.querySelector("#pGameInputWarning").style.display = "block";
 }
}; // END fnCharCreate()

// Define the PartyMember class using OCN - to group a Main Character and its companions
function PartyMember(cName, cHP, cStr, cSpd, cMp, cLuck, cWep, cClass){
    this.cName  = cName;
    this.cHP    = cHP;
    this.cStr   = cStr;
    this.cSpd   = cSpd;
    this.cMp    = cMp;
    this.cLuck  = cLuck;
    this.cWep   = cWep;
    this.cClass = cClass; 
    // cTotals is a Method to add up all the power points
    this.cTotals = function(){
        let tmpVal = this.cHP + this.cStr + this.cSpd + this.cMp + this.cLuck;
        return tmpVal;
    }; // END .cTotals()
}; // END PartyMember() OCN

// Define the Enemy class using JCN - align Enemy class to PartyMember class
class Enemy {
    constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){
        this.eType = eType;
        this.eHp = eHp;
        this.eStr = eStr
        this.eSpd = eSpd;
        this.eMp = eMp;
        this.eWep = eWep;
        this.eClass = eClass;
        this.eStatus = eStatus;
    }; // END Properties
    eLuck() {
        let tmpLuck = Math.ceil(Math.random() * 100);
        return tmpLuck;
    }; // END .eLuck() Method
}; // END Enemy class (JCN)

// Loads the data of a Player; requires an email Input (Parameter)
function fnGameLoad(gData){
    console.log("fnGameLoad() is running, loading " , gData);
    // Get data from localStorage and Parse it back into a JSON object
    let tmpLoadAllData = JSON.parse(localStorage.getItem(gData));
    console.log(tmpLoadAllData);
    // Use the _currentScreen Property to go to the correct screen
    fnNavQuest("#pgLoadGame", tmpLoadAllData._currentScreen, gData);
}; // END fnGameLoad()


// This function keeps track of current player and which screen to show
function fnNavQuest(pgHide, pgShow, currParty) {
    console.log("fnNavQuest() is running");
    console.log("Coming from: " + pgHide);
    console.log("Going to: " + pgShow);
    console.log("Current party: " + currParty);
    document.querySelector(pgHide).style.display = "none";
    document.querySelector(pgShow).style.display = "block";
    
    // Switch screen based on parameter pgShow
    switch(pgShow){
        case "#pgTavern":
            console.log("About to initialize The Tavern");
            fnTavern(currParty);
            break;
        case "#pgForest":
            console.log("About to initialize The Forest");
            // fnForest(currParty);
            break;
        case "#pgLake":
            console.log("About to initialize The Lake");
            // fnLake(currParty);
            break;
        default: 
            // Didn't match with any known possibility
            console.log("Unknown screen ? ", pgShow);
            break;
    }; // END switch()
}; // END fnNavQuest()

//========================================================================
//  Tavern Function - the Main Event
//========================================================================
function fnTavern(currParty){
    console.log("At the Tavern with ", currParty);

    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty);

    document.querySelector("#pTvnMsg").innerHTML = "Welcome travelers!<br> Try a Game of Strength, Game of Speed, or a Game of Luck? There are many willing participants to challenge!";

    // Display party members in a table format
    const partyTable = showTable(
        [myParty.cMain, myParty.cComp01, myParty.cComp02],
        [
            { label: 'cStr', name: 'STR' },
            { label: 'cSpd', name: 'SPD' },
            { label: 'cLuck', name: 'LUK' }
        ],
        'cName', 'name');
    const partyContainer = document.querySelector('#pTvnParty');
    partyContainer.innerHTML = ''; // clear any existing content
    partyContainer.appendChild(partyTable);


    // Pick from a drop down menu of myParty members to participate in the Tavern action
    document.querySelector("#pTvnParty").innerHTML += "<p><form id='frmTvnSlctChar'>" + 
        "<label>Choose a Party Member: </label>" +
            "<select id='selTvnChar'>" + 
                "<option value='0'>&nbsp;</option>" +
                "<option value='cMain'   id='cMain'>" + myParty.cMain.cName + "</option>" +
                "<option value='cComp01' id='cComp01'>" + myParty.cComp01.cName + "</option>" +
                "<option value='cComp02' id='cComp02'>" + myParty.cComp02.cName + "</option>" +
            "</select>" +
    "</form></p>"; // END the <form> to pick a Party member

    document.querySelector("#frmTvnSlctChar").addEventListener("change", function(){
        // Read the Values of what we selected
        let valSelTvnChar = document.querySelector("#selTvnChar");
        let valSelTvnCharObj = valSelTvnChar.options[valSelTvnChar.selectedIndex];
    
        // Let player pick a battle action
        if(valSelTvnCharObj.value == 0){
            console.log("true, we picked NOTHING");
        } else {
            console.log("false, we didn't pick nothing, web picked a character");
            console.log("Which <td>", valSelTvnCharObj);
            console.log("Member Name:", myParty[valSelTvnCharObj.value].cName);

                document.querySelector("#pTvnAction").innerHTML = "<p>Have " + myParty[valSelTvnCharObj.value].cName + " do this:</p>" +  "<button id='btnTvFight'>STR Contest</button> <button id='btnTvnRace'>SPD Contest</button> <button id='btnTvnGamble'>LUK Contest</button>";

                let elBtnTvFight = document.querySelector("#btnTvFight"); 
                elBtnTvFight.addEventListener("click", function(){fnTvFight(myParty[valSelTvnCharObj.value]);});

                function fnTvFight(currHero){
                    console.log("fnTvFight is running with: ", currHero.cName, currHero.cStr);
                    
                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided to fight it out. I hope your STR is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>STR: " + currHero.cStr +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy01.eType + 
                            "<br>" + tvEnemy01.eClass +
                        "</td></tr></table>";

                    console.log("Comparing stats: ", currHero.cStr, tvEnemy01.eStr);
                    
                    if(currHero.cStr > tvEnemy01.eStr){
                        console.log("WIN!");
                    
                        let tmpRndVal = fnRandomNumRange(7, 10);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your STR was high enough! You have increased your STR by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }else if(currHero.cStr == tvEnemy01.eStr){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your STR was good enough! You have increased your STR by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cStr += tmpRndVal;
                        myParty.cComp01.cStr += tmpRndVal;
                        myParty.cComp02.cStr += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your STR failed you! You have barely increased your STR by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvFight()

                let elBtnTvnRace = document.querySelector("#btnTvnRace"); 
                elBtnTvnRace.addEventListener("click", function(){fnTvnRace(myParty[valSelTvnCharObj.value]);});
                function fnTvnRace(currHero){
                    console.log("fnTvnRace is running with: ", currHero.cName, currHero.cSpd);

                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided on a race off. I hope your SPD is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>SPD: " + currHero.cSpd +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy02.eType + 
                            "<br>" + tvEnemy02.eClass +
                        "</td></tr></table>";

                    console.log("Comparing stats: ", currHero.cSpd, tvEnemy02.eSpd);
                    
                    if(currHero.cStr > tvEnemy02.eSpd){
                        console.log("WIN!");

                        let tmpRndVal = fnRandomNumRange(7, 10);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your SPD was high enough! You have increased your SPD by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }else if(currHero.cSpd == tvEnemy02.eSpd){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your SPD was good enough! You have increased your SPD by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cSpd += tmpRndVal;
                        myParty.cComp01.cSpd += tmpRndVal;
                        myParty.cComp02.cSpd += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your SPD failed you! You have barely increased your SPD by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvRace()

                let elBtnTvnGamble = document.querySelector("#btnTvnGamble");
                elBtnTvnGamble.addEventListener("click", function(){fnTvnGamble(myParty[valSelTvnCharObj.value]);});
                function fnTvnGamble(currHero){
                    console.log("fnTvnGambol is running with: ", currHero.cName, currHero.cLuck);

                    valSelTvnChar.disabled = true;
                    elBtnTvFight.disabled = true;
                    elBtnTvnRace.disabled = true;
                    elBtnTvnGamble.disabled = true;

                    document.querySelector("#pTvnResults").innerHTML = "<p>You decided to gamble your luck. I hope your LUK is worthy enough!</p>" +
                        "<table style='margin: auto;'><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
                            currHero.cName + 
                            "<br>LUK: " + currHero.cLuck +
                        "</td> <td style='padding-left: 0.5em; border-left: 2px solid goldenrod;'>" + 
                            tvEnemy03.eType + 
                            "<br>" + tvEnemy03.eClass +
                        "</td></tr></table>";

                    const tvEnemy03CurrLuck = tvEnemy03.eLuck();
                    console.log(currHero.cLuck, tvEnemy03CurrLuck);
                    
                    if(currHero.cLuck > tvEnemy03CurrLuck){
                        console.log("WIN!");
                    
                        let tmpRndVal = fnRandomNumRange(7, 10);; 
                        console.log(currParty, "Adding: ", tmpRndVal);
                        
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        
                        myParty._currentScreen = "#pgForest";
                        
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        
                        document.querySelector("#pTvnResults").innerHTML += "<p>Wonderful! Your LUK was high enough! You have increased your LUK by " + tmpRndVal + ". <br> Now venture to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }else if(currHero.cLuck == tvEnemy03CurrLuck){
                        console.log("Tie");
                        
                        let tmpRndVal = fnRandomNumRange(3, 6);;
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Close call! Your LUK was good enough! You have increased your LUK by " + tmpRndVal + ". <br> Now head over to the forest</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    } else {
                        console.log("loss...");
                        
                        let tmpRndVal = fnRandomNumRange(1, 2);;
                        console.log(currParty, "Adding: ", tmpRndVal);
                        myParty.cMain.cLuck += tmpRndVal;
                        myParty.cComp01.cLuck += tmpRndVal;
                        myParty.cComp02.cLuck += tmpRndVal;
                        myParty._currentScreen = "#pgForest";
                        localStorage.setItem(currParty, JSON.stringify(myParty));
                        document.querySelector("#pTvnResults").innerHTML += "<p>Alas! Your LUK failed you! You have barely increased your LUK by " + tmpRndVal + ". <br> Away from my sight, to the forest!!</p>"+
                        "<p><button id='btnTvnGoForest'>Forest</button></p>";
                        let elBtnTvnGoForest = document.querySelector("#btnTvnGoForest");
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty)});
                    }; // END If..Else If() win/loss/draw
                }; // END fnTvGamble()
            }; // END If..Else for Selecting a character
        }); // END .addEventListener on the <select>

    // Generate enemies
    let tvEnemy01 = new Enemy("Ogre", 
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");
    let tvEnemy02 = new Enemy("Goblin",   
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");
    let tvEnemy03 = new Enemy("Troll",   
        fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats), fnGenArray(arrStats),
        fnGenArray(arrWeapons), fnGenArray(arrClasses), "Normal");
    // Display enemies in a table
    const enemyTable = showTable(
        [tvEnemy01, tvEnemy02, tvEnemy03],
        [            
            { label: 'eClass', name: 'Class' },
            { label: 'eStr', name: 'STR' },
            { label: 'eSpd', name: 'SPD' },
            { label: 'eHp', name: 'HP' },
        ],
        'eType', 'name');
    const enemyContainer = document.querySelector('#pTvnEnemy');
    enemyContainer.innerHTML = '';
    enemyContainer.appendChild(enemyTable);
    // document.querySelector("#pTvnEnemy").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; border-left: 2px solid goldenrod; padding-left: 0.5em;'>" +
    //         tvEnemy01.eType +
    //         "<br>" + tvEnemy01.eClass +
    //     "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" +
    //         tvEnemy02.eType +
    //         "<br>" + tvEnemy02.eClass +
    //     "</td><td style='padding-left: 0.5em; border-right: 2px solid goldenrod;'>" +
    //         tvEnemy03.eType +
    //         "<br>" + tvEnemy03.eClass +
    // "</td></tr></table>"; // END <table> of Enemies

    
}; // END fnTavern()


// Universal game initializer subroutine
function fnGameInit(){
    console.log("fnGameInit() is running");
    document.querySelector("#pgWelcome").style.display = "block";

    // At game start, get the Array of all emails in localStorage
    let tmpGamesAll = JSON.parse(localStorage.getItem("allEmails"));

    // If no previous data was saved, tell user to go back to create a new game, otherwise show previous saved list
    if(!tmpGamesAll){
        console.log("TRUE that we have NO saves");
        document.querySelector("#pLGPartyMessage").innerHTML = "Hello, you are new... Go back and click on 'Create Game' to begin<br>";
        document.querySelector("#spnLGPartyTotals").innerHTML = "0";
    }else{
        console.log("FALSE we do NOT have an EMPTY save slot");
        document.querySelector("#pLGPartyMessage").innerHTML = "Welcome back! Soldier on!";
        document.querySelector("#spnLGPartyTotals").innerHTML = tmpGamesAll.length;
        document.querySelector("#pLGPartySelect").innerHTML = "&nbsp;";

        // Show the Saved Games (Parties) to select from
        for(let i = 0; i < tmpGamesAll.length; i++){
            let tmpPartyData = JSON.parse(localStorage.getItem(tmpGamesAll[i]));
            document.querySelector("#pLGPartySelect").innerHTML += 
                "<p>" + tmpPartyData.cMain.cName + " <button onclick='fnGameLoad(`" + tmpGamesAll[i] + "`);'>" + "Enter Game" + "</button></p>";
        }; //END For()
        
    }; // END If..Else()
}; // END fnGameInit()

// Make inner functions global so HTML can access them
window.fnNavMenus = fnNavMenus;
window.fnCharCreate = fnCharCreate;
window.fnGenArray = fnGenArray;
window.fnGameLoad = fnGameLoad;
window.fnNavQuest = fnNavQuest;
window.fnTavern = fnTavern;

// Initialize the game
fnGameInit();
