import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Link, Check, Maximize2, Minimize2, MonitorUp, MonitorOff, ChevronDown, ChevronUp, GripVertical, Lock, Shield, X, Disc, Pin, PinOff } from "lucide-react";
import { RoomControls } from "./components/RoomControls";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../store/api/authApi";
import { useJoinRoomMutation, useLeaveRoomMutation, useUpdateParticipantStatusMutation, useRequestToJoinMutation, useApproveJoinMutation, useDenyJoinMutation, useGetMyRequestStatusQuery, fetchAgoraToken } from "../../store/api/meetingApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const VideoRoom = ({ channelName, title, hostEmail, isMutedAll, isCamDisabled, isLocked, isRecording, activeParticipants = [], attendees = [], joinRequests = [], user: propUser, onToggleControl, onLeave, onEndMeeting }) => {
  // Derive initials from a name string for avatar fallback
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(/[\s@]+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  };
  const { user: reduxUser, token: jwtToken } = useSelector((state) => state.auth);
  const user = useMemo(() => {
    const base = propUser || reduxUser || {};
    return {
      id: base.id || propUser?.id || reduxUser?.id,
      email: base.email,
      fullName: base.fullName,
      role: base.role,
      avatarUrl: base.avatarUrl
    };
  }, [propUser, reduxUser]);
  const { data: allUsers = [] } = useGetAllUsersQuery();
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const isAppIdConfigured = appId && appId !== "YOUR_APP_ID_HERE" && appId.trim() !== "";

  const [agoraToken, setAgoraToken] = useState(null);
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    if (isAppIdConfigured && channelName && user?.id) {
      setTokenFetched(false);
      fetchAgoraToken(channelName, user.id, jwtToken)
        .then((token) => {
          setAgoraToken(token);
          setTokenFetched(true);
        })
        .catch((err) => {
          console.error("Error fetching Agora token:", err);
          setAgoraToken(null);
          setTokenFetched(true);
        });
    } else {
      setAgoraToken(null);
      setTokenFetched(false);
    }
  }, [channelName, user?.id, jwtToken, isAppIdConfigured]);

  const [joinRoom] = useJoinRoomMutation();
  const [leaveRoom] = useLeaveRoomMutation();
  const [updateParticipantStatus] = useUpdateParticipantStatusMutation();
  const [requestToJoin] = useRequestToJoinMutation();
  const [approveJoin] = useApproveJoinMutation();
  const [denyJoin] = useDenyJoinMutation();

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewState, setViewState] = useState("floating"); // "floating", "expanded", "minimized"

  // Presence synchronization effects
  useEffect(() => {
    if (channelName) {
      joinRoom({ roomId: channelName, micOn, cameraOn })
        .unwrap()
        .catch(err => console.error("Presence join error:", err));

      return () => {
        leaveRoom(channelName)
          .unwrap()
          .catch(err => console.error("Presence leave error:", err));
      };
    }
  }, [channelName, joinRoom, leaveRoom]);

  useEffect(() => {
    if (channelName) {
      updateParticipantStatus({ roomId: channelName, micOn, cameraOn })
        .unwrap()
        .catch(err => console.error("Presence status sync error:", err));
    }
  }, [micOn, cameraOn, channelName, updateParticipantStatus]);

  // Host administration states
  const [showHostSidebar, setShowHostSidebar] = useState(true);
  const [showHostPopover, setShowHostPopover] = useState(false);
  const [pinnedId, setPinnedId] = useState(null);
  const [orderedTeammates, setOrderedTeammates] = useState([]);

  // Enforce host controls in active call
  useEffect(() => {
    if (isMutedAll) {
      setMicOn(false);
    }
  }, [isMutedAll]);

  useEffect(() => {
    if (isCamDisabled) {
      setCameraOn(false);
    }
  }, [isCamDisabled]);

  // Dragging State for minimized view
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = React.useRef({ x: 0, y: 0 });
  const pillRef = React.useRef(null);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y,
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const margin = 24;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const isBottomCenterZone = (centerX > screenW * 0.35 && centerX < screenW * 0.65) && (centerY > screenH * 0.6);

      let newOffsetX = dragOffset.x;
      let newOffsetY = dragOffset.y;

      if (isBottomCenterZone) {
        newOffsetX = dragOffset.x + (screenW / 2 - centerX);
        newOffsetY = dragOffset.y + (screenH - margin - rect.bottom);
      } else {
        const snapToLeft = centerX < screenW / 2;
        if (snapToLeft) {
          newOffsetX = dragOffset.x - rect.left + margin;
        } else {
          newOffsetX = dragOffset.x + (screenW - rect.right) - margin;
        }

        if (rect.top < margin) {
          newOffsetY = dragOffset.y - rect.top + margin;
        } else if (rect.bottom > screenH - margin) {
          newOffsetY = dragOffset.y + (screenH - rect.bottom) - margin;
        }
      }

      setDragOffset({ x: newOffsetX, y: newOffsetY });
    }
  };

  // Join the Agora channel. Access control is handled upstream by the access-state screens.
  useJoin({
    appid: isAppIdConfigured ? appId : "",
    channel: channelName,
    token: agoraToken,
    uid: user?.id || null,
  }, activeConnection && isAppIdConfigured && tokenFetched);

  // Initialize local tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { screenTrack, error: screenError } = useLocalScreenTrack(screenShareOn, {}, "disable");

  // Control local microphone track status (hardware mute/unmute)
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn).catch(err => {
        console.error("Error setting microphone enabled status:", err);
      });
    }
  }, [micOn, localMicrophoneTrack]);

  // Control local camera track status (hardware mute/unmute)
  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(cameraOn).catch(err => {
        console.error("Error setting camera enabled status:", err);
      });
    }
  }, [cameraOn, localCameraTrack]);

  // Handle screen share stop from browser UI
  useEffect(() => {
    if (screenTrack && typeof screenTrack.on === "function") {
      const handleEnded = () => {
        setScreenShareOn(false);
      };
      screenTrack.on("track-ended", handleEnded);
      return () => {
        if (typeof screenTrack.off === "function") {
          screenTrack.off("track-ended", handleEnded);
        }
      };
    }
  }, [screenTrack]);

  // Publish local tracks — Agora only supports one video track per UID.
  // When screen sharing, publish screen track instead of camera track so remotes see the screen.
  const activeVideoTrack = screenShareOn && screenTrack ? screenTrack : (cameraOn ? localCameraTrack : null);
  const activeAudioTrack = micOn ? localMicrophoneTrack : null;

  const client = useRTCClient();
  const isConnected = useIsConnected();
  const publishedTracksRef = useRef([]);

  useEffect(() => {
    if (!isConnected) {
      publishedTracksRef.current = [];
      return;
    }
    if (!activeConnection || !isAppIdConfigured || !tokenFetched) return;

    const currentTracks = [activeAudioTrack, activeVideoTrack].filter(Boolean);
    const prevTracks = publishedTracksRef.current;

    const toUnpublish = prevTracks.filter(t => !currentTracks.includes(t));
    const toPublish = currentTracks.filter(t => !prevTracks.includes(t));

    const syncTracks = async () => {
      try {
        if (toUnpublish.length > 0) {
          const validUnpublish = toUnpublish.filter(t => t.state !== "closed");
          if (validUnpublish.length > 0) {
            await client.unpublish(validUnpublish);
          }
        }
        if (toPublish.length > 0) {
          await client.publish(toPublish);
        }
        publishedTracksRef.current = currentTracks;
      } catch (err) {
        console.error("Error during manual WebRTC track syncing:", err);
      }
    };

    syncTracks();
  }, [client, isConnected, activeAudioTrack, activeVideoTrack, activeConnection, isAppIdConfigured, tokenFetched]);

  // Get remote users
  const remoteUsers = useRemoteUsers();

  const handleCopyLink = () => {
    if (isLocked) {
      alert("Invite link is disabled. Meeting has been locked by the host.");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveClick = async () => {
    const isHost = user?.email && hostEmail && user.email.toLowerCase() === hostEmail.toLowerCase();
    if (isHost) {
      const endForAll = window.confirm("Would you like to end this meeting for all participants? (Click Cancel to just leave)");
      if (endForAll) {
        if (onEndMeeting) {
          await onEndMeeting();
        }
      } else {
        setActiveConnection(false);
        if (onLeave) onLeave();
      }
    } else {
      setActiveConnection(false);
      if (onLeave) onLeave();
    }
  };

  // Base list of remote teammates constructed from Agora state + database mapping + DB active presence
  const currentRemoteTeammates = useMemo(() => {
    const list = [];
    const seenEmails = new Set();
    if (user?.email) {
      seenEmails.add(user.email.trim().toLowerCase());
    }

    remoteUsers.forEach(u => {
      // Find the user details in our DB users
      const matchedUser = allUsers.find(dbUser => String(dbUser.id) === String(u.uid));
      const emailLower = matchedUser?.email?.trim()?.toLowerCase();

      if (emailLower) {
        if (seenEmails.has(emailLower)) return;
        seenEmails.add(emailLower);

        // Find their presence record in the DB to see if their mic/cam are on/off
        const presence = activeParticipants.find(p => p.email && p.email.trim().toLowerCase() === emailLower);

        list.push({
          id: `remote-${u.uid}`,
          type: "remote",
          name: matchedUser.fullName || matchedUser.email,
          email: matchedUser.email,
          isMicOn: u.hasAudio,
          isCameraOn: u.hasVideo,
          user: u,
          avatar: matchedUser.avatarUrl || null
        });
      } else {
        // Fallback for anonymous or unmapped Agora users
        list.push({
          id: `remote-${u.uid}`,
          type: "remote",
          name: `User #${u.uid}`,
          email: null,
          isMicOn: u.hasAudio,
          isCameraOn: u.hasVideo,
          user: u,
          avatar: null
        });
      }
    });

    return list;
  }, [remoteUsers, activeParticipants, allUsers, user]);

  // Sync orderedTeammates with currentRemoteTeammates when participants are added or removed
  useEffect(() => {
    setOrderedTeammates(prev => {
      const prevMap = new Map(prev.map(p => [p.id, p]));
      const currentIds = new Set(currentRemoteTeammates.map(p => p.id));

      const filtered = prev.filter(p => currentIds.has(p.id));

      const existingIds = new Set(filtered.map(p => p.id));
      const added = currentRemoteTeammates.filter(p => !existingIds.has(p.id));

      const newOrder = [...filtered, ...added];

      return newOrder.map(item => {
        const active = currentRemoteTeammates.find(p => p.id === item.id);
        return active ? { ...item, isMicOn: active.isMicOn, isCameraOn: active.isCameraOn, user: active.user } : item;
      });
    });
  }, [currentRemoteTeammates]);

  // Delayed swap timer ref
  const swapTimeoutRef = useRef(null);

  // Delayed swapping logic for speaking remote teammates outside the viewport
  useEffect(() => {
    // We only swap if we have more than 8 teammates (the 9th slot is the overflow indicator)
    if (orderedTeammates.length <= 8) {
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
        swapTimeoutRef.current = null;
      }
      return;
    }

    // Find speaking teammates in the overflow area (index >= 8)
    const speakingOverflowIdx = orderedTeammates.findIndex((p, idx) => idx >= 8 && p.isMicOn);

    if (speakingOverflowIdx !== -1) {
      // Find a silent/non-speaking teammate in the visible viewport area (index < 8)
      const silentVisibleIdx = orderedTeammates.findIndex((p, idx) => idx < 8 && !p.isMicOn);

      if (silentVisibleIdx !== -1) {
        if (!swapTimeoutRef.current) {
          swapTimeoutRef.current = setTimeout(() => {
            setOrderedTeammates(prev => {
              const updated = [...prev];
              if (updated[speakingOverflowIdx] && updated[silentVisibleIdx]) {
                const temp = updated[speakingOverflowIdx];
                updated[speakingOverflowIdx] = updated[silentVisibleIdx];
                updated[silentVisibleIdx] = temp;
              }
              return updated;
            });
            swapTimeoutRef.current = null;
          }, 3000); // 3 seconds speaking delay before layout swap
        }
        return;
      }
    }

    if (swapTimeoutRef.current) {
      clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = null;
    }
  }, [orderedTeammates]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
      }
    };
  }, []);

  // Combine all active participant feeds into a unified array
  const participants = [];

  // 1. Screen Share (local view — show as separate tile for self-preview)
  if (screenShareOn && screenTrack) {
    participants.push({
      id: "screenshare",
      type: "screenshare",
      name: "Your Screen",
      isCameraOn: true,
      track: Array.isArray(screenTrack) ? screenTrack[0] : screenTrack,
      isMicOn: false,
      avatar: ""
    });
  }

  // 2. Local User (Active profile fetched from Redux)
  // When screen sharing, camera is paused (track replaced by screen), so show avatar instead
  participants.push({
    id: "local",
    type: "local",
    name: `${user?.fullName || user?.email} (You)`,
    isMicOn: micOn,
    isCameraOn: screenShareOn ? false : cameraOn,
    track: screenShareOn ? null : localCameraTrack,
    audioTrack: localMicrophoneTrack,
    avatar: user?.avatarUrl || null
  });

  // 3. Remote Teammates (synced, persistently ordered, and delay-swapped)
  participants.push(...orderedTeammates);

  // Calculate pinned details
  const pinnedParticipant = participants.find(p => p.id === pinnedId);
  const otherParticipants = participants.filter(p => p.id !== pinnedId);

  const renderParticipant = (p, isPinnedStage = false, isOverflowIndicator = false, overflowCount = 0) => {
    const isCamOn = p.type === "local" ? cameraOn : p.type === "screenshare" ? screenShareOn : (p.user?.hasVideo || false);
    const avatarSizeClass = pinnedId
      ? isPinnedStage
        ? "w-32 h-32"
        : "w-16 h-16"
      : "w-24 h-24";
    const badgeSizeClass = pinnedId && !isPinnedStage ? "w-5 h-5 -bottom-0.5 -right-0.5" : "w-8 h-8 -bottom-1.5 -right-1.5";
    const badgeIconSize = pinnedId && !isPinnedStage ? 10 : 14;

    return (
      <div
        key={p.id}
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
        {/* Agora Remote Video Feed (must stay mounted to maintain audio/video track subscriptions) */}
        {p.type === "remote" && p.user && (
          <div className="absolute inset-0">
            <RemoteUser
              cover=""
              user={p.user}
              playVideo={isCamOn}
              playAudio={true}
            />
          </div>
        )}

        {/* Local User Camera Video Feed */}
        {p.type === "local" && cameraOn && (
          <div className="absolute inset-0">
            <LocalUser
              audioTrack={p.audioTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={p.track}
              playVideo={cameraOn}
              playAudio={micOn}
              cover=""
            />
          </div>
        )}

        {/* Local User Screen Share Video Feed */}
        {p.type === "screenshare" && (
          <div className="absolute inset-0">
            <LocalUser
              audioTrack={null}
              cameraOn={true}
              micOn={false}
              videoTrack={p.track}
              playVideo={true}
              playAudio={false}
              cover=""
            />
          </div>
        )}

        {/* Profile Avatar Visible at Center if Camera is Closed */}
        {!isCamOn && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center z-10">
            {isOverflowIndicator ? (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt=""
                      className={`${avatarSizeClass} rounded-full border-2 border-slate-800/40 object-cover opacity-30`}
                    />
                  ) : (
                    <div className={`${avatarSizeClass} rounded-full border-2 border-slate-800/40 bg-slate-800 flex items-center justify-center text-slate-400 font-black text-lg opacity-30`}>
                      {getInitials(p.name)}
                    </div>
                  )}
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
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className={`${avatarSizeClass} rounded-full border-2 object-cover shadow-lg transition-all ${p.isMicOn
                      ? "border-[#0061AA]"
                      : "border-slate-700/60"
                      }`}
                  />
                ) : (
                  <div className={`${avatarSizeClass} rounded-full border-2 shadow-lg flex items-center justify-center bg-slate-800 font-black text-slate-300 text-lg transition-all ${p.isMicOn
                    ? "border-[#0061AA]"
                    : "border-slate-700/60"
                    }`}>
                    {getInitials(p.name)}
                  </div>
                )}
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

  const isHost = user?.email && hostEmail && user.email.trim().toLowerCase() === hostEmail.trim().toLowerCase();
  const isAttendee = user?.email && attendees.some(a => a.trim().toLowerCase() === user.email.trim().toLowerCase());
  const isAuthorized = isHost || isAttendee;

  // Access control state for non-authorized users on locked meetings
  const [accessState, setAccessState] = useState(isAuthorized ? 'AUTHORIZED' : 'CHECKING');

  // Poll my request status when waiting
  const shouldPoll = isLocked && !isAuthorized && (accessState === 'PENDING' || accessState === 'CHECKING');
  const { data: requestStatusData } = useGetMyRequestStatusQuery(
    shouldPoll ? channelName : skipToken,
    { pollingInterval: shouldPoll ? 2000 : 0 }
  );

  // React to status changes from polling
  useEffect(() => {
    if (isAuthorized) {
      setAccessState('AUTHORIZED');
      return;
    }
    if (!isLocked) {
      setAccessState('AUTHORIZED');
      return;
    }
    if (requestStatusData?.status) {
      const s = requestStatusData.status;
      if (s === 'APPROVED') setAccessState('AUTHORIZED');
      else if (s === 'DENIED') setAccessState('DENIED');
      else if (s === 'PENDING') setAccessState('PENDING');
      else if (s === 'NONE' && accessState === 'CHECKING') {
        // Auto-send join request
        requestToJoin(channelName).unwrap()
          .then(res => setAccessState(res.status === 'APPROVED' ? 'AUTHORIZED' : 'PENDING'))
          .catch(() => setAccessState('PENDING'));
      }
    }
  }, [requestStatusData, isAuthorized, isLocked, channelName, accessState, requestToJoin]);

  // Initial request when locked + not authorized
  useEffect(() => {
    if (isLocked && !isAuthorized && accessState === 'CHECKING' && !requestStatusData) {
      requestToJoin(channelName).unwrap()
        .then(res => setAccessState(res.status === 'APPROVED' ? 'AUTHORIZED' : res.status))
        .catch(() => setAccessState('PENDING'));
    }
  }, [isLocked, isAuthorized, accessState, channelName, requestToJoin, requestStatusData]);

  // ─── Waiting for Approval Screen ──────────────────────────────────────
  if (accessState === 'PENDING') {
    return (
      <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[99] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-6 border border-blue-500/20 animate-pulse">
            <Lock size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-100 mb-2">Waiting for Host Approval</h3>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
            Your request to join has been sent to the meeting host. You'll be admitted automatically once approved.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <button
            onClick={onLeave}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[13px] font-bold transition-all border border-slate-700/50"
          >
            Cancel & Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── Request Denied Screen ────────────────────────────────────────────
  if (accessState === 'DENIED') {
    return (
      <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[99] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <X size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-100 mb-2">Request Denied</h3>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-8">
            The meeting host has denied your request to join this room.
          </p>

          <button
            onClick={onLeave}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[13px] font-bold transition-all border border-slate-700/50"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Still checking — show nothing until resolved ─────────────────────
  if (accessState === 'CHECKING' && isLocked && !isAuthorized) {
    return (
      <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-[99] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (viewState === "minimized") {
    return (
      <div
        ref={pillRef}
        className={`fixed bottom-6 left-1/2 bg-slate-900 text-white rounded-full shadow-2xl shadow-blue-900/20 ring-1 ring-slate-800 flex items-center p-2 gap-2 z-[60] animate-in slide-in-from-bottom-8 ${isDragging ? "cursor-grabbing" : "transition-transform duration-300"}`}
        style={{ transform: `translateX(calc(-50% + ${dragOffset.x}px)) translateY(${dragOffset.y}px)` }}
      >
        <div
          className="p-1 ml-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <GripVertical size={16} />
        </div>
        <button onClick={() => setViewState("floating")} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white" title="Expand">
          <ChevronUp size={18} />
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1" />
        <button
          onClick={() => setMicOn(a => !a)}
          className={`p-2.5 rounded-full transition-all relative ${micOn
            ? 'bg-slate-800 hover:bg-slate-700'
            : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
            }`}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? <Mic size={16} /> : <MicOff size={16} />}
        </button>
        <button
          onClick={() => setCameraOn(a => !a)}
          className={`p-2.5 rounded-full transition-all relative ${cameraOn
            ? 'bg-slate-800 hover:bg-slate-700'
            : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
            }`}
          title={cameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {cameraOn ? <Video size={16} /> : <VideoOff size={16} />}
        </button>
        <button onClick={() => setScreenShareOn(a => !a)} className={`p-2.5 rounded-full hidden sm:block ${screenShareOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-700'}`}>
          {screenShareOn ? <MonitorOff size={16} /> : <MonitorUp size={16} />}
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1" />
        <button
          disabled={isLocked}
          onClick={handleCopyLink}
          className={`p-2.5 rounded-full hover:bg-slate-700 transition-colors relative ${isLocked ? 'bg-slate-950 text-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-800 text-slate-300'}`}
          title={isLocked ? "Invites Locked" : "Copy invite link"}
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Link size={16} />}
        </button>
        <button onClick={handleLeaveClick} className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 ml-1">
          <PhoneOff size={16} />
        </button>
      </div>
    );
  }

  // Determine container classes based on viewState
  const containerClasses = viewState === "expanded"
    ? "fixed inset-0 z-[60] bg-slate-900 text-white flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
    : "fixed bottom-24 right-8 w-[400px] h-[550px] z-[60] bg-slate-900 text-white rounded-2xl shadow-2xl shadow-blue-900/20 ring-1 ring-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300";

  return (
    <div className={`${containerClasses} ${viewState === "expanded" && pinnedId ? "group/room" : ""}`}>
      <style>{`
        @keyframes ripple-wave {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 97, 170, 0.4), 0 0 0 0 rgba(0, 97, 170, 0.3);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(0, 97, 170, 0.15), 0 0 0 24px rgba(0, 97, 170, 0.05);
          }
          100% {
            box-shadow: 0 0 0 24px rgba(0, 97, 170, 0), 0 0 0 48px rgba(0, 97, 170, 0);
          }
        }
        @keyframes avatar-wobble {
          0%, 100% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.03) rotate(-1.5deg); }
          40% { transform: scale(0.98) rotate(1deg); }
          60% { transform: scale(1.02) rotate(-0.5deg); }
          80% { transform: scale(0.99) rotate(0.5deg); }
        }
        .speaking-ripple {
          animation: ripple-wave 2s infinite ease-out;
        }
        .speaking-wobble {
          animation: avatar-wobble 3s infinite ease-in-out;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700/50 z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <h3 className="font-bold tracking-tight truncate text-[14px]">
            {title || `War Room: ${channelName}`}
          </h3>
          {isLocked && (
            <span className="text-amber-500 hover:text-amber-400 transition-colors shrink-0" title="Meeting Locked by Host">
              <Lock size={13} />
            </span>
          )}
          {isRecording && (
            <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-red-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" /> REC
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
            <Users size={14} />
            <span>{participants.length} connected</span>
          </div>
          <button
            disabled={isLocked}
            onClick={handleCopyLink}
            className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${isLocked ? 'text-slate-600 cursor-not-allowed opacity-50' : 'text-slate-300'}`}
            title={isLocked ? "Invites Locked" : "Copy invite link"}
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Link size={14} />}
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button onClick={() => setViewState("minimized")} className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 transition-colors" title="Minimize">
            <ChevronDown size={16} />
          </button>
          <button onClick={() => setViewState(viewState === "expanded" ? "floating" : "expanded")} className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 transition-colors" title={viewState === "expanded" ? "Exit Fullscreen" : "Fullscreen"}>
            {viewState === "expanded" ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Diagnostics Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-slate-400 font-mono shrink-0">
        <div><span className="text-blue-400">Agora App ID:</span> {appId ? `${appId.substring(0, 6)}...` : 'Not Configured'}</div>
        <div><span className="text-blue-400">Channel Name:</span> {channelName}</div>
        <div><span className="text-blue-400">UID:</span> {user?.id || 'null'}</div>
        <div><span className="text-blue-400">Token Fetched:</span> {tokenFetched ? 'Yes' : 'No'}</div>
        <div><span className="text-blue-400">Token:</span> {agoraToken ? `${agoraToken.substring(0, 15)}... (len: ${agoraToken.length})` : 'None/Null'}</div>
        <div><span className="text-blue-400">Agora Remote Users:</span> {remoteUsers?.length ?? 0}</div>
        <div><span className="text-blue-400">DB Active:</span> {activeParticipants?.length ?? 0}</div>
        <div><span className="text-blue-400">Cam Track:</span> {localCameraTrack ? 'Active' : 'Null'} (On: {cameraOn ? 'Yes' : 'No'})</div>
        <div><span className="text-blue-400">Mic Track:</span> {localMicrophoneTrack ? 'Active' : 'Null'} (On: {micOn ? 'Yes' : 'No'})</div>
        <div><span className="text-blue-400">Screen Track:</span> {screenTrack ? 'Active' : 'Null'} (On: {screenShareOn ? 'Yes' : 'No'})</div>
      </div>

      {/* Main Body Area: contains the Video Grid and the collapsible Sidebar */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Unified Intelligent Layout Area */}
        {viewState !== "expanded" ? (
          /* Minimized / Floating view: Show only 1 user (pinned if active, else local) */
          <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto p-4">
            {(() => {
              const displayUser = participants.find(p => p.id === pinnedId) || participants.find(p => p.id === "local") || participants[0];
              return displayUser ? renderParticipant(displayUser, false) : null;
            })()}
          </div>
        ) : pinnedParticipant ? (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 gap-6 p-6">
            {/* Main Stage (Pinned Feed) */}
            <div className="flex-1 min-w-0 min-h-0 flex items-center justify-center">
              {renderParticipant(pinnedParticipant, true)}
            </div>

            {/* Sidebar for all other feeds (only render if they exist to prevent empty gaps) */}
            {otherParticipants.length > 0 && (
              <div className="lg:w-64 w-full flex lg:flex-col flex-row gap-3 overflow-auto p-1 shrink-0 lg:max-h-full max-h-40">
                {otherParticipants.map(p => renderParticipant(p, false))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Intelligent Grid */
          <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto p-6">
            {participants.length === 1 ? (
              /* 1 User: perfectly centered horizontally and vertically */
              <div className="w-full h-full flex items-center justify-center">
                {renderParticipant(participants[0], false)}
              </div>
            ) : participants.length === 2 ? (
              /* 2 Users: side by side, centered vertically and horizontally */
              <div className="w-full h-full flex flex-row items-center justify-center gap-6 max-w-6xl">
                {participants.map(p => renderParticipant(p, false))}
              </div>
            ) : (
              /* 3 or more Users: grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {participants.length <= 9 ? (
                  participants.map(p => renderParticipant(p, false))
                ) : (
                  <>
                    {participants.slice(0, 8).map(p => renderParticipant(p, false))}
                    {renderParticipant(participants[8], false, true, participants.length - 8)}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Host Controls Sidebar (for Expanded Fullscreen View) */}
        {showHostSidebar && viewState === "expanded" && (
          <div className="w-80 bg-slate-900 border-l border-slate-800/60 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h4 className="text-[13px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Shield size={16} className="text-[#0061AA]" /> Admin Dashboard
              </h4>
              <button onClick={() => setShowHostSidebar(false)} className="text-slate-500 hover:text-slate-300">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Host Lock controls</h5>
                <div className="flex flex-col gap-3">
                  {/* Audio Lock toggle */}
                  <div
                    onClick={() => onToggleControl?.('isMutedAll')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isMutedAll
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold"
                      : "bg-slate-950/40 border-slate-800/50 hover:bg-slate-950 text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMutedAll ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-500"}`}>
                        <MicOff size={15} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black leading-none mb-1">Mute Everyone</p>
                        <p className="text-[9px] text-slate-500 font-bold leading-none">Force participant mute</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-205 ${isMutedAll ? "bg-rose-500" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-205 ${isMutedAll ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Video Lock toggle */}
                  <div
                    onClick={() => onToggleControl?.('isCamDisabled')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isCamDisabled
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold"
                      : "bg-slate-950/40 border-slate-800/50 hover:bg-slate-950 text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCamDisabled ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-500"}`}>
                        <VideoOff size={15} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black leading-none mb-1">Block Cameras</p>
                        <p className="text-[9px] text-slate-500 font-bold leading-none">Disable participant feeds</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-205 ${isCamDisabled ? "bg-rose-500" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-205 ${isCamDisabled ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Lock Meeting toggle */}
                  <div
                    onClick={() => onToggleControl?.('isLocked')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isLocked
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold"
                      : "bg-slate-950/40 border-slate-800/50 hover:bg-slate-950 text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLocked ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-500"}`}>
                        <Lock size={15} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black leading-none mb-1">Lock Meeting</p>
                        <p className="text-[9px] text-slate-500 font-bold leading-none">Prevent entry & copy</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-205 ${isLocked ? "bg-amber-500" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-205 ${isLocked ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Cloud Recording toggle */}
                  <div
                    onClick={() => onToggleControl?.('isRecording')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isRecording
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400 font-bold"
                      : "bg-slate-950/40 border-slate-800/50 hover:bg-slate-950 text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRecording ? "bg-blue-500/20" : "bg-slate-800 text-slate-500"}`}>
                        <Disc size={15} className="animate-pulse text-red-500" />
                      </div>
                      <div>
                        <p className="text-[12px] font-black leading-none mb-1">Cloud Recording</p>
                        <p className="text-[9px] text-slate-500 font-bold leading-none">Archive active telemetry</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-205 ${isRecording ? "bg-blue-600" : "bg-slate-700"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-205 ${isRecording ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Requests (Host Only) */}
              {isHost && joinRequests.filter(r => r.status === 'PENDING').length > 0 && (
                <div>
                  <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Join Requests ({joinRequests.filter(r => r.status === 'PENDING').length})
                  </h5>
                  <div className="flex flex-col gap-2">
                    {joinRequests.filter(r => r.status === 'PENDING').map((req) => (
                      <div key={req.email} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[9px] font-black text-amber-400">
                              {getInitials(req.fullName || req.email)}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-200 leading-tight">{req.fullName || req.email}</p>
                              <p className="text-[9px] text-slate-500 leading-tight">{req.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => approveJoin({ roomId: channelName, email: req.email })}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => denyJoin({ roomId: channelName, email: req.email })}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-black transition-all"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Roster */}
              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Participants ({participants.length})</h5>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">Host</div>
                      <span className="text-[12px] text-slate-300 font-bold">{user?.fullName || user?.email} (You)</span>
                    </div>
                    <Mic size={12} className={micOn ? "text-emerald-400" : "text-slate-600"} />
                  </div>
                  {participants.filter(p => p.id !== "local" && p.id !== "screenshare").map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded bg-slate-950/30">
                      <div className="flex items-center gap-2">
                        {p.avatar ? (
                          <img src={p.avatar} className="w-6 h-6 rounded-full object-cover border border-slate-850" alt="" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-850 flex items-center justify-center text-[9px] font-bold text-slate-300">
                            {getInitials(p.name)}
                          </div>
                        )}
                        <span className="text-[12px] text-slate-300">{p.name}</span>
                      </div>
                      <Mic size={12} className={p.isMicOn ? "text-emerald-400" : "text-slate-600"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Floating Host Controls Popover (inside the floating card viewport) */}
      {showHostPopover && viewState !== "expanded" && (
        <div className="absolute bottom-24 right-6 left-6 bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl p-4 z-20 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[12px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield size={12} className="text-[#0061AA]" /> Host controls
            </span>
            <button onClick={() => setShowHostPopover(false)} className="text-slate-500 hover:text-slate-300">
              <X size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {/* Mute Everyone Toggle */}
            <div
              onClick={() => onToggleControl?.('isMutedAll')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <Mic size={14} className={isMutedAll ? "text-rose-400" : "text-slate-400"} />
                <span className="text-[12px] font-bold text-slate-200">Lock Microphones</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isMutedAll ? "bg-rose-500" : "bg-slate-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isMutedAll ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Block Cameras Toggle */}
            <div
              onClick={() => onToggleControl?.('isCamDisabled')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <Video size={14} className={isCamDisabled ? "text-rose-400" : "text-slate-400"} />
                <span className="text-[12px] font-bold text-slate-200">Block Cameras</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isCamDisabled ? "bg-rose-500" : "bg-slate-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isCamDisabled ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Lock Meeting Toggle */}
            <div
              onClick={() => onToggleControl?.('isLocked')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <Lock size={14} className={isLocked ? "text-amber-400" : "text-slate-400"} />
                <span className="text-[12px] font-bold text-slate-200">Lock Meeting Room</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isLocked ? "bg-amber-500" : "bg-slate-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isLocked ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Cloud Recording Toggle */}
            <div
              onClick={() => onToggleControl?.('isRecording')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <Disc size={14} className={isRecording ? "text-red-500 animate-pulse" : "text-slate-400"} />
                <span className="text-[12px] font-bold text-slate-200">Cloud Recording</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isRecording ? "bg-blue-600" : "bg-slate-700"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isRecording ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Controls */}
      <RoomControls
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        screenShareOn={screenShareOn}
        setScreenShareOn={setScreenShareOn}
        viewState={viewState}
        pinnedId={pinnedId}
        showHostSidebar={showHostSidebar}
        setShowHostSidebar={setShowHostSidebar}
        showHostPopover={showHostPopover}
        setShowHostPopover={setShowHostPopover}
        setActiveConnection={setActiveConnection}
        onLeave={onLeave}
        isHost={isHost}
      />
    </div>
  );
};
