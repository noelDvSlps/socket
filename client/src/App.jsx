import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function App() {
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join-room", room);
    }
  };

  const sendMessage = (message) => {
    socket.emit("send-message", { message, room });
  };

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessageReceived(data.message);
    });
  }, []);
  return (
    <div>
      <input
        type="text"
        placeholder="Room Number..."
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}> Join room</button>
      <input
        type="text"
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => sendMessage(message)}> Send Message</button>
      <h2>{messageReceived}</h2>
    </div>
  );
}

export default App;
