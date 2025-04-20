import { useEffect, useState } from "react";
import io from "socket.io-client";
let socket = null;
try {
  socket = io.connect("https://socket-e3rd.onrender.com");
} catch (error) {
  alert("connecting to local");
  socket = io.connect("http://localhost:3001");
}
// const socket = io.connect("http://localhost:3001");
// const socket = io.connect("https://socket-e3rd.onrender.com");

function App() {
  // Get the scrollable div element
  let scrollableDiv = document.getElementById("scrollableDiv");

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");

  const isSocketConnected = () => {
    return socket.connected;
  };

  // Function to scroll to the bottom of the div
  const scrollToBottom = () => {
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  };
  const joinRoom = () => {
    if (room !== "" && room !== currentRoom) {
      setCurrentRoom(room);
      socket.emit("join-room", room);
      sendMessage();
    }
    if (room === currentRoom) {
      alert("You are already in this room.");
    }
  };

  const sendMessage = (message) => {
    if (!isSocketConnected()) {
      alert("Disconnected");
      return;
    }
    try {
      if (message.trim() === "") {
        return;
      }
    } catch (error) {
      console.log("null");
    }

    const userId = socket.id;
    socket.emit("send-message", { message, room, userId });
    setMessage("");
  };

  useEffect(() => {
    console.log("useeffect");
    // console.log(messageReceived);
    setTimeout(() => {
      socket.on("receive-message", (data) => {
        console.log(`received ${room}`);
        console.log(data);
        setMessageReceived(data);
      });
    }, 1000);
  }, [room]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          // border: "solid",
          // height: "80vh",
          width: "99%",
        }}
      >
        <input
          type="text"
          placeholder="Room Number..."
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />
        <button onClick={joinRoom}> Join room</button>
      </div>

      <div
        id="scrollableDiv"
        style={{
          border: "solid",
          height: "80vh",
          width: "99%",
          overflowY: "scroll",
          scroll,
        }}
      >
        {
          <ul style={{ listStyle: "none", padding: "2px" }}>
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
                  {data.userId === socket.id
                    ? data.message
                      ? `Me: ${data.message}`
                      : null
                    : data.message
                    ? `${data.userId}: ${data.message}`
                    : `${data.userId} has joined`}

                  {scrollToBottom()}
                </li>
              );
            })}
          </ul>
        }
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // border: "solid",
          // height: "80vh",
          width: "99%",
        }}
      >
        <input
          type="text"
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          style={{
            width: "80%",
          }}
        />
        <button
          onClick={() => sendMessage(message)}
          style={{
            width: "20%",
          }}
        >
          {" "}
          Send Message
        </button>
      </div>

      {/* <h2>{messageReceived}</h2> */}
    </div>
  );
}

export default App;
