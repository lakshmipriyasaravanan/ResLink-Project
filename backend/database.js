const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read .env file:', e.message);
    }
  }
}
loadEnv();

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const DB_FILE = path.join(__dirname, 'reslink.db');
const JSON_BACKUP_FILE = path.join(__dirname, 'reslink_db.json');

// Initial Seed Data
const SEED_USERS = [
  {
    id: 1,
    name: "Dr. Arun Kumar",
    email: "arun.kumar@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "IIT Madras - Department of CSE",
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Prof. Sarah Chen",
    email: "sarah.chen@reslink.edu",
    password: "password123",
    role: "Research Scholar",
    affiliation: "Stanford University - AI Lab",
    created_at: "2026-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "IISc Bangalore - Supercomputer Education",
    created_at: "2026-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    name: "Elena Rostova",
    email: "elena.rostova@reslink.edu",
    password: "password123",
    role: "Student Researcher",
    affiliation: "MIT - Media Lab",
    created_at: "2026-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    name: "Marcus Vance",
    email: "marcus.vance@reslink.edu",
    password: "password123",
    role: "Industry Partner",
    affiliation: "Google Research Labs",
    created_at: "2026-01-05T00:00:00.000Z",
  },
  {
    id: 6,
    name: "Priyanshu Patel",
    email: "priyanshu.patel@reslink.edu",
    password: "password123",
    role: "Student Researcher",
    affiliation: "IIT Bombay - Centre for ML",
    created_at: "2026-01-06T00:00:00.000Z",
  },
  {
    id: 7,
    name: "Dr. Anita Roy",
    email: "anita.roy@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "Carnegie Mellon University",
    created_at: "2026-01-07T00:00:00.000Z",
  },
  {
    id: 8,
    name: "Alex Mercer",
    email: "alex.mercer@reslink.edu",
    password: "password123",
    role: "Research Scholar",
    affiliation: "ETH Zurich - Systems Lab",
    created_at: "2026-01-08T00:00:00.000Z",
  },
];

const SEED_PROFILES = {
  1: {
    user_id: 1,
    bio: "Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics. Published over 40+ journal articles.",
    interests: ["Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning"],
    experience: "12 years academic & industrial research in Deep Learning & Medical AI.",
    expertise: "Neural Network Architectures, Transformers, PyTorch, Predictive Modeling",
    skills: [
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
      { name: "NLP", category: "Artificial Intelligence", proficiency: 4 },
      { name: "Deep Learning", category: "Artificial Intelligence", proficiency: 5 },
    ],
  },
  2: {
    user_id: 2,
    bio: "Postdoctoral researcher focused on Large Language Models, semantic text embeddings, and multilingual NLP benchmark evaluation.",
    interests: ["Natural Language Processing", "Transformers", "Data Science", "Machine Learning"],
    experience: "6 years post-grad research on LLM alignment, rag pipelines, and tokenization.",
    expertise: "HuggingFace, BERT, LLaMA fine-tuning, PyTorch, Vector DBs",
    skills: [
      { name: "NLP", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
      { name: "Data Science", category: "Data Science", proficiency: 4 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 4 },
    ],
  },
  3: {
    user_id: 3,
    bio: "Supercomputing educator and systems architect designing resilient edge-cloud hybrid topologies for smart cities.",
    interests: ["Cloud Computing", "Distributed Systems", "IoT", "Cybersecurity"],
    experience: "15 years HPC cluster optimization and high-availability distributed grids.",
    expertise: "Kubernetes, Docker, Edge Computing, MPI, Python",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Data Science", category: "Data Science", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
  4: {
    user_id: 4,
    bio: "Graduate researcher working on Multimodal Generative AI, generative video models, and real-time diffusion pipelines.",
    interests: ["Computer Vision", "Generative AI", "Deep Learning"],
    experience: "3 years computer vision research, OpenCV image processing, diffusion models.",
    expertise: "Diffusion Models, Stable Diffusion, PyTorch, OpenCV, Computer Vision",
    skills: [
      { name: "Computer Vision", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
  5: {
    user_id: 5,
    bio: "Principal AI Scientist leading enterprise cloud ML infrastructure and privacy-preserving ML at Google Research Labs.",
    interests: ["Cloud Computing", "Machine Learning", "Privacy-Preserving AI"],
    experience: "10 years industrial software architecture and scalable ML serving pipelines.",
    expertise: "GCP, TensorFlow Serving, Federated Learning, Python",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
    ],
  },
  6: {
    user_id: 6,
    bio: "M.Tech scholar exploring IoT sensor networks, Edge AI deployment, and embedded ML optimizations.",
    interests: ["Edge AI", "Embedded Systems", "IoT"],
    experience: "2 years embedded Linux programming and Raspberry Pi sensor analytics.",
    expertise: "TinyML, MicroPython, IoT Protocols, C++, Python",
    skills: [
      { name: "Python", category: "Software Engineering", proficiency: 4 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 3 },
    ],
  },
  7: {
    user_id: 7,
    bio: "Associate Professor researching Blockchain protocols, Cryptography, and Decentralized Identity at CMU.",
    interests: ["Cybersecurity", "Blockchain", "Distributed Systems"],
    experience: "9 years cryptography and consensus mechanisms research.",
    expertise: "Smart Contracts, Zero-Knowledge Proofs, Rust, Python",
    skills: [
      { name: "Blockchain", category: "Cybersecurity", proficiency: 5 },
      { name: "Cybersecurity", category: "Cybersecurity", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 3 },
    ],
  },
  8: {
    user_id: 8,
    bio: "PhD candidate working on High-Performance Distributed Computing, Data Engineering, and Real-time Analytics at ETH Zurich.",
    interests: ["Data Science", "Distributed Computing", "MLOps"],
    experience: "4 years Spark pipelines, Ray distributed clusters, and big data benchmarks.",
    expertise: "Apache Spark, Ray, Kafka, Python, Data Science",
    skills: [
      { name: "Data Science", category: "Data Science", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
};

const SEED_PROJECTS = [
  {
    id: 1,
    creator_id: 1,
    title: "AI-Based Healthcare Prediction System",
    description: "Developing a real-time clinical prediction engine using electronic health records (EHR) and deep learning transformers to forecast patient ICU stay durations and disease progression.",
    domain: "Artificial Intelligence",
    status: "Team Formation",
    start_date: "2026-03-01",
    end_date: "2026-09-30",
    required_skills: [
      { name: "Machine Learning", proficiency: 4, is_mandatory: true },
      { name: "Python", proficiency: 4, is_mandatory: true },
      { name: "NLP", proficiency: 4, is_mandatory: true },
      { name: "Cloud Computing", proficiency: 4, is_mandatory: true },
      { name: "Data Science", proficiency: 4, is_mandatory: true },
    ],
    team_members: [
      { id: 1, name: "Dr. Arun Kumar", role: "Principal Investigator", affiliation: "IIT Madras" },
    ],
    milestones: [
      { id: 1, title: "Literature Review & Dataset Ingestion", description: "Incorporate MIMIC-IV electronic health dataset.", due_date: "2026-04-15", status: "Completed" },
      { id: 2, title: "Transformer Model Training & Evaluation", description: "Train BERT/BioClinical models on clinical text.", due_date: "2026-06-30", status: "In Progress" },
    ],
    created_at: "2026-03-01T00:00:00.000Z",
  },
  {
    id: 2,
    creator_id: 2,
    title: "Multilingual LLM Evaluation Benchmark",
    description: "Constructing an open-source evaluation suite to benchmark multilingual reasoning capabilities of LLMs across Indian languages.",
    domain: "Natural Language Processing",
    status: "In Progress",
    start_date: "2026-01-15",
    end_date: "2026-08-15",
    required_skills: [
      { name: "NLP", proficiency: 5, is_mandatory: true },
      { name: "Python", proficiency: 5, is_mandatory: true },
      { name: "Data Science", proficiency: 4, is_mandatory: true },
    ],
    team_members: [
      { id: 2, name: "Prof. Sarah Chen", role: "Lead Researcher", affiliation: "Stanford University" },
      { id: 1, name: "Dr. Arun Kumar", role: "Co-Investigator", affiliation: "IIT Madras" },
    ],
    milestones: [],
    created_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: 3,
    creator_id: 3,
    title: "Secure Edge-Cloud AI Framework for Smart Grids",
    description: "Designing a fault-tolerant, privacy-preserving microservices framework for processing IoT smart meter analytics using cloud edge nodes.",
    domain: "Cloud & Distributed Systems",
    status: "Planning",
    start_date: "2026-05-01",
    end_date: "2026-11-30",
    required_skills: [
      { name: "Cloud Computing", proficiency: 5, is_mandatory: true },
      { name: "Cybersecurity", proficiency: 4, is_mandatory: true },
      { name: "IoT", proficiency: 4, is_mandatory: true },
      { name: "Python", proficiency: 4, is_mandatory: true },
    ],
    team_members: [
      { id: 3, name: "Dr. Rajesh Sharma", role: "Project Creator", affiliation: "IISc Bangalore" },
    ],
    milestones: [],
    created_at: "2026-05-01T00:00:00.000Z",
  },
];

const SEED_REQUESTS = [
  {
    id: 101,
    project_id: 1,
    project_title: "AI-Based Healthcare Prediction System",
    sender_id: 1,
    sender_name: "Dr. Arun Kumar",
    receiver_id: 2,
    receiver_name: "Prof. Sarah Chen",
    role: "Collaborator",
    status: "Pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

const SEED_PUBLICATIONS = [
  {
    id: 1,
    project_id: 1,
    title: "Transformer Architectures for Predictive Healthcare Analytics",
    authors: "Dr. Arun Kumar, Prof. Sarah Chen",
    venue: "IEEE Journal of Biomedical & Health Informatics",
    publication_date: "2026-01-20",
    doi: "10.1109/JBHI.2026.381920",
  },
  {
    id: 2,
    project_id: 2,
    title: "Benchmarking Multilingual LLMs in Low-Resource Settings",
    authors: "Prof. Sarah Chen, Dr. Arun Kumar",
    venue: "NeurIPS 2025 Benchmarks Track",
    publication_date: "2025-12-10",
    doi: "10.48550/arXiv.2512.09182",
  },
];

const SEED_PATENTS = [
  {
    id: 1,
    project_id: 1,
    title: "Privacy-Preserving Clinical Risk Scoring via Neural Vector Quantization",
    inventors: "Dr. Arun Kumar, Marcus Vance",
    filing_date: "2026-02-14",
    patent_number: "US20260049281A1",
    status: "Under Review",
  },
];

const SEED_RESOURCES = [
  {
    id: 1,
    name: "MIMIC-IV De-identified Clinical Dataset",
    type: "Dataset",
    description: "Electronic health records covering thousands of ICU patient stays for predictive medical modeling.",
    url: "https://physionet.org/content/mimiciv/",
    domain: "Artificial Intelligence",
  },
  {
    id: 2,
    name: "HuggingFace Transformers Library",
    type: "Framework",
    description: "State-of-the-art Natural Language Processing library for PyTorch and TensorFlow.",
    url: "https://huggingface.co/docs/transformers/",
    domain: "Natural Language Processing",
  },
];

// Supabase REST Client
class SupabaseClient {
  constructor(url, key) {
    this.baseUrl = url.replace(/\/$/, '') + '/rest/v1';
    this.key = key;
  }

  async request(path, options = {}) {
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...(options.headers || {})
    };

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errText = await res.text();
      let parsed;
      try { parsed = JSON.parse(errText); } catch (e) { parsed = { message: errText }; }
      throw new Error(parsed.message || parsed.detail || `Supabase HTTP ${res.status}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
}

// Unified Database Layer
class Database {
  constructor() {
    this.supabase = null;
    this.isSupabaseActive = false;
    this.sqliteDb = null;
    this.useSqlite = false;
    this.memoryData = null;

    this.initSupabase();
    this.initSqlite();
    this.initData();
  }

  initSupabase() {
    if (SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.includes('supabase.co')) {
      this.supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
      this.isSupabaseActive = true;
      console.log(`✓ Connected to Cloud Supabase Database: ${SUPABASE_URL}`);
    } else {
      console.log('ℹ Supabase not configured in .env (or credentials empty). Running with persistent SQLite database engine.');
    }
  }

  initSqlite() {
    try {
      const { DatabaseSync } = require('node:sqlite');
      this.sqliteDb = new DatabaseSync(DB_FILE);
      this.useSqlite = true;

      // Create Tables
      this.sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          affiliation TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS profiles (
          user_id INTEGER PRIMARY KEY,
          bio TEXT,
          interests TEXT,
          experience TEXT,
          expertise TEXT,
          skills TEXT
        );

        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          creator_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          domain TEXT,
          status TEXT,
          start_date TEXT,
          end_date TEXT,
          required_skills TEXT,
          team_members TEXT,
          milestones TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS collaboration_requests (
          id INTEGER PRIMARY KEY,
          project_id INTEGER NOT NULL,
          project_title TEXT NOT NULL,
          sender_id INTEGER NOT NULL,
          sender_name TEXT NOT NULL,
          receiver_id INTEGER NOT NULL,
          receiver_name TEXT NOT NULL,
          role TEXT,
          status TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS publications (
          id INTEGER PRIMARY KEY,
          project_id INTEGER,
          title TEXT,
          authors TEXT,
          venue TEXT,
          publication_date TEXT,
          doi TEXT
        );

        CREATE TABLE IF NOT EXISTS patents (
          id INTEGER PRIMARY KEY,
          project_id INTEGER,
          title TEXT,
          inventors TEXT,
          filing_date TEXT,
          patent_number TEXT,
          status TEXT
        );

        CREATE TABLE IF NOT EXISTS resources (
          id INTEGER PRIMARY KEY,
          name TEXT,
          type TEXT,
          description TEXT,
          url TEXT,
          domain TEXT
        );
      `);
      console.log('✓ SQLite Database initialized: reslink.db');
    } catch (err) {
      console.warn('Note: node:sqlite not available, using persistent JSON engine:', err.message);
      this.useSqlite = false;
    }
  }

  initData() {
    if (this.useSqlite) {
      const countResult = this.sqliteDb.prepare('SELECT count(*) as count FROM users').get();
      if (!countResult || countResult.count === 0) {
        console.log('Seeding initial data into SQLite database...');
        const insertUser = this.sqliteDb.prepare(`
          INSERT INTO users (id, name, email, password, role, affiliation, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const insertProfile = this.sqliteDb.prepare(`
          INSERT INTO profiles (user_id, bio, interests, experience, expertise, skills)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        const insertProject = this.sqliteDb.prepare(`
          INSERT INTO projects (id, creator_id, title, description, domain, status, start_date, end_date, required_skills, team_members, milestones, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertReq = this.sqliteDb.prepare(`
          INSERT INTO collaboration_requests (id, project_id, project_title, sender_id, sender_name, receiver_id, receiver_name, role, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertPub = this.sqliteDb.prepare(`
          INSERT INTO publications (id, project_id, title, authors, venue, publication_date, doi)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const insertPat = this.sqliteDb.prepare(`
          INSERT INTO patents (id, project_id, title, inventors, filing_date, patent_number, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const insertRes = this.sqliteDb.prepare(`
          INSERT INTO resources (id, name, type, description, url, domain)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const u of SEED_USERS) {
          insertUser.run(u.id, u.name, u.email, u.password, u.role, u.affiliation, u.created_at);
          const p = SEED_PROFILES[u.id] || { bio: '', interests: [], experience: '', expertise: '', skills: [] };
          insertProfile.run(
            u.id,
            p.bio || '',
            JSON.stringify(p.interests || []),
            p.experience || '',
            p.expertise || '',
            JSON.stringify(p.skills || [])
          );
        }

        for (const pr of SEED_PROJECTS) {
          insertProject.run(
            pr.id,
            pr.creator_id,
            pr.title,
            pr.description,
            pr.domain,
            pr.status,
            pr.start_date,
            pr.end_date,
            JSON.stringify(pr.required_skills || []),
            JSON.stringify(pr.team_members || []),
            JSON.stringify(pr.milestones || []),
            pr.created_at
          );
        }

        for (const r of SEED_REQUESTS) {
          insertReq.run(r.id, r.project_id, r.project_title, r.sender_id, r.sender_name, r.receiver_id, r.receiver_name, r.role, r.status, r.created_at);
        }

        for (const pub of SEED_PUBLICATIONS) {
          insertPub.run(pub.id, pub.project_id, pub.title, pub.authors, pub.venue, pub.publication_date, pub.doi);
        }

        for (const pat of SEED_PATENTS) {
          insertPat.run(pat.id, pat.project_id, pat.title, pat.inventors, pat.filing_date, pat.patent_number, pat.status);
        }

        for (const res of SEED_RESOURCES) {
          insertRes.run(res.id, res.name, res.type, res.description, res.url, res.domain);
        }
      }
      this.syncToJson();
    } else {
      if (fs.existsSync(JSON_BACKUP_FILE)) {
        try {
          this.memoryData = JSON.parse(fs.readFileSync(JSON_BACKUP_FILE, 'utf8'));
        } catch (e) {
          this.memoryData = null;
        }
      }

      if (!this.memoryData || !this.memoryData.users) {
        this.memoryData = {
          users: SEED_USERS,
          profiles: SEED_PROFILES,
          projects: SEED_PROJECTS,
          collaborationRequests: SEED_REQUESTS,
          publications: SEED_PUBLICATIONS,
          patents: SEED_PATENTS,
          resources: SEED_RESOURCES,
        };
        this.saveJson();
      }
    }
  }

  saveJson() {
    try {
      fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(this.memoryData, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write JSON backup file:', e);
    }
  }

  syncToJson() {
    if (!this.useSqlite) return;
    try {
      const data = {
        users: this.getAllUsersSync(),
        profiles: this.getAllProfilesSync(),
        projects: this.getAllProjectsSync(),
        collaborationRequests: this.getCollaborationRequestsSync(),
        publications: this.getPublicationsSync(),
        patents: this.getPatentsSync(),
        resources: this.getResourcesSync(),
      };
      fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  }

  // --- Users Operations ---
  async getAllUsers() {
    if (this.isSupabaseActive) {
      try {
        return await this.supabase.request('/users?select=*&order=id.asc');
      } catch (err) {
        console.warn('Supabase getAllUsers failed, falling back to local:', err.message);
      }
    }
    return this.getAllUsersSync();
  }

  getAllUsersSync() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users ORDER BY id ASC').all();
    }
    return this.memoryData.users;
  }

  async getUserById(id) {
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request(`/users?id=eq.${id}&select=*`);
        return rows && rows[0] ? rows[0] : null;
      } catch (err) {
        console.warn('Supabase getUserById failed, falling back to local:', err.message);
      }
    }
    return this.getUserByIdSync(id);
  }

  getUserByIdSync(id) {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;
    }
    return this.memoryData.users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request(`/users?email=ilike.${encodeURIComponent(cleanEmail)}&select=*`);
        return rows && rows[0] ? rows[0] : null;
      } catch (err) {
        console.warn('Supabase getUserByEmail failed, falling back to local:', err.message);
      }
    }
    return this.getUserByEmailSync(cleanEmail);
  }

  getUserByEmailSync(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail) || null;
    }
    return this.memoryData.users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
  }

  async createUser({ name, email, password, role, affiliation }) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await this.getUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('Email already registered');
    }

    const createdAt = new Date().toISOString();

    if (this.isSupabaseActive) {
      try {
        const createdUsers = await this.supabase.request('/users', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email: cleanEmail,
            password: password || 'password123',
            role: role || 'Student Researcher',
            affiliation: affiliation || 'University',
            created_at: createdAt
          })
        });
        const newUser = createdUsers[0];

        // Create initial profile in Supabase
        await this.supabase.request('/profiles', {
          method: 'POST',
          body: JSON.stringify({
            user_id: newUser.id,
            bio: 'Research profile initialized.',
            interests: ['Artificial Intelligence', 'Data Science'],
            experience: 'Academic research enthusiast.',
            expertise: 'Python, Machine Learning',
            skills: [{ name: 'Python', category: 'Software Engineering', proficiency: 4 }]
          })
        });

        // Also replicate locally
        this.createUserLocal({ id: newUser.id, name, email: cleanEmail, password, role, affiliation, createdAt });
        return newUser;
      } catch (err) {
        console.warn('Supabase createUser failed, creating locally:', err.message);
      }
    }

    return this.createUserLocal({ name, email: cleanEmail, password, role, affiliation, createdAt });
  }

  createUserLocal({ id, name, email, password, role, affiliation, createdAt }) {
    let newId = id;
    if (this.useSqlite) {
      if (id) {
        this.sqliteDb.prepare(`
          INSERT INTO users (id, name, email, password, role, affiliation, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET name = excluded.name
        `).run(id, name, email, password, role, affiliation, createdAt);
      } else {
        const result = this.sqliteDb.prepare(`
          INSERT INTO users (name, email, password, role, affiliation, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(name, email, password, role, affiliation, createdAt);
        newId = Number(result.lastInsertRowid);
      }

      this.sqliteDb.prepare(`
        INSERT INTO profiles (user_id, bio, interests, experience, expertise, skills)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO NOTHING
      `).run(
        newId,
        'Research profile initialized.',
        JSON.stringify(['Artificial Intelligence', 'Data Science']),
        'Academic research enthusiast.',
        'Python, Machine Learning',
        JSON.stringify([{ name: 'Python', category: 'Software Engineering', proficiency: 4 }])
      );
      this.syncToJson();
    } else {
      newId = id || Math.max(10, ...this.memoryData.users.map(u => u.id || 0)) + 1;
      const newUser = {
        id: newId,
        name,
        email,
        password,
        role: role || 'Student Researcher',
        affiliation: affiliation || 'University',
        created_at: createdAt,
      };
      this.memoryData.users.push(newUser);
      this.memoryData.profiles[newId] = {
        user_id: newId,
        bio: 'Research profile initialized.',
        interests: ['Artificial Intelligence', 'Data Science'],
        experience: 'Academic research enthusiast.',
        expertise: 'Python, Machine Learning',
        skills: [{ name: 'Python', category: 'Software Engineering', proficiency: 4 }],
      };
      this.saveJson();
    }

    return this.getUserByIdSync(newId);
  }

  // --- Profiles Operations ---
  async getProfile(userId) {
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request(`/profiles?user_id=eq.${userId}&select=*`);
        if (rows && rows[0]) {
          return {
            user_id: rows[0].user_id,
            bio: rows[0].bio || '',
            interests: rows[0].interests || [],
            experience: rows[0].experience || '',
            expertise: rows[0].expertise || '',
            skills: rows[0].skills || [],
          };
        }
      } catch (err) {
        console.warn('Supabase getProfile failed, reading locally:', err.message);
      }
    }
    return this.getProfileSync(userId);
  }

  getProfileSync(userId) {
    if (this.useSqlite) {
      const row = this.sqliteDb.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
      if (!row) return null;
      return {
        user_id: row.user_id,
        bio: row.bio || '',
        interests: JSON.parse(row.interests || '[]'),
        experience: row.experience || '',
        expertise: row.expertise || '',
        skills: JSON.parse(row.skills || '[]'),
      };
    }
    return this.memoryData.profiles[userId] || null;
  }

  async getAllProfiles() {
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/profiles?select=*');
        const map = {};
        for (const row of rows) {
          map[row.user_id] = {
            user_id: row.user_id,
            bio: row.bio || '',
            interests: row.interests || [],
            experience: row.experience || '',
            expertise: row.expertise || '',
            skills: row.skills || [],
          };
        }
        return map;
      } catch (err) {
        console.warn('Supabase getAllProfiles failed, falling back to local:', err.message);
      }
    }
    return this.getAllProfilesSync();
  }

  getAllProfilesSync() {
    if (this.useSqlite) {
      const rows = this.sqliteDb.prepare('SELECT * FROM profiles').all();
      const map = {};
      for (const row of rows) {
        map[row.user_id] = {
          user_id: row.user_id,
          bio: row.bio || '',
          interests: JSON.parse(row.interests || '[]'),
          experience: row.experience || '',
          expertise: row.expertise || '',
          skills: JSON.parse(row.skills || '[]'),
        };
      }
      return map;
    }
    return this.memoryData.profiles;
  }

  async saveProfile(userId, profileData) {
    const existing = (await this.getProfile(userId)) || {};
    const updated = { ...existing, ...profileData, user_id: userId };

    if (this.isSupabaseActive) {
      try {
        await this.supabase.request('/profiles', {
          method: 'POST',
          prefer: 'resolution=merge-duplicates,return=representation',
          body: JSON.stringify({
            user_id: userId,
            bio: updated.bio || '',
            interests: updated.interests || [],
            experience: updated.experience || '',
            expertise: updated.expertise || '',
            skills: updated.skills || []
          })
        });
      } catch (err) {
        console.warn('Supabase saveProfile failed, saving locally:', err.message);
      }
    }

    // Always replicate locally
    if (this.useSqlite) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO profiles (user_id, bio, interests, experience, expertise, skills)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          bio = excluded.bio,
          interests = excluded.interests,
          experience = excluded.experience,
          expertise = excluded.expertise,
          skills = excluded.skills
      `);
      stmt.run(
        userId,
        updated.bio || '',
        JSON.stringify(updated.interests || []),
        updated.experience || '',
        updated.expertise || '',
        JSON.stringify(updated.skills || [])
      );
      this.syncToJson();
    } else {
      this.memoryData.profiles[userId] = updated;
      this.saveJson();
    }
    return updated;
  }

  // --- Projects Operations ---
  async getAllProjects() {
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/projects?select=*&order=id.desc');
        return rows.map(r => ({
          ...r,
          required_skills: r.required_skills || [],
          team_members: r.team_members || [],
          milestones: r.milestones || []
        }));
      } catch (err) {
        console.warn('Supabase getAllProjects failed, falling back to local:', err.message);
      }
    }
    return this.getAllProjectsSync();
  }

  getAllProjectsSync() {
    if (this.useSqlite) {
      const rows = this.sqliteDb.prepare('SELECT * FROM projects ORDER BY id DESC').all();
      return rows.map(r => ({
        id: r.id,
        creator_id: r.creator_id,
        title: r.title,
        description: r.description,
        domain: r.domain,
        status: r.status,
        start_date: r.start_date,
        end_date: r.end_date,
        required_skills: JSON.parse(r.required_skills || '[]'),
        team_members: JSON.parse(r.team_members || '[]'),
        milestones: JSON.parse(r.milestones || '[]'),
        created_at: r.created_at,
      }));
    }
    return this.memoryData.projects;
  }

  async getProjectById(id) {
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request(`/projects?id=eq.${id}&select=*`);
        if (rows && rows[0]) {
          return {
            ...rows[0],
            required_skills: rows[0].required_skills || [],
            team_members: rows[0].team_members || [],
            milestones: rows[0].milestones || []
          };
        }
      } catch (err) {
        console.warn('Supabase getProjectById failed, reading locally:', err.message);
      }
    }
    return this.getProjectByIdSync(id);
  }

  getProjectByIdSync(id) {
    if (this.useSqlite) {
      const r = this.sqliteDb.prepare('SELECT * FROM projects WHERE id = ?').get(id);
      if (!r) return null;
      return {
        id: r.id,
        creator_id: r.creator_id,
        title: r.title,
        description: r.description,
        domain: r.domain,
        status: r.status,
        start_date: r.start_date,
        end_date: r.end_date,
        required_skills: JSON.parse(r.required_skills || '[]'),
        team_members: JSON.parse(r.team_members || '[]'),
        milestones: JSON.parse(r.milestones || '[]'),
        created_at: r.created_at,
      };
    }
    return this.memoryData.projects.find(p => p.id === id) || null;
  }

  async createProject(projectData) {
    const createdAt = new Date().toISOString();

    if (this.isSupabaseActive) {
      try {
        const createdRows = await this.supabase.request('/projects', {
          method: 'POST',
          body: JSON.stringify({
            creator_id: projectData.creator_id,
            title: projectData.title,
            description: projectData.description || '',
            domain: projectData.domain || 'Artificial Intelligence',
            status: projectData.status || 'Team Formation',
            start_date: projectData.start_date || '',
            end_date: projectData.end_date || '',
            required_skills: projectData.required_skills || [],
            team_members: projectData.team_members || [],
            milestones: projectData.milestones || [],
            created_at: createdAt
          })
        });
        const newProj = createdRows[0];
        // Replicate locally
        this.createProjectLocal({ ...newProj });
        return newProj;
      } catch (err) {
        console.warn('Supabase createProject failed, creating locally:', err.message);
      }
    }

    return this.createProjectLocal({ ...projectData, created_at: createdAt });
  }

  createProjectLocal(projectData) {
    const createdAt = projectData.created_at || new Date().toISOString();
    let newId = projectData.id;

    if (this.useSqlite) {
      if (newId) {
        this.sqliteDb.prepare(`
          INSERT INTO projects (id, creator_id, title, description, domain, status, start_date, end_date, required_skills, team_members, milestones, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET title = excluded.title
        `).run(
          newId,
          projectData.creator_id,
          projectData.title,
          projectData.description || '',
          projectData.domain || 'Artificial Intelligence',
          projectData.status || 'Team Formation',
          projectData.start_date || '',
          projectData.end_date || '',
          JSON.stringify(projectData.required_skills || []),
          JSON.stringify(projectData.team_members || []),
          JSON.stringify(projectData.milestones || []),
          createdAt
        );
      } else {
        const stmt = this.sqliteDb.prepare(`
          INSERT INTO projects (creator_id, title, description, domain, status, start_date, end_date, required_skills, team_members, milestones, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
          projectData.creator_id,
          projectData.title,
          projectData.description || '',
          projectData.domain || 'Artificial Intelligence',
          projectData.status || 'Team Formation',
          projectData.start_date || '',
          projectData.end_date || '',
          JSON.stringify(projectData.required_skills || []),
          JSON.stringify(projectData.team_members || []),
          JSON.stringify(projectData.milestones || []),
          createdAt
        );
        newId = Number(result.lastInsertRowid);
      }
      this.syncToJson();
    } else {
      newId = newId || Math.max(10, ...this.memoryData.projects.map(p => p.id || 0)) + 1;
      const newProj = {
        id: newId,
        ...projectData,
        created_at: createdAt,
      };
      this.memoryData.projects.unshift(newProj);
      this.saveJson();
    }

    return this.getProjectByIdSync(newId);
  }

  async updateProject(id, projectData) {
    if (this.isSupabaseActive) {
      try {
        await this.supabase.request(`/projects?id=eq.${id}`, {
          method: 'PATCH',
          body: JSON.stringify(projectData)
        });
      } catch (err) {
        console.warn('Supabase updateProject failed, updating locally:', err.message);
      }
    }

    const existing = this.getProjectByIdSync(id);
    if (!existing) return null;
    const merged = { ...existing, ...projectData };

    if (this.useSqlite) {
      const stmt = this.sqliteDb.prepare(`
        UPDATE projects SET
          title = ?,
          description = ?,
          domain = ?,
          status = ?,
          start_date = ?,
          end_date = ?,
          required_skills = ?,
          team_members = ?,
          milestones = ?
        WHERE id = ?
      `);
      stmt.run(
        merged.title,
        merged.description || '',
        merged.domain || '',
        merged.status || '',
        merged.start_date || '',
        merged.end_date || '',
        JSON.stringify(merged.required_skills || []),
        JSON.stringify(merged.team_members || []),
        JSON.stringify(merged.milestones || []),
        id
      );
      this.syncToJson();
    } else {
      const idx = this.memoryData.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.memoryData.projects[idx] = merged;
        this.saveJson();
      }
    }

    return merged;
  }

  async deleteProject(id) {
    if (this.isSupabaseActive) {
      try {
        await this.supabase.request(`/projects?id=eq.${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Supabase deleteProject failed, deleting locally:', err.message);
      }
    }

    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM projects WHERE id = ?').run(id);
      this.sqliteDb.prepare('DELETE FROM collaboration_requests WHERE project_id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.projects = this.memoryData.projects.filter(p => p.id !== id);
      this.memoryData.collaborationRequests = this.memoryData.collaborationRequests.filter(r => r.project_id !== id);
      this.saveJson();
    }
    return true;
  }

  // --- Collaboration Requests Operations ---
  async getCollaborationRequests() {
    if (this.isSupabaseActive) {
      try {
        return await this.supabase.request('/collaboration_requests?select=*&order=id.desc');
      } catch (err) {
        console.warn('Supabase getCollaborationRequests failed, falling back to local:', err.message);
      }
    }
    return this.getCollaborationRequestsSync();
  }

  getCollaborationRequestsSync() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM collaboration_requests ORDER BY id DESC').all();
    }
    return this.memoryData.collaborationRequests;
  }

  async createCollaborationRequest(reqData) {
    const id = reqData.id || Date.now();
    const createdAt = reqData.created_at || new Date().toISOString();

    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/collaboration_requests', {
          method: 'POST',
          body: JSON.stringify({
            id,
            project_id: reqData.project_id,
            project_title: reqData.project_title,
            sender_id: reqData.sender_id,
            sender_name: reqData.sender_name,
            receiver_id: reqData.receiver_id,
            receiver_name: reqData.receiver_name,
            role: reqData.role || 'Collaborator',
            status: reqData.status || 'Pending',
            created_at: createdAt
          })
        });
        if (rows && rows[0]) return rows[0];
      } catch (err) {
        console.warn('Supabase createCollaborationRequest failed, creating locally:', err.message);
      }
    }

    if (this.useSqlite) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO collaboration_requests (id, project_id, project_title, sender_id, sender_name, receiver_id, receiver_name, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        reqData.project_id,
        reqData.project_title,
        reqData.sender_id,
        reqData.sender_name,
        reqData.receiver_id,
        reqData.receiver_name,
        reqData.role || 'Collaborator',
        reqData.status || 'Pending',
        createdAt
      );
      this.syncToJson();
    } else {
      const newReq = { id, ...reqData, created_at: createdAt };
      this.memoryData.collaborationRequests.unshift(newReq);
      this.saveJson();
    }

    return { id, ...reqData, created_at: createdAt };
  }

  async updateCollaborationRequest(id, status) {
    if (this.isSupabaseActive) {
      try {
        await this.supabase.request(`/collaboration_requests?id=eq.${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
      } catch (err) {
        console.warn('Supabase updateCollaborationRequest failed, updating locally:', err.message);
      }
    }

    if (this.useSqlite) {
      this.sqliteDb.prepare('UPDATE collaboration_requests SET status = ? WHERE id = ?').run(status, id);
      this.syncToJson();
    } else {
      const req = this.memoryData.collaborationRequests.find(r => r.id === id);
      if (req) {
        req.status = status;
        this.saveJson();
      }
    }
  }

  async deleteCollaborationRequest(id) {
    if (this.isSupabaseActive) {
      try {
        await this.supabase.request(`/collaboration_requests?id=eq.${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Supabase deleteCollaborationRequest failed, deleting locally:', err.message);
      }
    }

    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM collaboration_requests WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.collaborationRequests = this.memoryData.collaborationRequests.filter(r => r.id !== id);
      this.saveJson();
    }
    return true;
  }

  // --- Publications, Patents, Resources ---
  async getPublications() {
    if (this.isSupabaseActive) {
      try {
        return await this.supabase.request('/publications?select=*&order=id.desc');
      } catch (err) {}
    }
    return this.getPublicationsSync();
  }

  getPublicationsSync() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM publications ORDER BY id DESC').all();
    }
    return this.memoryData.publications;
  }

  async createPublication(pub) {
    const id = pub.id || Date.now();
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/publications', {
          method: 'POST',
          body: JSON.stringify({ id, ...pub })
        });
        if (rows && rows[0]) return rows[0];
      } catch (err) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare(`
        INSERT INTO publications (id, project_id, title, authors, venue, publication_date, doi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, pub.project_id, pub.title, pub.authors, pub.venue, pub.publication_date, pub.doi);
      this.syncToJson();
    } else {
      this.memoryData.publications.unshift({ id, ...pub });
      this.saveJson();
    }
    return { id, ...pub };
  }

  async deletePublication(id) {
    if (this.isSupabaseActive) {
      try { await this.supabase.request(`/publications?id=eq.${id}`, { method: 'DELETE' }); } catch (e) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM publications WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.publications = this.memoryData.publications.filter(p => p.id !== id);
      this.saveJson();
    }
    return true;
  }

  async getPatents() {
    if (this.isSupabaseActive) {
      try { return await this.supabase.request('/patents?select=*&order=id.desc'); } catch (err) {}
    }
    return this.getPatentsSync();
  }

  getPatentsSync() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM patents ORDER BY id DESC').all();
    }
    return this.memoryData.patents;
  }

  async createPatent(pat) {
    const id = pat.id || Date.now();
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/patents', {
          method: 'POST',
          body: JSON.stringify({ id, ...pat })
        });
        if (rows && rows[0]) return rows[0];
      } catch (err) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare(`
        INSERT INTO patents (id, project_id, title, inventors, filing_date, patent_number, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, pat.project_id, pat.title, pat.inventors, pat.filing_date, pat.patent_number, pat.status);
      this.syncToJson();
    } else {
      this.memoryData.patents.unshift({ id, ...pat });
      this.saveJson();
    }
    return { id, ...pat };
  }

  async deletePatent(id) {
    if (this.isSupabaseActive) {
      try { await this.supabase.request(`/patents?id=eq.${id}`, { method: 'DELETE' }); } catch (e) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM patents WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.patents = this.memoryData.patents.filter(p => p.id !== id);
      this.saveJson();
    }
    return true;
  }

  async getResources() {
    if (this.isSupabaseActive) {
      try { return await this.supabase.request('/resources?select=*&order=id.asc'); } catch (err) {}
    }
    return this.getResourcesSync();
  }

  getResourcesSync() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM resources ORDER BY id ASC').all();
    }
    return this.memoryData.resources;
  }

  async createResource(res) {
    const id = res.id || Date.now();
    if (this.isSupabaseActive) {
      try {
        const rows = await this.supabase.request('/resources', {
          method: 'POST',
          body: JSON.stringify({ id, ...res })
        });
        if (rows && rows[0]) return rows[0];
      } catch (err) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare(`
        INSERT INTO resources (id, name, type, description, url, domain)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, res.name, res.type, res.description, res.url, res.domain);
      this.syncToJson();
    } else {
      this.memoryData.resources.unshift({ id, ...res });
      this.saveJson();
    }
    return { id, ...res };
  }

  async deleteResource(id) {
    if (this.isSupabaseActive) {
      try { await this.supabase.request(`/resources?id=eq.${id}`, { method: 'DELETE' }); } catch (e) {}
    }
    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM resources WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.resources = this.memoryData.resources.filter(r => r.id !== id);
      this.saveJson();
    }
    return true;
  }
}

const db = new Database();
module.exports = db;
