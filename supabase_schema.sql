-- MediSketch Supabase Schema
-- Medical Study App Database Structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  year_level TEXT NOT NULL CHECK (year_level IN ('PCEM1', 'PCEM2', 'DCEM1', 'DCEM2', 'DCEM3', 'DCEM4')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  year_level TEXT NOT NULL CHECK (year_level IN ('PCEM1', 'PCEM2', 'DCEM1', 'DCEM2', 'DCEM3', 'DCEM4')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lectures table
CREATE TABLE lectures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lecture sections table
CREATE TABLE lecture_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heading', 'paragraph', 'bullet', 'highlight', 'image', 'warning')),
  content TEXT NOT NULL,
  color TEXT CHECK (color IN ('yellow', 'pink', 'blue', 'green')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table (for quizzes and exams)
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions junction table
CREATE TABLE quiz_questions (
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  PRIMARY KEY (quiz_id, question_id)
);

-- Exams table
CREATE TABLE exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam questions junction table
CREATE TABLE exam_questions (
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  PRIMARY KEY (exam_id, question_id)
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('exam', 'deadline', 'study')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study tasks table
CREATE TABLE study_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'progress', 'done')),
  subject TEXT NOT NULL,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flashcards table
CREATE TABLE flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('new', 'learning', 'review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repetition sessions table
CREATE TABLE repetition_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  cards_reviewed INTEGER NOT NULL,
  accuracy INTEGER NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_subjects_year_level ON subjects(year_level);
CREATE INDEX idx_lectures_subject_id ON lectures(subject_id);
CREATE INDEX idx_lecture_sections_lecture_id ON lecture_sections(lecture_id);
CREATE INDEX idx_quizzes_subject_id ON quizzes(subject_id);
CREATE INDEX idx_exams_subject_id ON exams(subject_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(date);
CREATE INDEX idx_study_tasks_user_id ON study_tasks(user_id);
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_subject_id ON flashcards(subject_id);
CREATE INDEX idx_repetition_sessions_user_id ON repetition_sessions(user_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE repetition_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects: Everyone can read, only authenticated users can insert/update
CREATE POLICY "Everyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert subjects" ON subjects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update subjects" ON subjects FOR UPDATE USING (auth.role() = 'authenticated');

-- Lectures: Everyone can read, authenticated users can modify
CREATE POLICY "Everyone can view lectures" ON lectures FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage lectures" ON lectures FOR ALL USING (auth.role() = 'authenticated');

-- Lecture sections: Same as lectures
CREATE POLICY "Everyone can view lecture sections" ON lecture_sections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage lecture sections" ON lecture_sections FOR ALL USING (auth.role() = 'authenticated');

-- Questions: Everyone can read, authenticated users can modify
CREATE POLICY "Everyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage questions" ON questions FOR ALL USING (auth.role() = 'authenticated');

-- Quizzes: Everyone can read, authenticated users can modify
CREATE POLICY "Everyone can view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage quizzes" ON quizzes FOR ALL USING (auth.role() = 'authenticated');

-- Quiz questions: Same as quizzes
CREATE POLICY "Everyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage quiz questions" ON quiz_questions FOR ALL USING (auth.role() = 'authenticated');

-- Exams: Everyone can read, authenticated users can modify
CREATE POLICY "Everyone can view exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage exams" ON exams FOR ALL USING (auth.role() = 'authenticated');

-- Exam questions: Same as exams
CREATE POLICY "Everyone can view exam questions" ON exam_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage exam questions" ON exam_questions FOR ALL USING (auth.role() = 'authenticated');

-- Notes: Users can only manage their own notes
CREATE POLICY "Users can manage own notes" ON notes FOR ALL USING (auth.uid() = user_id);

-- Calendar events: Users can only manage their own events
CREATE POLICY "Users can manage own calendar events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- Study tasks: Users can only manage their own tasks
CREATE POLICY "Users can manage own study tasks" ON study_tasks FOR ALL USING (auth.uid() = user_id);

-- Flashcards: Users can only manage their own flashcards
CREATE POLICY "Users can manage own flashcards" ON flashcards FOR ALL USING (auth.uid() = user_id);

-- Repetition sessions: Users can only manage their own sessions
CREATE POLICY "Users can manage own repetition sessions" ON repetition_sessions FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_tasks_updated_at BEFORE UPDATE ON study_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial subjects data
INSERT INTO subjects (name, icon, description, year_level) VALUES
('Anatomie', 'Bone', 'Étude de la structure du corps humain.', 'PCEM1'),
('Physiologie', 'Kidney', 'Fonctionnement des organismes vivants.', 'PCEM1'),
('Cardiologie', 'Heart', 'Pathologies du cœur et des vaisseaux.', 'DCEM2'),
('Pneumologie', 'Wind', 'Maladies des poumons et voies respiratoires.', 'DCEM2');

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, year_level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Nouveau Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'year_level', 'PCEM1')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
