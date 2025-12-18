import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Hand, MoreVertical, MessageSquare, ArrowLeft, Volume2, FlipHorizontal, Send, Heart, Smile, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppHooks';
import { Button } from '../components/ui/Button';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isMe: boolean;
}

interface Reaction {
  id: number;
  x: number; // random horizontal position percentage
  color: string;
}

export const LiveMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Media State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // UI State
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Sis. Mary', text: 'Hallelujah! God is good.', isMe: false },
    { id: '2', sender: 'Bro. John', text: 'Amen. Joining from London.', isMe: false },
  ]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock participants
  const participants = [
    { id: 1, name: 'Apostle Michael', isSpeaking: true, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
    { id: 2, name: 'Prophetess Sarah', isSpeaking: false, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
    { id: 4, name: 'Prayer Team', isSpeaking: false, image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80' },
    { id: 5, name: 'Bro. David', isSpeaking: false, image: null }, // No image
  ];

  // --- Camera Logic ---
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
        if (isVideoOff) return;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Failed to access camera", err);
        }
    };

    if (!isVideoOff) {
        startCamera();
    } else {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }

    return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isVideoOff]);

  useEffect(() => {
     if (videoRef.current && cameraStream) {
         videoRef.current.srcObject = cameraStream;
     }
  }, [cameraStream]);


  // --- Simulation Logic (Chat & Reactions) ---
  useEffect(() => {
      const interval = setInterval(() => {
          // Randomly add a reaction
          if (Math.random() > 0.7) {
              addReaction();
          }
          // Randomly add a message
          if (Math.random() > 0.92) {
              const dummyMessages = ['Glory to God!', 'Thank you Jesus!', 'Amen!', 'We receive it!', 'Powerful word.'];
              const dummyNames = ['Grace', 'Peter', 'Esther', 'Luke', 'Martha'];
              const text = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
              const sender = dummyNames[Math.floor(Math.random() * dummyNames.length)];
              
              setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  sender,
                  text,
                  isMe: false
              }]);
          }
      }, 2000);

      return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);


  // --- Handlers ---
  const handleSendMessage = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!chatInput.trim()) return;

      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'You',
          text: chatInput,
          isMe: true
      }]);
      setChatInput('');
      
      // Auto close keyboard on mobile sometimes helpful, but let's keep focus
  };

  const addReaction = () => {
      const id = Date.now();
      const x = Math.floor(Math.random() * 80) + 10; // 10% to 90% width
      const colors = ['text-red-500', 'text-pink-500', 'text-purple-500', 'text-yellow-400'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      setReactions(prev => [...prev, { id, x, color }]);

      // Cleanup reaction after animation
      setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== id));
      }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#202124] flex flex-col z-50 text-white font-sans overflow-hidden">
      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {reactions.map(r => (
              <div 
                key={r.id}
                className={`absolute bottom-24 text-2xl animate-float-up ${r.color}`}
                style={{ left: `${r.x}%`, opacity: 0 }}
              >
                  <Heart fill="currentColor" />
              </div>
          ))}
      </div>

      {/* Top Header */}
      <div className="flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 backdrop-blur-md">
                <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col">
                <span className="text-lg font-medium leading-none drop-shadow-md">Prayer Room</span>
                <span className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    LIVE • 1.2k Watching
                </span>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <button className="p-2 rounded-full hover:bg-white/10 backdrop-blur-md bg-black/20">
                 <FlipHorizontal size={20} />
             </button>
             <button className="p-2 rounded-full hover:bg-white/10 backdrop-blur-md bg-black/20">
                 <Volume2 size={20} />
             </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col justify-center relative">
        <div className="grid grid-cols-2 gap-3 h-full max-h-[70vh]">
            {participants.map((p) => (
                <div key={p.id} className={`relative bg-[#3c4043] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center group ${p.isSpeaking ? 'ring-2 ring-blue-500' : ''}`}>
                    {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-medium text-white shadow-sm">
                            {p.name.charAt(0)}
                        </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 max-w-[80%]">
                        <div className="text-xs font-bold text-white drop-shadow-md truncate flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                             {p.name}
                        </div>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                         {p.isSpeaking && (
                            <div className="bg-blue-500 p-1.5 rounded-full shadow-sm animate-pulse">
                                <Mic size={12} fill="currentColor" />
                            </div>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Self View (Floating) */}
      <div className="absolute bottom-32 right-4 w-28 h-40 bg-[#3c4043] rounded-xl overflow-hidden shadow-2xl border border-gray-700 z-20">
           {isVideoOff ? (
               <div className="w-full h-full flex items-center justify-center bg-gray-800">
                   {user?.avatar ? (
                       <img src={user.avatar} className="w-12 h-12 rounded-full" alt="You" />
                   ) : (
                       <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">Y</div>
                   )}
               </div>
           ) : (
               <video 
                   ref={videoRef} 
                   autoPlay 
                   muted 
                   playsInline 
                   className="w-full h-full object-cover transform scale-x-[-1]" 
               />
           )}
           <div className="absolute bottom-1 left-0 right-0 text-center">
               <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm text-white">You</span>
           </div>
           {isMuted && (
               <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full backdrop-blur-sm">
                   <MicOff size={10} className="text-red-400" />
               </div>
           )}
      </div>

      {/* Chat Overlay */}
      {showChat && (
          <div className="absolute inset-x-0 bottom-0 top-[40%] bg-black/80 backdrop-blur-md z-30 rounded-t-3xl flex flex-col animate-in slide-in-from-bottom-10 border-t border-white/10">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <h3 className="font-bold text-white">Live Chat</h3>
                  <button onClick={() => setShowChat(false)} className="p-1 hover:bg-white/10 rounded-full">
                      <X size={20} />
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                              msg.isMe 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white/10 text-gray-100 rounded-tl-none'
                          }`}>
                              {!msg.isMe && <span className="text-[10px] text-blue-300 font-bold block mb-0.5">{msg.sender}</span>}
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-white/10 bg-black/40 pb-safe">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Say something..."
                        className="flex-1 bg-white/10 border-none rounded-full px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                      />
                      <button 
                        type="submit" 
                        disabled={!chatInput.trim()}
                        className="p-2.5 bg-blue-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <Send size={18} />
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Bottom Controls */}
      <div className={`bg-[#202124] pb-safe pt-4 transition-transform duration-300 ${showChat ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="flex justify-evenly items-center px-4 mb-6">
            <button 
                onClick={() => navigate('/')}
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            >
                <PhoneOff size={22} fill="currentColor" />
            </button>

            <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${isVideoOff ? 'bg-white text-gray-900' : 'bg-[#3c4043] text-white border border-gray-600'}`}
            >
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>

            <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${isMuted ? 'bg-white text-gray-900' : 'bg-[#3c4043] text-white border border-gray-600'}`}
            >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <button 
                onClick={() => setShowChat(true)}
                className="w-12 h-12 rounded-full bg-[#3c4043] border border-gray-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform relative"
            >
                <MessageSquare size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">5</span>
            </button>

            <button 
                onClick={addReaction}
                className="w-12 h-12 rounded-full bg-[#3c4043] border border-gray-600 flex items-center justify-center text-pink-500 shadow-lg active:scale-95 transition-transform"
            >
                <Heart size={22} fill="currentColor" />
            </button>
            
            <button 
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform ${isHandRaised ? 'bg-yellow-100 text-yellow-700' : 'bg-[#3c4043] text-white border border-gray-600'}`}
            >
                <Hand size={22} />
            </button>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};