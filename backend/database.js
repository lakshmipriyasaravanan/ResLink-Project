const fs = require('fs');
const path = require('path');

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

// Database Engine Implementation
class Database {
  constructor() {
    this.sqliteDb = null;
    this.useSqlite = false;
    this.memoryData = null;

    this.initSqlite();
    this.initData();
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
      console.warn('Note: node:sqlite not available or disabled, using persistent JSON engine:', err.message);
      this.useSqlite = false;
    }
  }

  initData() {
    if (this.useSqlite) {
      // Check if users exist in SQLite
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

        // Seed Users & Profiles
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

        // Seed Projects
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

        // Seed Collaboration Requests
        for (const r of SEED_REQUESTS) {
          insertReq.run(r.id, r.project_id, r.project_title, r.sender_id, r.sender_name, r.receiver_id, r.receiver_name, r.role, r.status, r.created_at);
        }

        // Seed Publications
        for (const pub of SEED_PUBLICATIONS) {
          insertPub.run(pub.id, pub.project_id, pub.title, pub.authors, pub.venue, pub.publication_date, pub.doi);
        }

        // Seed Patents
        for (const pat of SEED_PATENTS) {
          insertPat.run(pat.id, pat.project_id, pat.title, pat.inventors, pat.filing_date, pat.patent_number, pat.status);
        }

        // Seed Resources
        for (const res of SEED_RESOURCES) {
          insertRes.run(res.id, res.name, res.type, res.description, res.url, res.domain);
        }
      }
      this.syncToJson();
    } else {
      // JSON File Database
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
        users: this.getAllUsers(),
        profiles: this.getAllProfiles(),
        projects: this.getAllProjects(),
        collaborationRequests: this.getCollaborationRequests(),
        publications: this.getPublications(),
        patents: this.getPatents(),
        resources: this.getResources(),
      };
      fs.writeFileSync(JSON_BACKUP_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      // Non-blocking
    }
  }

  // --- Users Operations ---
  getAllUsers() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users ORDER BY id ASC').all();
    }
    return this.memoryData.users;
  }

  getUserById(id) {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;
    }
    return this.memoryData.users.find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail) || null;
    }
    return this.memoryData.users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
  }

  createUser({ name, email, password, role, affiliation }) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = this.getUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('Email already registered');
    }

    const createdAt = new Date().toISOString();
    let newId;

    if (this.useSqlite) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO users (name, email, password, role, affiliation, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, cleanEmail, password, role, affiliation, createdAt);
      newId = Number(result.lastInsertRowid);

      // Create default research profile
      const profStmt = this.sqliteDb.prepare(`
        INSERT INTO profiles (user_id, bio, interests, experience, expertise, skills)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      profStmt.run(
        newId,
        'Research profile initialized.',
        JSON.stringify(['Artificial Intelligence', 'Data Science']),
        'Academic research enthusiast.',
        'Python, Machine Learning',
        JSON.stringify([{ name: 'Python', category: 'Software Engineering', proficiency: 4 }])
      );
      this.syncToJson();
    } else {
      newId = Math.max(10, ...this.memoryData.users.map(u => u.id || 0)) + 1;
      const newUser = {
        id: newId,
        name,
        email: cleanEmail,
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

    return this.getUserById(newId);
  }

  // --- Profiles Operations ---
  getProfile(userId) {
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

  getAllProfiles() {
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

  saveProfile(userId, profileData) {
    const existing = this.getProfile(userId) || {};
    const updated = { ...existing, ...profileData, user_id: userId };

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
  getAllProjects() {
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

  getProjectById(id) {
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

  createProject(projectData) {
    const createdAt = new Date().toISOString();
    let newId;

    if (this.useSqlite) {
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
      this.syncToJson();
    } else {
      newId = Math.max(10, ...this.memoryData.projects.map(p => p.id || 0)) + 1;
      const newProj = {
        id: newId,
        ...projectData,
        created_at: createdAt,
      };
      this.memoryData.projects.unshift(newProj);
      this.saveJson();
    }

    return this.getProjectById(newId);
  }

  updateProject(id, projectData) {
    const existing = this.getProjectById(id);
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

  deleteProject(id) {
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
  getCollaborationRequests() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM collaboration_requests ORDER BY id DESC').all();
    }
    return this.memoryData.collaborationRequests;
  }

  createCollaborationRequest(reqData) {
    const id = reqData.id || Date.now();
    const createdAt = reqData.created_at || new Date().toISOString();

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

  updateCollaborationRequest(id, status) {
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

  deleteCollaborationRequest(id) {
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
  getPublications() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM publications ORDER BY id DESC').all();
    }
    return this.memoryData.publications;
  }

  createPublication(pub) {
    const id = pub.id || Date.now();
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

  deletePublication(id) {
    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM publications WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.publications = this.memoryData.publications.filter(p => p.id !== id);
      this.saveJson();
    }
    return true;
  }

  getPatents() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM patents ORDER BY id DESC').all();
    }
    return this.memoryData.patents;
  }

  createPatent(pat) {
    const id = pat.id || Date.now();
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

  deletePatent(id) {
    if (this.useSqlite) {
      this.sqliteDb.prepare('DELETE FROM patents WHERE id = ?').run(id);
      this.syncToJson();
    } else {
      this.memoryData.patents = this.memoryData.patents.filter(p => p.id !== id);
      this.saveJson();
    }
    return true;
  }

  getResources() {
    if (this.useSqlite) {
      return this.sqliteDb.prepare('SELECT * FROM resources ORDER BY id ASC').all();
    }
    return this.memoryData.resources;
  }

  createResource(res) {
    const id = res.id || Date.now();
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

  deleteResource(id) {
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
