import { WebSocketServer , WebSocket} from "ws";

const wss = new WebSocketServer({port : 8000});

let userCount =0;
let allSockets : WebSocket[] = [];
wss.on("connection",(socket)=>{

    userCount += 1;
    allSockets.push(socket);

    console.log("user connected #",userCount);

    socket.on('message',(message)=>{

        allSockets.forEach(s =>{
            s.send(message.toString());
        });

    });
    
});

