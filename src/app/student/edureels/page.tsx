'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useResora } from '@/context/ResoraContext';
import {
  Video,
  Play,
  Pause,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  Sparkles,
  Flame,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Lock,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface ReelQuestionData {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Reel {
  id: string;
  title: string;
  creator: string;
  role: string;
  avatar: string;
  category: string;
  duration: string;
  views: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  summary: string;
  tags: string[];
  thumbnailGradient: string;
  videoUrl: string;
  question: ReelQuestionData;
}

const CATEGORIES = [
  'All Reels',
  '☕ Java',
  '🐍 Python',
  '💡 Aptitude',
];

const INITIAL_REELS: Reel[] = [
  // ================= JAVA REELS =================
  {
    id: 'java-reel-1',
    title: 'Java Reel 1 — Introduction to Java & JVM',
    creator: 'Prof. Ananya Sharma',
    role: 'CS Department Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    category: '☕ Java',
    duration: '01:45',
    views: '5.2k',
    likes: 482,
    isLiked: false,
    isBookmarked: true,
    summary: 'Understand JVM architecture, byte-code compilation, and platform independence in Java.',
    tags: ['Java', 'JVM', 'Backend', 'ObjectOriented'],
    thumbnailGradient: 'from-amber-600 via-orange-700 to-red-800',
    videoUrl: '/videos/java-reels/java-01.mp4',
    question: {
      text: 'What is the main purpose of a constructor in Java?',
      options: [
        'To destroy an object',
        'To initialize an object',
        'To inherit a class',
        'To create an interface'
      ],
      correctAnswer: 1,
      explanation: 'A constructor is a special method automatically invoked when an object is instantiated. It is used to initialize the state of the object.'
    }
  },
  {
    id: 'java-reel-2',
    title: 'Java Reel 2 — Variables & Primitive Data Types',
    creator: 'Prof. Ananya Sharma',
    role: 'CS Department Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    category: '☕ Java',
    duration: '01:30',
    views: '4.8k',
    likes: 390,
    isLiked: false,
    isBookmarked: false,
    summary: 'Explore primitive data types, wrapper classes, reference types, and type casting rules in Java.',
    tags: ['Java', 'DataTypes', 'Variables', 'OOP'],
    thumbnailGradient: 'from-orange-600 via-amber-700 to-yellow-800',
    videoUrl: '/videos/java-reels/java-02.mp4',
    question: {
      text: 'Which keyword is used to declare a constant variable in Java?',
      options: [
        'const',
        'static',
        'final',
        'immutable'
      ],
      correctAnswer: 2,
      explanation: 'The "final" keyword prevents a variable from being reassigned after its initial assignment.'
    }
  },
  {
    id: 'java-reel-3',
    title: 'Java Reel 3 — Operators and Expressions',
    creator: 'Dr. S. Rao',
    role: 'Faculty Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    category: '☕ Java',
    duration: '01:50',
    views: '6.1k',
    likes: 512,
    isLiked: true,
    isBookmarked: false,
    summary: 'Learn arithmetic, logical, bitwise, and ternary operators with precedence rules.',
    tags: ['Java', 'Operators', 'Expressions', 'Syntax'],
    thumbnailGradient: 'from-red-600 via-rose-700 to-pink-800',
    videoUrl: '/videos/java-reels/java-03.mp4',
    question: {
      text: 'What does the modulus operator (%) return in Java?',
      options: [
        'Quotient of division',
        'Remainder of division',
        'Product of numbers',
        'Exponential value'
      ],
      correctAnswer: 1,
      explanation: 'The modulus operator (%) returns the integer remainder resulting from dividing the dividend by the divisor.'
    }
  },
  {
    id: 'java-reel-4',
    title: 'Java Reel 4 — Control Flow & Branching',
    creator: 'Dr. S. Rao',
    role: 'Faculty Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    category: '☕ Java',
    duration: '02:00',
    views: '3.9k',
    likes: 340,
    isLiked: false,
    isBookmarked: true,
    summary: 'Master if-else branching, switch statements, and pattern matching in modern Java.',
    tags: ['Java', 'ControlFlow', 'Switch', 'Conditionals'],
    thumbnailGradient: 'from-amber-700 via-orange-800 to-red-900',
    videoUrl: '/videos/java-reels/java-04.mp4',
    question: {
      text: 'Which statement is used to immediately exit a loop in Java?',
      options: [
        'continue',
        'break',
        'return',
        'exit'
      ],
      correctAnswer: 1,
      explanation: 'The "break" statement immediately terminates the innermost enclosing loop or switch construct.'
    }
  },
  {
    id: 'java-reel-5',
    title: 'Java Reel 5 — Loops and Iteration',
    creator: 'Prof. Ananya Sharma',
    role: 'CS Department Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    category: '☕ Java',
    duration: '01:40',
    views: '7.1k',
    likes: 620,
    isLiked: true,
    isBookmarked: true,
    summary: 'Compare for, while, do-while, and enhanced for-each loops for processing arrays and collections.',
    tags: ['Java', 'Loops', 'Iteration', 'Collections'],
    thumbnailGradient: 'from-orange-500 via-amber-600 to-yellow-700',
    videoUrl: '/videos/java-reels/java-05.mp4',
    question: {
      text: 'Which loop is guaranteed to execute its body at least once?',
      options: [
        'for loop',
        'while loop',
        'do-while loop',
        'for-each loop'
      ],
      correctAnswer: 2,
      explanation: 'The "do-while" loop checks its condition at the end of the iteration, ensuring the loop body runs at least once.'
    }
  },

  // ================= PYTHON REELS =================
  {
    id: 'python-reel-1',
    title: 'Python Reel 1 — Dynamic Syntax & Scoping',
    creator: 'Rohan Verma',
    role: 'AI Research Alumnus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: '🐍 Python',
    duration: '01:25',
    views: '8.4k',
    likes: 812,
    isLiked: true,
    isBookmarked: false,
    summary: 'Learn dynamic typing, indentation rules, and why Python is the leading language for automation and AI.',
    tags: ['Python', 'Syntax', 'Indentation', 'Scripting'],
    thumbnailGradient: 'from-blue-600 via-teal-600 to-emerald-700',
    videoUrl: '/videos/python-reels/python-01.mp4',
    question: {
      text: 'How is code block scoping defined in Python?',
      options: [
        'Curly braces {}',
        'Indentation (whitespace)',
        'Begin and End keywords',
        'Parentheses ()'
      ],
      correctAnswer: 1,
      explanation: 'Python uses indentation (whitespace) to structure code blocks instead of explicit brackets or delimiters.'
    }
  },
  {
    id: 'python-reel-2',
    title: 'Python Reel 2 — Lists vs Tuples Mastery',
    creator: 'Rohan Verma',
    role: 'AI Research Alumnus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: '🐍 Python',
    duration: '01:35',
    views: '6.2k',
    likes: 540,
    isLiked: false,
    isBookmarked: true,
    summary: 'Understand mutable lists versus immutable tuples and list comprehension syntax.',
    tags: ['Python', 'Lists', 'Tuples', 'DataStructures'],
    thumbnailGradient: 'from-teal-600 via-emerald-700 to-green-800',
    videoUrl: '/videos/python-reels/python-02.mp4',
    question: {
      text: 'What is the key difference between a List and a Tuple in Python?',
      options: [
        'Lists are immutable, Tuples are mutable',
        'Lists are mutable, Tuples are immutable',
        'Tuples can only store numbers',
        'Lists cannot be indexed'
      ],
      correctAnswer: 1,
      explanation: 'Lists are mutable (can be altered after creation), while Tuples are immutable (read-only once defined).'
    }
  },
  {
    id: 'python-reel-3',
    title: 'Python Reel 3 — Dictionaries & Sets',
    creator: 'Priya Nambiar',
    role: 'Senior Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    category: '🐍 Python',
    duration: '01:45',
    views: '9.1k',
    likes: 920,
    isLiked: true,
    isBookmarked: true,
    summary: 'Key-value mapping with Dictionaries and set operations for fast membership testing.',
    tags: ['Python', 'Dictionaries', 'HashMaps', 'Performance'],
    thumbnailGradient: 'from-emerald-600 via-cyan-700 to-blue-800',
    videoUrl: '/videos/python-reels/python-03.mp4',
    question: {
      text: 'What is the average time complexity for searching a key in a Python dictionary?',
      options: [
        'O(N)',
        'O(N log N)',
        'O(1)',
        'O(N^2)'
      ],
      correctAnswer: 2,
      explanation: 'Python dictionaries use hash table lookups, granting an average time complexity of O(1).'
    }
  },
  {
    id: 'python-reel-4',
    title: 'Python Reel 4 — Functions & Lambda Expressions',
    creator: 'Rohan Verma',
    role: 'AI Research Alumnus',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: '🐍 Python',
    duration: '01:55',
    views: '5.9k',
    likes: 490,
    isLiked: false,
    isBookmarked: false,
    summary: 'Define clean modular functions, default parameters, *args, **kwargs, and inline lambda functions.',
    tags: ['Python', 'Functions', 'Lambda', 'CleanCode'],
    thumbnailGradient: 'from-cyan-600 via-teal-700 to-emerald-800',
    videoUrl: '/videos/python-reels/python-04.mp4',
    question: {
      text: 'Which keyword is used to create an anonymous inline function in Python?',
      options: [
        'def',
        'func',
        'lambda',
        'inline'
      ],
      correctAnswer: 2,
      explanation: 'The "lambda" keyword defines small, anonymous inline functions in Python.'
    }
  },
  {
    id: 'python-reel-5',
    title: 'Python Reel 5 — File Handling & Context Managers',
    creator: 'Priya Nambiar',
    role: 'Senior Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    category: '🐍 Python',
    duration: '01:40',
    views: '7.8k',
    likes: 670,
    isLiked: true,
    isBookmarked: true,
    summary: 'Read and write files safely using context managers (with open) and import external modules.',
    tags: ['Python', 'FileIO', 'ContextManager', 'Modules'],
    thumbnailGradient: 'from-teal-700 via-blue-800 to-indigo-900',
    videoUrl: '/videos/python-reels/python-05.mp4',
    question: {
      text: 'What is the advantage of using the "with open(...)" statement in Python?',
      options: [
        'It accelerates file reading speed 10x',
        'It automatically closes the file after the block completes',
        'It encrypts the text content',
        'It converts files to JSON format'
      ],
      correctAnswer: 1,
      explanation: 'The "with" statement acts as a context manager that automatically cleans up resources and closes the file.'
    }
  },

  // ================= APTITUDE REELS =================
  {
    id: 'aptitude-reel-1',
    title: 'Aptitude Reel 1 — Quantitative Numbers & LCM/HCF',
    creator: 'Placement Cell Lead',
    role: 'Campus Placement Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: '💡 Aptitude',
    duration: '01:45',
    views: '11.4k',
    likes: 1040,
    isLiked: true,
    isBookmarked: true,
    summary: 'Shortcuts for prime factorization, divisibility rules, and HCF/LCM problem solving.',
    tags: ['Aptitude', 'Numbers', 'LCM', 'Placements'],
    thumbnailGradient: 'from-purple-600 via-indigo-700 to-blue-800',
    videoUrl: '/videos/aptitude-reels/aptitude-01.mp4',
    question: {
      text: 'What is the LCM of two co-prime numbers A and B?',
      options: [
        '1',
        'A + B',
        'A * B',
        'A / B'
      ],
      correctAnswer: 2,
      explanation: 'Since co-prime numbers share no common factors other than 1, their Least Common Multiple (LCM) is simply their product (A * B).'
    }
  },
  {
    id: 'aptitude-reel-2',
    title: 'Aptitude Reel 2 — Speed Math & Percentage Change',
    creator: 'Placement Cell Lead',
    role: 'Campus Placement Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: '💡 Aptitude',
    duration: '01:30',
    views: '8.9k',
    likes: 760,
    isLiked: false,
    isBookmarked: false,
    summary: 'Calculate percentages in your head, fraction-to-percentage conversion tables, and ratio balances.',
    tags: ['Aptitude', 'SpeedMath', 'Percentages', 'Interview'],
    thumbnailGradient: 'from-indigo-600 via-purple-700 to-pink-800',
    videoUrl: '/videos/aptitude-reels/aptitude-02.mp4',
    question: {
      text: 'If a value increases by 20% and then decreases by 20%, what is the net percentage change?',
      options: [
        '0% change',
        '4% increase',
        '4% decrease',
        '2% decrease'
      ],
      correctAnswer: 2,
      explanation: 'Successive percentage change formula: net change = +20 - 20 - (20*20)/100 = -4% (a net 4% decrease).'
    }
  },
  {
    id: 'aptitude-reel-3',
    title: 'Aptitude Reel 3 — Time, Speed & Distance Tricks',
    creator: 'Placement Cell Lead',
    role: 'Campus Placement Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: '💡 Aptitude',
    duration: '01:50',
    views: '12.8k',
    likes: 1210,
    isLiked: true,
    isBookmarked: true,
    summary: 'Relative speed calculations, trains crossing platforms, and average speed formulas.',
    tags: ['Aptitude', 'TimeSpeedDistance', 'MathTricks', 'GATE'],
    thumbnailGradient: 'from-blue-700 via-indigo-800 to-purple-900',
    videoUrl: '/videos/aptitude-reels/aptitude-03.mp4',
    question: {
      text: 'What is the average speed for equal distance legs at speeds S1 and S2?',
      options: [
        '(S1 + S2) / 2',
        '(2 * S1 * S2) / (S1 + S2)',
        'S1 * S2',
        '(S1 - S2) / 2'
      ],
      correctAnswer: 1,
      explanation: 'The harmonic mean (2 * S1 * S2) / (S1 + S2) gives the exact average speed for equal distance legs.'
    }
  },
  {
    id: 'aptitude-reel-4',
    title: 'Aptitude Reel 4 — Profit, Loss & Discount',
    creator: 'Placement Cell Lead',
    role: 'Campus Placement Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: '💡 Aptitude',
    duration: '02:00',
    views: '6.7k',
    likes: 580,
    isLiked: false,
    isBookmarked: false,
    summary: 'Marked price versus cost price, successive discounts, and dishonest dealer problems.',
    tags: ['Aptitude', 'ProfitLoss', 'BusinessMath', 'Quants'],
    thumbnailGradient: 'from-purple-700 via-pink-800 to-rose-900',
    videoUrl: '/videos/aptitude-reels/aptitude-04.mp4',
    question: {
      text: 'If Cost Price = $100 and Selling Price = $125, what is the profit percentage?',
      options: [
        '20%',
        '25%',
        '30%',
        '15%'
      ],
      correctAnswer: 1,
      explanation: 'Profit % = [(Selling Price - Cost Price) / Cost Price] * 100 = (25 / 100) * 100 = 25%.'
    }
  },
  {
    id: 'aptitude-reel-5',
    title: 'Aptitude Reel 5 — Logical Series & Sequences',
    creator: 'Placement Cell Lead',
    role: 'Campus Placement Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: '💡 Aptitude',
    duration: '01:40',
    views: '10.1k',
    likes: 950,
    isLiked: true,
    isBookmarked: true,
    summary: 'Pattern recognition in number series, syllogisms, and seating arrangement logic.',
    tags: ['Aptitude', 'LogicalReasoning', 'Series', 'Logic'],
    thumbnailGradient: 'from-pink-600 via-rose-700 to-purple-800',
    videoUrl: '/videos/aptitude-reels/aptitude-05.mp4',
    question: {
      text: 'What is the next number in the series: 2, 6, 12, 20, 30, ...?',
      options: [
        '36',
        '40',
        '42',
        '48'
      ],
      correctAnswer: 2,
      explanation: 'The series adds increasing even numbers: +4, +6, +8, +10, +12. Therefore 30 + 12 = 42.'
    }
  },
];

export default function EduReelsPage() {
  const { currentUser } = useResora();
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [selectedCategory, setSelectedCategory] = useState('All Reels');
  const [searchQuery, setSearchQuery] = useState('');

  // Active playing reel state
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [completedReelVideos, setCompletedReelVideos] = useState<Record<string, boolean>>({});

  // Quiz submission state per reel
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  const handleToggleLike = (id: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === id) {
          const newLiked = !r.isLiked;
          return {
            ...r,
            isLiked: newLiked,
            likes: newLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  };

  const handleToggleBookmark = (id: string) => {
    setReels(prev =>
      prev.map(r => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const handleTogglePlay = (id: string) => {
    setIsPlaying(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVideoEnded = (reelId: string) => {
    setCompletedReelVideos(prev => ({ ...prev, [reelId]: true }));
  };

  const handleSelectOption = (reelId: string, optionIdx: number) => {
    if (!submittedAnswers[reelId]) {
      setUserAnswers(prev => ({ ...prev, [reelId]: optionIdx }));
    }
  };

  const handleSubmitQuiz = (reelId: string) => {
    if (userAnswers[reelId] !== undefined) {
      setSubmittedAnswers(prev => ({ ...prev, [reelId]: true }));
    }
  };

  const handleNextReel = (currentReelId: string) => {
    const activeList = filteredReels;
    const currIdx = activeList.findIndex(r => r.id === currentReelId);
    if (currIdx !== -1 && currIdx < activeList.length - 1) {
      const nextReel = activeList[currIdx + 1];
      setIsPlaying(prev => ({ ...prev, [currentReelId]: false, [nextReel.id]: true }));
    }
  };

  const filteredReels = reels.filter(reel => {
    let matchesCat = selectedCategory === 'All Reels';
    if (selectedCategory === '☕ Java') {
      matchesCat = reel.category.includes('Java');
    } else if (selectedCategory === '🐍 Python') {
      matchesCat = reel.category.includes('Python');
    } else if (selectedCategory === '💡 Aptitude') {
      matchesCat = reel.category.includes('Aptitude');
    } else {
      matchesCat = selectedCategory === 'All Reels' || reel.category === selectedCategory;
    }

    const matchesSearch =
      reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'all' || (activeTab === 'saved' && reel.isBookmarked);
    return matchesCat && matchesSearch && matchesTab;
  });

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                  <span>RESORA EduReels • Video Shorts + Quiz</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
                  Short Educational Reels 🎬
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Watch Java, Python, and Aptitude video reels. Watch each reel completely to unlock its single quiz question & explanation!
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Explore All
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'saved'
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved Reels ({reels.filter(r => r.isBookmarked).length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Category Pills: ONLY All Reels, Java, Python, Aptitude */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reels by title, tag..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Reels Grid */}
          {filteredReels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No EduReels Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try switching categories or clearing your search filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredReels.map(reel => {
                const playing = isPlaying[reel.id];
                const videoCompleted = completedReelVideos[reel.id];
                const selectedOpt = userAnswers[reel.id];
                const isSubmitted = submittedAnswers[reel.id];

                return (
                  <div
                    key={reel.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-card transition-all group"
                  >
                    {/* Live Video Preview & Player Header */}
                    <div className="relative h-64 bg-black p-4 flex flex-col justify-between text-white overflow-hidden group">
                      <video
                        id={`video-${reel.id}`}
                        src={`${reel.videoUrl}#t=0.001`}
                        preload="metadata"
                        controls={playing}
                        autoPlay={playing}
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        onPlay={() => setIsPlaying(prev => ({ ...prev, [reel.id]: true }))}
                        onPause={() => setIsPlaying(prev => ({ ...prev, [reel.id]: false }))}
                        onEnded={() => {
                          setIsPlaying(prev => ({ ...prev, [reel.id]: false }));
                          handleVideoEnded(reel.id);
                        }}
                      />

                      {!playing && (
                        <>
                          {/* Top Overlay Badges */}
                          <div className="flex items-center justify-between z-10 pointer-events-none">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-100 border border-white/20 shadow-md">
                              {reel.category}
                            </span>
                            <span className="text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-white flex items-center space-x-1 border border-white/10 shadow-md">
                              <Clock className="w-3 h-3 text-brand-300" />
                              <span>{reel.duration}</span>
                            </span>
                          </div>

                          {/* Play Overlay Button */}
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button
                              onClick={() => {
                                setIsPlaying(prev => ({ ...prev, [reel.id]: true }));
                                const vid = document.getElementById(`video-${reel.id}`) as HTMLVideoElement;
                                if (vid) vid.play();
                              }}
                              className="w-14 h-14 rounded-full bg-slate-900/70 backdrop-blur-md hover:bg-brand-600 border border-white/30 flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-2xl"
                            >
                              <Play className="w-6 h-6 fill-current ml-1" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-brand-600 transition-colors">
                          {reel.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {reel.summary}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {reel.tags.map(t => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* STRICT QUIZ UNLOCK SECTION BELOW VIDEO */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        {!videoCompleted ? (
                          /* Locked State before video ends */
                          <div className="bg-slate-900 text-white rounded-2xl p-3 text-center border border-slate-800 space-y-1">
                            <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-extrabold text-xs">
                              <Lock className="w-3.5 h-3.5 animate-pulse" />
                              <span>🔒 Quiz Locked</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              Watch reel completely to unlock single quiz question.
                            </p>
                            {/* Fast-track complete button for convenience */}
                            <button
                              onClick={() => handleVideoEnded(reel.id)}
                              className="mt-1 text-[9px] text-slate-400 hover:text-brand-300 underline font-mono"
                            >
                              ⚡ Unlock Quiz (Demo Finish)
                            </button>
                          </div>
                        ) : !isSubmitted ? (
                          /* Unlocked Question View after video ends */
                          <div className="bg-brand-50/70 border border-brand-200/80 rounded-2xl p-3.5 space-y-3 animate-in fade-in">
                            <div className="flex items-center justify-between text-[11px] font-bold text-brand-700">
                              <span className="flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Reel Finished</span>
                              </span>
                              <span className="text-[9px] bg-brand-200/60 text-brand-900 px-1.5 py-0.2 rounded">
                                Quiz Unlocked
                              </span>
                            </div>

                            <p className="text-xs font-extrabold text-slate-900">
                              ❓ {reel.question.text}
                            </p>

                            <div className="space-y-1.5">
                              {reel.question.options.map((optText, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(reel.id, optIdx)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all border ${
                                    selectedOpt === optIdx
                                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <span className="w-4 h-4 rounded-full bg-slate-200/60 text-slate-800 text-[9px] flex items-center justify-center shrink-0">
                                    {optionLabels[optIdx]}
                                  </span>
                                  <span className="truncate">{optText}</span>
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => handleSubmitQuiz(reel.id)}
                              disabled={selectedOpt === undefined}
                              className="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                            >
                              Submit Answer
                            </button>
                          </div>
                        ) : (
                          /* Quiz Result & Persistent Explanation */
                          <div className="space-y-2.5 animate-in fade-in">
                            {selectedOpt === reel.question.correctAnswer ? (
                              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-2xl text-xs space-y-1">
                                <p className="font-extrabold text-emerald-700 flex items-center space-x-1">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>✅ Correct! Well done! 🎉</span>
                                </p>
                                <p className="text-[11px]">
                                  Your Answer: <strong>{optionLabels[selectedOpt]}. {reel.question.options[selectedOpt]}</strong>
                                </p>
                              </div>
                            ) : (
                              <div className="bg-rose-50 border border-rose-200 text-rose-950 p-3 rounded-2xl text-xs space-y-1">
                                <p className="font-extrabold text-rose-700 flex items-center space-x-1">
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  <span>❌ Incorrect. Keep learning! 💡</span>
                                </p>
                                <p className="text-[11px] text-rose-900">
                                  Your Answer: {optionLabels[selectedOpt!]}. {reel.question.options[selectedOpt!]}
                                </p>
                                <p className="text-[11px] text-emerald-800 font-bold">
                                  Correct Answer: {optionLabels[reel.question.correctAnswer]}. {reel.question.options[reel.question.correctAnswer]}
                                </p>
                              </div>
                            )}

                            {/* Explanation Always Visible */}
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-slate-800 space-y-1">
                              <span className="font-extrabold text-amber-800 flex items-center space-x-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                <span>💡 Explanation:</span>
                              </span>
                              <p className="text-[11px] leading-relaxed">{reel.question.explanation}</p>
                            </div>

                            <button
                              onClick={() => handleNextReel(reel.id)}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                            >
                              <span>Next Reel</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleToggleLike(reel.id)}
                            className={`flex items-center space-x-1 font-semibold transition-colors ${
                              reel.isLiked ? 'text-rose-600' : 'hover:text-rose-600'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                reel.isLiked ? 'fill-rose-600 text-rose-600' : ''
                              }`}
                            />
                            <span>{reel.likes}</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleBookmark(reel.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              reel.isBookmarked
                                ? 'bg-brand-50 text-brand-600 font-bold'
                                : 'hover:bg-slate-100 text-slate-400'
                            }`}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                reel.isBookmarked ? 'fill-brand-600 text-brand-600' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
