import { showTable } from "./showTable.js";

function fnNavMenus(pgHide, pgShow) {
    console.log("fnNavMenus() is running");
    console.log("Coming from: " + pgHide);
    console.log("Going to: " + pgShow);
    document.querySelector(pgHide).style.display = "none";  
    document.querySelector(pgShow).style.display = "block";
    document.querySelector("#pGameInputWarning").style.display = "none";
}; // END fnNavMenus()

const arrStats = [10, 25, 50, 75, 100];
const arrMoney = ["Gold", "Silver", "Iron", "Bronze", "Seashells", "Copper", "Platinum", "RareEarth"];
const arrWeapons = ["Staff", "Dagger", "Chain", "Katana", "Axe", "Laser", "PitchFork", "FireBomb", "Rocks", "Sword"];
const arrClasses = ["Healer", "Warrior", "Thief", "Knight", "Damsel", "Gnome", "Ninja", "Gladiator", "Farmer"];
const arrFamiliars = ["Capuchin", "Hawk", "Lynx", "Wolf", "Wyvern"];
const arrNames = ["Abakor", "Bandala", "Cartin", "Dariane", "Fezzor", "Gizleeni", "Halor", "Iaono", "Jeepenn", "Kalindaa", "Lineuss", "Mordana", "Nazzor", "Ortery", "Pandora", "Quonta", "Rozoro", "Spruyo", "Taranza", "Ulytana", "Voltera", "Whez", "Xanado", "Yogito", "Zzaru"];

// Array to keep track of all Emails associated with each Saved game
let arrEmails = [];


//==================================================================================================
//  fnGameInit - this function initialize the game - loads previously saved games from localStorage
//==================================================================================================
function fnGameInit(){
    console.log("fnGameInit() is running");
    document.querySelector("#pgWelcome").style.display = "block";

    // At game start, get the Array of all emails in localStorage
    let tmpGamesAll = JSON.parse(localStorage.getItem("allEmails"));

    console.log(tmpGamesAll);

    // If no previous data was saved, tell user to go back to create a new game, otherwise show previous saved list
    if(!tmpGamesAll){
        console.log("TRUE that we have NO saves");
        document.querySelector("#pLGPartyMessage").innerHTML = "Hello, you are new... Go back and click on 'Create Game' to begin the game<br>";
        document.querySelector("#spnLGPartyTotals").innerHTML = "0";
    } else {
        console.log("FALSE we do NOT have an EMPTY save slot");
        document.querySelector("#pLGPartyMessage").innerHTML = "Welcome back! Continue your quest!";
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

// Initialize the game
fnGameInit();


// Global Scope Random Number Generator (min, max) inclusive
function fnRandomNumRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}; // END fnRandomNumRange()

function fnGenArray(anArray){
    console.log("fnGenArray() is running with " + anArray);
    let tmpNumber = Math.floor(Math.random() * anArray.length);
    return anArray[tmpNumber];
}; // END fnGenArray()

//========================================================================
//  fnCharCreate - this function creates game characters
//========================================================================
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

    // Generate companion #1 and #2
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
    partyContainer.innerHTML = "<p>Your party is ready at your command. Start your quest.</p>";
    partyContainer.appendChild(partyTable);


    // Save this new party in localStorage (Save Email ONLY), but first check if anything has been previously saved
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

    // Add "Start Quest" button to move to the next level
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


//============================================================================
//  fnGameLoad - this function loads ONE previously saved game using email id
//============================================================================
function fnGameLoad(gData){
    console.log("fnGameLoad() is running, loading " , gData);
    // Get data from localStorage and Parse it back into a JSON object
    let tmpLoadAllData = JSON.parse(localStorage.getItem(gData));
    console.log(tmpLoadAllData);
    // Use the _currentScreen Property to go to the correct screen
    fnNavQuest("#pgLoadGame", tmpLoadAllData._currentScreen, gData);
}; // END fnGameLoad()

//============================================================================
//  fnNavQuest - this function tracks current player location
//============================================================================
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
            fnForest(currParty);
            break;
        case "#pgLake":
            console.log("About to initialize The Lake");
            fnLake(currParty);
            break;
        case "#pgMountain":
            console.log("About to initialize The Mountain");
            fnTmpPath(currParty); 
            break;
        case "#pgBridge":
            console.log("About to initialize The Bridge");
            fnTmpPath(currParty); 
            break;
        case "#pgNextLevel":
            console.log("About to initialize The NextLevel");
            fnTmpPath(currParty); 
            break;
        default: 
            console.log("Unknown place - going nowhere", pgShow);
            break;
    }; // END switch()
}; // END fnNavQuest()

//============================================================================
//  fnTavern - the Main Event at the Tavern
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
        // Player must select a character to participate in battle
        let valSelTvnChar = document.querySelector("#selTvnChar");
        let valSelTvnCharObj = valSelTvnChar.options[valSelTvnChar.selectedIndex];
    
        // Player must pick an action for the battle
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
                        elBtnTvnGoForest.addEventListener("click", function(){fnNavQuest("#pgTavern", "#pgForest", myParty._id)});
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
   
}; // END fnTavern()


// TMP function for the future levels
function fnTmpPath(currParty){
    console.log("tmppath", currParty);
}; // END fnTmpPath()


//========================================================================
//  fnForest - Function for the all the action in the Forest
//========================================================================
function fnForest(currParty){
    console.log("At the forest with", currParty);

    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    // Set up Lookup Tables (Multi-Dimensional Array) for the Forest Intro Message
    // arrFstMessage[PERSON, ITEM, TRAIT]
    const arrFstMessages = [
            ["Aba", "Beb", "Cab", "Dek", "Eep"], 
            ["Secret Book", "Holy Codex", "Lost Parchment", "Gothic Scroll"], 
            ["Power", "Wisdom", "Validation", "Insight", "Experience", "Adventure", "Love", "Treasure"]
        ]; // END arrFstMessages
    // Pick randomly for each
    let valFstPerson    = arrFstMessages[0][fnRandomNumRange(0, 4)];
    let valFstItem      = arrFstMessages[1][fnRandomNumRange(0, 3)];
    let valFstTrait     = arrFstMessages[2][fnRandomNumRange(0, 7)];

    document.querySelector("#pFstMsg").innerHTML = "You have reached The Forbidden Forest. You meet a lone traveller. <br><br>Say hello to " + valFstPerson + " who possesses the " + valFstItem + " and seeks " + valFstTrait + "!"; 

    document.querySelector("#pFstParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>The " + myParty.cMain.cClass +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>MP: " + myParty.cMain.cMp +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>The " + myParty.cComp01.cClass +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>MP: " + myParty.cComp01.cMp +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>The " + myParty.cComp02.cClass +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>MP: " + myParty.cComp02.cMp +
    
        "</td></tr></table>"; // END <table> of Party

        document.querySelector("#pFstAction").innerHTML = "You will ask " + valFstPerson + 
         " to help you on your quest by giving you some of their " + valFstTrait + " from their " + valFstItem + "!" +
         "<p><button id='btnFstHP'>Ask for HP</button> <button id='btnFstMP'>Ask for MP</button></p>"
        ; // END #pFstAction

        // Set up an Object for that <button> and then Event Listener, then Function
        let elBtnFstHP = document.querySelector("#btnFstHP");
        let elBtnFstMP = document.querySelector("#btnFstMP");

        elBtnFstHP.addEventListener("click", fnFstGetHP);
        elBtnFstMP.addEventListener("click", fnFstGetMP);

        function fnFstGetHP(){
            console.log("fnFstGetHP() is running");
            elBtnFstMP.disabled = true;
            elBtnFstHP.disabled = true;
            // Generate this character
                // constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ .eLuck()
            let fstNPC = new Enemy(valFstPerson, fnGenArray(arrStats), null, null, fnGenArray(arrStats), valFstItem, null, valFstTrait);
            console.log(fstNPC);
            // Generate a Random fraction to take some of their Stat
            let tmpRndFrac = Math.random();
            console.log(tmpRndFrac);
            // Generate a random boon of HP, based on their Stat
            let tmpNewHP = fstNPC.eHp * tmpRndFrac;
            console.log(Math.ceil(tmpNewHP));
            // Then add the new boon (values)
            myParty.cMain.cHP   += Math.ceil(tmpNewHP);
            myParty.cComp01.cHP += Math.ceil(tmpNewHP);
            myParty.cComp02.cHP += Math.ceil(tmpNewHP);
            // Also, create a new Property for the ITEM!
            myParty._inventory = [fstNPC.eWep];

            // Pick from the 3 possible paths:  #pgLake (1)  #pgMountain (2)  #pgBridge (3)
            let tmpRndPath = ["#pgLake", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgLake":
                    console.log("About to go to Lake");
                    myParty._currentScreen = "#pgLake";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Lake"
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain"
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge"
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            // Show the updated stats
            document.querySelector("#pFstResults").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            
            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            
            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            
            "</td></tr></table>" + 
            
            "<p>Amazing! " + valFstPerson + " has bestowed upon you " + (Math.ceil(tmpRndFrac*100)) + "% of their Power and gifted you their " + valFstItem  +"!</p>" + 
            "<p>Now, head for the " + tmpRndNextPath + " with your boon.</p>" +
            "<p><button id='btnFstGoNext'>Go</button></p>"
            ; // END <table> updated    
            let elBtnFstGoNext = document.querySelector("#btnFstGoNext");
            elBtnFstGoNext.addEventListener("click", function(){fnNavQuest("#pgForest", myParty._currentScreen, myParty._id)});
        }; // END fnFstGetHP()

        function fnFstGetMP(){
            console.log("fnFstGetMP() is running");
            elBtnFstMP.disabled = true;
            elBtnFstHP.disabled = true;
            let fstNPC = new Enemy(valFstPerson, fnGenArray(arrStats), null, null, fnGenArray(arrStats), valFstItem, null, valFstTrait);
            console.log(fstNPC);
            // Generate a Random fraction to take some of their Stat
            let tmpRndFrac = Math.random();
            console.log(tmpRndFrac);
            // Generate a random boon of HP, based on their Stat
            let tmpNewMP = fstNPC.eMp * tmpRndFrac;
            console.log(Math.ceil(tmpNewMP));
            myParty.cMain.cMp   += Math.ceil(tmpNewMP);
            myParty.cComp01.cMp += Math.ceil(tmpNewMP);
            myParty.cComp02.cMp += Math.ceil(tmpNewMP);
            myParty._inventory = [fstNPC.eWep];

            // Pick from the 3 possible paths:  #pgLake (1)  #pgMountain (2)  #pgBridge (3)
            let tmpRndPath = ["#pgLake", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgLake":
                    console.log("About to go to Lake");
                    myParty._currentScreen = "#pgLake";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Lake";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            // Show the updated stats
            document.querySelector("#pFstResults").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>MP: " + myParty.cMain.cMp +
            
            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>MP: " + myParty.cComp01.cMp +
            
            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>MP: " + myParty.cComp02.cMp +
            
            "</td></tr></table>" +

            "<p>Amazing! " + valFstPerson + " has bestowed upon you " + (Math.ceil(tmpRndFrac*100)) + "% of their Power and gifted you their " + valFstItem  +"!</p>" +
            "<p>Now, head for the " + tmpRndNextPath + " with your boon.</p>" +
            "<p><button id='btnFstGoNext'>Go</button></p>"
            ; // END <table> updated    
            let elBtnFstGoNext = document.querySelector("#btnFstGoNext");
            elBtnFstGoNext.addEventListener("click", function(){fnNavQuest("#pgForest", myParty._currentScreen, myParty._id)});
            
            ; // END <table> of Party UPGRADE
        }; // END fnFstGetMP()
}; // END fnForest()

//=====================================================================
//  fnLake - Function for all the Lake action
//=====================================================================
function fnLake(currParty){
    console.log("At the Lake", currParty);
    let myParty = JSON.parse(localStorage.getItem(currParty));
    console.log(myParty._id);

    document.querySelector("#pLakMsg").innerHTML = "Welcome to Eel Lake. A powerful foe stands before you! You must all join together to defeat it!";  

    // A Function to draw the Party Table when needed, then run it right away
    function fnPartyDrawTable(){
            document.querySelector("#pLakParty").innerHTML = "<table><tr><td style='padding-right: 0.5em; border-right: 2px solid goldenrod;'>" + 
            myParty.cMain.cName +
            "<br>HP: " + myParty.cMain.cHP +
            "<br>WEP: " + myParty.cMain.cWep +

            "</td><td style='padding-right: 0.5em; border-right: 2px solid goldenrod; padding-left: 0.5em;'>" + 
            myParty.cComp01.cName +
            "<br>HP: " + myParty.cComp01.cHP +
            "<br>WEP: " + myParty.cComp01.cWep +

            "</td><td style='padding-left: 0.5em;'>" + 
            myParty.cComp02.cName +
            "<br>HP: " + myParty.cComp02.cHP +
            "<br>WEP: " + myParty.cComp02.cWep +
    
        "</td></tr></table>"; // END <table> of Party
    }; // END fnPartyDrawTable()

    // Render the table at the start of the level, and then later, after taking damage
    fnPartyDrawTable();

    // Enemy { constructor(eType, eHp, eStr, eSpd, eMp, eWep, eClass, eStatus){ eLuck() {}}
    // Generate a Level Boss
    let lakBoss = new Enemy("Aqua Takson", fnRandomNumRange(75, 100), null, null, null, fnGenArray(arrWeapons), null, "Alive");
    console.log(lakBoss);

    document.querySelector("#pLakEnemy").innerHTML = lakBoss.eType + " stands before you! They hold a " + lakBoss.eWep + " and have " + lakBoss.eHp + "HP. Who of your Party will strike first?";

    // Create Buttons for the action of each character
    document.querySelector("#pLakAction").innerHTML = 
        myParty.cMain.cName   + " uses " + myParty.cMain.cWep   + " <button id='btnLakMain'>Go!</button><br>" +
        myParty.cComp01.cName + " uses " + myParty.cComp01.cWep + " <button id='btnLakC01'>Go!</button><br>" +
        myParty.cComp02.cName + " uses " + myParty.cComp02.cWep + " <button id='btnLakC02'>Go!</button>" 
        ; // END of #pLakActions
    // Create JS Objects for each of generated Buttons
    let elBtnLakMain = document.querySelector("#btnLakMain"); 
    let elBtnLakC01 =  document.querySelector("#btnLakC01");
    let elBtnLakC02 =  document.querySelector("#btnLakC02");

    // Create Event Listeners for each of those Buttons
    // If you need to pass a Parameter into a function: function(){subRoutine(parameter);}
    // If you DON'T need to pass a Parm, it's only: subRoutine (no parens)
    elBtnLakMain.addEventListener("click", fnLakMainFight);
    elBtnLakC01.addEventListener("click",  fnLakC01Fight);
    elBtnLakC02.addEventListener("click",  fnLakC02Fight);

    // Create Functions for those Button Clicks
    function fnLakMainFight(){
        console.log(myParty.cMain.cName, myParty.cMain.cLuck, "VS", lakBoss.eHp);
        // This character fighting, so disable their Button
        elBtnLakMain.disabled = true;
        // From BOSS, subtract LUK as a hit
        lakBoss.eHp = lakBoss.eHp - myParty.cMain.cLuck;
        // Conditional to deal with a "Boss Defeated" or a "Keep Fighting Boss"
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            // Deactivate other attacks
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;
            
            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgNextLevel", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgNextLevel":
                    console.log("About to go to NextLevel");
                    myParty._currentScreen = "#pgNextLevel";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "NextLevel";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cMain.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cMain.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            // You took damage
            let tmpHIT = myParty.cMain.cHP / 10;
            myParty.cMain.cHP = Math.round(myParty.cMain.cHP - tmpHIT);
            console.log("Main down to", myParty.cMain.cHP);
            // After the attack, update #pLakResults to show weaker Boss
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cMain.cName + " is weakened: " + myParty.cMain.cHP + "HP!</p>"
            ; // END #pLakResults

            // and then our Party table with damage taken
            fnPartyDrawTable();
        }; // END If..Else eHP checker
    }; // END fnLakMainFight()

    function fnLakC01Fight(){
        console.log(myParty.cComp01.cName, myParty.cComp01.cLuck, "VS", lakBoss.eHp);
        elBtnLakC01.disabled = true;
        lakBoss.eHp = lakBoss.eHp - myParty.cComp01.cLuck;
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

        let tmpRndPath = ["#pgNextLevel", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgNextLevel":
                    console.log("About to go to NextLevel");
                    myParty._currentScreen = "#pgNextLevel";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "NextLevel";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cComp01.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cComp01.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            let tmpHIT = myParty.cComp01.cHP / 10;
            myParty.cComp01.cHP = Math.round(myParty.cComp01.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp01.cHP);
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cComp01.cName + " is weakened: " + myParty.cComp01.cHP + "HP!</p>"
            ; // END #pLakResults
            fnPartyDrawTable();
        }; // END If..Else eHP checker
    }; // END fnLak01

    function fnLakC02Fight(){
        console.log(myParty.cComp02.cName, myParty.cComp02.cLuck, "VS", lakBoss.eHp);
        elBtnLakC02.disabled = true;
        lakBoss.eHp = lakBoss.eHp - myParty.cComp02.cLuck;
        if(lakBoss.eHp <= 0){
            console.log("BOSS DEFEATED");
            elBtnLakMain.disabled = true;
            elBtnLakC01.disabled = true;
            elBtnLakC02.disabled = true;

            myParty.cMain.cLuck     += fnRandomNumRange(25, 75);
            myParty.cComp01.cLuck   += fnRandomNumRange(25, 75);
            myParty.cComp02.cLuck   += fnRandomNumRange(25, 75);

            let tmpRndPath = ["#pgNextLevel", "#pgMountain", "#pgBridge"];
            let tmpRndNextPath = tmpRndPath[fnRandomNumRange(0, 2)];
            switch(tmpRndNextPath){
                case "#pgNextLevel":
                    console.log("About to go to NextLevel");
                    myParty._currentScreen = "#pgNextLevel";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "NextLevel";
                    break;
                case "#pgMountain":
                    console.log("About to go to Mountain");
                    myParty._currentScreen = "#pgMountain";
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Mountain";
                    break;
                case "#pgBridge":
                    console.log("About to go to Bridge");
                    myParty._currentScreen = "#pgBridge"
                    localStorage.setItem(myParty._id, JSON.stringify(myParty));
                    tmpRndNextPath = "Bridge";
                    break;
                default:
                    console.log(tmpRndNextPath);
                    break;
            }; // END Switch() for next path

            console.log(myParty);

            document.querySelector("#pLakResults").innerHTML = "<p>Success!</p><p>" + myParty.cComp02.cName + " struck the final attack and defeated " + lakBoss.eType + "!</p><p>You now have " + myParty.cComp02.cLuck +"LUK and get to move on to the " + tmpRndNextPath + ".</p><p><button id='btnLakGoNext'>Next</button></p>";
            let elBtnLakGoNext = document.querySelector("#btnLakGoNext");
            elBtnLakGoNext.addEventListener("click", function(){fnNavQuest("#pgLake", myParty._currentScreen, myParty._id)});
        }else{
            console.log("KEEP FIGHTING", lakBoss.eHp);
            let tmpHIT = myParty.cComp02.cHP / 10;
            myParty.cComp02.cHP = Math.round(myParty.cComp02.cHP - tmpHIT);
            console.log("Main down to", myParty.cComp02.cHP);
            document.querySelector("#pLakResults").innerHTML = "<p>You have weakened " + lakBoss.eType + " down to " + lakBoss.eHp + "HP! Keep fighting and choose another Party Member!</p>" +
            "<p>" + myParty.cComp02.cName + " is weakened: " + myParty.cComp02.cHP + "HP!</p>"
            ; // END #plakResults
            fnPartyDrawTable();
        }; // END If..Else eHP checker
    }; // END fnLak02

}; // END fnLake()


function fnGameRestart(pgHide, pgShow) {
    fnGameInit();
    fnNavMenus(pgHide, pgShow);
}


// Make inner functions global so HTML can access them
window.fnGameInit = fnGameInit;
window.fnNavMenus = fnNavMenus;
window.fnCharCreate = fnCharCreate;
window.fnGenArray = fnGenArray;
window.fnGameLoad = fnGameLoad;
window.fnNavQuest = fnNavQuest;
window.fnTavern = fnTavern;
window.fnLake = fnLake;
// window.fnBridge = fnBridge;
// window.fnMountain = fnMountain;
// window.fnNextLevel = fnNextLevel;
window.fnGameRestart = fnGameRestart;