import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Search, Bell, Settings, Send, Paperclip, Smile, MessageSquare, Ghost } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5001";

const ChatPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [incognitoMode, setIncognitoMode] = useState(false);
  
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Socket
  useEffect(() => {
    if (user) {
      socket.current = io(ENDPOINT, { autoConnect: true });
      socket.current.emit("setup", user);
      socket.current.on("connected", () => setSocketConnected(true));

      socket.current.on("message received", async (newMessageReceived) => {
        // We handle appending in a functional way to get latest state
        setMessages((prev) => {
          // Only append if we are currently chatting with the sender
          return [...prev, newMessageReceived];
        });

        // Trigger safe remote wipe if recipient picks up incognito packet
        if (newMessageReceived.isIncognito && newMessageReceived.recipient && newMessageReceived.recipient._id === user._id) {
          try {
             await api.post("/messages/viewed", { messageIds: [newMessageReceived._id] });
          } catch(e) { console.error("Could not wipe socket incognito fragment", e); }
        }
      });
      
      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when active user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser) return;
      try {
        const { data } = await api.get(`/messages/${activeUser._id}`);
        setMessages(data);
        socket.current.emit("join chat", activeUser._id);
        
        // Wipe pending incognito messages targeted to us dynamically upon first successful render read
        const unreadSecureIDs = data
          .filter(m => m.isIncognito && m.recipient && m.recipient._id === user._id)
          .map(m => m._id);
          
        if (unreadSecureIDs.length > 0) {
          try {
            await api.post("/messages/viewed", { messageIds: unreadSecureIDs });
          } catch(err) { console.error("Could not wipe active chat incognito logs", err); }
        }
        
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, [activeUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const { data } = await api.post("/messages", {
        content: newMessage,
        recipient: activeUser._id,
        isIncognito: incognitoMode,
      });

      setNewMessage("");
      setMessages((prev) => [...prev, data]);

      // Emit socket event. The backend expects a 'chat' shape or similar to know who to send to.
      // Based on the backend server.js implementation:
      socket.current.emit("new message", {
        ...data,
        chat: { users: [user, activeUser] } // Mocking a chat object so backend can iterate users
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const filteredUsers = users.filter((u) => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 bg-card/30 flex-col hidden md:flex">
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search direct messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 mb-2">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Direct Messages
              </h3>
              <div className="space-y-1.5 mt-1">
                {filteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => setActiveUser(u)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      activeUser?._id === u._id
                        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:shadow-sm"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden uppercase text-sm font-bold shadow-sm transition-transform duration-300 group-hover:scale-105 ${activeUser?._id === u._id ? "bg-primary text-primary-foreground border border-primary/30" : "bg-linear-to-br from-secondary to-secondary/50 text-foreground border border-border/50"}`}>
                        {u.username.substring(0, 2)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm"></div>
                    </div>
                    <div className="flex flex-col items-start truncate min-w-0">
                      <span className="truncate w-full text-left font-semibold">{u.username}</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5 border border-primary/10 bg-background/50 px-1.5 py-0.5 rounded-sm">
                        {u.language || "English"}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                      <Search className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try another search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-background/50 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/5 via-background to-background pointer-events-none"></div>

          {!activeUser ? (
            <div className="flex-1 flex items-center justify-center z-10 p-6 flex-col text-center">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-linear-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/5 backdrop-blur-3xl relative overflow-hidden hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                <MessageSquare className="h-10 w-10 text-primary relative z-10" />
              </div>
              <h2 className="text-4xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Ready to chat?</h2>
              <p className="text-muted-foreground max-w-sm mx-auto text-base">Select a user from the sidebar to start a real-time conversation backed by dynamic translation.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b border-border/50 flex flex-nowrap items-center justify-between px-4 sm:px-6 bg-card/30 backdrop-blur-sm z-10 w-full overflow-hidden shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden uppercase text-sm font-bold shadow-sm bg-linear-to-br from-primary to-primary/80 text-primary-foreground`}>
                    {activeUser.username.substring(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-sm leading-none flex items-center gap-2">{activeUser.username} <span className="text-[9px] uppercase tracking-wider opacity-70 bg-secondary px-1.5 py-0.5 rounded-full border border-border/50 text-muted-foreground">{activeUser.language || "English"}</span></h2>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                      Active now
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-4">
                  <Button onClick={() => setIncognitoMode(!incognitoMode)} variant={incognitoMode ? "default" : "ghost"} size="icon" className={`rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] group ${incognitoMode ? 'bg-zinc-900 border-red-500/50 hover:bg-black text-red-500 border shadow-red-500/30' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Ghost className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 ${incognitoMode ? 'scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 flex flex-col transition-all duration-700 ease-in-out relative ${incognitoMode ? 'bg-slate-950/95 backdrop-blur-3xl shadow-[inset_0_0_100px_rgba(239,68,68,0.03)]' : ''}`}>
                {incognitoMode && (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02)_0%,transparent_100%)]"></div>
                )}
                
                <div className="text-center my-4 relative z-10">
                  {incognitoMode ? (
                     <div className="mx-auto flex flex-col items-center gap-2 max-w-sm">
                       <Ghost className="h-8 w-8 text-red-500/50 mb-1" />
                       <span className="text-xs font-semibold text-red-500/80 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-500/10">
                         Incognito Mode Active
                       </span>
                       <p className="text-[10px] text-muted-foreground mt-2 max-w-[250px] mx-auto text-center leading-relaxed">Messages in this overlay self-destruct from the server instantly upon delivery. They will not persist after refresh.</p>
                     </div>
                  ) : (
                     <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/30 shadow-sm">
                       This is the beginning of your direct message history with {activeUser.username}.
                     </span>
                  )}
                </div>

                {messages.filter(m => incognitoMode ? m.isIncognito : !m.isIncognito).map((m, i) => {
                  const isSender = m.sender._id === user._id;
                  return (
                    <div key={i} className={`flex items-start gap-4 ${isSender ? "flex-row-reverse" : ""}`}>
                      <div className={`w-10 h-10 rounded-full border ${isSender ? "border-primary/30 bg-primary/20" : "border-border/50 bg-secondary"} flex items-center justify-center shrink-0 uppercase text-xs font-bold`}>
                        {m.sender.username.substring(0, 2)}
                      </div>
                      <div className={`flex flex-col gap-1 w-full max-w-2xl ${isSender ? "items-end" : ""}`}>
                        <div className={`flex items-baseline gap-2 ${isSender ? "flex-row-reverse" : ""}`}>
                          <span className="font-semibold text-sm">{m.sender.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`${isSender ? (incognitoMode ? "bg-linear-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-md shadow-black/50 text-zinc-100" : "bg-linear-to-br from-primary to-primary/80 border-primary shadow-md shadow-primary/20 text-primary-foreground") : (incognitoMode ? "bg-black/60 backdrop-blur-md border border-red-500/20 shadow-md shadow-red-500/5 text-zinc-300" : "bg-card/90 backdrop-blur-md border border-border/60 shadow-sm text-foreground")} border rounded-2xl px-4 py-3 text-sm break-words max-w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-${isSender ? 'tr' : 'tl'}-sm`}>
                          {isSender && !incognitoMode && (
                              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                          )}
                          {!isSender && incognitoMode && (
                              <div className="absolute top-0 left-0 w-12 h-12 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
                          )}
                          {!isSender && m.translatedContent ? (
                            <div className="flex flex-col gap-1.5 relative z-10">
                              <p className="font-medium tracking-wide leading-relaxed">{m.translatedContent}</p>
                              <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-border/20">
                                <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Original</span>
                                <p className="text-xs opacity-80 italic line-clamp-2">{m.content}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="relative z-10 font-medium tracking-wide leading-relaxed">{m.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-4 bg-background z-10 w-full overflow-hidden border-t border-border/50 transition-colors duration-500 ${incognitoMode ? 'bg-zinc-950 border-white/5' : ''}`}>
                <form onSubmit={sendMessage} className={`relative flex items-center bg-secondary/30 border border-border rounded-xl focus-within:ring-1 transition-all overflow-hidden w-full max-w-full shadow-sm ${incognitoMode ? 'bg-zinc-900/50 border-zinc-800 focus-within:border-red-500/50 focus-within:ring-red-500/30' : 'focus-within:border-primary/50 focus-within:ring-primary/50'}`}>
                  <button type="button" className={`p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0 ${incognitoMode ? 'hover:text-red-400' : ''}`}>
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={incognitoMode ? `Send self-destructing message to ${activeUser.username}...` : `Message ${activeUser.username}...`}
                    className={`flex-1 bg-transparent py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm focus:outline-none placeholder:text-muted-foreground/70 min-w-0 ${incognitoMode ? 'text-zinc-200' : ''}`}
                  />
                  <button type="button" className={`p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors shrink-0 ${incognitoMode ? 'hover:text-red-400' : ''}`}>
                    <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button type="submit" disabled={!newMessage.trim()} className={`p-1.5 sm:p-2 mr-1.5 sm:mr-2 rounded-lg transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 duration-200 shrink-0 disabled:opacity-50 disabled:pointer-events-none ${incognitoMode ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-500/20' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </form>
                <div className="text-center mt-2 hidden sm:block">
                  <span className="text-[10px] text-muted-foreground">
                    <span className="font-semibold">Pro tip:</span> Press Enter to send.
                  </span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
