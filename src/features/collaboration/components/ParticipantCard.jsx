import React from "react";
import { LocalUser, RemoteUser } from "agora-rtc-react";
import { MicOff, Pin, PinOff } from "lucide-react";

export const ParticipantCard = ({
  p,
  cameraOn,
  micOn,
  pinnedId,
  isPinnedStage = false,
  isOverflowIndicator = false,
  overflowCount = 0,
  viewState,
  participants,
  setPinnedId
}) => {
  const isCamOn = p.isCameraOn;
  const avatarSizeClass = pinnedId 
    ? isPinnedStage 
      ? "w-32 h-32" 
      : "w-16 h-16"
    : "w-24 h-24";
  const badgeSizeClass = pinnedId && !isPinnedStage ? "w-5 h-5 -bottom-0.5 -right-0.5" : "w-8 h-8 -bottom-1.5 -right-1.5";
  const badgeIconSize = pinnedId && !isPinnedStage ? 10 : 14;

  return (
    <div
      className={`relative overflow-hidden bg-slate-950/80 transition-all group shrink-0 rounded-2xl border border-slate-800 shadow-2xl ${isPinnedStage
        ? "w-full h-full"
        : `${viewState === "expanded"
          ? p.id === "screenshare"
            ? "w-full aspect-video max-w-4xl"
            : participants.length === 1
              ? "w-full max-w-2xl aspect-video mx-auto"
              : participants.length === 2
                ? "flex-1 max-w-[48%] aspect-video"
                : "w-full aspect-video animate-in zoom-in-95 duration-200"
          : "w-full h-full"
        }`
        }`}
    >
      {/* Agora Video Feed (Only if Camera is active) */}
      {isCamOn ? (
        p.type === "local" ? (
          <LocalUser
            audioTrack={p.audioTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={p.track}
            cover=""
          />
        ) : p.type === "screenshare" ? (
          <LocalUser
            audioTrack={null}
            cameraOn={true}
            micOn={false}
            videoTrack={p.track}
            cover=""
          />
        ) : (
          <RemoteUser
            cover=""
            user={p.user}
          />
        )
      ) : (
        /* Profile Avatar Visible at Center if Camera is Closed */
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center">
          {isOverflowIndicator ? (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative">
                <img
                  src={p.avatar}
                  alt=""
                  className={`${avatarSizeClass} rounded-full border-2 border-slate-800/40 object-cover opacity-30`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[28px] font-black tracking-tight text-white drop-shadow-md">
                    +{overflowCount}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                More Teammates
              </p>
            </div>
          ) : (
            <div className={`relative animate-in zoom-in-95 duration-350 rounded-full ${p.isMicOn ? "speaking-ripple" : ""}`}>
              <img
                src={p.avatar}
                alt={p.name}
                className={`${avatarSizeClass} rounded-full border-2 object-cover shadow-lg transition-all ${
                  p.isMicOn 
                    ? "border-[#0061AA]" 
                    : "border-slate-700/60"
                }`}
              />
              {!p.isMicOn && (
                <div className={`absolute rounded-full bg-rose-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-lg z-10 ${badgeSizeClass}`}>
                  <MicOff size={badgeIconSize} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lower Left Name Tag */}
      {!isOverflowIndicator && (
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 flex items-center gap-1.5 z-10">
          <span>{p.name}</span>
          {!p.isMicOn && <MicOff size={12} className="text-rose-500" />}
        </div>
      )}

      {/* Pinning Overlay Control */}
      {!isOverflowIndicator && viewState === "expanded" && (
        <button
          onClick={() => setPinnedId(pinnedId === p.id ? null : p.id)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-slate-350 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center"
          title={pinnedId === p.id ? "Unpin participant" : "Pin participant"}
        >
          {pinnedId === p.id ? (
            <PinOff size={14} className="text-blue-400 fill-blue-400/20" />
          ) : (
            <Pin size={14} />
          )}
        </button>
      )}
    </div>
  );
};
