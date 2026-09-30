'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  Eye,
  UserCheck,
  Building2,
  CalendarDays,
  X
} from 'lucide-react';

// Data Interfaces
export interface FacultyClassEvent {
  id: string;
  facultyId: string;
  facultyName: string;
  courseCode: string;
  courseName: string;
  sectionName: string; // e.g. "CSE-A", "CSE-B", "CSE-C", "CSE-AI"
  classType: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR' | 'PROJECT' | 'EXAM' | 'OTHER';
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  dayIndex: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  displayTime: string; // "09:00 AM – 10:30 AM"
  roomName: string;  // "Room 302", "DBMS Lab 1"
  studentCount: number;
  status?: 'REGULAR' | 'TIME_CHANGED' | 'ROOM_CHANGED' | 'CANCELLED' | 'SUBSTITUTION';
  notes?: string;
  specificDate?: string; // YYYY-MM-DD for date-specific overrides
}

export interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  section: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
}

// Demo Faculty Schedule Data (Prompt Rule #31: Dr. S. Rao schedule)
const DEMO_TEACHING_SCHEDULE: FacultyClassEvent[] = [
  {
    id: 'evt_1',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-301',
    courseName: 'Database Management Systems',
    sectionName: 'CSE-A',
    classType: 'LECTURE',
    dayOfWeek: 'MONDAY',
    dayIndex: 1,
    startTime: '09:00',
    endTime: '10:30',
    displayTime: '09:00 AM – 10:30 AM',
    roomName: 'Room 302',
    studentCount: 58,
    status: 'REGULAR',
  },
  {
    id: 'evt_2',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-301',
    courseName: 'Database Management Systems',
    sectionName: 'CSE-B',
    classType: 'LECTURE',
    dayOfWeek: 'TUESDAY',
    dayIndex: 2,
    startTime: '11:00',
    endTime: '12:30',
    displayTime: '11:00 AM – 12:30 PM',
    roomName: 'Room 304',
    studentCount: 55,
    status: 'REGULAR',
  },
  {
    id: 'evt_3',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-401',
    courseName: 'Operating Systems',
    sectionName: 'CSE-C',
    classType: 'LECTURE',
    dayOfWeek: 'WEDNESDAY',
    dayIndex: 3,
    startTime: '11:00',
    endTime: '12:30',
    displayTime: '11:00 AM – 12:30 PM',
    roomName: 'Room 204',
    studentCount: 60,
    status: 'REGULAR',
  },
  {
    id: 'evt_4',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-301',
    courseName: 'Database Management Systems',
    sectionName: 'CSE-C',
    classType: 'LECTURE',
    dayOfWeek: 'THURSDAY',
    dayIndex: 4,
    startTime: '14:00',
    endTime: '15:30',
    displayTime: '02:00 PM – 03:30 PM',
    roomName: 'Room 305',
    studentCount: 52,
    status: 'REGULAR',
  },
  {
    id: 'evt_5',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-301L',
    courseName: 'DBMS Laboratory',
    sectionName: 'CSE-A',
    classType: 'LAB',
    dayOfWeek: 'FRIDAY',
    dayIndex: 5,
    startTime: '09:00',
    endTime: '12:00',
    displayTime: '09:00 AM – 12:00 PM',
    roomName: 'DBMS Lab 1',
    studentCount: 30,
    status: 'REGULAR',
  },
  {
    id: 'evt_6',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-301L',
    courseName: 'DBMS Laboratory',
    sectionName: 'CSE-B',
    classType: 'LAB',
    dayOfWeek: 'FRIDAY',
    dayIndex: 5,
    startTime: '14:00',
    endTime: '17:00',
    displayTime: '02:00 PM – 05:00 PM',
    roomName: 'DBMS Lab 1',
    studentCount: 28,
    status: 'REGULAR',
  },
  {
    id: 'evt_7',
    facultyId: 'fac_1',
    facultyName: 'Dr. S. Rao',
    courseCode: 'CSE-490',
    courseName: 'AI Capstone Mentoring',
    sectionName: 'CSE-AI',
    classType: 'PROJECT',
    dayOfWeek: 'SATURDAY',
    dayIndex: 6,
    startTime: '10:00',
    endTime: '13:00',
    displayTime: '10:00 AM – 01:00 PM',
    roomName: 'Innovation Lab',
    studentCount: 35,
    status: 'REGULAR',
  },
];

// Sample Student Rosters per Section
const MOCK_SECTION_ROSTERS: Record<string, StudentRosterItem[]> = {
  'CSE-A': [
    { id: 'st_1', name: 'Aryan Reddy', rollNo: '2023CSE001', section: 'CSE-A', attendanceStatus: 'PRESENT' },
    { id: 'st_2', name: 'Sneha Patel', rollNo: '2023CSE004', section: 'CSE-A', attendanceStatus: 'PRESENT' },
    { id: 'st_3', name: 'Vikram Singh', rollNo: '2023CSE012', section: 'CSE-A', attendanceStatus: 'ABSENT' },
    { id: 'st_4', name: 'Ananya Sharma', rollNo: '2023CSE018', section: 'CSE-A', attendanceStatus: 'PRESENT' },
    { id: 'st_5', name: 'Rahul Verma', rollNo: '2023CSE025', section: 'CSE-A', attendanceStatus: 'PRESENT' },
    { id: 'st_6', name: 'Divya Nair', rollNo: '2023CSE031', section: 'CSE-A', attendanceStatus: 'PRESENT' },
  ],
  'CSE-B': [
    { id: 'st_7', name: 'Rohan Mehta', rollNo: '2023CSE045', section: 'CSE-B', attendanceStatus: 'PRESENT' },
    { id: 'st_8', name: 'Karthik Joshi', rollNo: '2023CSE048', section: 'CSE-B', attendanceStatus: 'PRESENT' },
    { id: 'st_9', name: 'Pooja Gupta', rollNo: '2023CSE052', section: 'CSE-B', attendanceStatus: 'ABSENT' },
    { id: 'st_10', name: 'Amit Kumar', rollNo: '2023CSE060', section: 'CSE-B', attendanceStatus: 'PRESENT' },
  ],
  'CSE-C': [
    { id: 'st_11', name: 'Siddharth Rao', rollNo: '2023CSE075', section: 'CSE-C', attendanceStatus: 'PRESENT' },
    { id: 'st_12', name: 'Meera Deshmukh', rollNo: '2023CSE080', section: 'CSE-C', attendanceStatus: 'PRESENT' },
    { id: 'st_13', name: 'Nikhil Agarwal', rollNo: '2023CSE088', section: 'CSE-C', attendanceStatus: 'PRESENT' },
  ],
  'CSE-AI': [
    { id: 'st_14', name: 'Tarun Saxena', rollNo: '2023AI005', section: 'CSE-AI', attendanceStatus: 'PRESENT' },
    { id: 'st_15', name: 'Riya Sen', rollNo: '2023AI012', section: 'CSE-AI', attendanceStatus: 'PRESENT' },
  ],
};

export default function FacultyClassesPage() {
  const { currentUser } = useResora();

  // Navigation Date State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedClassEvent, setSelectedClassEvent] = useState<FacultyClassEvent | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'roster' | 'attendance'>('details');

  // Attendance state for modal
  const [localRoster, setLocalRoster] = useState<StudentRosterItem[]>([]);

  // Compute Monday of the current selected week
  const mondayOfSelectedWeek = useMemo(() => {
    const d = new Date(selectedDate);
    const day = d.getDay(); // 0 = Sun, 1 = Mon...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, [selectedDate]);

  // Compute 7 days of the selected week (Mon - Sun)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(mondayOfSelectedWeek);
      nextDay.setDate(mondayOfSelectedWeek.getDate() + i);
      days.push(nextDay);
    }
    return days;
  }, [mondayOfSelectedWeek]);

  // Format week date header range (e.g. "Sep 28 – Oct 4, 2026")
  const weekRangeText = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    const firstMonth = first.toLocaleDateString('en-US', { month: 'short' });
    const lastMonth = last.toLocaleDateString('en-US', { month: 'short' });
    const year = last.getFullYear();

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${first.getDate()} – ${last.getDate()}, ${year}`;
    }
    return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${year}`;
  }, [weekDays]);

  // Week navigation handlers
  const handlePrevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(d);
  };

  const handleGoToday = () => {
    setSelectedDate(new Date());
  };

  // Determine current day of week index (1 = Mon ... 7 = Sun)
  const todayDayIndex = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  }, []);

  // Determine current time string "HH:MM"
  const currentTimeStr = useMemo(() => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  }, []);

  // Live Class Calculation (Section 9)
  const liveClass = useMemo(() => {
    return DEMO_TEACHING_SCHEDULE.find(evt => {
      if (evt.dayIndex !== todayDayIndex) return false;
      return currentTimeStr >= evt.startTime && currentTimeStr < evt.endTime;
    });
  }, [todayDayIndex, currentTimeStr]);

  // Next Class Calculation (Section 8)
  const nextClass = useMemo(() => {
    if (liveClass) return null; // If live class is on, next class is following one

    // First try to find upcoming class today
    const todayUpcoming = DEMO_TEACHING_SCHEDULE.filter(
      evt => evt.dayIndex === todayDayIndex && evt.startTime > currentTimeStr
    ).sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

    if (todayUpcoming) return todayUpcoming;

    // Otherwise find first class of upcoming days
    const futureClasses = DEMO_TEACHING_SCHEDULE.filter(
      evt => evt.dayIndex > todayDayIndex
    ).sort((a, b) => a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime));

    if (futureClasses.length > 0) return futureClasses[0];

    // Fallback to first class of the week
    return DEMO_TEACHING_SCHEDULE[0];
  }, [todayDayIndex, currentTimeStr, liveClass]);

  // Today's Schedule List (Section 10)
  const todayClassesList = useMemo(() => {
    return DEMO_TEACHING_SCHEDULE.filter(evt => evt.dayIndex === todayDayIndex).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [todayDayIndex]);

  // Weekly Stats Calculation (Section 11)
  const weeklyStats = useMemo(() => {
    const totalClasses = DEMO_TEACHING_SCHEDULE.length;
    let totalMins = 0;
    const sectionsSet = new Set<string>();
    let labCount = 0;

    DEMO_TEACHING_SCHEDULE.forEach(evt => {
      sectionsSet.add(evt.sectionName);
      if (evt.classType === 'LAB') labCount++;

      const [startH, startM] = evt.startTime.split(':').map(Number);
      const [endH, endM] = evt.endTime.split(':').map(Number);
      totalMins += endH * 60 + endM - (startH * 60 + startM);
    });

    const hours = (totalMins / 60).toFixed(1);

    return {
      classesCount: totalClasses,
      hoursCount: hours,
      sectionsCount: sectionsSet.size,
      labsCount: labCount,
    };
  }, []);

  // Open Details Modal for Class
  const handleOpenClassDetails = (evt: FacultyClassEvent) => {
    setSelectedClassEvent(evt);
    setActiveModalTab('details');
    const roster = MOCK_SECTION_ROSTERS[evt.sectionName] || MOCK_SECTION_ROSTERS['CSE-A'];
    setLocalRoster(roster);
  };

  // Toggle Student Attendance
  const toggleAttendance = (stId: string) => {
    setLocalRoster(prev =>
      prev.map(st => {
        if (st.id === stId) {
          const nextStatus =
            st.attendanceStatus === 'PRESENT'
              ? 'ABSENT'
              : st.attendanceStatus === 'ABSENT'
              ? 'LATE'
              : 'PRESENT';
          return { ...st, attendanceStatus: nextStatus };
        }
        return st;
      })
    );
  };

  // Time Slot Rows for Timetable Grid
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const dayLabels = [
    { label: 'MON', index: 1 },
    { label: 'TUE', index: 2 },
    { label: 'WED', index: 3 },
    { label: 'THU', index: 4 },
    { label: 'FRI', index: 5 },
    { label: 'SAT', index: 6 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* ==================================================
              1. PAGE HEADER & SUBTITLE (Section 1)
             ================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                <span>Academic Schedule</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
                My Teaching Schedule
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                View your weekly classes, labs, sections, timings and assigned rooms.
              </p>
            </div>

            {/* View Mode Toggle & Quick Jump */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'week'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Week View
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'day'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Day View
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              2. WEEK NAVIGATION CONTROLS (Section 2)
             ================================================== */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevWeek}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Week</span>
              </button>

              <button
                onClick={handleGoToday}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
              >
                Today
              </button>

              <button
                onClick={handleNextWeek}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Next Week</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-extrabold text-slate-900 font-heading bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/70">
              {weekRangeText}
            </div>
          </div>

          {/* ==================================================
              3. LIVE NOW & NEXT CLASS HIGHLIGHT CARDS (Section 8 & 9)
             ================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LIVE NOW CARD */}
            {liveClass ? (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE NOW</span>
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold">
                    <span>{liveClass.courseCode}</span>
                    <span>·</span>
                    <span>Section {liveClass.sectionName}</span>
                  </div>

                  <h3 className="text-xl font-black font-heading text-white">
                    {liveClass.courseName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 font-medium">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-emerald-200" />
                      {liveClass.displayTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <MapPin className="w-4 h-4 text-emerald-200" />
                      {liveClass.roomName}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Users className="w-4 h-4 text-emerald-200" />
                      {liveClass.studentCount} Students
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-500/50 flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-medium">Ongoing session</span>
                  <button
                    onClick={() => handleOpenClassDetails(liveClass)}
                    className="px-4 py-2 bg-white text-emerald-900 font-extrabold rounded-xl text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    Take Attendance Now
                  </button>
                </div>
              </div>
            ) : null}

            {/* NEXT CLASS CARD */}
            {nextClass ? (
              <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>NEXT CLASS</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-brand-500/30 text-brand-300 border border-brand-400/30 px-2.5 py-0.5 rounded">
                      {nextClass.courseCode}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      Section {nextClass.sectionName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      {nextClass.classType}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold font-heading text-white">
                    {nextClass.courseName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <Clock className="w-4 h-4 text-brand-400" />
                      {nextClass.dayOfWeek} · {nextClass.displayTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <MapPin className="w-4 h-4 text-brand-400" />
                      {nextClass.roomName}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Users className="w-4 h-4 text-slate-400" />
                      {nextClass.studentCount} Enrolled
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Assigned to Dr. S. Rao</span>
                  <button
                    onClick={() => handleOpenClassDetails(nextClass)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                  >
                    View Class Details →
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* ==================================================
              4. TODAY'S SCHEDULE & TEACHING SUMMARY (Section 10 & 11)
             ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TODAY'S COMPACT SCHEDULE (Section 10) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    Today&apos;s Schedule
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {todayClassesList.length} Classes Today
                </span>
              </div>

              {todayClassesList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No classes scheduled for today. Enjoy your research time!
                </div>
              ) : (
                <div className="space-y-3">
                  {todayClassesList.map(cls => {
                    const isLab = cls.classType === 'LAB';
                    return (
                      <div
                        key={cls.id}
                        onClick={() => handleOpenClassDetails(cls)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 hover:shadow-md ${
                          isLab
                            ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                            : 'bg-slate-50/70 border-slate-200/80 hover:border-brand-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-24 shrink-0 font-bold text-slate-900 text-xs bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-center">
                            {cls.startTime} – {cls.endTime}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-slate-900 text-sm">{cls.courseName}</h4>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-brand-600 text-white rounded-md">
                                {cls.sectionName}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>Code: <strong>{cls.courseCode}</strong></span>
                              <span>·</span>
                              <span className="font-medium text-slate-700">{cls.studentCount} Students</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {cls.roomName}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl uppercase tracking-wider border ${
                            isLab ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}>
                            {cls.classType}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* TEACHING SUMMARY STATS (Section 11) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 font-heading">
                  Teaching Summary
                </h3>

                <div className="space-y-4 pt-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      TODAY&apos;S WORKLOAD
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Classes Today</span>
                        <span className="text-lg font-extrabold text-slate-900">{todayClassesList.length}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Sections Today</span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {new Set(todayClassesList.map(c => c.sectionName)).size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100 space-y-2">
                    <span className="text-[10px] font-extrabold text-brand-700 uppercase tracking-wider block">
                      THIS WEEK (OCT 2026)
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Weekly Classes</span>
                        <span className="text-xl font-black text-brand-900">{weeklyStats.classesCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Teaching Hours</span>
                        <span className="text-xl font-black text-emerald-700">{weeklyStats.hoursCount} hrs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Assigned Sections</span>
                        <span className="text-base font-extrabold text-slate-900">{weeklyStats.sectionsCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Lab Sessions</span>
                        <span className="text-base font-extrabold text-purple-700">{weeklyStats.labsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium text-center pt-2">
                Faculty ID: Dr. S. Rao · Dept of CSE
              </div>
            </div>
          </div>

          {/* ==================================================
              5. WEEKLY TIMETABLE SCHEDULE BOARD (Section 6 & 7 & 12 & 13)
             ================================================== */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                  Weekly Teaching Timetable
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive weekly schedule board for Dr. S. Rao · CSE Department
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold mr-2">
                  <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Lecture
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Lab Session
                  </span>
                  <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    Project
                  </span>
                </div>
              </div>
            </div>

            {/* DAY BOARD COLUMNS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {dayLabels.map((day, idx) => {
                const dayClasses = DEMO_TEACHING_SCHEDULE.filter(evt => evt.dayIndex === day.index).sort(
                  (a, b) => a.startTime.localeCompare(b.startTime)
                );
                const isToday = day.index === todayDayIndex;
                const dayDateStr = weekDays[day.index - 1]?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={day.index}
                    className={`flex flex-col rounded-3xl border transition-all ${
                      isToday
                        ? 'bg-gradient-to-b from-emerald-50/70 via-slate-50/50 to-slate-50 border-emerald-300 ring-2 ring-emerald-400/20 shadow-md'
                        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Day Column Header */}
                    <div
                      className={`p-3.5 border-b rounded-t-3xl flex items-center justify-between ${
                        isToday
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100/90 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black tracking-wider block font-heading">
                          {day.label}
                        </span>
                        <span
                          className={`text-[11px] font-semibold ${
                            isToday ? 'text-emerald-100' : 'text-slate-500'
                          }`}
                        >
                          {dayDateStr}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isToday
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {dayClasses.length} {dayClasses.length === 1 ? 'Class' : 'Classes'}
                      </span>
                    </div>

                    {/* Classes List inside Day Column */}
                    <div className="p-3 space-y-3 flex-1 min-h-[220px]">
                      {dayClasses.length === 0 ? (
                        <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs rounded-2xl border border-dashed border-slate-200/80 bg-white/50">
                          <span className="font-semibold text-slate-400">No Classes</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Free Schedule</span>
                        </div>
                      ) : (
                        dayClasses.map(evt => {
                          const isLab = evt.classType === 'LAB';
                          const isProject = evt.classType === 'PROJECT';

                          return (
                            <div
                              key={evt.id}
                              onClick={() => handleOpenClassDetails(evt)}
                              className={`p-3.5 rounded-2xl border shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer space-y-2.5 group bg-white ${
                                isLab
                                  ? 'border-emerald-200/90 hover:border-emerald-400'
                                  : isProject
                                  ? 'border-purple-200/90 hover:border-purple-400'
                                  : 'border-blue-200/90 hover:border-blue-400'
                              }`}
                            >
                              {/* Top Bar: Section Badge & Course Code */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900 text-white shadow-2xs">
                                  {evt.sectionName}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                                  {evt.courseCode}
                                </span>
                              </div>

                              {/* Course Title */}
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                                  {evt.courseName}
                                </h4>
                                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                                  {evt.displayTime}
                                </span>
                              </div>

                              {/* Bottom Details Bar */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600">
                                <span className="flex items-center gap-1 text-slate-700 truncate max-w-[90px]">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{evt.roomName}</span>
                                </span>

                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  isLab
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isProject
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {evt.classType}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* ==================================================
          CLASS DETAILS & SECTION ROSTER MODAL (Section 23 & 24)
         ================================================== */}
      {selectedClassEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold bg-brand-500/30 text-brand-300 border border-brand-400/30 px-2.5 py-0.5 rounded">
                    {selectedClassEvent.courseCode}
                  </span>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                    Section {selectedClassEvent.sectionName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">
                    {selectedClassEvent.classType}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white font-heading">
                  {selectedClassEvent.courseName}
                </h2>
              </div>

              <button
                onClick={() => setSelectedClassEvent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-200 px-6 pt-3 bg-slate-50">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeModalTab === 'details'
                    ? 'border-brand-600 text-brand-600 font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Class Details
              </button>
              <button
                onClick={() => setActiveModalTab('roster')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeModalTab === 'roster'
                    ? 'border-brand-600 text-brand-600 font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Section Roster ({selectedClassEvent.studentCount})
              </button>
              <button
                onClick={() => setActiveModalTab('attendance')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeModalTab === 'attendance'
                    ? 'border-brand-600 text-brand-600 font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Take Attendance
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6">
              {/* TAB 1: DETAILS */}
              {activeModalTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Schedule & Timing</span>
                      <span className="font-extrabold text-slate-900 mt-1 block">
                        {selectedClassEvent.dayOfWeek} · {selectedClassEvent.displayTime}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Location / Room</span>
                      <span className="font-extrabold text-emerald-700 mt-1 block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedClassEvent.roomName}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Section & Strength</span>
                      <span className="font-extrabold text-slate-900 mt-1 block">
                        Section {selectedClassEvent.sectionName} ({selectedClassEvent.studentCount} Students)
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Faculty Instructor</span>
                      <span className="font-extrabold text-slate-900 mt-1 block">
                        {selectedClassEvent.facultyName} (CSE Dept)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <span className="font-bold block">✓ Resource Verification</span>
                    <p className="text-[11px] opacity-90">
                      {selectedClassEvent.roomName} is reserved in RESORA Campus Network for this scheduled session. No room conflicts detected.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ROSTER */}
              {activeModalTab === 'roster' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Students Enrolled in {selectedClassEvent.sectionName}</span>
                    <span className="text-slate-500">{localRoster.length} Total</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {localRoster.map((st, i) => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 font-bold text-[10px] flex items-center justify-center text-slate-700">
                            {i + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900">{st.name}</h4>
                            <p className="text-[10px] text-slate-500">Roll No: {st.rollNo}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          st.attendanceStatus === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : st.attendanceStatus === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {st.attendanceStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ATTENDANCE */}
              {activeModalTab === 'attendance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Mark Attendance for {selectedClassEvent.courseCode} ({selectedClassEvent.sectionName})
                    </span>
                    <span className="text-slate-500 text-[11px]">Click status badge to toggle</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {localRoster.map(st => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900">{st.name}</h4>
                          <p className="text-[10px] text-slate-500">{st.rollNo}</p>
                        </div>

                        <button
                          onClick={() => toggleAttendance(st.id)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all shadow-2xs ${
                            st.attendanceStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white'
                              : st.attendanceStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {st.attendanceStatus}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      alert(`Attendance saved for Section ${selectedClassEvent.sectionName}!`);
                      setSelectedClassEvent(null);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                  >
                    Save & Submit Attendance Sheet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

