-- =========================================================================
-- ResLink — AI Research Collaboration Platform
-- Supabase PostgreSQL Database Schema & Seed Data Script
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to the "SQL Editor" on the left menu.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT 'password123',
  role TEXT NOT NULL DEFAULT 'Student Researcher',
  affiliation TEXT NOT NULL DEFAULT 'University',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESEARCH PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT DEFAULT '',
  interests JSONB DEFAULT '[]'::jsonb,
  experience TEXT DEFAULT '',
  expertise TEXT DEFAULT '',
  skills JSONB DEFAULT '[]'::jsonb
);

-- 3. RESEARCH PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  creator_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  domain TEXT NOT NULL DEFAULT 'Artificial Intelligence',
  status TEXT NOT NULL DEFAULT 'Team Formation',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  required_skills JSONB DEFAULT '[]'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COLLABORATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS collaboration_requests (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  project_title TEXT DEFAULT '',
  sender_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  sender_name TEXT DEFAULT '',
  receiver_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  receiver_name TEXT DEFAULT '',
  role TEXT DEFAULT 'Collaborator',
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS publications (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors TEXT DEFAULT '',
  venue TEXT DEFAULT '',
  publication_date TEXT DEFAULT '',
  doi TEXT DEFAULT ''
);

-- 6. PATENTS TABLE
CREATE TABLE IF NOT EXISTS patents (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  inventors TEXT DEFAULT '',
  filing_date TEXT DEFAULT '',
  patent_number TEXT DEFAULT '',
  status TEXT DEFAULT 'Under Review'
);

-- 7. RESEARCH RESOURCES TABLE
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Dataset',
  description TEXT DEFAULT '',
  url TEXT DEFAULT '',
  domain TEXT DEFAULT 'Artificial Intelligence'
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows API read/write access via Supabase anon / service role keys
-- =========================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Public users select" ON users;
CREATE POLICY "Public users select" ON users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public users insert" ON users;
CREATE POLICY "Public users insert" ON users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public users update" ON users;
CREATE POLICY "Public users update" ON users FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public users delete" ON users;
CREATE POLICY "Public users delete" ON users FOR DELETE USING (true);

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles select" ON profiles;
CREATE POLICY "Public profiles select" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public profiles insert" ON profiles;
CREATE POLICY "Public profiles insert" ON profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public profiles update" ON profiles;
CREATE POLICY "Public profiles update" ON profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public profiles delete" ON profiles;
CREATE POLICY "Public profiles delete" ON profiles FOR DELETE USING (true);

-- Projects policies
DROP POLICY IF EXISTS "Public projects select" ON projects;
CREATE POLICY "Public projects select" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public projects insert" ON projects;
CREATE POLICY "Public projects insert" ON projects FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public projects update" ON projects;
CREATE POLICY "Public projects update" ON projects FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public projects delete" ON projects;
CREATE POLICY "Public projects delete" ON projects FOR DELETE USING (true);

-- Collaboration requests policies
DROP POLICY IF EXISTS "Public reqs select" ON collaboration_requests;
CREATE POLICY "Public reqs select" ON collaboration_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public reqs insert" ON collaboration_requests;
CREATE POLICY "Public reqs insert" ON collaboration_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public reqs update" ON collaboration_requests;
CREATE POLICY "Public reqs update" ON collaboration_requests FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public reqs delete" ON collaboration_requests;
CREATE POLICY "Public reqs delete" ON collaboration_requests FOR DELETE USING (true);

-- Publications policies
DROP POLICY IF EXISTS "Public pubs select" ON publications;
CREATE POLICY "Public pubs select" ON publications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public pubs insert" ON publications;
CREATE POLICY "Public pubs insert" ON publications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public pubs update" ON publications;
CREATE POLICY "Public pubs update" ON publications FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public pubs delete" ON publications;
CREATE POLICY "Public pubs delete" ON publications FOR DELETE USING (true);

-- Patents policies
DROP POLICY IF EXISTS "Public pats select" ON patents;
CREATE POLICY "Public pats select" ON patents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public pats insert" ON patents;
CREATE POLICY "Public pats insert" ON patents FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public pats update" ON patents;
CREATE POLICY "Public pats update" ON patents FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public pats delete" ON patents;
CREATE POLICY "Public pats delete" ON patents FOR DELETE USING (true);

-- Resources policies
DROP POLICY IF EXISTS "Public res select" ON resources;
CREATE POLICY "Public res select" ON resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public res insert" ON resources;
CREATE POLICY "Public res insert" ON resources FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public res update" ON resources;
CREATE POLICY "Public res update" ON resources FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public res delete" ON resources;
CREATE POLICY "Public res delete" ON resources FOR DELETE USING (true);

-- =========================================================================
-- SEED INITIAL PLATFORM DATA
-- =========================================================================

-- Insert Seed Users
INSERT INTO users (id, name, email, password, role, affiliation, created_at)
VALUES
  (1, 'Dr. Arun Kumar', 'arun.kumar@reslink.edu', 'password123', 'Faculty Member', 'IIT Madras - Department of CSE', '2026-01-01T00:00:00Z'),
  (2, 'Prof. Sarah Chen', 'sarah.chen@reslink.edu', 'password123', 'Research Scholar', 'Stanford University - AI Lab', '2026-01-02T00:00:00Z'),
  (3, 'Dr. Rajesh Sharma', 'rajesh.sharma@reslink.edu', 'password123', 'Faculty Member', 'IISc Bangalore - Supercomputer Education', '2026-01-03T00:00:00Z'),
  (4, 'Elena Rostova', 'elena.rostova@reslink.edu', 'password123', 'Student Researcher', 'MIT - Media Lab', '2026-01-04T00:00:00Z'),
  (5, 'Marcus Vance', 'marcus.vance@reslink.edu', 'password123', 'Industry Partner', 'Google Research Labs', '2026-01-05T00:00:00Z'),
  (6, 'Priyanshu Patel', 'priyanshu.patel@reslink.edu', 'password123', 'Student Researcher', 'IIT Bombay - Centre for ML', '2026-01-06T00:00:00Z'),
  (7, 'Dr. Anita Roy', 'anita.roy@reslink.edu', 'password123', 'Faculty Member', 'Carnegie Mellon University', '2026-01-07T00:00:00Z'),
  (8, 'Alex Mercer', 'alex.mercer@reslink.edu', 'password123', 'Research Scholar', 'ETH Zurich - Systems Lab', '2026-01-08T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  affiliation = EXCLUDED.affiliation;

-- Reset users sequence so new registrations start from 9+
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Insert Seed Profiles
INSERT INTO profiles (user_id, bio, interests, experience, expertise, skills)
VALUES
  (1, 'Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics. Published over 40+ journal articles.',
   '["Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning"]'::jsonb,
   '12 years academic & industrial research in Deep Learning & Medical AI.',
   'Neural Network Architectures, Transformers, PyTorch, Predictive Modeling',
   '[{"name": "Machine Learning", "category": "Artificial Intelligence", "proficiency": 5}, {"name": "Python", "category": "Software Engineering", "proficiency": 5}, {"name": "NLP", "category": "Artificial Intelligence", "proficiency": 4}, {"name": "Deep Learning", "category": "Artificial Intelligence", "proficiency": 5}]'::jsonb),
  (2, 'Postdoctoral researcher focused on Large Language Models, semantic text embeddings, and multilingual NLP benchmark evaluation.',
   '["Natural Language Processing", "Transformers", "Data Science", "Machine Learning"]'::jsonb,
   '6 years post-grad research on LLM alignment, rag pipelines, and tokenization.',
   'HuggingFace, BERT, LLaMA fine-tuning, PyTorch, Vector DBs',
   '[{"name": "NLP", "category": "Artificial Intelligence", "proficiency": 5}, {"name": "Python", "category": "Software Engineering", "proficiency": 5}, {"name": "Data Science", "category": "Data Science", "proficiency": 4}, {"name": "Machine Learning", "category": "Artificial Intelligence", "proficiency": 4}]'::jsonb),
  (3, 'Supercomputing educator and systems architect designing resilient edge-cloud hybrid topologies for smart cities.',
   '["Cloud Computing", "Distributed Systems", "IoT", "Cybersecurity"]'::jsonb,
   '15 years HPC cluster optimization and high-availability distributed grids.',
   'Kubernetes, Docker, Edge Computing, MPI, Python',
   '[{"name": "Cloud Computing", "category": "Cloud & Systems", "proficiency": 5}, {"name": "Data Science", "category": "Data Science", "proficiency": 4}, {"name": "Python", "category": "Software Engineering", "proficiency": 4}]'::jsonb),
  (4, 'Graduate researcher working on Multimodal Generative AI, generative video models, and real-time diffusion pipelines.',
   '["Computer Vision", "Generative AI", "Deep Learning"]'::jsonb,
   '3 years computer vision research, OpenCV image processing, diffusion models.',
   'Diffusion Models, Stable Diffusion, PyTorch, OpenCV, Computer Vision',
   '[{"name": "Computer Vision", "category": "Artificial Intelligence", "proficiency": 5}, {"name": "Machine Learning", "category": "Artificial Intelligence", "proficiency": 4}, {"name": "Python", "category": "Software Engineering", "proficiency": 4}]'::jsonb),
  (5, 'Principal AI Scientist leading enterprise cloud ML infrastructure and privacy-preserving ML at Google Research Labs.',
   '["Cloud Computing", "Machine Learning", "Privacy-Preserving AI"]'::jsonb,
   '10 years industrial software architecture and scalable ML serving pipelines.',
   'GCP, TensorFlow Serving, Federated Learning, Python',
   '[{"name": "Cloud Computing", "category": "Cloud & Systems", "proficiency": 5}, {"name": "Machine Learning", "category": "Artificial Intelligence", "proficiency": 5}, {"name": "Python", "category": "Software Engineering", "proficiency": 5}]'::jsonb),
  (6, 'M.Tech scholar exploring IoT sensor networks, Edge AI deployment, and embedded ML optimizations.',
   '["Edge AI", "Embedded Systems", "IoT"]'::jsonb,
   '2 years embedded Linux programming and Raspberry Pi sensor analytics.',
   'TinyML, MicroPython, IoT Protocols, C++, Python',
   '[{"name": "Python", "category": "Software Engineering", "proficiency": 4}, {"name": "Machine Learning", "category": "Artificial Intelligence", "proficiency": 3}]'::jsonb),
  (7, 'Associate Professor researching Blockchain protocols, Cryptography, and Decentralized Identity at CMU.',
   '["Cybersecurity", "Blockchain", "Distributed Systems"]'::jsonb,
   '9 years cryptography and consensus mechanisms research.',
   'Smart Contracts, Zero-Knowledge Proofs, Rust, Python',
   '[{"name": "Blockchain", "category": "Cybersecurity", "proficiency": 5}, {"name": "Cybersecurity", "category": "Cybersecurity", "proficiency": 5}, {"name": "Python", "category": "Software Engineering", "proficiency": 3}]'::jsonb),
  (8, 'PhD candidate working on High-Performance Distributed Computing, Data Engineering, and Real-time Analytics at ETH Zurich.',
   '["Data Science", "Distributed Computing", "MLOps"]'::jsonb,
   '4 years Spark pipelines, Ray distributed clusters, and big data benchmarks.',
   'Apache Spark, Ray, Kafka, Python, Data Science',
   '[{"name": "Data Science", "category": "Data Science", "proficiency": 5}, {"name": "Python", "category": "Software Engineering", "proficiency": 4}]'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET
  bio = EXCLUDED.bio,
  skills = EXCLUDED.skills;

-- Insert Seed Projects
INSERT INTO projects (id, creator_id, title, description, domain, status, start_date, end_date, required_skills, team_members, milestones, created_at)
VALUES
  (1, 1, 'AI-Based Healthcare Prediction System',
   'Developing a real-time clinical prediction engine using electronic health records (EHR) and deep learning transformers to forecast patient ICU stay durations and disease progression.',
   'Artificial Intelligence', 'Team Formation', '2026-03-01', '2026-09-30',
   '[{"name": "Machine Learning", "proficiency": 4, "is_mandatory": true}, {"name": "Python", "proficiency": 4, "is_mandatory": true}, {"name": "NLP", "proficiency": 4, "is_mandatory": true}, {"name": "Cloud Computing", "proficiency": 4, "is_mandatory": true}, {"name": "Data Science", "proficiency": 4, "is_mandatory": true}]'::jsonb,
   '[{"id": 1, "name": "Dr. Arun Kumar", "role": "Principal Investigator", "affiliation": "IIT Madras"}]'::jsonb,
   '[{"id": 1, "title": "Literature Review & Dataset Ingestion", "description": "Incorporate MIMIC-IV electronic health dataset.", "due_date": "2026-04-15", "status": "Completed"}, {"id": 2, "title": "Transformer Model Training & Evaluation", "description": "Train BERT/BioClinical models on clinical text.", "due_date": "2026-06-30", "status": "In Progress"}]'::jsonb,
   '2026-03-01T00:00:00Z'),
  (2, 2, 'Multilingual LLM Evaluation Benchmark',
   'Constructing an open-source evaluation suite to benchmark multilingual reasoning capabilities of LLMs across Indian languages.',
   'Natural Language Processing', 'In Progress', '2026-01-15', '2026-08-15',
   '[{"name": "NLP", "proficiency": 5, "is_mandatory": true}, {"name": "Python", "proficiency": 5, "is_mandatory": true}, {"name": "Data Science", "proficiency": 4, "is_mandatory": true}]'::jsonb,
   '[{"id": 2, "name": "Prof. Sarah Chen", "role": "Lead Researcher", "affiliation": "Stanford University"}, {"id": 1, "name": "Dr. Arun Kumar", "role": "Co-Investigator", "affiliation": "IIT Madras"}]'::jsonb,
   '[]'::jsonb,
   '2026-01-15T00:00:00Z'),
  (3, 3, 'Secure Edge-Cloud AI Framework for Smart Grids',
   'Designing a fault-tolerant, privacy-preserving microservices framework for processing IoT smart meter analytics using cloud edge nodes.',
   'Cloud & Distributed Systems', 'Planning', '2026-05-01', '2026-11-30',
   '[{"name": "Cloud Computing", "proficiency": 5, "is_mandatory": true}, {"name": "Cybersecurity", "proficiency": 4, "is_mandatory": true}, {"name": "IoT", "proficiency": 4, "is_mandatory": true}, {"name": "Python", "proficiency": 4, "is_mandatory": true}]'::jsonb,
   '[{"id": 3, "name": "Dr. Rajesh Sharma", "role": "Project Creator", "affiliation": "IISc Bangalore"}]'::jsonb,
   '[]'::jsonb,
   '2026-05-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- Insert Seed Collaboration Requests
INSERT INTO collaboration_requests (id, project_id, project_title, sender_id, sender_name, receiver_id, receiver_name, role, status, created_at)
VALUES
  (101, 1, 'AI-Based Healthcare Prediction System', 1, 'Dr. Arun Kumar', 2, 'Prof. Sarah Chen', 'Collaborator', 'Pending', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

SELECT setval('collaboration_requests_id_seq', (SELECT MAX(id) FROM collaboration_requests));

-- Insert Seed Publications
INSERT INTO publications (id, project_id, title, authors, venue, publication_date, doi)
VALUES
  (1, 1, 'Transformer Architectures for Predictive Healthcare Analytics', 'Dr. Arun Kumar, Prof. Sarah Chen', 'IEEE Journal of Biomedical & Health Informatics', '2026-01-20', '10.1109/JBHI.2026.381920'),
  (2, 2, 'Benchmarking Multilingual LLMs in Low-Resource Settings', 'Prof. Sarah Chen, Dr. Arun Kumar', 'NeurIPS 2025 Benchmarks Track', '2025-12-10', '10.48550/arXiv.2512.09182')
ON CONFLICT (id) DO NOTHING;

SELECT setval('publications_id_seq', (SELECT MAX(id) FROM publications));

-- Insert Seed Patents
INSERT INTO patents (id, project_id, title, inventors, filing_date, patent_number, status)
VALUES
  (1, 1, 'Privacy-Preserving Clinical Risk Scoring via Neural Vector Quantization', 'Dr. Arun Kumar, Marcus Vance', '2026-02-14', 'US20260049281A1', 'Under Review')
ON CONFLICT (id) DO NOTHING;

SELECT setval('patents_id_seq', (SELECT MAX(id) FROM patents));

-- Insert Seed Resources
INSERT INTO resources (id, name, type, description, url, domain)
VALUES
  (1, 'MIMIC-IV De-identified Clinical Dataset', 'Dataset', 'Electronic health records covering thousands of ICU patient stays for predictive medical modeling.', 'https://physionet.org/content/mimiciv/', 'Artificial Intelligence'),
  (2, 'HuggingFace Transformers Library', 'Framework', 'State-of-the-art Natural Language Processing library for PyTorch and TensorFlow.', 'https://huggingface.co/docs/transformers/', 'Natural Language Processing')
ON CONFLICT (id) DO NOTHING;

SELECT setval('resources_id_seq', (SELECT MAX(id) FROM resources));
