const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const ACTIONS = require("./src/Actions");
const cors = require('cors');
const Axios = require("axios");

app.use(cors());
app.use(express.json());

app.post("/compile",(req,res)=>{
    const code = req.body.code;
    const language = req.body.language;
    const input = req.body.input;

    const languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" },
    };

    if (!languageMap[language]) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    const data = {
        "language": languageMap[language].language,
        "version": languageMap[language].version,
        "files": [
            {
                "name": "main",
                "content": code
            }
        ],
        "stdin": input
    };

    const config = {
        method: 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    Axios(config)
        .then((response) => {
            res.json(response.data.run);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ error: "Something went wrong" });
        });
});

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {}
const roomLanguageMap = {}
const PORT = process.env.PORT || 5000;
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId],
        };
    });
}

io.on('connection',(socket)=>{
    console.log("socket connected",socket.id);
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        userSocketMap[socket.id]=username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        if (!roomLanguageMap[roomId]) {
            roomLanguageMap[roomId] = "cpp";
        }
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id,
                language:roomLanguageMap[roomId],
            });
        })
    });
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
    })
    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })
    socket.on(ACTIONS.LANGUAGE_CHANGE,({roomId,language})=>{
        roomLanguageMap[roomId] = language;
        socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE,{language});
    })
    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

server.listen(PORT,()=>console.log(`Listening on PORT ${PORT}`));

app.listen(PORT+1,()=>{})