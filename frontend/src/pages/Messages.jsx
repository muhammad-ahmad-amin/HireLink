import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Messages() {
  const [conversations, setConversations] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", lastMessage: "Thanks for the update!", time: "2h ago", unread: 2 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", lastMessage: "Can you start on Monday?", time: "5h ago", unread: 0 },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", lastMessage: "Great work on the project!", time: "1d ago", unread: 0 },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Smith", text: "Hi, are you interested in this project?", time: "10:30 AM" },
    { id: 2, sender: "You", text: "Yes, I'd love to discuss more details.", time: "10:35 AM" },
    { id: 3, sender: "John Smith", text: "Great! Can you start next week?", time: "10:40 AM" },
    { id: 4, sender: "You", text: "Yes, that works perfectly for me.", time: "10:45 AM" },
    { id: 5, sender: "John Smith", text: "Thanks for the update!", time: "10:50 AM" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-8 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">HireLink</h1>
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-md flex flex-col space-y-2 text-sm">
          <Link to="/dashboard" className="text-green-700 font-semibold hover:bg-green-100 px-2 py-1 rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link to="/browse-jobs" className="text-green-700 font-semibold hover:bg-green-100 px-2 py-1 rounded-lg transition-colors">
            Browse Jobs
          </Link>
          <Link to="/my-bids" className="text-green-700 font-semibold hover:bg-green-100 px-2 py-1 rounded-lg transition-colors">
            My Bids
          </Link>
          <Link to="/messages" className="text-green-700 font-semibold bg-green-100 px-2 py-1 rounded-lg transition-colors">
            Messages
          </Link>
          <Link to="/wallet" className="text-green-700 font-semibold hover:bg-green-100 px-2 py-1 rounded-lg transition-colors">
            Wallet
          </Link>
          <Link to="/free-profile" className="text-green-700 font-semibold hover:bg-green-100 px-2 py-1 rounded-lg transition-colors">
            Profile
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex gap-6 p-6">
          {/* Conversations List */}
          <div className="w-80 bg-white rounded-xl shadow-md flex flex-col">
            <div className="p-4 border-b border-green-200">
              <h2 className="text-xl font-bold text-green-700">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer border-b border-green-100 transition-colors ${
                    selectedConversation.id === conversation.id
                      ? "bg-green-100 border-l-4 border-green-500"
                      : "hover:bg-green-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-green-700">{conversation.name}</h3>
                    {conversation.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-green-600 text-sm mb-1 truncate">{conversation.lastMessage}</p>
                  <p className="text-green-400 text-xs">{conversation.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-green-200">
              <h3 className="text-lg font-bold text-green-700">{selectedConversation.name}</h3>
              <p className="text-green-600 text-sm">{selectedConversation.email}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "You"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-green-200">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
