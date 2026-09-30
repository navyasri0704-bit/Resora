export interface ReelQuestion {
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface CourseReel {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  question: ReelQuestion;
}

export interface DiscoveryCourse {
  id: string;
  name: string;
  icon?: string;
  tagline?: string;
  totalReels: number;
  reels: CourseReel[];
}

export interface UserReelAnswer {
  reelId: string;
  selectedOption: number;
  isCorrect: boolean;
  answeredAt: string;
}

export interface CourseUserProgress {
  courseId: string;
  completedReelIds: string[];
  answers: Record<string, UserReelAnswer>;
}
