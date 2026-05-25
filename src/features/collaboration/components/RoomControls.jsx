import React from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff, Shield, PhoneOff } from "lucide-react";

export const RoomControls = ({
  micOn,
  setMicOn,
  cameraOn,
  setCameraOn,
  screenShareOn,
  setScreenShareOn,
  viewState,
  pinnedId,
  showHostSidebar,
  setShowHostSidebar,
  showHostPopover,
  setShowHostPopover,
  setActiveConnection,
  onLeave,
  isHost
}) => {
  return (
    <div className={`px-6 py-4 bg-slate-800 border-t border-slate-700/50 backdrop-blur-md flex items-center justify-center gap-4 shrink-0 z-35 transition-all duration-350 ${
      viewState === "expanded" && pinnedId 
        ? "opacity-0 translate-y-full group-hover/room:opacity-100 group-hover/room:translate-y-0 absolute bottom-0 left-0 right-0" 
        : "relative"
    }`}>
      <button
        onClick={() => setMicOn((a) => !a)}
        className={`p-3 rounded-full transition-all shadow-sm relative ${micOn
          ? "bg-slate-700 text-white hover:bg-slate-600"
          : "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
          }`}
        title={micOn ? "Mute Microphone" : "Unmute Microphone"}
      >
        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      <button
        onClick={() => setCameraOn((a) => !a)}
        className={`p-3 rounded-full transition-all shadow-sm relative ${cameraOn
          ? "bg-slate-700 text-white hover:bg-slate-600"
          : "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
          }`}
        title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
      >
        {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
      </button>

      <button
        onClick={() => setScreenShareOn((a) => !a)}
        className={`p-3 rounded-full transition-all shadow-sm hidden sm:block ${screenShareOn ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-700 text-white hover:bg-slate-600"}`}
        title={screenShareOn ? "Stop Sharing" : "Share Screen"}
      >
        {screenShareOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
      </button>

      {/* Shield Toggle Button for Host Controls Dashboard */}
      {isHost && (
        <button
          onClick={() => {
            if (viewState === "expanded") {
              setShowHostSidebar(prev => !prev);
            } else {
              setShowHostPopover(prev => !prev);
            }
          }}
          className={`p-3 rounded-full transition-all shadow-sm ${(viewState === "expanded" ? showHostSidebar : showHostPopover)
            ? "bg-[#0061AA] text-white hover:bg-[#004d8a]"
            : "bg-slate-700 text-white hover:bg-slate-600"
            }`}
          title="Host Administration Dashboard"
        >
          <Shield size={18} />
        </button>
      )}

      <div className="w-px h-6 bg-slate-700 mx-2" />

      <button
        onClick={() => {
          setActiveConnection(false);
          if (onLeave) onLeave();
        }}
        className="p-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-sm shadow-rose-500/20"
      >
        <PhoneOff size={18} />
      </button>
    </div>
  );
};
