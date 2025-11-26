
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, Layout, PenTool, Calendar as CalendarIcon, 
  Menu, X, Maximize, Minimize, ChevronRight, 
  Search, Brain, ArrowLeft, CheckCircle, Clock, Plus, Trash2, 
  Home, RefreshCw, ChevronDown, PanelLeftClose, PanelLeftOpen,
  LogOut, User as UserIcon, Eye, EyeOff, History, Sparkles, Loader2
} from 'lucide-react';
import { MOCK_CURRICULUM, SUBJECT_ICONS, MOCK_EVENTS, MOCK_TASKS, MOCK_FLASHCARDS, MOCK_HISTORY } from './constants';
import { YearLevel, Subject, ContentType, Lecture, Quiz, Exam, Note, CalendarEvent, StudyTask, Flashcard, UserProfile, RepetitionSession } from './types';
import { supabase } from './supabase';

// ==========================================
// 1. AUTH COMPONENT (LOGIN / REGISTER)
// ==========================================

const LoginPage = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    year: YearLevel.PCEM1
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Debug: Log Supabase client initialization
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    try {
      if (isLoginMode) {
        console.log('Attempting login with email:', formData.email);
        
        // Real Supabase Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        console.log('Supabase auth response:', { data, error });

        if (error) {
          console.error('Supabase auth error:', error);
          setError(`Erreur d'authentification: ${error.message}`);
          return;
        }

        if (data.user) {
          console.log('User authenticated, fetching profile...');
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
          });
          
          // Fetch user profile from database with timeout
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            const { data: profile, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as any;
            
            console.log('Profile fetch result:', { profile, profileError });

            if (profileError) {
              console.error('Profile fetch error:', profileError);
              setError(`Erreur profil: ${profileError.message}`);
              return;
            }

            if (!profile) {
              console.log('No profile found for user:', data.user.id);
              setError('Profil utilisateur non trouvé. Veuillez vous inscrire.');
              return;
            }

            console.log('Login successful, calling onLogin...');
            onLogin({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              year: profile.year_level as YearLevel
            });
          } catch (timeoutError) {
            console.error('Profile fetch failed:', timeoutError);
            setError('La connexion au profil a expiré. Veuillez réessayer.');
            return;
          }
        } else {
          setError('Aucune donnée utilisateur reçue de Supabase.');
        }
      } else {
        console.log('Attempting registration with email:', formData.email);
        
        // Real Supabase Registration
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.fullName,
              year_level: formData.year
            }
          }
        });

        console.log('Supabase registration response:', { data, error });

        if (error) {
          console.error('Supabase registration error:', error);
          setError(`Erreur d'inscription: ${error.message}`);
          return;
        }

        if (data.user) {
          console.log('User registered, fetching profile...');
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000);
          });
          
          // Fetch user profile from database with timeout
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            const { data: profile, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as any;
            
            console.log('Profile fetch result after registration:', { profile, profileError });

            if (profileError) {
              console.error('Profile fetch error after registration:', profileError);
              setError(`Erreur profil: ${profileError.message}`);
              return;
            }

            if (!profile) {
              console.log('No profile found after registration for user:', data.user.id);
              setError('Profil utilisateur non trouvé après inscription.');
              return;
            }

            console.log('Registration successful, calling onLogin...');
            onLogin({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              year: profile.year_level as YearLevel
            });
          } catch (timeoutError) {
            console.error('Profile fetch failed after registration:', timeoutError);
            setError('La connexion au profil a expiré. Veuillez réessayer.');
            return;
          }
        } else {
          setError('Aucune donnée utilisateur reçue lors de l\'inscription.');
        }
      }
    } catch (err) {
      console.error('Unexpected error during auth:', err);
      setError(`Erreur inattendue: ${err instanceof Error ? err.message : 'Veuillez réessayer.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-paper bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl border-2 border-sketch-black shadow-sketch-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-marker-yellow via-marker-pink to-marker-blue" />
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-sketch-black text-white rounded-xl mx-auto flex items-center justify-center text-3xl font-black mb-4">M</div>
          <h1 className="font-hand text-4xl font-bold mb-2">MediSketch</h1>
          <p className="text-gray-500">Votre compagnon d'études médicales.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm font-bold rounded-lg flex items-center gap-2">
            <span>!</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-sketch-black outline-none transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Année d'étude</label>
                <select 
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value as YearLevel})}
                  className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-sketch-black outline-none transition-colors bg-white"
                >
                  {Object.values(YearLevel).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-sketch-black outline-none transition-colors"
              placeholder="etudiant@medecine.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:border-sketch-black outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-sketch-black text-white font-bold py-3 rounded-xl shadow-sketch hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : (isLoginMode ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-sm text-gray-500 hover:text-sketch-black underline decoration-dashed underline-offset-4"
          >
            {isLoginMode ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENTS
// ==========================================

// --- LECTURE READER (WITH FETCH & GEMINI) ---
const LectureReader = ({ lectureData, year, subject }: { lectureData: any, year: string, subject: string }) => {
  const [content, setContent] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [askingAi, setAskingAi] = useState(false);

  useEffect(() => {
    const fetchLectureContent = async () => {
      setLoading(true);
      try {
        // Try fetching from the static file system structure
        // Path: /data/DCEM2/Cardiologie/hta.json
        if (lectureData.file) {
            const response = await fetch(`/data/${year}/${subject}/${lectureData.file}`);
            if (!response.ok) throw new Error('Fichier non trouvé');
            const data = await response.json();
            setContent(data);
        } else {
            // Fallback for demo/legacy data that is embedded
            setContent(lectureData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Impossible de charger le contenu du cours. Vérifiez que le fichier JSON existe bien dans le dossier public/data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLectureContent();
  }, [lectureData, year, subject]);

  const handleAskAI = async () => {
    setAskingAi(true);
    // SIMULATE GEMINI API CALL
    setTimeout(() => {
      setAiResponse("Voici un résumé généré par Gemini AI : Ce cours aborde les points essentiels de la pathologie, en mettant l'accent sur le diagnostic clinique et les complications majeures. N'oubliez pas la règle des 3 consultations.");
      setAskingAi(false);
    }, 1500);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sketch-black" size={40} /></div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold border-2 border-red-200 rounded-xl bg-red-50">{error}</div>;
  if (!content) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-[4px_4px_0px_0px_#1a1a1a] border-2 border-sketch-black p-6 md:p-10 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-marker-yellow via-marker-pink to-marker-blue" />
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-gray-900 font-sans tracking-tight">{content.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-1 text-sm font-bold text-gray-500 uppercase tracking-widest"><Clock size={16} /> {content.duration}</span>
            <button 
                onClick={handleAskAI}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-purple-800 px-4 py-2 rounded-lg font-bold text-sm hover:shadow-md transition-all"
            >
                <Sparkles size={16} /> {askingAi ? 'Analyse en cours...' : 'Résumer avec Gemini'}
            </button>
        </div>
        {aiResponse && (
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2"><Sparkles size={12}/> Réponse AI</h4>
                <p className="font-serif text-purple-900">{aiResponse}</p>
            </div>
        )}
      </div>

      <div className="space-y-8 px-2 md:px-0">
        {content.sections.map((section) => {
          if (section.type === 'heading') return (
              <div key={section.id} className="pt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-sketch-black relative inline-block">
                  {section.content}
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-marker-yellow/40 -z-10 skew-x-12" />
                </h2>
              </div>
          );
          if (section.type === 'paragraph') return <p key={section.id} className="text-lg md:text-xl leading-relaxed text-gray-800 font-serif max-w-4xl">{section.content}</p>;
          if (section.type === 'bullet') return (
              <div key={section.id} className="flex gap-3 items-start pl-2 md:pl-4 max-w-4xl">
                <div className="w-2 h-2 mt-2.5 bg-sketch-black rounded-full shrink-0" />
                <p className="text-lg md:text-xl leading-relaxed text-gray-800">{section.content}</p>
              </div>
          );
          if (section.type === 'highlight') return (
              <div key={section.id} className={`bg-marker-${section.color || 'yellow'}/30 p-6 rounded-lg border-l-4 border-sketch-black my-6 max-w-4xl`}>
                  <div className="flex items-center gap-2 mb-2 opacity-60 font-bold uppercase text-xs tracking-wider">
                    <Brain size={14} /> Point Clé
                  </div>
                  <p className="font-hand text-2xl font-bold text-gray-900">{section.content}</p>
              </div>
          );
          if (section.type === 'warning') return (
            <div key={section.id} className="bg-red-50 p-4 md:p-6 rounded-xl border-2 border-dashed border-red-300 flex gap-4 items-start max-w-4xl">
              <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0"><span className="text-xl font-bold">!</span></div>
              <div>
                <h4 className="font-bold text-red-800 uppercase text-xs tracking-widest mb-1">Attention</h4>
                <p className="text-red-900 font-bold text-lg">{section.content}</p>
              </div>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

// --- SUBJECT CONTENT LIST (DYNAMIC FETCH) ---
const SubjectContentList = ({ 
    items, 
    type, 
    onSelect, 
    subjectId, 
    yearId 
}: { 
    items: any[], 
    type: ContentType, 
    onSelect: (item: any) => void,
    subjectId: string,
    yearId: string
}) => {
    const [fetchedItems, setFetchedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch the list of content from index file
    useEffect(() => {
        const loadIndex = async () => {
            // If static items are provided (non-empty array), use them. 
            // In constants.ts, these are now empty to force fetching.
            if (items.length > 0) {
                setFetchedItems(items);
                return;
            }

            setLoading(true);
            try {
                // Determine filename based on type
                let filename = '';
                if (type === ContentType.LECTURE) filename = 'lectures.json';
                if (type === ContentType.QUIZ) filename = 'quizzes.json';
                if (type === ContentType.EXAM) filename = 'exams.json';

                // Path: /data/[YEAR]/[SUBJECT]/[filename]
                const response = await fetch(`/data/${yearId}/${subjectId}/${filename}`);
                if (response.ok) {
                    const data = await response.json();
                    setFetchedItems(data);
                } else {
                    setFetchedItems([]); // No file found
                }
            } catch (e) {
                console.log("No dynamic content found for", subjectId, type);
                setFetchedItems([]);
            } finally {
                setLoading(false);
            }
        };
        loadIndex();
    }, [subjectId, yearId, type, items]);

    if (loading) return <div className="p-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={16}/> Chargement...</div>;
    if (fetchedItems.length === 0) return <div className="opacity-40 italic p-2 text-sm">Aucun contenu disponible</div>;

    return (
        <div className="space-y-4">
            {fetchedItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="bg-white p-4 rounded-xl border-2 border-sketch-black hover:shadow-sketch transition-all cursor-pointer flex items-center justify-between group"
                >
                   <div>
                     <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{item.title}</h4>
                     {type === ContentType.LECTURE && <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.duration}</span>}
                     {type === ContentType.QUIZ && <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">{item.questions?.length || '?'} Q</span>}
                     {type === ContentType.EXAM && <span className="text-xs font-bold text-gray-400">{item.year}</span>}
                   </div>
                   <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            ))}
        </div>
    );
};

const SidebarCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');

  const today = new Date();
  const currentMonth = today.toLocaleString('fr-FR', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  
  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const addEvent = () => {
    if (!newEventTitle || !selectedDate) return;
    setEvents([...events, { id: Date.now().toString(), date: selectedDate, title: newEventTitle, type: 'study' }]);
    setNewEventTitle('');
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="bg-white p-3 rounded-xl border-2 border-sketch-black shadow-[2px_2px_0px_0px_#1a1a1a]">
      <h3 className="font-hand font-bold text-xl capitalize mb-2 text-center">{currentMonth} {currentYear}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-1">
        <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dayEvents = getEventsForDay(day);
          const dateStr = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const isToday = day === today.getDate();
          
          return (
            <button 
              key={day} 
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all relative
                ${isToday ? 'bg-sketch-black text-white' : 'hover:bg-gray-100'}
                ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
            >
              {day}
              <div className="flex gap-0.5 mt-0.5">
                {dayEvents.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-red-400" />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-xs font-bold text-gray-500 mb-2">Événements du {selectedDate.split('-')[2]}:</p>
          <div className="space-y-1 mb-2">
            {events.filter(e => e.date === selectedDate).map(ev => (
              <div key={ev.id} className="text-xs flex items-center gap-1 bg-white px-1 py-0.5 border border-gray-200 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {ev.title}
              </div>
            ))}
            {events.filter(e => e.date === selectedDate).length === 0 && <span className="text-xs text-gray-400 italic">Rien de prévu</span>}
          </div>
          <div className="flex gap-1">
            <input 
              value={newEventTitle} 
              onChange={e => setNewEventTitle(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded px-1 py-1" 
              placeholder="Ajouter..." 
            />
            <button onClick={addEvent} className="bg-sketch-black text-white p-1 rounded"><Plus size={12} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

const PlanningBoard = () => {
  const [tasks, setTasks] = useState<StudyTask[]>(MOCK_TASKS);
  
  const moveTask = (id: string, newStatus: StudyTask['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const Column = ({ title, status, color }: { title: string, status: StudyTask['status'], color: string }) => (
    <div className="flex-1 min-w-[280px] bg-white rounded-xl border-2 border-sketch-black shadow-sketch p-4 flex flex-col h-full">
      <h3 className={`font-hand text-2xl font-bold border-b-2 border-sketch-black pb-2 mb-4 ${color}`}>{title}</h3>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-paper p-3 rounded-lg border-2 border-sketch-black group relative hover:shadow-md transition-all">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{task.subject}</span>
            <p className="font-medium mt-1 text-sm">{task.title}</p>
            <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {status !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')} className="p-1 hover:bg-gray-200 rounded"><ArrowLeft size={14} /></button>}
              {status !== 'done' && <button onClick={() => moveTask(task.id, status === 'todo' ? 'progress' : 'done')} className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={14} /></button>}
            </div>
          </div>
        ))}
        {tasks.filter(t => t.status === status).length === 0 && (
          <div className="text-center py-10 opacity-30 font-hand text-xl">Vide</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6">
      <h2 className="text-3xl font-black mb-6 font-hand">Planning de Révision</h2>
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        <Column title="À Faire" status="todo" color="text-red-500" />
        <Column title="En Cours" status="progress" color="text-yellow-600" />
        <Column title="Terminé" status="done" color="text-green-600" />
      </div>
    </div>
  );
};

const SpacedRepetition = () => {
  const [mode, setMode] = useState<'practice' | 'history'>('practice');
  const [cards, setCards] = useState<Flashcard[]>(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [history] = useState<RepetitionSession[]>(MOCK_HISTORY);

  const currentCard = cards[currentIndex];

  const handleRate = (difficulty: string) => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    } else {
      setSessionComplete(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSessionComplete(false);
    setIsFlipped(false);
  };

  if (mode === 'history') {
    return (
      <div className="max-w-4xl mx-auto p-6">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black font-hand">Historique des Sessions</h2>
            <button onClick={() => setMode('practice')} className="flex items-center gap-2 font-bold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
               <ArrowLeft size={18} /> Retour aux cartes
            </button>
         </div>

         <div className="bg-white rounded-xl border-2 border-sketch-black shadow-sketch overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-100 border-b-2 border-sketch-black">
                  <tr>
                     <th className="p-4 font-bold text-sm uppercase text-gray-500">Date</th>
                     <th className="p-4 font-bold text-sm uppercase text-gray-500">Cartes Revues</th>
                     <th className="p-4 font-bold text-sm uppercase text-gray-500">Précision</th>
                     <th className="p-4 font-bold text-sm uppercase text-gray-500">Statut</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {history.map(session => (
                    <tr key={session.id} className="hover:bg-gray-50">
                       <td className="p-4 font-medium font-hand text-lg">{session.date}</td>
                       <td className="p-4">{session.cardsReviewed}</td>
                       <td className="p-4">
                          <div className="flex items-center gap-2">
                             <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                <div className={`h-full ${session.accuracy > 80 ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${session.accuracy}%` }} />
                             </div>
                             <span className="text-xs font-bold">{session.accuracy}%</span>
                          </div>
                       </td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${session.accuracy > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {session.accuracy > 80 ? 'Excellent' : 'Moyen'}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-full border-4 border-sketch-black mb-6 shadow-sketch-lg">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-4xl font-hand font-bold mb-2">Session Terminée !</h2>
        <p className="text-gray-600 mb-8">Vous avez révisé {cards.length} cartes aujourd'hui.</p>
        <button onClick={restart} className="bg-sketch-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all">
          <RefreshCw size={20} /> Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center p-6 max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black font-hand">Révision Espacée</h2>
        <button onClick={() => setMode('history')} className="text-gray-500 hover:text-sketch-black p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Historique">
           <History size={24} />
        </button>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8 border border-sketch-black">
        <div className="bg-marker-blue h-full rounded-full transition-all duration-300 border-r-2 border-sketch-black" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
      </div>
      <div onClick={() => setIsFlipped(!isFlipped)} className="w-full aspect-[3/2] perspective cursor-pointer group">
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-sketch-black rounded-2xl shadow-sketch-lg flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50">
             <span className="absolute top-4 left-4 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-gray-300">{currentCard.subjectId}</span>
             <p className="text-2xl font-bold">{currentCard.front}</p>
             <p className="text-gray-400 text-sm mt-4 font-hand">(Cliquez pour retourner)</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-paper border-2 border-sketch-black rounded-2xl shadow-sketch-lg flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
             <p className="text-2xl font-serif text-gray-800">{currentCard.back}</p>
          </div>
        </div>
      </div>
      <div className={`mt-10 flex gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); handleRate('hard'); }} className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-red-200 hover:-translate-y-1 transition-transform">Difficile</button>
        <button onClick={(e) => { e.stopPropagation(); handleRate('good'); }} className="bg-blue-100 border-2 border-blue-500 text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 hover:-translate-y-1 transition-transform">Correct</button>
        <button onClick={(e) => { e.stopPropagation(); handleRate('easy'); }} className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-200 hover:-translate-y-1 transition-transform">Facile</button>
      </div>
    </div>
  );
};

const NotesPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const addNote = () => {
    if (!currentNote.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Note',
      content: currentNote,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    };
    setNotes([newNote, ...notes]);
    setCurrentNote('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-paper border-l-2 border-sketch-black shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b-2 border-sketch-black flex justify-between items-center bg-marker-yellow">
          <h3 className="font-hand text-2xl font-bold flex items-center gap-2">
            <PenTool size={24} /> Notes
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full"><X size={24} /></button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="bg-white p-2 rounded-xl border-2 border-sketch-black shadow-sm mb-6">
            <textarea
              className="w-full h-24 p-2 font-hand text-xl focus:outline-none resize-none bg-transparent"
              placeholder="Écrire une note..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
            <div className="flex justify-end pt-2">
              <button 
                onClick={addNote}
                className="bg-sketch-black text-white px-3 py-1 rounded-lg font-bold text-sm hover:opacity-80 flex items-center gap-1"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-[#fff9c4] p-3 border-2 border-sketch-black rounded-lg shadow-sm relative group">
                <button 
                  onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 rounded p-1 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <p className="text-[10px] font-bold text-gray-500 mb-1">{note.date}</p>
                <p className="font-hand text-lg leading-snug">{note.content}</p>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <PenTool size={32} className="mx-auto mb-2" />
                <p className="font-hand">Vos notes ici.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ExamPaperReader = ({ exam }: { exam: Exam }) => {
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});
  const toggleAnswer = (id: string) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
       <div className="bg-[#fffdf0] border-2 border-sketch-black shadow-[3px_3px_0px_0px_#1a1a1a] p-8 md:p-12 min-h-[80vh] relative">
          <div className="absolute top-0 left-8 md:left-24 w-0.5 h-full bg-red-200" />
          <div className="mb-12 text-center border-b-4 border-double border-gray-300 pb-6 relative z-10">
             <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">Faculté de Médecine</span>
             <h1 className="text-4xl font-serif font-bold text-gray-800 my-2">{exam.title}</h1>
             <p className="text-gray-600 font-serif italic">Année universitaire: {exam.year}</p>
          </div>
          <div className="space-y-12 relative z-10">
             {exam.questions.map((q, idx) => (
                <div key={q.id} className="pl-4 md:pl-20">
                   <div className="flex gap-4">
                      <span className="font-bold font-serif text-xl text-gray-400">Q{idx + 1}.</span>
                      <div className="flex-1">
                         <p className="font-serif text-xl leading-relaxed text-gray-900 mb-6">{q.text}</p>
                         <ul className="space-y-2 mb-6">
                            {q.options.map((opt, i) => (
                               <li key={i} className="flex gap-3 items-baseline">
                                  <span className="w-5 h-5 rounded-full border border-gray-400 text-xs flex items-center justify-center shrink-0">{String.fromCharCode(65 + i)}</span>
                                  <span className="font-serif text-lg">{opt}</span>
                               </li>
                            ))}
                         </ul>
                         <button 
                            onClick={() => toggleAnswer(q.id)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-3"
                         >
                            {visibleAnswers[q.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            {visibleAnswers[q.id] ? 'Masquer la réponse' : 'Voir la réponse'}
                         </button>
                         {visibleAnswers[q.id] && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-in fade-in slide-in-from-top-2">
                               <p className="font-bold text-green-800 mb-1">
                                  Réponse: {String.fromCharCode(65 + q.correctIndex)}
                               </p>
                               <p className="text-green-700 font-serif leading-relaxed">
                                  {q.explanation}
                               </p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const QuizRunner = ({ quiz }: { quiz: Quiz }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const question = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const next = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
       <div className="mb-6">
          <h2 className="text-2xl font-black mb-1">{quiz.title}</h2>
          <div className="h-3 bg-gray-200 rounded-full border border-sketch-black overflow-hidden mt-4">
             <div className="h-full bg-sketch-black transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
       </div>
       <div className="bg-white rounded-2xl border-2 border-sketch-black shadow-sketch p-6 md:p-8 mb-6 relative">
          <p className="text-xl md:text-2xl font-bold leading-tight mb-6">{question.text}</p>
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let style = "border-gray-200 hover:border-gray-400 hover:bg-gray-50";
              if (selected !== null) {
                if (idx === question.correctIndex) style = "border-green-500 bg-green-50 ring-2 ring-green-200";
                else if (idx === selected) style = "border-red-500 bg-red-50";
                else style = "opacity-50 border-gray-100";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg flex items-center justify-between ${style}`}
                >
                  {opt}
                  {selected !== null && idx === question.correctIndex && <CheckCircle className="text-green-500" />}
                </button>
              );
            })}
          </div>
       </div>
       {selected !== null && (
         <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
             <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><BookOpen size={16}/> Explication</h4>
             <p className="text-blue-800">{question.explanation}</p>
           </div>
           {currentIdx < quiz.questions.length - 1 ? (
             <button onClick={next} className="w-full bg-sketch-black text-white py-4 rounded-xl font-bold text-lg hover:translate-y-1 hover:shadow-none shadow-sketch transition-all flex items-center justify-center gap-2">
               Question Suivante <ChevronRight />
             </button>
           ) : (
             <div className="text-center p-4 bg-green-100 rounded-xl border-2 border-green-500 font-bold text-green-800 text-xl">
               Quiz Terminé ! 
             </div>
           )}
         </div>
       )}
    </div>
  );
};

// ==========================================
// 4. MAIN APP LAYOUT
// ==========================================

export default function App() {
  console.log('DEBUG: App component mounting...');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState<YearLevel | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [activeContent, setActiveContent] = useState<{ type: ContentType, item: any } | null>(null);
  const [view, setView] = useState<'dashboard' | 'planning' | 'repetition' | 'subject'>('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // TEMPORARILY DISABLED - Check for existing session on mount (causing infinite refresh)
  // useEffect(() => {
  //   console.log('DEBUG: Auth useEffect starting');
  //   const checkSession = async () => {
  //     try {
  //       console.log('DEBUG: Checking session...');
  //       const { data: { session } } = await supabase.auth.getSession();
  //       console.log('DEBUG: Session result:', session);
  //       if (session?.user) {
  //         // Fetch user profile from database
  //         const { data: profile, error: profileError } = await supabase
  //           .from('profiles')
  //           .select('*')
  //           .eq('id', session.user.id)
  //           .single();

  //         if (!profileError && profile) {
  //           setUser({
  //             id: profile.id,
  //             email: profile.email,
  //             name: profile.name,
  //             year: profile.year_level as YearLevel
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       console.error('DEBUG: Session check error:', error);
  //     }
  //   };

  //   try {
  //     // Listen for auth changes
  //     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  //       console.log('DEBUG: Auth state change:', event, session);
  //       if (event === 'SIGNED_IN' && session?.user) {
  //         // Fetch user profile from database
  //         const { data: profile, error: profileError } = await supabase
  //           .from('profiles')
  //           .select('*')
  //           .eq('id', session.user.id)
  //           .single();

  //         if (!profileError && profile) {
  //           setUser({
  //             id: profile.id,
  //             email: profile.email,
  //             name: profile.name,
  //             year: profile.year_level as YearLevel
  //           });
  //         }
  //       } else if (event === 'SIGNED_OUT') {
  //         setUser(null);
  //         setShowInstallPrompt(false);
  //       }
  //     });

  //     checkSession();
  //     return () => subscription.unsubscribe();
  //   } catch (error) {
  //     console.error('DEBUG: Auth setup error:', error);
  //   }
  // }, []); // Empty dependency array - only runs once

  // Separate useEffect for PWA install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []); // Empty dependency array

  // Separate useEffect for PWA install prompt logic
  useEffect(() => {
    if (user && deferredPrompt) {
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000); // Show after 3 seconds
      }
    }
  }, [user, deferredPrompt]);

  // TEMPORARILY DISABLED - Service worker causing infinite refresh
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered with scope:', registration.scope);
  //       })
  //       .catch((error) => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   }
  // }, []);

  // Handle PWA installation
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    if (view !== 'subject') {
      setCurrentSubject(null);
      setActiveContent(null);
    }
  }, [view]);

  const handleSubjectSelect = (subject: Subject) => {
    setCurrentSubject(subject);
    setActiveContent(null);
    setView('subject');
    setMobileMenuOpen(false);
  };

  const handleYearSelect = (year: YearLevel) => {
    setCurrentYear(currentYear === year ? null : year);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('dashboard');
    setCurrentSubject(null);
    setCurrentYear(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-paper overflow-hidden text-sketch-black font-sans selection:bg-marker-yellow/30">
      
      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="bg-gradient-to-r from-marker-yellow via-marker-pink to-marker-blue border-b-2 border-sketch-black p-3 animate-in slide-in-from-top duration-500">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sketch-black rounded-lg flex items-center justify-center text-white font-black text-lg">M</div>
              <div>
                <p className="font-bold text-sm">Installez MediSketch</p>
                <p className="text-xs opacity-75">Accès rapide hors ligne • Meilleure expérience</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="bg-sketch-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                Installer
              </button>
              <button 
                onClick={handleInstallDismiss}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Plus tard"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      <header className="h-16 border-b-2 border-sketch-black bg-white flex items-center px-2 sm:px-4 justify-between z-40 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-sketch-black transition-colors">
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('dashboard'); setCurrentSubject(null); }}>
             <div className="w-7 h-7 sm:w-8 sm:h-8 bg-sketch-black rounded-lg flex items-center justify-center text-white font-black text-lg sm:text-xl">M</div>
             <span className="font-hand font-bold text-lg sm:text-2xl hidden xs:block sm:block">MediSketch</span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <button 
            onClick={() => setView('dashboard')} 
            className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-gray-200 text-sketch-black' : 'text-gray-500'}`}
            title="Accueil"
          >
            <Home size={18} /> <span className="hidden sm:inline text-xs sm:text-base">Accueil</span>
          </button>
          <button 
            onClick={() => setView('planning')} 
            className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${view === 'planning' ? 'bg-gray-200 text-sketch-black' : 'text-gray-500'}`}
            title="Planning"
          >
            <CalendarIcon size={18} /> <span className="hidden sm:inline text-xs sm:text-base">Planning</span>
          </button>
          <button 
            onClick={() => setView('repetition')} 
            className={`p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ${view === 'repetition' ? 'bg-gray-200 text-sketch-black' : 'text-gray-500'}`}
            title="Révision"
          >
            <RefreshCw size={18} /> <span className="hidden sm:inline text-xs sm:text-base">Révision</span>
          </button>
          <div className="hidden sm:block w-px h-6 bg-gray-300 mx-1" />
          <button onClick={() => setIsNotesOpen(true)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg relative" title="Notes">
            <PenTool size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          <button onClick={toggleFullscreen} className="hidden md:block p-2 hover:bg-gray-100 rounded-lg" title="Plein écran">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button onClick={handleLogout} className="p-1.5 sm:p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Se déconnecter">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 flex overflow-hidden relative">
        <aside 
          className={`
            ${isSidebarOpen ? 'w-80 opacity-100 border-r-2' : 'w-0 opacity-0 overflow-hidden border-r-0'} 
            transition-all duration-300 ease-in-out border-sketch-black bg-gray-50 flex flex-col hidden md:flex
          `}
        >
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="mb-6 flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                  <UserIcon />
               </div>
               <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.year}</p>
               </div>
            </div>

            <SidebarCalendar />
            
            <div className="mt-8 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-2">Années & Matières</h4>
              {Object.entries(MOCK_CURRICULUM).map(([year, subjects]) => (
                <div key={year} className="border-b border-gray-200 pb-2 last:border-0">
                  <button 
                    onClick={() => handleYearSelect(year as YearLevel)}
                    className="w-full flex items-center justify-between py-2 px-1 hover:bg-gray-100 rounded-lg group"
                  >
                    <span className="font-bold text-lg">{year}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${currentYear === year ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {currentYear === year && (
                    <div className="mt-1 ml-2 space-y-1 animate-in slide-in-from-top-2">
                       {subjects.map(subject => (
                         <button
                           key={subject.id}
                           onClick={() => handleSubjectSelect(subject)}
                           className={`
                             w-full text-left py-2 px-3 rounded-md text-sm font-medium flex items-center gap-3 transition-all
                             ${currentSubject?.id === subject.id ? 'bg-sketch-black text-white shadow-md' : 'hover:bg-gray-200 text-gray-600'}
                           `}
                         >
                           <span>{SUBJECT_ICONS[subject.icon] || '📚'}</span>
                           {subject.name}
                         </button>
                       ))}
                       {subjects.length === 0 && <p className="text-xs text-gray-400 px-3 py-1 italic">Aucun contenu</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-paper bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] relative scroll-smooth p-4 md:p-8">
           
           {view === 'dashboard' && (
             <div className="max-w-4xl mx-auto pt-10">
                <div className="text-center mb-12">
                   <h1 className="font-hand text-5xl md:text-6xl font-bold mb-4">Bienvenue, {user.name} !</h1>
                   <p className="text-xl text-gray-500 max-w-lg mx-auto">Votre espace de travail personnel pour réussir vos années de médecine.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div 
                     onClick={() => setView('planning')}
                     className="bg-white p-6 rounded-xl border-2 border-sketch-black shadow-sketch hover:-translate-y-1 transition-transform cursor-pointer group"
                   >
                      <div className="w-12 h-12 bg-marker-yellow rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layout size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Planning</h3>
                      <p className="text-gray-500">Organisez vos révisions. {MOCK_TASKS.filter(t => t.status === 'todo').length} tâches à faire.</p>
                   </div>
                   <div 
                     onClick={() => setView('repetition')}
                     className="bg-white p-6 rounded-xl border-2 border-sketch-black shadow-sketch hover:-translate-y-1 transition-transform cursor-pointer group"
                   >
                      <div className="w-12 h-12 bg-marker-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <RefreshCw size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Révision Espacée</h3>
                      <p className="text-gray-500">Testez vos connaissances. {MOCK_FLASHCARDS.length} cartes.</p>
                   </div>
                </div>
             </div>
           )}

           {view === 'planning' && <PlanningBoard />}
           {view === 'repetition' && <SpacedRepetition />}

           {view === 'subject' && currentSubject && !activeContent && (
             <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white border-2 border-sketch-black rounded-2xl flex items-center justify-center text-3xl shadow-sketch">
                    {SUBJECT_ICONS[currentSubject.icon]}
                  </div>
                  <div>
                    <h1 className="text-4xl font-black">{currentSubject.name}</h1>
                    <p className="text-gray-500 font-medium">{currentSubject.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* LECTURES */}
                  <div className="space-y-4">
                    <h3 className="font-hand text-2xl font-bold border-b-2 border-marker-yellow inline-block px-2">Cours Magistraux</h3>
                    <SubjectContentList 
                        items={currentSubject.lectures} 
                        type={ContentType.LECTURE} 
                        onSelect={(item) => setActiveContent({ type: ContentType.LECTURE, item })}
                        subjectId={currentSubject.name} // Matches folder name in public/data
                        yearId={currentYear!} 
                    />
                  </div>

                  {/* QUIZZES */}
                  <div className="space-y-4">
                    <h3 className="font-hand text-2xl font-bold border-b-2 border-marker-pink inline-block px-2">QCM</h3>
                    <SubjectContentList 
                        items={currentSubject.quizzes} 
                        type={ContentType.QUIZ} 
                        onSelect={(item) => setActiveContent({ type: ContentType.QUIZ, item })}
                        subjectId={currentSubject.name}
                        yearId={currentYear!} 
                    />
                  </div>

                  {/* EXAMS */}
                  <div className="space-y-4">
                    <h3 className="font-hand text-2xl font-bold border-b-2 border-marker-green inline-block px-2">Annales</h3>
                    <SubjectContentList 
                        items={currentSubject.exams} 
                        type={ContentType.EXAM} 
                        onSelect={(item) => setActiveContent({ type: ContentType.EXAM, item })}
                        subjectId={currentSubject.name}
                        yearId={currentYear!} 
                    />
                  </div>
                </div>
             </div>
           )}

           {view === 'subject' && activeContent && (
             <div className="animate-in fade-in duration-300">
               <button 
                 onClick={() => setActiveContent(null)}
                 className="mb-6 flex items-center gap-2 text-gray-500 hover:text-sketch-black font-bold transition-colors"
               >
                 <ArrowLeft size={20} /> Retour au sujet
               </button>
               
               {activeContent.type === ContentType.LECTURE && (
                 <LectureReader 
                    lectureData={activeContent.item} 
                    year={currentYear!} 
                    subject={currentSubject!.name} 
                 />
               )}
               {activeContent.type === ContentType.QUIZ && <QuizRunner quiz={activeContent.item} />}
               {activeContent.type === ContentType.EXAM && <ExamPaperReader exam={activeContent.item} />}
             </div>
           )}
        </main>
      </div>

      <NotesPanel isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}
