'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import {
  Target,
  Briefcase,
  BookOpen,
  Code,
  Terminal,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Search,
  Award,
  Sparkles,
  BarChart2,
  X,
  Play,
  Zap,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Calendar,
  FileText,
  CheckSquare,
  RotateCcw,
  HelpCircle,
  Send,
  Check,
  ChevronRight,
  Filter,
  Bookmark,
  Flame,
  UserCheck,
  Layers,
  GraduationCap,
  Globe,
  Cpu,
  ShieldCheck,
  BrainCircuit,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solved: boolean;
  acceptance: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  solutionHint: string;
}

interface AptitudeTopic {
  id: string;
  title: string;
  category: 'Quantitative' | 'Logical' | 'Verbal' | 'Data Interpretation';
  progress: number;
  formula: string;
  sampleQuestion: string;
  sampleOptions: string[];
  correctOptionIndex: number;
}

interface UserExamTarget {
  id: string;
  name: string;
  type: 'SEMESTER' | 'COMPETITIVE';
  subject: string;
  examDate: string;
  targetScore: number;
  currentProgress: number;
}

interface StudyPlannerTask {
  id: string;
  subject: string;
  topic: string;
  scheduledTime: string;
  completed: boolean;
}

function PreparationContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Top-level Navigation Mode: 'PLACEMENT' vs 'EXAM'
  const [activeMainSection, setActiveMainSection] = useState<'PLACEMENT' | 'EXAM'>('PLACEMENT');

  useEffect(() => {
    if (tabParam === 'exam') {
      setActiveMainSection('EXAM');
    } else if (tabParam === 'placement') {
      setActiveMainSection('PLACEMENT');
    }
  }, [tabParam]);

  // Sub-navigation inside PLACEMENT PREPARATION
  const [placementSubNav, setPlacementSubNav] = useState<
    'OVERVIEW' | 'CODING' | 'APTITUDE' | 'CORE_CS' | 'INTERVIEW' | 'COMPANY_ROLE'
  >('OVERVIEW');

  // Sub-navigation inside EXAM PREPARATION
  const [examSubNav, setExamSubNav] = useState<
    'MY_EXAMS' | 'COMPETITIVE' | 'SYLLABUS' | 'PLANNER' | 'PYQ' | 'MOCK_ENGINE' | 'REVISION'
  >('MY_EXAMS');

  // State
  const [problemFilterDifficulty, setProblemFilterDifficulty] = useState<string>('ALL');
  const [selectedCodingProblem, setSelectedCodingProblem] = useState<CodingProblem | null>(null);
  const [showSolutionHint, setShowSolutionHint] = useState(false);
  const [codingSolutionCode, setCodingSolutionCode] = useState('');
  const [codingTestResult, setCodingTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const [selectedRoleTrack, setSelectedRoleTrack] = useState('Software Developer');

  const [userExamTargets, setUserExamTargets] = useState<UserExamTarget[]>([
    {
      id: 'ex-1',
      name: 'DBMS End-Sem Exam',
      type: 'SEMESTER',
      subject: 'Database Systems',
      examDate: '2026-10-18',
      targetScore: 90,
      currentProgress: 76,
    },
    {
      id: 'ex-2',
      name: 'GATE Computer Science 2027',
      type: 'COMPETITIVE',
      subject: 'Full GATE Syllabus',
      examDate: '2027-02-07',
      targetScore: 82,
      currentProgress: 68,
    },
    {
      id: 'ex-3',
      name: 'CAT 2026 Management Entrance',
      type: 'COMPETITIVE',
      subject: 'Quant, DILR, Verbal',
      examDate: '2026-11-29',
      targetScore: 98,
      currentProgress: 72,
    },
  ]);

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamTargetScore, setNewExamTargetScore] = useState(90);

  const [plannerTasks, setPlannerTasks] = useState<StudyPlannerTask[]>([
    {
      id: 'tsk-101',
      subject: 'DBMS',
      topic: 'B+ Tree Indexing & 3NF Normalization',
      scheduledTime: '04:30 PM',
      completed: false,
    },
    {
      id: 'tsk-102',
      subject: 'DSA',
      topic: 'Dynamic Programming - 0/1 Knapsack & Subset Sum',
      scheduledTime: '07:00 PM',
      completed: false,
    },
    {
      id: 'tsk-103',
      subject: 'OS',
      topic: 'Virtual Memory & Page Replacement Algorithms (LRU, FIFO)',
      scheduledTime: '09:00 PM',
      completed: true,
    },
  ]);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('06:00 PM');

  const [activeTimedQuiz, setActiveTimedQuiz] = useState<{
    title: string;
    questions: { q: string; options: string[]; answerIndex: number }[];
    currentQIndex: number;
    selectedOption: number | null;
    score: number;
    isSubmitted: boolean;
  } | null>(null);

  const [assistantInput, setAssistantInput] = useState('');
  const [assistantChatHistory, setAssistantChatHistory] = useState<
    { sender: 'USER' | 'BOT'; text: string }[]
  >([
    {
      sender: 'BOT',
      text: 'Welcome to your Smart Study Assistant! Ask me to build a 7-day GATE roadmap, generate DSA practice problems, explain DBMS concepts, or summarize your weak areas.',
    },
  ]);

  const codingProblems: CodingProblem[] = [
    {
      id: 'p1',
      title: 'Two Sum II - Input Array Is Sorted',
      difficulty: 'Easy',
      category: 'Arrays & Two Pointers',
      solved: true,
      acceptance: '61.4%',
      description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
      sampleInput: 'numbers = [2,7,11,15], target = 9',
      sampleOutput: '[1,2]',
      solutionHint: 'Use two pointers starting at opposite ends (left=0, right=n-1). If sum > target, move right--; if sum < target, move left++.',
    },
    {
      id: 'p2',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings & Sliding Window',
      solved: true,
      acceptance: '34.8%',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      sampleInput: 's = "abcabcbb"',
      sampleOutput: '3',
      solutionHint: 'Use a sliding window with a HashMap tracking character indices. Expand right pointer and shrink left when repeat detected.',
    },
    {
      id: 'p3',
      title: 'Course Schedule II (Topological Sort)',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      solved: false,
      acceptance: '49.2%',
      description: 'Return the ordering of courses you should take to finish all courses. If impossible, return empty array.',
      sampleInput: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      sampleOutput: '[0,1,2,3]',
      solutionHint: 'Use Kahns algorithm with indegree array and queue, or DFS with visited states (0=unvisited, 1=visiting, 2=visited).',
    },
    {
      id: 'p4',
      title: 'Coin Change (Min Coins DP)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      solved: false,
      acceptance: '43.1%',
      description: 'Return the fewest number of coins that you need to make up amount. If amount cannot be made, return -1.',
      sampleInput: 'coins = [1,2,5], amount = 11',
      sampleOutput: '3 (5 + 5 + 1)',
      solutionHint: 'Build a DP table dp[i] storing minimum coins needed for amount i. Recurrence: dp[i] = min(dp[i], 1 + dp[i - coin]).',
    },
    {
      id: 'p5',
      title: 'LRU Cache Design',
      difficulty: 'Hard',
      category: 'Data Structures Design',
      solved: false,
      acceptance: '42.6%',
      description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.',
      sampleInput: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);',
      sampleOutput: 'get(1) -> 1, get(2) -> -1',
      solutionHint: 'Combine a HashMap (for O(1) key lookup) with a Doubly Linked List (for O(1) node deletion and insertion at head).',
    },
  ];

  const aptitudeTopics: AptitudeTopic[] = [
    {
      id: 'apt-1',
      title: 'Permutations & Combinations',
      category: 'Quantitative',
      progress: 82,
      formula: 'nPr = n! / (n-r)!  |  nCr = n! / (r! * (n-r)!)',
      sampleQuestion: 'In how many ways can the letters of the word "LEADING" be arranged such that vowels always come together?',
      sampleOptions: ['360 ways', '720 ways', '1440 ways', '2880 ways'],
      correctOptionIndex: 1,
    },
    {
      id: 'apt-2',
      title: 'Time, Speed & Distance',
      category: 'Quantitative',
      progress: 75,
      formula: 'Speed = Distance / Time  |  Avg Speed = 2xy / (x+y)',
      sampleQuestion: 'A train 150m long crosses a telegraph post in 12 seconds. Find the speed of the train in km/h.',
      sampleOptions: ['45 km/h', '50 km/h', '54 km/h', '60 km/h'],
      correctOptionIndex: 0,
    },
    {
      id: 'apt-3',
      title: 'Data Interpretation & Charts',
      category: 'Data Interpretation',
      progress: 88,
      formula: 'Percentage Change = [(Final - Initial) / Initial] * 100',
      sampleQuestion: 'If company revenue grew from $40M to $64M over 2 years, what was the total percentage increase?',
      sampleOptions: ['40%', '50%', '60%', '64%'],
      correctOptionIndex: 2,
    },
    {
      id: 'apt-4',
      title: 'Syllogism & Logical Deduction',
      category: 'Logical',
      progress: 79,
      formula: 'All A are B + All B are C => All A are C',
      sampleQuestion: 'Statement: All Cats are Dogs. Some Dogs are Lions. Conclusion: Some Cats are Lions.',
      sampleOptions: ['Definitely True', 'Definitely False', 'Can be True or False', 'Invalid Data'],
      correctOptionIndex: 2,
    },
  ];

  const handleAddExamTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName || !newExamSubject) return;
    setUserExamTargets([
      {
        id: `ex-${Date.now()}`,
        name: newExamName,
        type: 'SEMESTER',
        subject: newExamSubject,
        examDate: '2026-11-20',
        targetScore: Number(newExamTargetScore) || 90,
        currentProgress: 15,
      },
      ...userExamTargets,
    ]);
    setNewExamName('');
    setNewExamSubject('');
    setIsAddExamModalOpen(false);
  };

  const handleAddPlannerTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskSubject || !newTaskTopic) return;
    setPlannerTasks([
      {
        id: `tsk-${Date.now()}`,
        subject: newTaskSubject,
        topic: newTaskTopic,
        scheduledTime: newTaskTime || '05:00 PM',
        completed: false,
      },
      ...plannerTasks,
    ]);
    setNewTaskSubject('');
    setNewTaskTopic('');
    setIsAddTaskModalOpen(false);
  };

  const togglePlannerTask = (id: string) => {
    setPlannerTasks(
      plannerTasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleRunCodingSolution = () => {
    setCodingTestResult({
      success: true,
      message: '✓ All 15 Test Cases Passed! Execution time: 18ms | Memory: 13.8MB | Beats 94.2% of submissions.',
    });
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
  };

  const handleLaunchTimedQuiz = (title: string) => {
    setActiveTimedQuiz({
      title,
      questions: [
        {
          q: 'Which data structure is most efficient for evaluating postfix expressions and recursion backtracks?',
          options: ['Queue', 'Stack', 'Binary Search Tree', 'Linked List'],
          answerIndex: 1,
        },
        {
          q: 'In relational database design, what does 3NF (Third Normal Form) eliminate?',
          options: ['Repeating groups', 'Partial functional dependencies', 'Transitive functional dependencies', 'Multivalued dependencies'],
          answerIndex: 2,
        },
        {
          q: 'What is the worst-case time complexity of QuickSort when bad pivot selection occurs?',
          options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(2^N)'],
          answerIndex: 2,
        },
      ],
      currentQIndex: 0,
      selectedOption: null,
      score: 0,
      isSubmitted: false,
    });
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (!activeTimedQuiz) return;
    setActiveTimedQuiz({
      ...activeTimedQuiz,
      selectedOption: optionIndex,
    });
  };

  const handleQuizNext = () => {
    if (!activeTimedQuiz || activeTimedQuiz.selectedOption === null) return;
    const isCorrect =
      activeTimedQuiz.selectedOption ===
      activeTimedQuiz.questions[activeTimedQuiz.currentQIndex].answerIndex;
    const newScore = isCorrect ? activeTimedQuiz.score + 1 : activeTimedQuiz.score;

    if (activeTimedQuiz.currentQIndex + 1 < activeTimedQuiz.questions.length) {
      setActiveTimedQuiz({
        ...activeTimedQuiz,
        score: newScore,
        currentQIndex: activeTimedQuiz.currentQIndex + 1,
        selectedOption: null,
      });
    } else {
      setActiveTimedQuiz({
        ...activeTimedQuiz,
        score: newScore,
        isSubmitted: true,
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    }
  };

  const handleAssistantSend = (promptText?: string) => {
    const text = promptText || assistantInput;
    if (!text.trim()) return;

    const newHistory = [...assistantChatHistory, { sender: 'USER' as const, text }];
    setAssistantChatHistory(newHistory);
    setAssistantInput('');

    setTimeout(() => {
      const botReply = `🤖 **Smart Analysis:** Based on your current stats (Placement Readiness: 72%, Exam Readiness: 68%), we recommend focusing on DBMS Normalization and DSA Graphs to reach 85%+!`;
      setAssistantChatHistory([...newHistory, { sender: 'BOT' as const, text: botReply }]);
    }, 400);
  };

  const filteredCodingProblems = codingProblems.filter(p => {
    return problemFilterDifficulty === 'ALL' || p.difficulty === problemFilterDifficulty;
  });

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/60">
              Unified Preparation Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-heading mt-1">
            PREPARATION
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build your academic, career and competitive-exam readiness in one place.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg font-heading shadow-glow">
            74%
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Preparedness</span>
            <p className="text-xs font-bold text-slate-900">Rank #14 in CSE Dept</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">Tier-1 Company Eligible ✓</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Overall Readiness</span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-heading">74%</span>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full" style={{ width: '74%' }} />
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Placement Readiness</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-heading">72%</span>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Exam Readiness</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-heading">68%</span>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 font-heading">12 Days</span>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* TWO MAIN TOGGLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveMainSection('PLACEMENT')}
          className={`p-6 rounded-3xl border transition-all text-left flex items-start space-x-4 shadow-soft ${
            activeMainSection === 'PLACEMENT'
              ? 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-400 shadow-card'
              : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
              activeMainSection === 'PLACEMENT' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold font-heading">PLACEMENT PREPARATION</h3>
              {activeMainSection === 'PLACEMENT' && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Active Mode
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${activeMainSection === 'PLACEMENT' ? 'text-brand-100' : 'text-slate-500'}`}>
              LeetCode DSA Practice, Aptitude Drills, Core CS Subjects, Mock Technical Interviews & Role Trackers
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveMainSection('EXAM')}
          className={`p-6 rounded-3xl border transition-all text-left flex items-start space-x-4 shadow-soft ${
            activeMainSection === 'EXAM'
              ? 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-400 shadow-card'
              : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
              activeMainSection === 'EXAM' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold font-heading">EXAM PREPARATION</h3>
              {activeMainSection === 'EXAM' && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Active Mode
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${activeMainSection === 'EXAM' ? 'text-brand-100' : 'text-slate-500'}`}>
              University Semester Exams, GATE CS 2027, CAT & GRE Hub, Study Planner, PYQs & Timed Exam Engine
            </p>
          </div>
        </button>
      </div>

      {/* SECTION A: PLACEMENT PREPARATION */}
      {activeMainSection === 'PLACEMENT' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-soft no-scrollbar">
            {[
              { id: 'OVERVIEW', label: '📊 Placement Dashboard' },
              { id: 'CODING', label: '💻 Coding & DSA (LeetCode)' },
              { id: 'APTITUDE', label: '🧮 Aptitude & Reasoning' },
              { id: 'CORE_CS', label: '📚 Core CS Flashcards' },
              { id: 'INTERVIEW', label: '🎙️ Mock Interview Prep' },
              { id: 'COMPANY_ROLE', label: '🏢 Target Role Checklist' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setPlacementSubNav(sub.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  placementSubNav === sub.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {placementSubNav === 'OVERVIEW' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Placement Pillar Readiness</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Placement Readiness', score: 72, color: 'bg-brand-600' },
                  { name: 'Aptitude & Logic', score: 80, color: 'bg-emerald-500' },
                  { name: 'Coding & DSA', score: 70, color: 'bg-blue-500' },
                  { name: 'Technical Core', score: 68, color: 'bg-purple-500' },
                  { name: 'Communication', score: 74, color: 'bg-amber-500' },
                  { name: 'Interview Preparedness', score: 65, color: 'bg-rose-500' },
                ].map((p, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{p.name}</span>
                      <span className="font-mono text-sm">{p.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {placementSubNav === 'CODING' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xl font-bold font-heading">LeetCode & DSA Suite</h3>
                  <span className="text-xs text-amber-300 font-bold">14 Days Coding Streak 🔥</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>Solved: <strong className="text-lg font-mono text-white block">184 / 450</strong></div>
                  <div>Accuracy: <strong className="text-lg font-mono text-emerald-400 block">76%</strong></div>
                  <div>Easy/Med/Hard: <strong className="text-sm font-mono text-slate-200 block">90 / 74 / 20</strong></div>
                  <div>LeetCode Rating: <strong className="text-lg font-mono text-brand-400 block">1680</strong></div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-700">Filter Difficulty:</span>
                <div className="flex space-x-2">
                  {['ALL', 'Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setProblemFilterDifficulty(d)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        problemFilterDifficulty === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-sm">Curated Coding Problems</div>
                <div className="divide-y divide-slate-100 text-xs">
                  {filteredCodingProblems.map(prob => (
                    <div key={prob.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-slate-900 cursor-pointer hover:text-brand-600" onClick={() => setSelectedCodingProblem(prob)}>
                            {prob.title}
                          </h5>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-700'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{prob.category} • Acceptance: {prob.acceptance}</span>
                      </div>
                      <button onClick={() => setSelectedCodingProblem(prob)} className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm">
                        Solve Problem
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {placementSubNav === 'APTITUDE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aptitudeTopics.map(tp => (
                <div key={tp.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm">{tp.title}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">{tp.category}</span>
                  </div>
                  <p className="text-xs text-slate-600">{tp.sampleQuestion}</p>
                  <div className="text-[11px] bg-slate-50 font-mono text-slate-500 p-2.5 rounded-xl border border-slate-200/60">
                    💡 Formula: {tp.formula}
                  </div>
                  <button onClick={() => handleLaunchTimedQuiz(`Aptitude: ${tp.title}`)} className="w-full py-2 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-sm">
                    Practice Questions
                  </button>
                </div>
              ))}
            </div>
          )}

          {placementSubNav === 'CORE_CS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { q: 'What is ACID in DBMS?', a: 'Atomicity, Consistency, Isolation, Durability.' },
                { q: 'Process vs Thread in OS?', a: 'Process has independent virtual memory; Thread shares process memory space.' },
                { q: 'What is TCP vs UDP?', a: 'TCP is connection-oriented, reliable with 3-way handshake; UDP is connectionless and faster.' },
                { q: 'Explain Virtual Memory & Paging', a: 'Virtual Memory maps virtual addresses to physical RAM using page tables and page fault handlers.' },
              ].map((fc, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{fc.q}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">{fc.a}</p>
                </div>
              ))}
            </div>
          )}

          {placementSubNav === 'INTERVIEW' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Technical & HR Mock Interview</h3>
              <p className="text-xs text-slate-500">Practice STAR behavioral responses, System Design questions, and LIVE peer practice.</p>
              <div className="flex gap-3">
                <button onClick={() => handleLaunchTimedQuiz('Technical Mock Interview')} className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md">
                  Start Technical Mock
                </button>
                <button onClick={() => handleLaunchTimedQuiz('HR Behavioral Interview')} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md">
                  Start HR Interview
                </button>
              </div>
            </div>
          )}

          {placementSubNav === 'COMPANY_ROLE' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Target Role Checklist</h3>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-600">Select Track:</span>
                <select value={selectedRoleTrack} onChange={e => setSelectedRoleTrack(e.target.value)} className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold">
                  {['Software Developer', 'Frontend Engineer', 'Backend Engineer', 'Data Analyst'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800">✓ <span className="font-semibold">Data Structures & Algorithms (LeetCode 150)</span></div>
                <div className="flex items-center space-x-2 text-slate-800">✓ <span className="font-semibold">SQL & Relational Databases</span></div>
                <div className="flex items-center space-x-2 text-slate-600">○ <span>System Design Basics & Distributed Systems</span></div>
                <div className="flex items-center space-x-2 text-slate-600">○ <span>Full-Stack Project Deployment</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION B: EXAM PREPARATION */}
      {activeMainSection === 'EXAM' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-soft no-scrollbar">
            {[
              { id: 'MY_EXAMS', label: '📅 My Exams & Targets' },
              { id: 'COMPETITIVE', label: '🏆 Competitive (GATE / CAT / GRE)' },
              { id: 'SYLLABUS', label: '📖 Subject Syllabus & Units' },
              { id: 'PLANNER', label: '⏱️ Study Planner Tasks' },
              { id: 'PYQ', label: '📄 Solved Previous Papers' },
              { id: 'MOCK_ENGINE', label: '⚡ Timed Exam Engine' },
              { id: 'REVISION', label: '🔄 Revision Center' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setExamSubNav(sub.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  examSubNav === sub.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {examSubNav === 'MY_EXAMS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Target Exams & Semester Goals</h3>
                <button
                  onClick={() => setIsAddExamModalOpen(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exam Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userExamTargets.map(ex => (
                  <div key={ex.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{ex.name}</h4>
                      <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase">{ex.type}</span>
                    </div>
                    <p className="text-xs text-slate-500">{ex.subject} • Target: {ex.targetScore}%</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${ex.currentProgress}%` }} />
                    </div>
                    <button onClick={() => handleLaunchTimedQuiz(`Exam Practice: ${ex.name}`)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-800 transition-colors">
                      Practice Questions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {examSubNav === 'COMPETITIVE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { exam: 'GATE CS 2027', weightage: 'Algorithms 11%, DBMS 8%, OS 10%, Networks 9%', progress: 68 },
                { exam: 'CAT 2026 Management', weightage: 'Quantitative 33%, Verbal 33%, DILR 34%', progress: 72 },
              ].map((ce, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
                  <h4 className="font-bold text-slate-900">{ce.exam}</h4>
                  <p className="text-xs text-slate-500">{ce.weightage}</p>
                  <button onClick={() => handleLaunchTimedQuiz(`Competitive Exam: ${ce.exam}`)} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm">
                    Launch Mock Paper
                  </button>
                </div>
              ))}
            </div>
          )}

          {examSubNav === 'SYLLABUS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Data Structures', 'Database Systems', 'Operating Systems'].map((sub, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">{sub}</h4>
                  <p className="text-xs text-slate-500">Unit 1 & 2 Completed ✓ • Unit 3 In Progress</p>
                  <button onClick={() => handleLaunchTimedQuiz(`Unit Test: ${sub}`)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-800 transition-colors">
                    Practice Unit Questions
                  </button>
                </div>
              ))}
            </div>
          )}

          {examSubNav === 'PLANNER' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Study Planner Tasks</h3>
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Study Task</span>
                </button>
              </div>

              <div className="space-y-2">
                {plannerTasks.map(t => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => togglePlannerTask(t.id)}
                        className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                      />
                      <span className={t.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                        <strong>{t.subject}:</strong> {t.topic}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">{t.scheduledTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {examSubNav === 'PYQ' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">DBMS Semester 6 End-Sem (2024)</h4>
                <p className="text-xs text-slate-500">15 Solved Questions • Step-by-step solutions</p>
                <button onClick={() => handleLaunchTimedQuiz('PYQ DBMS 2024')} className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-800">
                  View Solved Paper
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">GATE CS Algorithms Solved Papers (2020-2024)</h4>
                <p className="text-xs text-slate-500">42 Solved GATE Questions with detailed explanations</p>
                <button onClick={() => handleLaunchTimedQuiz('GATE Solved PYQs')} className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-800">
                  View Solved Paper
                </button>
              </div>
            </div>
          )}

          {examSubNav === 'MOCK_ENGINE' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Quick Quiz (10 Mins)', 'GATE CS Full Mock (180 Mins)', 'CAT Speed Drill (40 Mins)'].map((m, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">{m}</h4>
                  <button onClick={() => handleLaunchTimedQuiz(m)} className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm">
                    Start Timed Test
                  </button>
                </div>
              ))}
            </div>
          )}

          {examSubNav === 'REVISION' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Revision Center</h3>
              <p className="text-xs text-slate-500">Fast review of formulas & weak topics</p>
              <button onClick={() => handleLaunchTimedQuiz('Revision Test')} className="py-2 px-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm">
                Revise Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* SMART STUDY ASSISTANT (COMMON AT BOTTOM) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Smart Study Assistant</h3>
            <p className="text-xs text-slate-500">AI-powered preparation planner & problem solver</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 max-h-56 overflow-y-auto space-y-3 text-xs border border-slate-800">
          {assistantChatHistory.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-xl max-w-xl ${msg.sender === 'USER' ? 'bg-brand-600 ml-auto text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
              <strong className="block text-[10px] opacity-75 uppercase mb-0.5">{msg.sender === 'USER' ? 'You' : 'Assistant'}</strong>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={assistantInput}
            onChange={e => setAssistantInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAssistantSend()}
            placeholder="Ask Smart Assistant e.g. Give me 3 tips for GATE CS algorithms..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={() => handleAssistantSend()} className="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODAL 1: CODING SOLVER MODAL */}
      {selectedCodingProblem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedCodingProblem.title}</h3>
                <span className="text-xs text-slate-400">{selectedCodingProblem.category} • {selectedCodingProblem.difficulty}</span>
              </div>
              <button onClick={() => { setSelectedCodingProblem(null); setCodingTestResult(null); setShowSolutionHint(false); }} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedCodingProblem.description}</p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
              <div><strong>Sample Input:</strong> {selectedCodingProblem.sampleInput}</div>
              <div><strong>Sample Output:</strong> {selectedCodingProblem.sampleOutput}</div>
            </div>

            <div className="space-y-1">
              <button onClick={() => setShowSolutionHint(!showSolutionHint)} className="text-xs font-bold text-purple-600 hover:underline flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showSolutionHint ? 'Hide Solution Hint' : 'Show AI Solution Hint'}</span>
              </button>
              {showSolutionHint && (
                <p className="text-xs text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-200">
                  {selectedCodingProblem.solutionHint}
                </p>
              )}
            </div>

            <textarea
              rows={5}
              value={codingSolutionCode}
              onChange={e => setCodingSolutionCode(e.target.value)}
              placeholder="// Write your C++ / Java / Python solution here..."
              className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none"
            />

            {codingTestResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${codingTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {codingTestResult.message}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button onClick={() => { setSelectedCodingProblem(null); setCodingTestResult(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Close
              </button>
              <button onClick={handleRunCodingSolution} className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md">
                Run & Submit Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TIMED QUIZ / EXAM ENGINE MODAL */}
      {activeTimedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{activeTimedQuiz.title}</h3>
                {!activeTimedQuiz.isSubmitted && (
                  <span className="text-xs font-bold text-brand-600">
                    Question {activeTimedQuiz.currentQIndex + 1} of {activeTimedQuiz.questions.length}
                  </span>
                )}
              </div>
              <button onClick={() => setActiveTimedQuiz(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!activeTimedQuiz.isSubmitted ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-800">
                  {activeTimedQuiz.questions[activeTimedQuiz.currentQIndex].q}
                </p>

                <div className="space-y-2">
                  {activeTimedQuiz.questions[activeTimedQuiz.currentQIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                        activeTimedQuiz.selectedOption === idx
                          ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleQuizNext}
                    disabled={activeTimedQuiz.selectedOption === null}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md ${
                      activeTimedQuiz.selectedOption !== null
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {activeTimedQuiz.currentQIndex + 1 === activeTimedQuiz.questions.length ? 'Submit Quiz' : 'Next Question →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">Quiz Complete!</h4>
                <p className="text-sm text-slate-600">
                  You scored <strong className="text-brand-600 text-base">{activeTimedQuiz.score}</strong> / {activeTimedQuiz.questions.length} ({Math.round((activeTimedQuiz.score / activeTimedQuiz.questions.length) * 100)}%)
                </p>
                <button
                  onClick={() => setActiveTimedQuiz(null)}
                  className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: ADD EXAM TARGET MODAL */}
      {isAddExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddExamTarget} className="bg-white max-w-md w-full rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Exam Goal</h3>
              <button type="button" onClick={() => setIsAddExamModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Exam Name</label>
              <input
                type="text"
                value={newExamName}
                onChange={e => setNewExamName(e.target.value)}
                placeholder="e.g. Operating Systems End-Sem"
                required
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                value={newExamSubject}
                onChange={e => setNewExamSubject(e.target.value)}
                placeholder="e.g. Computer Science CS302"
                required
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Score (%)</label>
              <input
                type="number"
                value={newExamTargetScore}
                onChange={e => setNewExamTargetScore(Number(e.target.value))}
                min={50}
                max={100}
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsAddExamModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md">
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: ADD STUDY TASK MODAL */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddPlannerTask} className="bg-white max-w-md w-full rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Study Task</h3>
              <button type="button" onClick={() => setIsAddTaskModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                value={newTaskSubject}
                onChange={e => setNewTaskSubject(e.target.value)}
                placeholder="e.g. DBMS"
                required
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Topic</label>
              <input
                type="text"
                value={newTaskTopic}
                onChange={e => setNewTaskTopic(e.target.value)}
                placeholder="e.g. B+ Tree Indexing & 3NF Normalization"
                required
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Scheduled Time</label>
              <input
                type="text"
                value={newTaskTime}
                onChange={e => setNewTaskTime(e.target.value)}
                placeholder="e.g. 05:30 PM"
                className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsAddTaskModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-md">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default function PreparationPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Preparation Workspace...</div>}>
          <PreparationContent />
        </Suspense>
      </div>
    </div>
  );
}
