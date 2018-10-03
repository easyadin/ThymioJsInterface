import {Client,Node,Request} from '@mobsya/thymio-api'

//Connect to the switch
//We will need some way to get that url, via the launcher
let client = new Client("ws://localhost:8597");
let selectedNode = undefined

// Start monitotring for node event
// A node will have the state
//      * connected    : Connected but vm description unavailable - little can be done in this state
//      * available    : The node is available, we can start communicating with it
//      * ready        : We have an excusive lock on the node and can start sending code to it.
//      * busy         : The node is locked by someone else.
//      * disconnected : The node is gone
client.on_nodes_changed = async (nodes) => {
    //Iterate over the nodes
    for (let node of nodes) {
        console.log(`${node.id} : ${node.status_str}`)
        // Select the first non busy node
        if((!selectedNode || !selectedNode.ready) && node.status == Node.Status.available) {
            selectedNode = node
            try {
                console.log(`Locking ${node.id}`)
                // Lock (take ownership) of the node. We cannot mutate a node (send code to it), until we have a lock on it
                // Once locked, a node will appear busy / unavailable to other clients until we close the connection or call `unlock` explicitely
                // We can lock as many nodes as we want
                await selectedNode.lock();
                console.log("Node locked, sending code")

                let colgen = () => {
                    return Math.floor(Math.random() * (32 - 1)) + 0
                }

                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                selectedNode.on_vars_changed = (vars) => {
                    console.log(vars)
                    //selectedNode.on_vars_changed = null
                }

                while(true) {
                    // Load some aseba code on the device
                    // The code will be compiled on the switch
                    console.time('Sending code');
                    await selectedNode.send_aseba_program(
                        `call leds.bottom.left(${colgen()},${colgen()},${colgen()})
                         call leds.bottom.right(${colgen()},${colgen()},${colgen()})
                         call leds.top(${colgen()}, ${colgen()}, ${colgen()})
                        `
                    )
                    console.timeEnd('Sending code');

                    // Execute whatever code is loaded on the device
                    console.time('Running code');
                    await selectedNode.run_aseba_program()
                    console.timeEnd('Running code');
                    await sleep(1000)
                }

            } catch(err) {
                console.log(err)
                switch(err) {
                    case Request.ErrorType.node_busy:
                        console.log("Node Busy !")
                        break
                    default:
                        console.log("unknown error")
                }
            }
            break;
        }
    }
}
