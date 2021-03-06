/*jshint esversion: 6 */
// These two variables are the canvas located in the HTML and also the canvases rectangular hitbox
// I will also declare the textbox as a constant variable so I can alter its inner HTML easier.
let canvas = document.getElementById("display");
let rect = canvas.getBoundingClientRect();
const textbox = document.getElementById("textbox");

// I will create a variable called ctx which is "context" which will hold the drawn out products that are printed to the canvas. This will be needed for the draw and clear function.
let ctx = canvas.getContext("2d");

// Using the canvas and its hitbox I then create a scale factor of how big the actual canvas is currently being displayed at. This allows for me to change the actual size of the canvas and any following numerical data to make sure that I am using the correct data from the website that the user is using.
let scaleX = canvas.width / rect.width;
let scaleY = canvas.height / rect.height;

// This is just a constant value of the size of each tile that will be printed to the screen, I have also locked the total amount of tiles that will be printed using the size constants that are set to 20 whilst I am in the early development.
const tileSizeX = 5;
const tileSizeY = 5;
const MapSizeX = Math.round((rect.width * scaleX) / tileSizeX);
const MapSizeY = Math.round((rect.height * scaleY) / tileSizeY);

// This is an initialization of the mapArray so that it can hold the numerical values in the array format.
let mapArray = [];

// Create an array to hold the sequence and another to hold the users inputted characters.
let randomSequence = [];
let usersSequence = [];

// These are the variables that will be used during outputs from the EventHandlers and will allow for me to get a public mouse location and a keyCode of the current buttom pressed.
let mouseX = 0;
let mouseY = 0;
let click = false;
let keyCode;

// Add an array initializer to create the biome array needed to produce the values needed when rendering the terrain.
let biomeType = [];

// Set a value for the point-of-interests size when its displayed to the user.
const nodeSizeX = 20;
const nodeSizeY = 20;

// Create an inventory array for the museum to hold the processed items
let museumInventory = [];


// Create a variable to hold a number of how long a sequence is.
let sequenceLength;

// Create an array to hold the position location of each of the nodes or points of interest that are present within a map.
let nodePosArray = [];

// Create an array to hold the positions of the users attempts on digging in the terrain. Also a variable used to hold the users attempts within the terrain. This can be effected and increased by the upgrades later.            
let usersPosArray = [];
let usersAttempts = 0;

// A time variable to count up or down the length of the time that the points of interests that are displayed. Another variable that will time the display of the random sequence.
let nodeDisplayTime;
let sequenceDisplayTime;

// Create an empty array which will be used as the inventory, it will hold the values as a name "" - string and then a number, which will be the quantity or the percentage of how well the item was obtained.
let usersInventory = ["Gold ore", 20, "Iron ore", 20, "Copper ore", 20];

// This will be used later as a way of ungrading the users tools what they use to give them more attempts, and less of a length on the overal sequences.
let usersToolbelt = [1, 1, 1, 1];

// Let a variable be equal to 0 to hold the value of which one is selected.
let selectedMenuOption = 0;
let selectedOptionDifference = 0;

// The chosen menu option will take the value of the selected menu option when the user presses a button like enter or space or uses the mouse.
let chosenMenuOption = -1;

// This will hold the values of the item and quality of an item before processing
let currentProcessItem = [];

// A boolean to tell the script to return to the Main menu when possible.
let menuReturn = false;

// This is a container with all of the possible gameStates that can be assigned to gameState, I use a numerical value for the state variable and have this function to give a name to what that numerical value stands for. I will then also organise these different numbers into groups depending on what they may include or do. Example, tutorial will have several messages that can be displayed to the screen.
const gameStates = {
    WELCOME: 0,
    TUTORIAL: {
        MESSAGE_ONE: 1,
        MESSAGE_TWO: 2,
        MESSAGE_THREE: 3,
        MESSAGE_FOUR: 4,
        MESSAGE_FIVE: 5,
        MESSAGE_SIX: 6,
        MESSAGE_SEVEN: 7,
        MESSAGE_EIGHT: 8
    },
    MAIN_MENU: 9,
    BIOME_MENU: 10,
    MUSEUM_MENU: 11,
    INVENTORY_SCREEN: 12,
    UPGRADE_MENU: 13,
    RENDER_TERRAIN: 14,
    RENDER_NODES: 15,
    BEGIN_GAME: 16,
    DISPLAY_DIGGOUTS: 17,
    BEGIN_SEQUENCE: 18,
    REPEAT_SEQUENCE: 19,
    PROCESS_ITEMS: 20,
    M_BEGIN_SEQUENCE: 21,
    M_REPEAT_SEQUENCE: 22
};

// A container for the current state on which the game is at so that the script knows what to do depending on the state.
let gameState = 0;

// These are constant arrays of text outputs that will be displayed on the textbox and also the menu options when relevent.

const textboxMessages = ["Welcome to Dig Up! This is a game based around finding things from different terrains. There are three mini-games within this game.", "You can use the W and S key to navigate through the menus that you'll be displayed, and the item on which is currently selected will be in bold.", "You will be able to select a terrain by going into the World Map and then selecting the type of terrain you would like to use. Different terrains have different items which you can obtain. More information about this is on the help page. Also you can unlock different terrains which will give you different items or more items depending on the terrain type. ", "Once you begin the game you will be shown a series of black tiles, (points-of-interest), which will display for around 4 seconds and then will disappear. The job is to try and click your mouse cursor over the locations that where displayed. If you successfully do this you will gain rarer items which can have a chance to be processed in the museum.", "Once you have used up all your attempts then you will be shown a series of random sequences with a set length, (the length increases as you play the game), depending on how well you repeat these sequences will effect the items you get. Rare items will have an overal quality and this is determind by how well you repeat this sequence. The sequence will consist of W,A,S and D characters that can be typed in once the sequence has been removed from the screen.", "Within the museum you can be able to process specific items, these items can not be stacked and have a quality. You will then be able to go though a 'processing' system to be able to put them in the museum. To do this you need to complete another sequence, which then also alters and changes the quality further.", "You can also use the Inventory tab just to see what is in your inventory. You can see what is in your inventory and then either use a confirm button or escape to come back to the main menu.", "Lastly, the upgrade tab is used to upgrade any of your current tools that you use. The scanner is upgraded using gold ore, and the pickaxe and shovel are upgraded using iron ore. You must keep in mind that the level of the scanner will give you more attempts and possibly new terrain types. Whilst upgrading the tools will decrease the sequence lengths.", "If you have entered the wrong menu you can still use escape to come back to the main menu. Although you can not leave a game when it is playing.", "Use W and S to select what you want to do on the Main Menu. Once you see the item is bold, its selected and then click either the mouse, spacebar or enter to confirm.", "This is a list of the terrain types that you can currently access at your level.", "Welcome to the Museum, you can either see what items you have already processed or begin processing items if you have any.", "This is the inventory screen.", "This is the upgrades page, if you have any items you maybe able to upgrade your tools. <br> Gold ore is needed to upgrade the scanner. <br> Iron ore is needed to upgrade the tools. <br> Copper ore can be used to upgrade the processor, which effects the length of the sequnce in the process mini-game. <br> The amount of materials needed will increase depending on the level they are at.", "Terrain is being generated.", "You will be shown the points interest that are on the map. Try and remember these locations.", "Use your attempts to place down where you want to dig. When an attempt has been deducted that location has been added.", "Sequence is being created", "This is the sequence that you need to try and remember.", "Can you repeat that sequence?", "Which item would you like to process using the processor?", "This is the sequence that you need to try and remember.", "Can you repeat that sequence?"];

// This is a multi-array of the options that are displayed on the different menus, This will show and present the options that the user can select to do different things.
const MenuOptions = [["World Map", "Museum", "Inventory", "Upgrade"],["Dirty Plain", "Plains", "Desert", "Forest", "Swamp", "Mountain", "Taiga", "Jungle", "Red Desert", "Savannah"], ["Process", "View Museum"], ["Pocket Scanner || Level ", "Pickaxe || Level ", "Shovel || Level ", "Processer || Level "]];

// This is an array of all the common items within the game
const commonItems = ["Dirt", "Stone", "Gold ore", "Iron ore", "Copper ore", "Sand", "Lapis Lazuli"];

function init() {
    // This function will be used when the page loads and will start or "(init)ialize" the rest of the needed programs.
    setInterval(main, 20);
}

function MenuPrintout(array, selectedItem) {
    // This will be a basic function that will create an array and be given a chosen item and return the string print out of the list with a selected item in bold.
    let i;
    let temp_string = "";
    for (i = 0; i < array.length; i++) {
        if (i == selectedItem) {
        temp_string = temp_string+"<br><b>"+array[i]+"</b>";
        } else {
        temp_string = temp_string+"<br>"+array[i];
        }
    }
    return temp_string;
}

function partialArrayOutput(array, num) {
    // Takes an array and how much of the array you would like to present using a numerical index value
    let i;
    let temp_array = [];
    for (i = 0; i < range(num, 2, array.length); i++) {
        temp_array.push(array[i]);
    }
    return temp_array;
}

function main() {
    /* This is my main function within my script, this will make sure that the parts of the script that are needed will always run. */
    clear();
    
    // This will output the corrisponding text which is relevant to the gameState. Their is exactly enough text outputs to match the amount of gameStates that the game can be set to.
    textbox.innerHTML = textboxMessages[gameState]+" ";
    
    if (keyCode > 0) {
        if (keyCode == 87) {
        // Check if the keycode is W, if the gameState is repeat sequence then add W to the users sequence. If not and the user is in a menu, change the option difference. Meaning that I can apply a negative difference to the currently selected option to move the selected option to a different location.
            if (gameState == gameStates.REPEAT_SEQUENCE || gameState == gameStates.M_REPEAT_SEQUENCE) {
                usersSequence.push("W");
            } else {
                selectedOptionDifference = -1;
            }
        }
        if (keyCode == 83) {
        // Check if the keycode is S, if the gameState is repeat sequence then add S to the users sequence. If not and the user is in a menu, change the option difference. Meaning that I can apply a positive difference to the currently selected option to move the selected option to a different location.
            if (gameState == gameStates.REPEAT_SEQUENCE) {
                usersSequence.push("S");
            } else if (gameState == gameStates.M_REPEAT_SEQUENCE) {
                usersSequence.push("S");
            }else {
                selectedOptionDifference = 1;
            }
        }
        if (keyCode == 65) {
        // This checks if the keycode is A, and adds it to the sequence array if the gamestate is repeat sequence.
            if (gameState == gameStates.REPEAT_SEQUENCE) {
                usersSequence.push("A");
            } else if (gameState == gameStates.M_REPEAT_SEQUENCE) {
                usersSequence.push("A");
            }
        }
        if (keyCode == 68) {
        // This checks if the keycode is D, and adds it to the sequence array if the gamestate is repeat sequence.
            if (gameState == gameStates.REPEAT_SEQUENCE) {
                usersSequence.push("D");
            } else if (gameState == gameStates.M_REPEAT_SEQUENCE) {
                usersSequence.push("D");
            }
        }
        if (keyCode == 27 && gameState > gameStates.MAIN_MENU) {
        // This checks if the keycode is escape, and will set a boolean which will flag the script to move the user to the main menu if possible.
            menuReturn = true;
            chosenMenuOption = -1;
        }
        if (keyCode == 13 || keyCode == 32) {
        //  Check if the keycode is either enter or spacebar, and then progress the textbox or select the chosen option.
            if (gameState < gameStates.MAIN_MENU) {
                chosenMenuOption = 0;
            } else {
                chosenMenuOption = selectedMenuOption;
            }
        }
        keyCode = 0;
    }
    
    if (click) {
        if (gameState < gameStates.MAIN_MENU) {
        // This will check what the state is if its the tutorial I will change a variable to flag that the textbox needs to progress. If the game state is not before the main menu then it will inherit the option that is currently selected in bold.
        chosenMenuOption = 0;
        } else {
        chosenMenuOption = selectedMenuOption;
        }
        if (gameState == gameStates.BEGIN_GAME && usersAttempts > 0) {
        // This will add the users Mouse Position to the users pos array and use one attempt, this is how I begin to track and locate the mouse and where it has been clicked whilst playing the game.
            if (mouseX > 0 && mouseX < rect.width * scaleX && mouseY > 0 && mouseY < rect.height * scaleY) {
                usersPosArray.push(mouseX);
                usersPosArray.push(mouseY);
                usersAttempts -= 1;
            }
        }
        // Reset the click boolean so that if the conditions are met alter some features of the game, and then reset the boolean as the mouse has been clicked and registered.
        click = false;
    }
    
    if (gameState < gameStates.MAIN_MENU) {
        //  This will add a message to the texbox to tell the user how to continue the tutorial. Will also tell the user what they can do to progress the textbox.
        textbox.innerHTML = textbox.innerHTML+"<br><br>You can use the mouse, spacebar or the enter button to continue.";
        if (chosenMenuOption == 0) {
            // This will progress the textbox by altering the game state to the next corrisponding gameState, if the confirm button is clicked. Then using the chosenOption int value turn the value to -1 which is the passive state.
            gameState += 1;
            chosenMenuOption = -1;
        }
    }
    
    if (selectedOptionDifference != 0) {
        /* This will process which of the items on the menu is being selected. This is by checking which menu the user is on and then altering the chosen option difference. It will let me be able to allow the player to select one of the options.
        These are the displays for the menus if the gameState is correct, These use a range function to alter the selected menu option and alter it by a difference , it is prevented from being below 0 or greater than the menuOptions variable .length, which corrisponds to the correct menu. */
        if (gameState == gameStates.MAIN_MENU) {
            selectedMenuOption = range(selectedMenuOption+selectedOptionDifference, 0, MenuOptions[0].length-1);
        }
        if (gameState == gameStates.BIOME_MENU) {
            selectedMenuOption = range(selectedMenuOption+selectedOptionDifference, 0, MenuOptions[1].length-1);
        }
        if (gameState == gameStates.MUSEUM_MENU) {
            selectedMenuOption = range(selectedMenuOption+selectedOptionDifference, 0, MenuOptions[2].length-1);
        }
        if (gameState == gameStates.UPGRADE_MENU) {
            selectedMenuOption = range(selectedMenuOption+selectedOptionDifference, 0, MenuOptions[3].length-1);
        }
        if (gameState == gameStates.PROCESS_ITEMS) {
            selectedMenuOption = range(selectedMenuOption+selectedOptionDifference, 0, mergeTwoItems(filterArray(usersInventory, commonItems)).length-1);
        }
        selectedOptionDifference = 0;
    }
    
    if (gameState == gameStates.MAIN_MENU) {
        // This is the main menu screen and displays the different options. Also allows for the ability to be able to select  an option of the menu.
        textbox.innerHTML = textbox.innerHTML+MenuPrintout(MenuOptions[0], selectedMenuOption);
        if (chosenMenuOption != -1) {
            // Check if the user has used one of the continue buttons. Then register that action and do the corresponding actions to the script depending on the current gameState. This will just redirect the player to one of his chosen options from the main menu.
            gameState = gameState+chosenMenuOption+1;
            chosenMenuOption = -1;
            selectedMenuOption = 0;
        }
    }
    
    if (gameState == gameStates.MUSEUM_MENU) {
        if (usersInventory.length > 0) {
            // This is the museum menu which will display if the inventory has any contents. This will alter the menu depending on what the user does on this menu. The different conditions below are the listed conditions, needed for the menu or gamestate to change.
            if (chosenMenuOption == -1) {
                // Display the menu relevant to the chosen menu option so I can print out two other menus depending on the options.
                textbox.innerHTML = textbox.innerHTML+"<br>"+MenuPrintout(MenuOptions[2], selectedMenuOption);
            } else if (chosenMenuOption == 0) {
                // Change the gameState to process items and reset the chosen menu option to initialize the museum mini-game.
                gameState = gameStates.PROCESS_ITEMS;
                chosenMenuOption = -1;
            } else if (chosenMenuOption == 1) {
                // This displays the museum inventory and shows that the user has managed to obtain from doing the mini-game and processing the rarer items.
                textbox.innerHTML = textbox.innerHTML+"<br>"+museumInventory;
                if (menuReturn) {
                    // When the user wantes to return from this screen and the menuReturn boolean is true reset the game mode.
                    gameState = gameStates.MAIN_MENU;
                }
            }
        } else {
            // This is a text output that will be displayed if the user has no items in there inventory.
            textbox.innerHTML = textbox.innerHTML+"<br> You have no items that can be processed within the museum.";
            chosenMenuOption = -1;
        }
    }
    
    if (gameState == gameStates.PROCESS_ITEMS) {
        // This is the statement which will render the game when the gameState is processItems, initially it will display the list of items that are not common and allow for the user to look thought these items.
        textbox.innerHTML = textbox.innerHTML+"<br>"+MenuPrintout(mergeTwoItems(filterArray(usersInventory, commonItems)), selectedMenuOption);
        if (chosenMenuOption > -1 && (filterArray(usersInventory, commonItems)).length > 0) {
            // This will initialize a mini-game to process the items that the user has.
            currentProcessItem = [];
            currentProcessItem.push(filterArray(usersInventory, commonItems)[chosenMenuOption*2]);
            currentProcessItem.push(parseInt(filterArray(usersInventory, commonItems)[(chosenMenuOption*2)+1]));
            removeItemFromInventory(currentProcessItem[0], currentProcessItem[1]);
            chosenMenuOption = -1;
            sequenceLength = range(5-Math.round((usersToolbelt[0]+usersToolbelt[3])/2), 3, 12);
            gameState = gameStates.M_BEGIN_SEQUENCE;
        }
        if (menuReturn) {
            // Return the user to the main menu if they press the escape button.
            gameState = gameStates.MAIN_MENU;
            menuReturn = false;
        }
    }

    if (usersSequence.length > 0 && gameState == gameStates.M_REPEAT_SEQUENCE) {
        // Display the text of the users sequence when they have began to input the characters.
        textbox.innerHTML = textbox.innerHTML+"<br><br><br><br>"+usersSequence;
    }

    if (sequenceDisplayTime > 0 && gameState == gameStates.M_BEGIN_SEQUENCE) {
        // This will deduct 1 value from the display time until it equals 0 then change the game mode.
        textbox.innerHTML = textbox.innerHTML+"<br><br>"+randomSequence;
        sequenceDisplayTime -= 1;
        if (sequenceDisplayTime == 0) {
            gameState = gameStates.M_REPEAT_SEQUENCE;
        }
    }

    if (gameState == gameStates.M_BEGIN_SEQUENCE && randomSequence.length < sequenceLength) {
        // This will create a random sequence for the museum mini-game.
        sequenceDisplayTime = 100;
        randomSequence = sequenceGenerator(["W", "A", "S", "D"], sequenceLength);
    }

    if (gameState == gameStates.M_REPEAT_SEQUENCE && usersSequence.length == randomSequence.length && usersSequence.length > 0) {
        // This is what happens when the gameState is set to the M_REPEAT_SEQUENCE and these actions are what happens due to it. Create an average of the percentage of the actual items current quality by the new quality obtained though the mini-game. Once that is done then you can add the item to the inventory of the museum and the gameState back to the main men.
        currentProcessItem[1] = Math.round((ArraySimilarity(usersSequence, randomSequence)+currentProcessItem[1])/2);
        museumInventory.push(currentProcessItem[0]+" - Quality: "+currentProcessItem[1]);
        gameState = gameStates.MUSEUM_MENU;
    }
    
    if (gameState == gameStates.INVENTORY_SCREEN) {
        if (usersInventory.length > 0) {
            // This is the inventory screen which will only display the contents of the inventory if they have any items in the inventory.
            textbox.innerHTML = textbox.innerHTML+"<br>"+usersInventory;
        } else {
            textbox.innerHTML = textbox.innerHTML+"<br> There is no items within the inventory to display.";
            chosenMenuOption = -1;
        }

        if (chosenMenuOption > -1) {
            gameState = gameStates.MAIN_MENU;
            chosenMenuOption = -1;
        }
    }
    
    if (gameState == gameStates.UPGRADE_MENU) {
        if (usersInventory.length > 0) { 
        // Check if the user is in the update meny and will display two different outputs depending on whether the player has got an item in their inventory.
        textbox.innerHTML = textbox.innerHTML+"<br>"+MenuPrintout((mergeTwoArray(MenuOptions[3], usersToolbelt)), selectedMenuOption);
            if (chosenMenuOption == 0 && checkItemAmount(usersInventory, "Gold ore") >= usersToolbelt[0]) {
                // When the conditions are met and user has selected to upgrade their pocket scanner we check for gold and then remove the amount of gold needed to upgrade and increase the usersToolbelt[0] by one. This value represents the pocket scanner and then once that is done we then reset the chosen menu option value to = -1 and allow for them to chose again.
                removeItemFromInventory("Gold ore", usersToolbelt[0]);
                usersToolbelt[0] += 1;
                chosenMenuOption = -1;
            } else if (chosenMenuOption == 1 && checkItemAmount(usersInventory, "Iron ore") >= usersToolbelt[1]) {
                removeItemFromInventory("Iron ore", usersToolbelt[1]);
                // When the conditions are met and user has selected to upgrade their pickaxe we check for iron and then remove the amount of iron needed to upgrade and increase the usersToolbelt[1] by one. This value represents the pickaxe and then once that is done we then reset the chosen menu option value to = -1 and allow for them to chose again.
                usersToolbelt[1] += 1;
                chosenMenuOption = -1;
            } else if (chosenMenuOption == 2 && checkItemAmount(usersInventory, "Iron ore") >= usersToolbelt[2]) {
                // When the conditions are met and user has selected to upgrade their shovel we check for iron and then remove the amount of iron needed to upgrade and increase the usersToolbelt[2] by one. This value represents the shovel and then once that is done we then reset the chosen menu option value to = -1 and allow for them to chose again.
                removeItemFromInventory("Iron ore", usersToolbelt[2]);
                usersToolbelt[2] += 1;
                chosenMenuOption = -1;
            } else if (chosenMenuOption == 3 && checkItemAmount(usersInventory, "Copper ore") >= usersToolbelt[3]) {
                // When the conditions are met and user has selected to upgrade their processor we check for copper and then remove the amount of copper needed to upgrade and increase the usersToolbelt[3] by one. This value represents the pickaxe and then once that is done we then reset the chosen menu option value to = -1 and allow for them to chose again.
                removeItemFromInventory("Copper ore", usersToolbelt[3]);
                usersToolbelt[3] += 1;
                chosenMenuOption = -1;
            } else {
                // This is text for if the user doesn't have an item in the inventory yet.
                textbox.innerHTML = textbox.innerHTML+"<br>"+"You can't upgrade this item your missing the needed items.";
            }
            } else if (chosenMenuOption > -1) {
                // This is a catch to find if the user has selected an option and the actions have not been competed to reset the chosenMenuOption so it is a quick display message to tell the play they dont have the gold or iron and then resets the chosenMenuOption.
                textbox.innerHTML = textbox.innerHTML+"<br> You have no gold or iron ore in your inventory to upgrade your tools or the pocket scanner.";
                chosenMenuOption = -1;
        }
    }
    
    if ((gameState >= gameStates.MAIN_MENU && gameState <= gameStates.UPGRADE_MENU) && menuReturn) {
        // This will make the escape button return to the main menu when the user is in a different menu then the main one.
        menuReturn = false;
        gameState = gameStates.MAIN_MENU;
        selectedMenuOption = 0;
    }
    
    if (gameState == gameStates.BIOME_MENU) {
        // This will check if the gameState is the biome menu and will display the options on the terrain. It will then print out the menu, and then check if the player has selected or chosen an option and change the game state to RENDER TERRAIN, once changed will obtain data on the terrain that has been chosen.
        textbox.innerHTML = textbox.innerHTML+MenuPrintout(partialArrayOutput(MenuOptions[1], usersToolbelt[0]), selectedMenuOption);
        if (chosenMenuOption != -1) {
            // Once the user selects the correct biome then I generate a biome for them using this selected type and then also begin to set up the other variables. User attempts = 2 + the pocket scanner level, the nodeDisplayTime = 100 and will show the nodes based on if the nodeDisplayTime > 0. sequenceLength = range which is either a base of 4 + the pocket scanner - Rounded(pickaxe level & shovel level) divided by 2. But can not go below 2 or above 12
            gameState = gameStates.RENDER_TERRAIN; // GameState change to RENDER TERRAIN
            biomeType = getBiomeVal(MenuOptions[1][chosenMenuOption]);
            nodeDisplayTime = 100;
            usersAttempts = usersToolbelt[0]+2;
            sequenceLength = range(4+usersToolbelt[0]-Math.round((usersToolbelt[1]+usersToolbelt[2])/2), 2, 12);
        }
    }
    
    if (gameState == gameStates.RENDER_TERRAIN) {
        // Generate the terrain when a biome is chosen, and change the game state to a state to explain the terrain has been built. Also generate a series of Positions for the nodes. And change the game state to display the nodes.
        mapArray = mapGenerator(biomeType[0], biomeType[1], biomeType[2], MapSizeX, MapSizeY);
        nodePosArray = nodeGenerator((usersAttempts*2));
        gameState = gameStates.RENDER_NODES; // gameState is equal to display nodes
    }
    
    if (gameState == gameStates.RENDER_NODES || gameState == gameStates.REPEAT_SEQUENCE) {
        // Change the nodeDisplayTime negatively by 1 overtime. If the nodeDisplayTime equal to 0 then change the gameState to beginGame.
        if (nodeDisplayTime > 0) {
            nodeDisplayTime -= 1;
        } else if (nodeDisplayTime == 0) {
            gameState = gameStates.BEGIN_GAME; // GameState is equal to begin game.
        }
    }
    
    if (gameState == gameStates.BEGIN_GAME && usersAttempts == 0) {
        // Display the locations of where the user has selected once they have ran out of attempts.
        gameState = gameStates.DISPLAY_DIGGOUTS;
    }
    
    if (usersAttempts > 0) {
        // If the userAttempts is greater than and not equal to 0 display the users attempts on the texbox.
        textbox.innerHTML = textbox.innerHTML+"<br>You have got "+usersAttempts+" attempts remaining.";
    }
    
    if (mapArray != []) {
        // This will render to the canvas if the mapArray contains some mappable data.
        mapRender(mapArray, biomeType[3], MapSizeX, MapSizeY, tileSizeX, tileSizeY);
    }
    
    if (gameState == gameStates.RENDER_NODES) {
        // This will render the nodes until the gamemode is changed.
        nodeRender(nodePosArray);
    }
    
    if (gameState == gameStates.DISPLAY_DIGGOUTS || gameState == gameStates.BEGIN_SEQUENCE) {
        // Create a function that will display the locations the user has selected.
        nodeRender(usersPosArray);
    }
    
    if (gameState == gameStates.DISPLAY_DIGGOUTS) {
        // Once the gameState has changed to display digouts then begin the sequence mini-game
        gameState = gameStates.BEGIN_SEQUENCE;
    }
    
    if (randomSequence.length < sequenceLength && gameState == gameStates.BEGIN_SEQUENCE) {
        // This will only activate if the randomSequence length is greater than 0 and the gameState is equal to begin sequence. This creates a random sequence using the W A S D characters and creates this random sequence to the length of the sequenceLength and will change the displayTime to 100 which will be negatively change by -1 overtime.
        randomSequence = sequenceGenerator(["W", "A", "S", "D"], sequenceLength);
        sequenceDisplayTime = 100;
    }

    if (sequenceDisplayTime > 0 && gameState == gameStates.BEGIN_SEQUENCE) {
        sequenceDisplayTime -= 1;
        textbox.innerHTML = textbox.innerHTML+"<br><br>"+randomSequence;
    }
    
    if (sequenceDisplayTime == 0 && gameState == gameStates.BEGIN_SEQUENCE) {
        // This is to show the sequence for a set amount of time.
        textbox.innerHTML = textbox.innerHTML+"<br><br>";
        if (gameState == gameStates.BEGIN_SEQUENCE) {
            gameState = gameStates.REPEAT_SEQUENCE;
        }
    }
    
    if (usersSequence.length > 0 && gameState == gameStates.REPEAT_SEQUENCE) {
        // Adds the users sequence to the texbox output if the sequence has a length.
        textbox.innerHTML = textbox.innerHTML+"<br><br>"+usersSequence;
    }
    
    if (usersSequence.length == randomSequence.length && usersSequence.length > 0) {
        // add a function to test if both variables are the same. Once you test that we add random item depending on the biome and then remove the first two positions from the usersPos array and then empty the sequence arrays and then check if the users pos array is now empty. If empty we change the game mode.
        if (checkPos(usersPosArray[0], usersPosArray[1], nodePosArray, nodeSizeX, nodeSizeY) == true && usersPosArray.length > 0) {
            // Check if the user has managed to click on a location where there is a node. If they have managed to give them a random item from the biomeType. If not just give them a random item from the NA type which is a basic random range of common items.
            addRandomItem(biomeType[4],ArraySimilarity(usersSequence, randomSequence));
        } else {
            addRandomItem("NA",ArraySimilarity(usersSequence, randomSequence));
        }
        
        // This resets both of the sequence arrays to empty for the next sequence or next time.
        
        randomSequence = [];
        usersSequence = [];
        
        if (usersPosArray.length > 0) {
            // Remove the position from the usersPosArray to work though the different locations the user has pressed.
            usersPosArray.splice(0, 2);
        }
        
        if (usersPosArray.length <= 0 && gameState == gameStates.REPEAT_SEQUENCE) {
            // Change the game state to see if its repeat sequence and if the users pos array length is equal to 0 then reset the different variables and then go back to the main-menu.
            mapArray = [];
            chosenMenuOption = -1;
            gameState = gameStates.MAIN_MENU;
        }
    }
}

function mergeTwoItems(array) {
    // This is a function that takes two items from an array and combines them, line items in an array with a name, num, name, num structure. I will use this to print out museum and on inventory.
    let i;
    let temp_array = [];
    for (i = 0; i < array.length; i = i+2) {
        temp_array.push(array[i]+" "+array[i+1]);
    }
    return temp_array;
}

function filterArray(main_array, filter) {
    // Takes a main array and then alters the main array by a filter to be able to present the user with all of the rarer items when in the process screen in the museum.
    let i;
    let temp_array = [];
    for (i = 0; i < main_array.length; i = i+2) {
        if (filter.includes(main_array[i]) == false) {
            temp_array.push(main_array[i]);
            temp_array.push(main_array[i+1]);
        }
    }
    return temp_array;
}

function mergeTwoArray(arrayA, arrayB) {
    // Take one main array A and another array B and then take both items from the array and merge them, example, arraya[0]+" "+arrayb[0];
    let i;
    let temp_array = [];
    for (i = 0; i < arrayA.length; i++) {
        temp_array.push(arrayA[i]+" "+arrayB[i]);
    }
    return temp_array;
}

function checkItemAmount(array, item) {
    // Returns either 0 or the number of items which are in the inventory. The array must be singular and also be in a structure of itemName, itemQuantity.
    if (array.indexOf(item) != -1) {
        return array[array.indexOf(item)+1];
    } else {
        return 0;
    }
}

function removeItemFromInventory(item, quantity) {
    // Check if the user has got the item and the item is not common and then remove the item depending on how much of the item I am after removing. If the item is uncommon then remove the item from the inventory.
    let temp_boolean = false;
    let i;
    if (usersInventory.includes(item)) {
        // Within this function it checks if the item has got a rarity instead of an quantity and checks to remove the item first before deducting its value.
        for (i = 0; i < usersInventory.length-1; i = i+2) {
            if (temp_boolean == false && usersInventory[i] == item && usersInventory[i+1] == quantity) {
                usersInventory.splice(i, 2);
                temp_boolean = true;
            } else if (temp_boolean == false && usersInventory[i] == item && usersInventory[i+1] > quantity && commonItems.indexOf(item) > -1) {
                usersInventory[i+1] = usersInventory[i+1]-quantity;
                temp_boolean = true;
            }
        }
    }
}

function checkPos(x, y, arrayB, sizeX, sizeY) {
    // arrayA is being checked against arrayB, forms of arrays are singular arrays with a structure of x,y,x,y ect. Array B is the points of the nodes and the array A is the mouse position, the sizes are the sizes to the tiles.
    let i;
    for (i = 0; i < arrayB.length; i = i+2) {
        if (x > arrayB[i]-(sizeX/2) && x < arrayB[i]+(sizeX/2) && y > arrayB[i+1]-(sizeX/2) && y < arrayB[i+1]+(sizeX/2)) {
        return true;
        }
    }
    return false;
}

function addItemToInventory(item, quantity) {
    // This will add an item to the inventory which is either rare and obtained from a node, or will add an item thats not in the inventory. If the item is common then it will just add the quantity to the entry within the inventory.
    if (commonItems.indexOf(item) == -1 || usersInventory.indexOf(item) == -1) {
        usersInventory.push(item);
        usersInventory.push(quantity);
    } else if (usersInventory.indexOf(item) != -1) {
        usersInventory[usersInventory.indexOf(item)+1] = usersInventory[usersInventory.indexOf(item)+1]+quantity;
    }
}

function addRandomItem(biome, quality) {
    let r;
    // This is a series of random items that will be added depending on the biome. Some biomes will have better items or different items and different randomness levels.
    if (biome == "NA") {
        r = Math.random();
        if (r > 0.5) {
            addItemToInventory("Dirt", 1, 0);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 1, 0);
        } else if (r > 0.2) {
            addItemToInventory("Stone", 1, 0);
        } else if (r > 0.1) {
            addItemToInventory("Sand", 1, 0);
        }
    } else if (biome == "Dirty Plain") {
        r = Math.random();
        if (r > 0.5) {
            addItemToInventory("Geode", quality);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 1);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        }else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }
    } else if (biome == "Plains") {
        r = Math.random();
        if (r > 0.5) {
            addItemToInventory("Geode", quality);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 1);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        }else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }
    } else if (biome == "Desert") {
        r = Math.random();
        if (r > 0.5) {
            addItemToInventory("Fossil", quality);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 1);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        }else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }
    } else if (biome == "Forest") {
        r = Math.random();
        if (r > 0.6) {
            addItemToInventory("Ruby", quality);
        } else if (r > 0.5) {
            addItemToInventory("Lapis Lazuli", 1);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 1);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        }else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }
    } else if (biome == "Swamp") {
        r = Math.random();
        if (r > 0.6) {
            addItemToInventory("Amber", quality);
        } else if (r > 0.5) {
            addItemToInventory("Lapis Lazuli", 2);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 2);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        } else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }  else if (r > 0.03) {
            addItemToInventory("Iron ore", 2);
        } else if (r > 0.0) {
            addItemToInventory("Gold ore", 2);
        }
    } else if (biome == "Mountain") {
        r = Math.random();
        if (r > 0.6) {
            addItemToInventory("Emerald", quality);
        } else if (r > 0.5) {
            addItemToInventory("Sapphire", quality);
            addItemToInventory("Sapphire", quality);
        } else if (r > 0.4) {
            addItemToInventory("Geode", quality);
            addItemToInventory("Geode", quality);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        } else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }  else if (r > 0.05) {
            addItemToInventory("Iron ore", 2);
        } else if (r > 0.0) {
            addItemToInventory("Gold ore", 2);
        }
    } else if (biome == "Taiga") {
        r = Math.random();
        if (r > 0.6) {
            addItemToInventory("Emerald", quality);
        } else if (r > 0.5) {
            addItemToInventory("Sapphire", quality);
            addItemToInventory("Sapphire", quality);
        } else if (r > 0.4) {
            addItemToInventory("Copper ore", 2);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 1);
        } else if (r > 0.1) {
            addItemToInventory("Gold ore", 1);
        }  else if (r > 0.05) {
            addItemToInventory("Iron ore", 2);
        } else if (r > 0.0) {
            addItemToInventory("Gold ore", 2);
        }
    } else if (biome == "Jungle") {
        r = Math.random();
        if (r > 0.7) {
            addItemToInventory("Geode", quality);
            addItemToInventory("Geode", quality);
        } else if (r > 0.6) {
            addItemToInventory("Sapphire", quality);
        } else if (r > 0.5) {
            addItemToInventory("Emerald", quality);
        } else if (r > 0.4) {
            addItemToInventory("Ruby", quality);
        } else if (r > 0.3) {
            addItemToInventory("Iron ore", 1);
        }  else if (r > 0.25) {
            addItemToInventory("Gold ore", 2);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 2);
        } else if (r > 0.19) {
        addItemToInventory("Iron ore", 3);
        } else if (r > 0.185) {
            addItemToInventory("Gold ore", 3);
        } else if (r > 0.15) {
            addItemToInventory("Fossil", quality);
            addItemToInventory("Fossil", quality);
        } else if (r > 0.2) {
            addItemToInventory("Iron ore", 2);
        } else if (r > 0.04) {
            addItemToInventory("Amber", quality);
            addItemToInventory("Amber", quality);
        } else if (r > 0.0) {
            addItemToInventory("Diamond", quality);
            addItemToInventory("Diamond", quality);
        }
    } else if (biome == "Red Desert" || biome == "Savannah") {
        r = Math.random();
        if (r > 0.6) {
            addItemToInventory("Geode", quality);
            addItemToInventory("Geode", quality);
        } else if (r > 0.1) {
            addItemToInventory("Fossil", quality);
            addItemToInventory("Fossil", quality);
        } else if (r > 0.08) {
            addItemToInventory("Iron ore", 2, 0);
        } else if (r > 0.06) {
            addItemToInventory("Gold ore", 2, 0);
        } else if (r > 0.04) {
            addItemToInventory("Diamond", quality);
            addItemToInventory("Diamond", quality);
        }  else if (r > 0.02) {
            addItemToInventory("Emerald", quality);
            addItemToInventory("Emerald", quality);
        } else if (r > 0.0) {
            addItemToInventory("Topaz", quality);
            addItemToInventory("Topaz", quality);
        }
    }
}

function ArraySimilarity(arrayA, arrayB) {
    // How two arrays are similar shown in a percentage.
    let i;
    let perc = 100;
    for (i = 0; i < arrayA.length; i++) {
        if (arrayA[i] != arrayB[i]) {
        perc -= (100/(arrayA.length));
        }
    }
    return perc;
}

function sequenceGenerator(array, len) {
    // This will take an array of characters that will be used to create a random array with a definable length. This function will be used for two of my mini-games but will use two different sets of characters for the both mini-games.
    let i, r;
    let temp_array = [];
    for (i = 0; i < len; i++) {
        r = Math.random();
        // Create a variable to hold a random int, use that int to then chose a random number from an array, using the arrays length * by random then rounded to the nearest whole number, then -1 to give an actual position in the array. Add that character to a temp array and once anotehr characters are added to the array, return the array.
        temp_array.push(array[Math.round(r*(array.length-1))]);
    }
    return temp_array;
}

function nodeGenerator(num) {
    // This function will create a series of random position that can easily be displayed on the canvas temparerily for the user. It returns the values which is a long singular array of x,y,x,y,x,y,x,y which will be interpreted as this structure by a nodeRender function.
    let i, x, y;
    let temp_pos = [];
    for (i = 0; temp_pos.length != num*2; i = i+2) {
        x = range(Math.round(Math.random()*rect.width*scaleX), nodeSizeX, rect.width*scaleY-nodeSizeX);
        y = range(Math.round(Math.random()*rect.height*scaleY), nodeSizeY, rect.height*scaleY-nodeSizeY);
        if (temp_pos.indexOf(x) == -1 && temp_pos.indexOf(y) == -1) {
        temp_pos.push(x);
        temp_pos.push(y);
        }
    }
    return temp_pos;
}

function nodeRender(array) {
    // This function is used to generate the location of the nodes that have been created on the terrain. This shows the points as locations prepresented on the canvas. Taking the array in a singular array and in the way of x,y,x,y layout.
    let i;
    for (i = 0; i < array.length; i = i+2) {
        draw("hsl(0, 0%, 0%)", array[i]-(nodeSizeX/2), array[i+1]-(nodeSizeY/2), nodeSizeX, nodeSizeY);
    }
}

function getBiomeVal(val) {
    // Returns the corresponding values depending on what the users has chosen for the terrain type. This will return the gradient, minV, maxV and a color set up, this is the beginning of a hsl() value including the hue and saturation and the lightness will be created externally by the value set up by the mapGeneration function. This lets me set up a color variation in the terrain.
    if (val == "Dirty Plain") {
        return [5, 40, 75, "hsl(20, 40%, ", val];
    } else if (val == "Plains") {
        return [5, 40, 55, "hsl(124, 71%, ", val];
    } else if (val == "Desert") {
        return [5, 60, 80, "hsl(59, 56%, ", val];
    } else if (val == "Forest") {
        return [5, 15, 30, "hsl(115, 64%, ", val];
    } else if (val == "Swamp") {
        return [5, 25, 55, "hsl(115, 64%, ", val];
    } else if (val == "Mountain") {
        return [5, 35, 60, "hsl(115, 0%, ", val];
    } else if (val == "Taiga") {
        return [5, 30, 40, "hsl(143, 62%, ", val];
    } else if (val == "Jungle") {
        return [5, 25, 40, "hsl(95, 75%, ", val];
    } else if (val == "Red Desert") {
        return [5, 30, 50, "hsl(18, 38%, ", val];
    } else if (val == "Savannah") {
        return [5, 30, 50, "hsl(62, 38%, ", val];
    }
}

function MouseMove(e) {
    // This function will cast out the users position relative to the canvas. This is done by taking the users X or Y and then finding the location of the canvas and the rectangular hitbox. This is then rounded afterwards.
    canvas = document.getElementById("display");
    rect = canvas.getBoundingClientRect();
    ctx = canvas.getContext("2d");
    
    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
    
    if ((e.clientX - rect.left) * scaleX > 0 && (e.clientX - rect.left) * scaleX < rect.width * scaleX) {
        mouseX = Math.round(range((e.clientX - rect.left) * scaleX, 0, rect.width * scaleX));
    }
    if ((e.clientY - rect.top) * scaleY > 0 && (e.clientY - rect.top) * scaleY < rect.width * scaleY) {
        mouseY = Math.round(range((e.clientY - rect.top) * scaleY, 0, rect.height * scaleY));
    }
}

function KeyDown(e) {
    // Will set the keyCode variable with the code of a key that is down.
    keyCode = e.keyCode;
}

function MouseDown() {
    // Will set the click variable to true to show that the mouse button is down.
    click = true;
}

function range(val, min, max) {
    // I created this function to control the values that will be used within my website. This is to help with numerical data controls and to allow for me to keep a "lid" on the values that will be present within my game.
    if (val > max) {
        return max;
    } else if (val < min) {
        return min;
    } else {
        return val;
    }
}

function mapGenerator(gradient, MinV, MaxV, MaxX, MaxY) {
    /* This function is used to create and generate a random two dimensional array which takes specific conditions.

    gradient - this is the amount general progression of the values on the multi-array this is how the value will begin to alter.
    MinV and MaxV - these are just restrictive containers for the values to remain inbetween a range that can be external altered or changed.
    MaxX and MaxY - this is how long you would like to make the array, this is if you want to make the map bigger or smaller depending on these two values. They define how long the for loops will run for. */
    let tempMultiArray = [];
    let tempArray = [];
    let x, y, r, diff;
    
    for (x = 0; x < MaxX; x++) {
        for (y = 0; y < MaxY; y++) {
        tempArray.push(MinV);
        }
        tempMultiArray.push(tempArray);
        tempArray = [];
    }
    
    for (x = 0; x < MaxX; x++) {
        for (y = 0; y < MaxY; y++) {
            r = (Math.random()*2)-1;
            diff = gradient*r;
            // I use r as a random numeric value variable with this value I then times it by 2 and then -1 this can then provide me with a value that is either -0.9 or 0.9 which will allow for me to be able to change the value that will be applied to the diff variable. Diff is the difference that needs to be applied to the chosen tile of the array and will alalow for me to either accend or decent that tile by the current amount that is present. This allows for the terrain to gain a random but effective difference in depth. Along with this the random value that is created modifies the gradient variable that is given though the function. This is how you can customise how must the terrain can change in altitute. Gradient represents the overal height difference you would like to see in your terrain.
            
            tempMultiArray[x][y] = range(Math.round(tempMultiArray[x][y]+diff), MinV, MaxV);
            
            /* I then after modifing the original selected tile begin to modify any tiles that are adjacent to this selected tile. I first check if there is a tile in either the positive or negative position to the main one and then do an average of the main tile and the tile that is select. After the average of those two values I then change that tile by the difference.
            I begin by taking the value of the adjacent tile, altering by the selected difference and once I alter that I take the value from the original center tile and average both of their values together to create a slightly flatter and more progressive terrain. */
                        
            if (x+1 < MaxX) {
                // This is the tile that is to the right of the chosen tile and is modified in the way stated in the previous comment.
                tempMultiArray[x+1][y] = range(Math.round(((tempMultiArray[x+1][y]+diff)+tempMultiArray[x][y])/2), MinV, MaxV);
                
            }
            if (x-1 > 0) {
                // This is the tile that is to the left of the chosen tile and is modified in the way stated in the previous comment.
                tempMultiArray[x-1][y] = range(Math.round(((tempMultiArray[x-1][y]+diff)+tempMultiArray[x][y])/2), MinV, MaxV);
            }
            if (y+1 < MaxY) {
                // This is the tile that is to the top of the chosen tile and is modified in the way stated in the previous comment.
                tempMultiArray[x][y+1] = range(Math.round(((tempMultiArray[x][y+1]+diff)+tempMultiArray[x][y])/2), MinV, MaxV);
            }
            if (y-1 > 0) {
                // This is the tile that is to the bottom of the chosen tile and is modified in the way stated in the previous comment.
                tempMultiArray[x][y-1] = range(Math.round(((tempMultiArray[x][y-1]+diff)+tempMultiArray[x][y])/2), MinV, MaxV);
            }
        }
    }
    // Once the entire multi-array has been created and randomly altered I then return this out of the function so that it can be called and casted to an external variable.
    return tempMultiArray;
}

function mapRender(multi_array, biomeColor, MaxX, MaxY, SizeX, SizeY) {
    // This takes the multi-array of values and then a biome color which is stored in the biomeType function and then will generate the tiles depending on the sizes and maximums of X and Y.
    let x, y;
    for (x = 0; x < MaxX; x++) {
        for (y = 0; y < MaxY; y++) {
        draw((biomeColor+multi_array[x][y]+"%)"), x*SizeX, y*SizeY, SizeX, SizeY);
        }
    }
}

function draw(color, x, y, size_x, size_y) {
    /* This is the draw function which only has a sole purpose to print out the tiles of the terrain that has been randomly generated. I will create a render function for the terrain which will widely use this function.

    color - it will be the color value of the tile. It will be using the hsl() color function from css to allow for tiles to gain a form of difference in "lightness" to display to the user a sense of depth.
    x and y - location of the tiles that are being printed.
    size_x and size_y are the size of the tiles that will be printed. */
    ctx.beginPath();

    ctx.fillStyle = color;
    ctx.fillRect(x, y, size_x, size_y);

    ctx.stroke();
}

function clear() {
    // This function will clear the canvas when needed. This will allow for me to clear and reprint to the canvas if needed.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}