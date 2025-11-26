
export enum YearLevel {
  PCEM1 = 'PCEM1',
  PCEM2 = 'PCEM2',
  DCEM1 = 'DCEM1',
  DCEM2 = 'DCEM2',
  DCEM3 = 'DCEM3',
  DCEM4 = 'DCEM4',
}

export enum ContentType {
  LECTURE = 'COURS',
  QUIZ = 'QCM',
  EXAM = 'ANNALES',
}

export interface LectureSection {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet' | 'highlight' | 'image' | 'warning';
  content: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
}

export interface Lecture {
  id: string;
  title: string;
  duration: string;
  sections: LectureSection[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  year: number;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  lectures: Lecture[];
  quizzes: Quiz[];
  exams: Exam[];
}

export interface Curriculum {
  [key: string]: Subject[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

// --- NEW FEATURES TYPES ---

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'exam' | 'deadline' | 'study';
}

export interface StudyTask {
  id: string;
  title: string;
  status: 'todo' | 'progress' | 'done';
  subject: string;
  dueDate?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId: string;
  difficulty: 'new' | 'learning' | 'review';
}

export interface RepetitionSession {
  id: string;
  date: string;
  cardsReviewed: number;
  accuracy: number; // percentage
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  year: YearLevel;
}