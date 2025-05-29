import { WebSocketServer , WebSocket} from "ws";

const wss = new WebSocketServer({port : 8000});

let userCount =0;
let allSockets = new Map<string,WebSocket[]>();


wss.on("connection",(socket)=>{

    userCount += 1;

    console.log("user connected #",userCount);

    let roomId : string = "";
    socket.on('message',(message)=>{

        const parsedMaessage = JSON.parse(message.toString());
        console.log(parsedMaessage , "message");

        if(parsedMaessage.type === "join"){

            if(roomId){
                console.log("already in room return back")
                return;
            }

            console.log("want to join")
            roomId = parsedMaessage.payload.roomId;
            console.log(roomId)
            if(!roomId) console.log("yes")
            if(allSockets.has(roomId)){
                allSockets.get(roomId)!.push(socket);
            }else{
                allSockets.set(roomId,[socket]);
            }

        }

        if(parsedMaessage.type === "chat"){
            console.log("want to chat");
            console.log(roomId)
            if(roomId == null) return;

            allSockets.get(roomId)?.forEach((s) =>{
                s.send(parsedMaessage.payload.message);
            });

        }

    });

    socket.on("close",()=>{

        if(roomId){
           const sockets  = allSockets.get(roomId);

           if(sockets){

                const updatedSockets = sockets?.filter((s) => s !== socket);

                if(updatedSockets.length > 0){
                    allSockets.set(roomId,updatedSockets);
                }else{
                    allSockets.delete(roomId);
                }
                console.log("removed from the map");

           }

        }

    });
    
});

