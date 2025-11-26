
import { Curriculum, YearLevel, CalendarEvent, StudyTask, Flashcard, Lecture, Quiz, Exam, RepetitionSession } from './types';

// ==========================================
// VIRTUAL FILE SYSTEM (DATA FOLDERS)
// ==========================================
// NOTE: These arrays are now empty to force the App to fetch data from 
// the /public/data/[YEAR]/[SUBJECT]/ directory structure.

// --- PCEM1 DATA ---
const PCEM1_ANATOMIE_LECTURES: Lecture[] = []; 
const PCEM1_ANATOMIE_QUIZZES: Quiz[] = [];

// --- DCEM2 DATA ---
const DCEM2_CARDIO_LECTURES: Lecture[] = [];
const DCEM2_CARDIO_EXAMS: Exam[] = [];

// ==========================================
// EXPORTS
// ==========================================

export const MOCK_CURRICULUM: Curriculum = {
  [YearLevel.PCEM1]: [
    {
      id: 'anat-p1',
      name: 'Anatomie',
      icon: 'Bone',
      description: 'Étude de la structure du corps humain.',
      lectures: PCEM1_ANATOMIE_LECTURES,
      quizzes: PCEM1_ANATOMIE_QUIZZES,
      exams: []
    },
    {
      id: 'phy-p1',
      name: 'Physiologie',
      icon: 'Kidney',
      description: 'Fonctionnement des organismes vivants.',
      lectures: [],
      quizzes: [],
      exams: []
    }
  ],
  [YearLevel.DCEM2]: [
    {
      id: 'cardio-d2',
      name: 'Cardiologie',
      icon: 'Heart',
      description: 'Pathologies du cœur et des vaisseaux.',
      lectures: DCEM2_CARDIO_LECTURES,
      quizzes: [],
      exams: DCEM2_CARDIO_EXAMS
    },
    {
      id: 'pneumo-d2',
      name: 'Pneumologie',
      icon: 'Wind',
      description: 'Maladies des poumons et voies respiratoires.',
      lectures: [],
      quizzes: [],
      exams: []
    }
  ],
  [YearLevel.PCEM2]: [],
  [YearLevel.DCEM1]: [],
  [YearLevel.DCEM3]: [],
  [YearLevel.DCEM4]: [],
};

export const SUBJECT_ICONS: Record<string, string> = {
  'Bone': '💀',
  'Heart': '❤️',
  'Wind': '🌬️',
  'Brain': '🧠',
  'Stomach': '🥨',
  'Kidney': '🫘'
};

// --- EVENTS DATA ---
export const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', date: new Date().toISOString().split('T')[0], title: 'Révision Cardio', type: 'study' },
  { id: '2', date: '2023-11-15', title: 'Exam partiel Anat', type: 'exam' },
];

// --- PLANNING DATA ---
export const MOCK_TASKS: StudyTask[] = [
  { id: '1', title: 'Lire le cours sur l\'HTA', status: 'done', subject: 'Cardiologie' },
  { id: '2', title: 'Faire le QCM Anatomie', status: 'progress', subject: 'Anatomie' },
  { id: '3', title: 'Réviser les fiches Pneumo', status: 'todo', subject: 'Pneumologie' },
  { id: '4', title: 'Préparer cas cliniques', status: 'todo', subject: 'Cardiologie' },
];

// --- FLASHCARDS DATA ---
export const MOCK_FLASHCARDS: Flashcard[] = [
  { id: '1', front: 'Quelle est la définition de l\'HTA ?', back: 'PAS ≥ 140 mmHg et/ou PAD ≥ 90 mmHg', subjectId: 'cardio', difficulty: 'learning' },
  { id: '2', front: 'Nerf principal de l\'extension du poignet ?', back: 'Nerf Radial', subjectId: 'anat', difficulty: 'review' },
  { id: '3', front: 'Signification de IDM ?', back: 'Infarctus du Myocarde', subjectId: 'cardio', difficulty: 'new' },
  { id: '4', front: 'Traitement de première intention OAP ?', back: 'Diurétiques de l\'anse (Furosémide) + Dérivés nitrés', subjectId: 'cardio', difficulty: 'learning' },
];

// --- HISTORY DATA ---
export const MOCK_HISTORY: RepetitionSession[] = [
  { id: 'h1', date: '2023-10-24', cardsReviewed: 25, accuracy: 85 },
  { id: 'h2', date: '2023-10-23', cardsReviewed: 40, accuracy: 92 },
  { id: 'h3', date: '2023-10-21', cardsReviewed: 15, accuracy: 70 },
];
