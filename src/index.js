import {createClient, Node, NodeStatus, Request, setup} from '@mobsya/thymio-api'

//Connect to the switch
//We will need some way to get that url, via the launcher
const port = process.env.PORT;
let client = createClient(port);



let selectedNode = undefined
let foundNodes = []; // array to hold all locked nodes
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// we need a way to count number of nodes 
//Note: Subsequent refresh may be required to be sure the number of nodes displayed corresponds with the real robots
//Just refresh and it will adjust 
let NumberOfNodesFound = 0;

var robotName = "thymio2 D on DESKTOP-OMM87U3 - 16928";

const aeslProgram = `
call leds.top(30,0,0)  
                            `

// Start monitotring for node event
// A node will have the state
//     1 * connected    : Connected but vm description unavailable - little can be done in this state
//     2 * available    : The node is available, we can start communicating with it
//     4 * ready        : We have an exclusive lock on the node and can start sending code to it.
//     3 * busy         : The node is locked by someone else.
//     5 * disconnected : The node is gone
client.onNodesChanged = async (nodes) => {
        //iterate over nodes to find the currently available and but not currently selected node
        for(let node of nodes){
            if(node.status == NodeStatus.available) {
                //save to array
                foundNodes.push(node);
            }
        }
        //iterate through 
        foundNodes.forEach(function (node){
        // bind available nodes to html
        var ThymioList = document.getElementById("thymioList");
        var ThymioItem = document.createElement("li");
        ThymioItem.innerHTML = `ID ${node._name} STATUS ${node._status}`;
        ThymioItem.onclick = function(name){
            console.log(node._name)
            robotName = node._name
        }
        // bind node to parent div
        ThymioList.appendChild(ThymioItem);
        NumberOfNodesFound++; // number of available robots
        //bind number of thymio to html count
        document.getElementById("ThymioCounter").innerText = NumberOfNodesFound;
         });


         //now lets try to send data to robot with "b0242d53-b23c-4e69-ad6e-7eb77b6ac315"
         //NOTE: sending data to a node requires that a node is locked which will set its status to ready 
         //now lets try to lock node only when we selects its id
         

         for(let node of foundNodes){
            if(node._name == robotName){
                //lock this particular node
                await node.lock();
                console.log(`${node._name} is locked`);
                await node.sendAsebaProgram(aeslProgram);
                await node.runProgram();
               
            }
        }
    
}