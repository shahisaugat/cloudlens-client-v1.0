import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Video, Calendar, Clock, Users, Plus, X, ArrowRight, ChevronLeft, ChevronRight,
  Mic, MicOff, VideoOff, Lock, Unlock, Disc, Square, Link2, UserCheck, Check
} from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ScheduleModal } from "./ScheduleModal";

// Helper to get local YYYY-MM-DD
const getLocalYMD = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const MeetingsPage = ({ meetings, user, onUpdateMeeting, onSchedule, onJoin, onStartInstant, onDeleteMeeting }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [justCopied, setJustCopied] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalYMD());

  const getMeetingStatus = (meeting) => {
    const now = new Date();
    const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
    
    if (isNaN(meetingDateTime.getTime())) {
      return { label: "Live Now", canJoin: true, isExpired: false, isUpcoming: false };
    }

    const diffMs = now - meetingDateTime;
    const oneHourMs = 60 * 60 * 1000;

    if (diffMs < 0) {
      return {
        label: "Upcoming",
        canJoin: false,
        isExpired: false,
        isUpcoming: true,
        text: `Starts at ${meeting.time}`
      };
    } else if (diffMs <= oneHourMs) {
      return {
        label: "Live Now",
        canJoin: true,
        isExpired: false,
        isUpcoming: false,
        text: "Active"
      };
    } else {
      return {
        label: "Expired",
        canJoin: false,
        isExpired: true,
        isUpcoming: false,
        text: "Meeting Expired"
      };
    }
  };

  // Generate Calendar Days
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Padding empty cells for first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayMeetings = meetings.filter(m => m.date === dateString);

      days.push({
        day: i,
        dateString,
        hasMeeting: dayMeetings.length > 0,
        meetingCount: dayMeetings.length
      });
    }
    return days;
  }, [currentDate, meetings]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectedMeetings = useMemo(() => {
    return meetings.filter(m => m.date === selectedDateStr);
  }, [meetings, selectedDateStr]);

  // Auto-select first meeting of the day
  useEffect(() => {
    if (selectedMeetings.length > 0) {
      const exists = selectedMeetings.some(m => String(m.id) === String(selectedMeetingId));
      if (!exists) {
        setSelectedMeetingId(selectedMeetings[0].id);
      }
    } else {
      setSelectedMeetingId(null);
    }
  }, [selectedMeetings, selectedMeetingId]);

  const selectedMeeting = useMemo(() => {
    return meetings.find(m => String(m.id) === String(selectedMeetingId));
  }, [meetings, selectedMeetingId]);

  // Host Controls derived from selectedMeeting (supporting both isProperty and property names from Jackson)
  const isMutedAll = selectedMeeting?.isMutedAll || selectedMeeting?.mutedAll || false;
  const isCamDisabled = selectedMeeting?.isCamDisabled || selectedMeeting?.camDisabled || false;
  const isRoomLocked = selectedMeeting?.isLocked || selectedMeeting?.locked || false;
  const isRecording = selectedMeeting?.isRecording || selectedMeeting?.recording || false;

  const isHost = useMemo(() => {
    if (!selectedMeeting || !user || !user.email) return false;
    return selectedMeeting.hostEmail && 
           selectedMeeting.hostEmail.trim().toLowerCase() === user.email.trim().toLowerCase();
  }, [selectedMeeting, user]);

  const toggleControl = (field) => {
    if (!selectedMeeting) return;
    if (!isHost) {
      alert("Access Denied: Only the meeting host can modify control settings.");
      return;
    }
    
    // Toggle both versions of the key to guarantee dynamic React UI update & backend persistence
    const baseField = field.startsWith('is') ? field.slice(2).charAt(0).toLowerCase() + field.slice(3) : field;
    const isField = field.startsWith('is') ? field : 'is' + field.charAt(0).toUpperCase() + field.slice(1);
    
    const currentValue = selectedMeeting[isField] || selectedMeeting[baseField] || false;
    const updatedValue = !currentValue;
    
    const updated = {
      ...selectedMeeting,
      [isField]: updatedValue,
      [baseField]: updatedValue
    };
    if (onUpdateMeeting) {
      onUpdateMeeting(updated);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Meetings & Calls</h2>
          <p className="text-[14px] text-gray-500 font-medium">Schedule huddles and collaborate in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStartInstant}
            className="px-4 py-2.5 rounded-xl bg-blue-50 text-[#0061AA] text-[13px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Video size={16} /> Instant Huddle
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0061AA] text-white text-[13px] font-bold hover:bg-[#004d8a] transition-all flex items-center gap-2"
          >
            <Calendar size={16} /> Schedule Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-black text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Body (Centered vertically to make top and bottom padding perfectly equal) */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[11px] font-black text-gray-400 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarData.map((dayData, idx) => {
                if (!dayData) return <div key={`empty-${idx}`} className="p-2" />;

                const isSelected = dayData.dateString === selectedDateStr;
                const isToday = dayData.dateString === getLocalYMD();

                return (
                  <button
                    key={dayData.dateString}
                    onClick={() => setSelectedDateStr(dayData.dateString)}
                    className={`
                      relative h-10 w-10 mx-auto rounded-xl flex flex-col items-center justify-center text-[13px] font-bold transition-all
                      ${isSelected ? 'bg-[#0061AA] text-white' : 'text-gray-700 hover:bg-gray-100'}
                      ${isToday && !isSelected ? 'text-[#0061AA] bg-blue-50' : ''}
                    `}
                  >
                    <span>{dayData.day}</span>
                    {dayData.hasMeeting && (
                      <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#0061AA]'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Meetings List Card */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[380px]">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            <h3 className="text-[15px] font-black text-gray-900">
              {(() => {
                const [y, m, d] = selectedDateStr.split('-');
                return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
              })()}
            </h3>
            <span className="text-[12px] font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {selectedMeetings.length} Scheduled
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {selectedMeetings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100/50 shrink-0">
                  <Calendar size={22} className="text-[#0061AA]" />
                </div>
                <h3 className="text-[16px] font-black text-gray-900 tracking-tight mb-1">
                  No meetings scheduled
                </h3>
                <p className="text-[13px] text-gray-500 max-w-sm leading-relaxed mb-5 font-bold">
                  You have a clear schedule for this day. Click 'Schedule Meeting' to add one.
                </p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0061AA] text-white rounded-xl text-[13px] font-bold hover:bg-[#004d8a] transition-all active:scale-95 shadow-md shadow-blue-900/10 shrink-0"
                >
                  <Plus size={14} /> Schedule Meeting
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                {selectedMeetings.map((meeting) => {
                  const status = getMeetingStatus(meeting);
                  const isSelected = String(selectedMeetingId) === String(meeting.id);
                  return (
                    <div 
                      key={meeting.id} 
                      onClick={() => setSelectedMeetingId(meeting.id)}
                      className={`p-6 flex items-center justify-between cursor-pointer transition-all duration-200 border-l-4 ${
                        isSelected 
                          ? "bg-blue-50/20 border-l-[#0061AA] pl-5 shadow-none" 
                          : "hover:bg-gray-50/50 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          status.isExpired 
                            ? "bg-gray-100 text-gray-400" 
                            : status.isUpcoming 
                              ? "bg-blue-50 text-[#0061AA]" 
                              : "bg-emerald-50 text-emerald-600"
                        }`}>
                          <Video size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`text-[16px] font-black tracking-tight transition-all duration-200 ${
                              status.isExpired 
                                ? "text-gray-400 line-through" 
                                : isSelected 
                                  ? "text-[#0061AA] font-black" 
                                  : "text-gray-900"
                            }`}>
                              {meeting.title}
                            </h3>
                            {status.isUpcoming && (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0061AA] px-2 py-0.5 rounded-md border border-blue-100/50">
                                Upcoming
                              </span>
                            )}
                            {status.isExpired && (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md border border-gray-100">
                                Expired
                              </span>
                            )}
                            {!status.isExpired && !status.isUpcoming && (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1 animate-pulse">
                                Live Now
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-[13px] font-bold text-gray-500">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {meeting.time}</span>
                            <span className="flex items-center gap-1.5"><Users size={14} /> {meeting.attendees.length} Attendees</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {status.canJoin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onJoin(meeting.roomId);
                            }}
                            className="px-5 py-2.5 bg-[#0061AA] text-white text-[13px] font-bold rounded-xl hover:bg-[#004d8a] transition-all flex items-center gap-2 shadow-sm shadow-blue-900/10 active:scale-95"
                          >
                            Join Call <ArrowRight size={14} />
                          </button>
                        )}
                        
                        {status.isUpcoming && (
                          <span className="text-[13px] font-black text-blue-600 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100/50">
                            Starts {meeting.time}
                          </span>
                        )}

                        {status.isExpired && (
                          <span className="text-[13px] font-black text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Details & Host Controls Panel Card (Full Widescreen width below calendar grid!) */}
      {selectedMeeting ? (() => {
        const status = getMeetingStatus(selectedMeeting);
        return (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-6 flex-wrap gap-4">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-[22px] font-black text-gray-900 tracking-tight leading-tight">
                  {selectedMeeting.title}
                </h2>
                <div className="flex items-center gap-4 text-[13px] font-bold text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedMeeting.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedMeeting.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {isHost && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to cancel and delete this meeting?")) {
                        if (onDeleteMeeting) onDeleteMeeting(selectedMeeting.id);
                      }
                    }}
                    className="px-6 py-3.5 bg-rose-50 text-rose-600 border border-rose-100/50 text-[13px] font-bold rounded-xl hover:bg-rose-100 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                  >
                    Cancel Meeting
                  </button>
                )}
                {status.canJoin && (
                  <button
                    onClick={() => onJoin(selectedMeeting.roomId)}
                    className="px-8 py-3.5 bg-[#0061AA] text-white text-[13px] font-bold rounded-xl hover:bg-[#004d8a] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95 shrink-0"
                  >
                    Join Call <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Main Body Grid (2/3 width Host Controls, 1/3 width invite link & attendance directory) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column (Span 3): Host Control Matrix */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Host Control Matrix
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Audio Lock */}
                  <button
                    onClick={() => toggleControl('isMutedAll')}
                    disabled={!isHost}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left shadow-sm ${
                      !isHost
                        ? "bg-gray-50/60 border-gray-150 text-gray-400 cursor-not-allowed opacity-75"
                        : isMutedAll 
                          ? "bg-red-50/50 border-red-100 text-red-700 font-bold hover:bg-red-50" 
                          : "bg-white border-gray-100 hover:border-gray-200 text-gray-800"
                    }`}
                    title={!isHost ? "Mute Control (Host Only)" : "Toggle Audio Lock"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !isHost ? "bg-gray-100 text-gray-450" : isMutedAll ? "bg-red-100 text-red-600" : "bg-gray-50 text-gray-500"
                    }`}>
                      {isMutedAll ? <MicOff size={18} /> : <Mic size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black tracking-tight leading-none mb-1 truncate">
                        {isMutedAll ? "Audio Locked" : "Mute Everyone"}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 leading-none truncate mt-0.5">
                        {!isHost ? "Mute lock (host only)" : isMutedAll ? "All lines are muted" : "Lock attendee microphones"}
                      </p>
                    </div>
                  </button>

                  {/* Video Lock */}
                  <button
                    onClick={() => toggleControl('isCamDisabled')}
                    disabled={!isHost}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left shadow-sm ${
                      !isHost
                        ? "bg-gray-50/60 border-gray-150 text-gray-400 cursor-not-allowed opacity-75"
                        : isCamDisabled 
                          ? "bg-red-50/50 border-red-100 text-red-700 font-bold hover:bg-red-50" 
                          : "bg-white border-gray-100 hover:border-gray-200 text-gray-800"
                    }`}
                    title={!isHost ? "Camera Control (Host Only)" : "Toggle Video Lock"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !isHost ? "bg-gray-100 text-gray-450" : isCamDisabled ? "bg-red-100 text-red-600" : "bg-gray-50 text-gray-500"
                    }`}>
                      {isCamDisabled ? <VideoOff size={18} /> : <Video size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black tracking-tight leading-none mb-1 truncate">
                        {isCamDisabled ? "Video Locked" : "Block Cameras"}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 leading-none truncate mt-0.5">
                        {!isHost ? "Camera lock (host only)" : isCamDisabled ? "Attendee feeds disabled" : "Lock attendee video feeds"}
                      </p>
                    </div>
                  </button>

                  {/* Access Control */}
                  <button
                    onClick={() => toggleControl('isLocked')}
                    disabled={!isHost}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left shadow-sm ${
                      !isHost
                        ? "bg-gray-50/60 border-gray-150 text-gray-400 cursor-not-allowed opacity-75"
                        : isRoomLocked 
                          ? "bg-amber-50/50 border-amber-100 text-amber-800 font-bold hover:bg-amber-50" 
                          : "bg-white border-gray-100 hover:border-gray-200 text-gray-800"
                    }`}
                    title={!isHost ? "Access Control (Host Only)" : "Toggle Access Lock"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !isHost ? "bg-gray-100 text-gray-450" : isRoomLocked ? "bg-amber-100 text-amber-600" : "bg-gray-50 text-gray-500"
                    }`}>
                      {isRoomLocked ? <Lock size={18} /> : <Unlock size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black tracking-tight leading-none mb-1 truncate">
                        {isRoomLocked ? "Room Secured" : "Lock Meeting"}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 leading-none truncate mt-0.5">
                        {!isHost ? "Meeting lock (host only)" : isRoomLocked ? "No new entries allowed" : "Prevent new participants"}
                      </p>
                    </div>
                  </button>

                  {/* Cloud Recording */}
                  <button
                    onClick={() => toggleControl('isRecording')}
                    disabled={!isHost}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left shadow-sm ${
                      !isHost
                        ? "bg-gray-50/60 border-gray-150 text-gray-400 cursor-not-allowed opacity-75"
                        : isRecording 
                          ? "bg-blue-50/50 border-blue-100 text-[#0061AA] font-bold hover:bg-blue-50" 
                          : "bg-white border-gray-100 hover:border-gray-200 text-gray-800"
                    }`}
                    title={!isHost ? "Recording Control (Host Only)" : "Toggle Recording"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !isHost ? "bg-gray-100 text-gray-450" : isRecording ? "bg-blue-100 text-[#0061AA]" : "bg-gray-50 text-gray-500"
                    }`}>
                      {isRecording ? (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></span>
                          <span className="relative w-2.5 h-2.5 rounded-full bg-red-600"></span>
                        </div>
                      ) : (
                        <Disc size={18} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black tracking-tight leading-none mb-1 truncate">
                        {isRecording ? "Recording Live" : "Record Session"}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 leading-none truncate mt-0.5">
                        {!isHost ? "Recording (host only)" : isRecording ? "Archiving telemetry & calls" : "Enable cloud video archives"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column (Span 2): Roster & Quick Share Invite */}
              <div className="lg:col-span-2 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                {/* Share Link */}
                <div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Attendee Invitation Link
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}?room=${selectedMeeting.roomId}`}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-mono font-bold text-gray-600 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}?room=${selectedMeeting.roomId}`;
                        navigator.clipboard.writeText(link);
                        setJustCopied(true);
                        setTimeout(() => setJustCopied(false), 2000);
                      }}
                      className="px-4 bg-[#0061AA] text-white hover:bg-[#004d8a] rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                    >
                      {justCopied ? <Check size={14} /> : <Link2 size={14} />}
                      {justCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Attendee Directory */}
                <div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>Attendee Directory</span>
                    <span className="text-[11px] font-bold text-[#0061AA] bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-100/50">
                      {selectedMeeting.attendees.length + 1} Cleared
                    </span>
                  </h4>
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {/* Host */}
                    <div className="flex items-center justify-between p-3 bg-gray-50/40 rounded-xl border border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0061AA] font-black text-[12px] flex items-center justify-center border border-blue-100 shrink-0">
                          {selectedMeeting.hostName 
                            ? selectedMeeting.hostName.split(' ').map(n => n[0]).join('').toUpperCase() 
                            : (user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "SH")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-black text-gray-800 leading-none mb-1 truncate">
                            {selectedMeeting.hostName || user?.fullName || "Sarah Henderson"}
                          </p>
                          <p className="text-[10px] font-bold text-[#0061AA] leading-none uppercase tracking-wider truncate">
                            {selectedMeeting.hostEmail || user?.email || "Organizer (Host)"}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                        Active
                      </span>
                    </div>

                    {/* Other attendees */}
                    {selectedMeeting.attendees.map((email, idx) => {
                      const initial = email.split('@')[0].substring(0, 2).toUpperCase();
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 font-black text-[12px] flex items-center justify-center border border-gray-100 shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold text-gray-700 leading-none mb-1 truncate">
                                {email}
                              </p>
                              <p className="text-[10px] font-medium text-gray-400 leading-none uppercase tracking-wider truncate">
                                Invited Clear
                              </p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 shrink-0">
                            Offline
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })() : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center min-h-[300px] text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0061AA] flex items-center justify-center mb-5 border border-blue-100/50">
            <Video size={28} />
          </div>
          <h3 className="text-[17px] font-black text-gray-900 mb-1.5 tracking-tight">
            No Active Selection
          </h3>
          <p className="text-[13px] text-gray-500 font-bold max-w-md leading-relaxed">
            Select a scheduled huddle from the timeline above to access active host controls, session recordings, copy guest invites, and attendee directory lists.
          </p>
        </div>
      )}

      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={(data) => {
            onSchedule(data);
            setSelectedDateStr(data.date);
            const [y, m, d] = data.date.split('-');
            setCurrentDate(new Date(y, m - 1, 1));
            setShowScheduleModal(false);
          }}
        />
      )}
    </div>
  );
};

