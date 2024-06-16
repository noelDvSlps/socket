import { useEffect, useState } from "react";
import io from "socket.io-client";
// const socket = io.connect("http://localhost:3001");
const socket = io.connect("https://socket-e3rd.onrender.com");

function App() {
  // Get the scrollable div element
  let scrollableDiv = document.getElementById("scrollableDiv");

  // Function to scroll to the bottom of the div
  const scrollToBottom = () => {
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  };
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join-room", room);
    }
  };

  const sendMessage = (message) => {
    const userId = socket.id;
    socket.emit("send-message", { message, room, userId });
  };

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("receive-message", (data) => {
      console.log("received");
      console.log(data);
      // setMessageReceived(data.message);
      setMessageReceived(data);
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
      {/* <h2>{messageReceived}</h2> */}
      <div
        id="scrollableDiv"
        style={{
          border: "solid",
          height: "30vh",
          width: "80vw",
          overflowY: "scroll",
          scroll,
        }}
      >
        {
          <ul style={{ listStyle: "none" }}>
            {messageReceived.map((data, i) => {
              // setTimeout(() => {
              //   scrollToBottom();
              // }, 100);
              return (
                <li
                  key={i}
                  style={{
                    textAlign: data.userId === socket.id ? "end" : "start",
                  }}
                >
                  {data.userId === socket.id ? "Me:" : data.userId + ":"}{" "}
                  {data.message}
                  {scrollToBottom()}
                </li>
              );
            })}
          </ul>
        }
      </div>
    </div>
  );
}

export default App;
