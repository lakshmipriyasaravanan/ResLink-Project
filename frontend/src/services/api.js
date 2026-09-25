import axios from 'axios';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('reslink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Initial Seed Data ---
const initialProjects = [
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
  },
];

const arunRecommendations = [
  {
    id: 2,
    name: "Prof. Sarah Chen",
    role: "Research Scholar",
    affiliation: "Stanford University",
    bio: "Postdoctoral researcher focused on Large Language Models, semantic text embeddings, and multilingual NLP evaluation.",
    match_score: 95,
    matched_skills: ["NLP", "Python", "Data Science"],
    why_recommended: "Strong semantic affinity in NLP, Machine Learning, and Transformer architectures.",
    skills: [
      { name: "NLP", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
      { name: "Data Science", category: "Data Science", proficiency: 4 },
    ]
  },
  {
    id: 3,
    name: "Dr. Rajesh Sharma",
    role: "Faculty Member",
    affiliation: "IISc Bangalore",
    bio: "Expert in Cloud & Distributed Systems, High-Performance Computing, and scalable infrastructure.",
    match_score: 87,
    matched_skills: ["Cloud Computing", "Python"],
    why_recommended: "Direct match for Cloud Computing & Infrastructure required skills.",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Data Science", category: "Data Science", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ]
  },
  {
    id: 4,
    name: "Elena Rostova",
    role: "Student Researcher",
    affiliation: "MIT Media Lab",
    bio: "Graduate researcher working on Computer Vision, Multimodal Generative AI, and PyTorch.",
    match_score: 82,
    matched_skills: ["Python", "Machine Learning"],
    why_recommended: "Solid alignment in Python modeling and deep neural networks.",
    skills: [
      { name: "Computer Vision", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ]
  },
  {
    id: 5,
    name: "Marcus Vance",
    role: "Industry Partner",
    affiliation: "Google Research Labs",
    bio: "Principal AI Scientist leading enterprise cloud ML infrastructure and privacy-preserving ML.",
    match_score: 79,
    matched_skills: ["Cloud Computing", "Machine Learning"],
    why_recommended: "Industry expertise in enterprise cloud machine learning systems.",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
    ]
  }
];

const sarahRecommendations = [
  {
    id: 1,
    name: "Dr. Arun Kumar",
    role: "Faculty Member",
    affiliation: "IIT Madras - Department of CSE",
    bio: "Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics.",
    match_score: 92,
    matched_skills: ["Machine Learning", "NLP", "Python"],
    why_recommended: "Expert alignment in ML evaluation benchmarks, NLP model architectures, and clinical dataset text.",
    skills: [
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
      { name: "NLP", category: "Artificial Intelligence", proficiency: 4 },
    ]
  },
  {
    id: 6,
    name: "Priyanshu Patel",
    role: "Student Researcher",
    affiliation: "IIT Bombay - Centre for ML",
    bio: "M.Tech scholar exploring IoT sensor networks, Edge AI deployment, and embedded ML optimizations.",
    match_score: 85,
    matched_skills: ["Python", "Machine Learning"],
    why_recommended: "Solid proficiency in Python scripts and benchmark execution.",
    skills: [
      { name: "Python", category: "Software Engineering", proficiency: 4 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 3 },
    ]
  },
  {
    id: 8,
    name: "Alex Mercer",
    role: "Research Scholar",
    affiliation: "ETH Zurich - Systems Lab",
    bio: "PhD candidate working on High-Performance Distributed Computing, Data Engineering, and Real-time Analytics.",
    match_score: 81,
    matched_skills: ["Data Science", "Python"],
    why_recommended: "Data Science and dataset engineering expertise for LLM corpora validation.",
    skills: [
      { name: "Data Science", category: "Data Science", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ]
  },
  {
    id: 5,
    name: "Marcus Vance",
    role: "Industry Partner",
    affiliation: "Google Research Labs",
    bio: "Principal AI Scientist leading enterprise cloud ML infrastructure and privacy-preserving ML.",
    match_score: 78,
    matched_skills: ["Machine Learning", "Python"],
    why_recommended: "Industry expertise in enterprise LLM evaluation tools.",
    skills: [
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
    ]
  }
];

const initialPublications = [
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
  }
];

const initialPatents = [
  {
    id: 1,
    project_id: 1,
    title: "Privacy-Preserving Clinical Risk Scoring via Neural Vector Quantization",
    inventors: "Dr. Arun Kumar, Marcus Vance",
    filing_date: "2026-02-14",
    patent_number: "US20260049281A1",
    status: "Under Review",
  }
];

const initialResources = [
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
  }
];

// Helper functions for reading/writing persistent user-specific data
const getStoredUsers = () => {
  try {
    const data = localStorage.getItem('reslink_users_store');
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [
    { id: 1, name: "Dr. Arun Kumar", email: "arun.kumar@reslink.edu", password: "password123", role: "Faculty Member", affiliation: "IIT Madras - Department of CSE" },
    { id: 2, name: "Prof. Sarah Chen", email: "sarah.chen@reslink.edu", password: "password123", role: "Research Scholar", affiliation: "Stanford University - AI Lab" },
    { id: 3, name: "Dr. Rajesh Sharma", email: "rajesh.sharma@reslink.edu", password: "password123", role: "Faculty Member", affiliation: "IISc Bangalore - Supercomputer Education" },
    { id: 4, name: "Elena Rostova", email: "elena.rostova@reslink.edu", password: "password123", role: "Student Researcher", affiliation: "MIT - Media Lab" },
    { id: 5, name: "Marcus Vance", email: "marcus.vance@reslink.edu", password: "password123", role: "Industry Partner", affiliation: "Google Research Labs" },
    { id: 6, name: "Priyanshu Patel", email: "priyanshu.patel@reslink.edu", password: "password123", role: "Student Researcher", affiliation: "IIT Bombay - Centre for ML" },
    { id: 7, name: "Dr. Anita Roy", email: "anita.roy@reslink.edu", password: "password123", role: "Faculty Member", affiliation: "Carnegie Mellon University" },
    { id: 8, name: "Alex Mercer", email: "alex.mercer@reslink.edu", password: "password123", role: "Research Scholar", affiliation: "ETH Zurich - Systems Lab" },
  ];
};

const saveStoredUsers = (users) => {
  localStorage.setItem('reslink_users_store', JSON.stringify(users));
};

const getCurrentUserFromStorage = () => {
  try {
    const data = localStorage.getItem('reslink_user');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const isNewUser = (user) => {
  const curUser = user || getCurrentUserFromStorage();
  if (!curUser) return false;
  // User is new if registered freshly or id > 2 and email is not arun/sarah
  const email = (curUser.email || '').toLowerCase();
  const isDemo = email.includes('arun') || email.includes('sarah') || curUser.id === 1 || curUser.id === 2;
  return !isDemo;
};

const getProjectsData = (user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_projects_${curUser?.id}` : 'reslink_projects_store';
  const data = localStorage.getItem(key);
  
  if (data) return JSON.parse(data);
  return userIsNew ? [] : initialProjects;
};

const saveProjectsData = (projects, user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_projects_${curUser?.id}` : 'reslink_projects_store';
  localStorage.setItem(key, JSON.stringify(projects));
};

const getPubsData = (user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_pubs_${curUser?.id}` : 'reslink_pubs_store';
  const data = localStorage.getItem(key);
  
  if (data) return JSON.parse(data);
  return userIsNew ? [] : initialPublications;
};

const savePubsData = (pubs, user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_pubs_${curUser?.id}` : 'reslink_pubs_store';
  localStorage.setItem(key, JSON.stringify(pubs));
};

const getPatentsData = (user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_patents_${curUser?.id}` : 'reslink_patents_store';
  const data = localStorage.getItem(key);
  
  if (data) return JSON.parse(data);
  return userIsNew ? [] : initialPatents;
};

const savePatentsData = (patents, user) => {
  const curUser = user || getCurrentUserFromStorage();
  const userIsNew = isNewUser(curUser);
  const key = userIsNew ? `reslink_user_patents_${curUser?.id}` : 'reslink_patents_store';
  localStorage.setItem(key, JSON.stringify(patents));
};

const getResourcesData = () => {
  const data = localStorage.getItem('reslink_resources_store');
  return data ? JSON.parse(data) : initialResources;
};
const saveResourcesData = (resources) => {
  localStorage.setItem('reslink_resources_store', JSON.stringify(resources));
};

const getProfileData = (user) => {
  const curUser = user || getCurrentUserFromStorage();
  const key = 'reslink_profile_store_' + (curUser?.id || 1);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const saveProfileData = (profile, user) => {
  const curUser = user || getCurrentUserFromStorage();
  const key = 'reslink_profile_store_' + (curUser?.id || profile?.user_id || 1);
  localStorage.setItem(key, JSON.stringify(profile));
};

const initialRequests = [
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
  }
];

const getRequestsData = () => {
  const data = localStorage.getItem('reslink_collab_requests');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {}
  }
  return initialRequests;
};

const saveRequestsData = (reqs) => {
  localStorage.setItem('reslink_collab_requests', JSON.stringify(reqs));
};

const ALL_SEED_RESEARCHERS = [
  ...arunRecommendations,
  ...sarahRecommendations,
  {
    id: 7,
    name: "Dr. Anita Roy",
    role: "Faculty Member",
    affiliation: "Carnegie Mellon University",
    bio: "Associate Professor researching Blockchain protocols, Cryptography, and Decentralized Identity.",
    match_score: 80,
    matched_skills: ["Cybersecurity", "Blockchain"],
    skills: [
      { name: "Blockchain", category: "Cybersecurity", proficiency: 5 },
      { name: "Cybersecurity", category: "Cybersecurity", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ]
  }
];

const SKILL_ALIASES = {
  'ml': 'machine learning',
  'machine learning': 'machine learning',
  'ai': 'artificial intelligence',
  'artificial intelligence': 'artificial intelligence',
  'nlp': 'natural language processing',
  'natural language processing': 'natural language processing',
  'dl': 'deep learning',
  'deep learning': 'deep learning',
  'cv': 'computer vision',
  'computer vision': 'computer vision',
  'iot': 'internet of things',
  'internet of things': 'internet of things',
  'ds': 'data science',
  'data science': 'data science',
};

function normalizeSkill(name) {
  if (!name) return '';
  const cleaned = name.toString().toLowerCase().trim().replace(/[-_]/g, ' ');
  return SKILL_ALIASES[cleaned] || cleaned;
}

function skillsMatch(skillA, skillB) {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;
  return false;
}

// API Services
export const authAPI = {
  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.user) {
        const users = getStoredUsers();
        if (!users.some(u => u.email.toLowerCase() === res.data.user.email.toLowerCase())) {
          users.push({ ...res.data.user, password: userData.password });
          saveStoredUsers(users);
        }
      }
      return res;
    } catch (err) {
      if (err.response?.status === 400) {
        throw err;
      }
      const users = getStoredUsers();
      const cleanEmail = (userData.email || '').toLowerCase().trim();
      const existing = users.find(u => u.email.toLowerCase().trim() === cleanEmail);
      if (existing) {
        const error = new Error('Email is already registered. Please sign in instead.');
        error.response = { data: { detail: 'Email is already registered. Please sign in instead.' } };
        throw error;
      }

      const newId = Math.max(10, ...users.map(u => u.id || 0)) + 1;
      const newUserObj = {
        id: newId,
        name: userData.name || 'New Researcher',
        email: cleanEmail,
        password: userData.password || 'password123',
        role: userData.role || 'Student Researcher',
        affiliation: userData.affiliation || 'University',
        is_new_user: true,
      };
      users.push(newUserObj);
      saveStoredUsers(users);

      // Initialize persistent profile and empty project store for this new user
      saveProfileData({
        user_id: newId,
        name: newUserObj.name,
        role: newUserObj.role,
        affiliation: newUserObj.affiliation,
        bio: 'Research scholar & academic collaborator.',
        interests: ['Artificial Intelligence', 'Data Science'],
        experience: 'Academic & lab research.',
        expertise: 'Python, Machine Learning',
        skills: [{ name: 'Python', category: 'Software Engineering', proficiency: 4 }],
      }, newUserObj);
      saveProjectsData([], newUserObj);

      return {
        data: {
          token: `reslink_jwt_token_${newId}`,
          user: newUserObj
        }
      };
    }
  },
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data?.user) {
        const users = getStoredUsers();
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === res.data.user.email.toLowerCase());
        if (existingIdx === -1) {
          users.push({ ...res.data.user, password: credentials.password });
        } else {
          users[existingIdx] = { ...users[existingIdx], ...res.data.user };
        }
        saveStoredUsers(users);
      }
      return res;
    } catch (err) {
      if (err.response?.status === 401) {
        throw err;
      }
      const users = getStoredUsers();
      const cleanEmail = (credentials.email || '').toLowerCase().trim();
      const found = users.find(u => u.email.toLowerCase().trim() === cleanEmail);

      if (!found) {
        const error = new Error('Invalid email or password. Please check your credentials or register.');
        error.response = { data: { detail: 'Invalid email or password. Please check your credentials or register.' } };
        throw error;
      }

      if (credentials.password && found.password && found.password !== credentials.password && found.password !== 'password123') {
        const error = new Error('Invalid email or password. Please check your credentials.');
        error.response = { data: { detail: 'Invalid email or password. Please check your credentials.' } };
        throw error;
      }

      return {
        data: {
          token: `reslink_jwt_token_${found.id}`,
          user: found
        }
      };
    }
  },
};

export const profileAPI = {
  getProfile: async (user = null) => {
    try {
      return await api.get('/profiles/me');
    } catch {
      const curUser = user || getCurrentUserFromStorage();
      const stored = getProfileData(curUser);
      if (stored) return { data: stored };

      const isSarah = curUser?.email?.toLowerCase().includes('sarah') || curUser?.id === 2;
      const isArun = curUser?.email?.toLowerCase().includes('arun') || curUser?.id === 1;

      let profileObj;
      if (isSarah) {
        profileObj = {
          user_id: 2,
          name: "Prof. Sarah Chen",
          role: "Research Scholar",
          affiliation: "Stanford University - AI Lab",
          bio: "Postdoctoral researcher focused on Large Language Models, semantic text embeddings, and multilingual NLP benchmark evaluation across low-resource languages.",
          interests: ["Natural Language Processing", "Transformers", "Data Science", "Machine Learning"],
          experience: "6 years post-grad research on LLM alignment, RAG pipelines, and tokenization benchmarks.",
          expertise: "HuggingFace, BERT, LLaMA fine-tuning, PyTorch, Vector DBs, Prompt Engineering",
          skills: [
            { name: "NLP", category: "Artificial Intelligence", proficiency: 5 },
            { name: "Python", category: "Software Engineering", proficiency: 5 },
            { name: "Data Science", category: "Data Science", proficiency: 4 },
            { name: "Transformers", category: "Artificial Intelligence", proficiency: 5 },
            { name: "LLM Fine-tuning", category: "Artificial Intelligence", proficiency: 5 },
          ]
        };
      } else if (isArun) {
        profileObj = {
          user_id: 1,
          name: "Dr. Arun Kumar",
          role: "Faculty Member",
          affiliation: "IIT Madras - Department of CSE",
          bio: "Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics. Published over 40+ journal articles.",
          interests: ["Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning"],
          experience: "12 years academic & industrial research in Deep Learning & Medical AI.",
          expertise: "Neural Network Architectures, Transformers, PyTorch, Predictive Modeling",
          skills: [
            { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
            { name: "Python", category: "Software Engineering", proficiency: 5 },
            { name: "NLP", category: "Artificial Intelligence", proficiency: 4 },
            { name: "Deep Learning", category: "Artificial Intelligence", proficiency: 5 },
          ]
        };
      } else {
        // Fresh empty profile for newly registered users
        profileObj = {
          user_id: curUser?.id || Date.now(),
          name: curUser?.name || "New Researcher",
          role: curUser?.role || "Student Researcher",
          affiliation: curUser?.affiliation || "University",
          bio: "",
          interests: [],
          experience: "",
          expertise: "",
          skills: [],
        };
      }

      saveProfileData(profileObj, curUser);
      return { data: profileObj };
    }
  },
  updateProfile: async (profileData, user = null) => {
    try {
      const res = await api.put('/profiles/me', profileData);
      saveProfileData(res.data, user);
      return res;
    } catch {
      saveProfileData(profileData, user);
      return { data: profileData };
    }
  },
  getAllResearchers: async () => {
    try {
      return await api.get('/profiles/all');
    } catch {
      return { data: arunRecommendations };
    }
  },
  getResearcherById: async (id) => {
    try {
      return await api.get(`/profiles/${id}`);
    } catch {
      const found = arunRecommendations.find(r => r.id == id) || arunRecommendations[0];
      return { data: found };
    }
  },
};

export const projectAPI = {
  getProjects: async () => {
    try {
      const res = await api.get('/projects');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveProjectsData(res.data);
      }
      return res;
    } catch {
      return { data: getProjectsData() };
    }
  },
  createProject: async (projectData) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const newProj = {
      id: Date.now(),
      creator_id: curUser?.id || Date.now(),
      title: projectData.title,
      description: projectData.description,
      domain: projectData.domain || 'Artificial Intelligence',
      status: projectData.status || 'Team Formation',
      start_date: projectData.start_date,
      end_date: projectData.end_date,
      required_skills: projectData.required_skills || [],
      team_members: [{ 
        id: curUser?.id || Date.now(), 
        name: curUser?.name || 'Researcher', 
        role: curUser?.role || 'Project Creator', 
        affiliation: curUser?.affiliation || 'University' 
      }],
      milestones: [],
    };
    projects.unshift(newProj);
    saveProjectsData(projects, curUser);

    try {
      await api.post('/projects', projectData);
    } catch (e) {}
    return { data: newProj };
  },
  getProjectById: async (id) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const found = projects.find(p => p.id == id) || projects[0];

    try {
      const res = await api.get(`/projects/${id}`);
      return res;
    } catch {
      if (!found) {
        return { data: null };
      }
      return {
        data: {
          ...found,
          publications: getPubsData(curUser).filter(p => p.project_id && p.project_id == id),
          patents: getPatentsData(curUser).filter(p => p.project_id && p.project_id == id),
          resources: getResourcesData().filter(r => found?.domain && r.domain === found?.domain),
        }
      };
    }
  },
  updateProject: async (id, projectData) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const updated = projects.map(p => p.id == id ? { ...p, ...projectData } : p);
    saveProjectsData(updated, curUser);

    try {
      await api.put(`/projects/${id}`, projectData);
    } catch (e) {}
    return { data: projectData };
  },
  deleteProject: async (id) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser).filter(p => p.id != id);
    saveProjectsData(projects, curUser);

    try {
      await api.delete(`/projects/${id}`);
    } catch (e) {}
    return { data: { success: true } };
  },
  
  // Team Management (Sends request to collaborator)
  addTeamMember: async (projectId, userId, role = 'Collaborator') => {
    return await collaborationRequestAPI.sendRequest(projectId, userId, role);
  },

  removeTeamMember: async (projectId, userId) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const proj = projects.find(p => p.id == projectId) || projects[0];
    if (proj) {
      proj.team_members = (proj.team_members || []).filter(m => (m.id || m.user_id) != userId);
      saveProjectsData(projects, curUser);
    }

    try {
      await api.delete(`/projects/${projectId}/team/${userId}`);
    } catch (e) {}
    return { data: proj };
  },
  
  // Milestones
  addMilestone: async (projectId, milestoneData) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const proj = projects.find(p => p.id == projectId) || projects[0];
    const newMs = { id: Date.now(), ...milestoneData };
    if (proj) {
      if (!proj.milestones) proj.milestones = [];
      proj.milestones.push(newMs);
      saveProjectsData(projects, curUser);
    }

    try {
      await api.post(`/projects/${projectId}/milestones`, milestoneData);
    } catch (e) {}
    return { data: newMs };
  },

  updateMilestone: async (milestoneId, milestoneData) => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    projects.forEach(p => {
      if (p.milestones) {
        p.milestones = p.milestones.map(m => m.id == milestoneId ? { ...m, ...milestoneData } : m);
      }
    });
    saveProjectsData(projects, curUser);

    try {
      await api.put(`/milestones/${milestoneId}`, milestoneData);
    } catch (e) {}
    return { data: milestoneData };
  },
  
  // AI Recommendations & Skill Gap
  getRecommendations: async (projectId, missingSkillsOnly = false) => {
    try {
      return await api.post(`/projects/${projectId}/recommendations`, { missing_skills_only: missingSkillsOnly });
    } catch {
      const curUser = getCurrentUserFromStorage();
      const isSarah = curUser?.email?.toLowerCase().includes('sarah') || curUser?.id === 2 || projectId == 2;
      return { data: isSarah ? sarahRecommendations : arunRecommendations };
    }
  },
  getSkillGap: async (projectId) => {
    try {
      const res = await api.get(`/projects/${projectId}/skill-gap`);
      if (res && res.data) return res;
    } catch (e) {}

    // Dynamic, automatic team skill gap calculation
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const proj = projects.find(p => p.id == projectId) || projects[0];
    if (!proj) {
      return {
        data: {
          project_id: projectId,
          total_required: 0,
          covered_count: 0,
          missing_count: 0,
          covered_skills: [],
          missing_skills: [],
          coverage_percentage: 100,
          gap_percentage: 0,
        }
      };
    }

    const reqSkills = proj.required_skills ? proj.required_skills.map(s => s.name || s) : [];
    if (reqSkills.length === 0) {
      return {
        data: {
          project_id: projectId,
          total_required: 0,
          covered_count: 0,
          missing_count: 0,
          covered_skills: [],
          missing_skills: [],
          coverage_percentage: 100,
          gap_percentage: 0,
        }
      };
    }

    // Dynamically aggregate skills from all current team members
    const teamSkills = [];
    (proj.team_members || []).forEach(member => {
      const memId = member.id || member.user_id;
      // 1. Direct skills on member object
      if (Array.isArray(member.skills)) {
        member.skills.forEach(s => teamSkills.push(s.name || s));
      }
      // 2. Profile stored in localStorage
      const storedProf = getProfileData({ id: memId });
      if (storedProf && Array.isArray(storedProf.skills)) {
        storedProf.skills.forEach(s => teamSkills.push(s.name || s));
      }
      // 3. Pool lookup
      const foundRec = ALL_SEED_RESEARCHERS.find(r => r.id == memId);
      if (foundRec && Array.isArray(foundRec.skills)) {
        foundRec.skills.forEach(s => teamSkills.push(s.name || s));
      }
      // 4. Current user check
      if (curUser && (curUser.id == memId || curUser.user_id == memId)) {
        const myProf = getProfileData(curUser);
        if (myProf && Array.isArray(myProf.skills)) {
          myProf.skills.forEach(s => teamSkills.push(s.name || s));
        }
      }
    });

    const covered = [];
    const missing = [];

    reqSkills.forEach(reqSkill => {
      const isCovered = teamSkills.some(teamSkill => skillsMatch(reqSkill, teamSkill));
      if (isCovered) {
        covered.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const total = reqSkills.length;
    const covPct = Math.round((covered.length / total) * 100);
    const gapPct = 100 - covPct;

    return {
      data: {
        project_id: projectId,
        total_required: total,
        covered_count: covered.length,
        missing_count: missing.length,
        covered_skills: covered,
        missing_skills: missing,
        coverage_percentage: covPct,
        gap_percentage: gapPct,
      }
    };
  },
};

// Collaboration Requests API Service
export const collaborationRequestAPI = {
  getRequests: async (projectId = null) => {
    try {
      const url = projectId ? `/projects/${projectId}/requests` : '/collaboration-requests';
      const res = await api.get(url);
      if (res && res.data) return res;
    } catch (e) {}

    const curUser = getCurrentUserFromStorage();
    const all = getRequestsData();
    let filtered = all;
    if (projectId) {
      filtered = all.filter(r => r.project_id == projectId);
    } else if (curUser) {
      filtered = all.filter(r => r.receiver_id == curUser.id || r.sender_id == curUser.id);
    }
    return { data: filtered };
  },

  sendRequest: async (projectId, receiverId, role = 'Collaborator') => {
    const curUser = getCurrentUserFromStorage();
    const projects = getProjectsData(curUser);
    const proj = projects.find(p => p.id == projectId) || projects[0];
    const targetUser = ALL_SEED_RESEARCHERS.find(r => r.id == receiverId) || {
      id: receiverId,
      name: "Collaborator",
      affiliation: "University"
    };

    try {
      const res = await api.post(`/projects/${projectId}/requests`, { receiver_id: receiverId, role });
      if (res && res.data) {
        const allReqs = getRequestsData();
        allReqs.unshift(res.data.request || res.data);
        saveRequestsData(allReqs);
        return res;
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.status === 400) {
        throw e;
      }
    }

    const allReqs = getRequestsData();
    // Check if already on team
    if (proj && proj.team_members && proj.team_members.some(m => (m.id || m.user_id) == receiverId)) {
      const err = new Error(`${targetUser.name} is already a member of this team.`);
      err.response = { data: { detail: err.message } };
      throw err;
    }

    // Check if request already pending
    if (allReqs.some(r => r.project_id == projectId && r.receiver_id == receiverId && r.status === 'Pending')) {
      const err = new Error(`A collaboration invitation is already pending for ${targetUser.name}.`);
      err.response = { data: { detail: err.message } };
      throw err;
    }

    const newReq = {
      id: Date.now(),
      project_id: projectId,
      project_title: proj?.title || 'Research Project',
      sender_id: curUser?.id || 1,
      sender_name: curUser?.name || 'Dr. Arun Kumar',
      receiver_id: receiverId,
      receiver_name: targetUser.name,
      role: role || targetUser.role || 'Collaborator',
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    allReqs.unshift(newReq);
    saveRequestsData(allReqs);
    return { data: { message: `Collaboration request sent to ${targetUser.name}!`, request: newReq } };
  },

  respondToRequest: async (requestId, action) => {
    try {
      const res = await api.put(`/collaboration-requests/${requestId}/respond`, { action });
      if (res && res.data) {
        const allReqs = getRequestsData();
        const found = allReqs.find(r => r.id == requestId);
        if (found) {
          found.status = action === 'accept' ? 'Accepted' : 'Declined';
          saveRequestsData(allReqs);
        }
        return res;
      }
    } catch (e) {}

    const curUser = getCurrentUserFromStorage();
    const allReqs = getRequestsData();
    const found = allReqs.find(r => r.id == requestId);
    if (!found) {
      const err = new Error('Collaboration request not found.');
      err.response = { data: { detail: err.message } };
      throw err;
    }

    if (action === 'accept') {
      found.status = 'Accepted';
      saveRequestsData(allReqs);

      // Add to project team
      const projects = getProjectsData(curUser);
      const proj = projects.find(p => p.id == found.project_id);
      if (proj) {
        const receiver = ALL_SEED_RESEARCHERS.find(r => r.id == found.receiver_id) || curUser || {
          id: found.receiver_id,
          name: found.receiver_name,
          role: found.role
        };
        if (!proj.team_members.some(m => (m.id || m.user_id) == found.receiver_id)) {
          proj.team_members.push({
            id: found.receiver_id,
            name: found.receiver_name || receiver.name,
            role: found.role || 'Collaborator',
            affiliation: receiver.affiliation || 'University',
          });
          saveProjectsData(projects, curUser);
        }
      }
      return { data: { message: 'Collaboration invitation accepted!', request: found } };
    } else {
      found.status = 'Declined';
      saveRequestsData(allReqs);
      return { data: { message: 'Collaboration invitation declined.', request: found } };
    }
  },

  cancelRequest: async (requestId) => {
    try {
      await api.delete(`/collaboration-requests/${requestId}`);
    } catch (e) {}

    const allReqs = getRequestsData().filter(r => r.id != requestId);
    saveRequestsData(allReqs);
    return { data: { success: true } };
  },
};

export const publicationAPI = {
  getPublications: async (projectId = null) => {
    try {
      return await api.get('/publications', { params: { project_id: projectId } });
    } catch {
      const curUser = getCurrentUserFromStorage();
      return { data: getPubsData(curUser) };
    }
  },
  createPublication: async (pubData) => {
    const curUser = getCurrentUserFromStorage();
    const pubs = getPubsData(curUser);
    const newPub = { id: Date.now(), ...pubData };
    pubs.unshift(newPub);
    savePubsData(pubs, curUser);

    try {
      await api.post('/publications', pubData);
    } catch (e) {}
    return { data: newPub };
  },
  updatePublication: async (id, pubData) => {
    const curUser = getCurrentUserFromStorage();
    const pubs = getPubsData(curUser).map(p => p.id == id ? { ...p, ...pubData } : p);
    savePubsData(pubs, curUser);

    try {
      await api.put(`/publications/${id}`, pubData);
    } catch (e) {}
    return { data: pubData };
  },
  deletePublication: async (id) => {
    const curUser = getCurrentUserFromStorage();
    const pubs = getPubsData(curUser).filter(p => p.id != id);
    savePubsData(pubs, curUser);

    try {
      await api.delete(`/publications/${id}`);
    } catch (e) {}
    return { data: { success: true } };
  },
};

export const patentAPI = {
  getPatents: async (projectId = null) => {
    try {
      return await api.get('/patents', { params: { project_id: projectId } });
    } catch {
      const curUser = getCurrentUserFromStorage();
      return { data: getPatentsData(curUser) };
    }
  },
  createPatent: async (patentData) => {
    const curUser = getCurrentUserFromStorage();
    const patents = getPatentsData(curUser);
    const newPat = { id: Date.now(), ...patentData };
    patents.unshift(newPat);
    savePatentsData(patents, curUser);

    try {
      await api.post('/patents', patentData);
    } catch (e) {}
    return { data: newPat };
  },
  updatePatent: async (id, patentData) => {
    const curUser = getCurrentUserFromStorage();
    const patents = getPatentsData(curUser).map(p => p.id == id ? { ...p, ...patentData } : p);
    savePatentsData(patents, curUser);

    try {
      await api.put(`/patents/${id}`, patentData);
    } catch (e) {}
    return { data: patentData };
  },
  deletePatent: async (id) => {
    const curUser = getCurrentUserFromStorage();
    const patents = getPatentsData(curUser).filter(p => p.id != id);
    savePatentsData(patents, curUser);

    try {
      await api.delete(`/patents/${id}`);
    } catch (e) {}
    return { data: { success: true } };
  },
};

export const resourceAPI = {
  getResources: async (search = '', type = '', domain = '') => {
    try {
      return await api.get('/resources', { params: { search, type, domain } });
    } catch {
      let filtered = getResourcesData();
      if (search) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.domain.toLowerCase().includes(search.toLowerCase()));
      }
      if (type) {
        filtered = filtered.filter(r => r.type.toLowerCase() === type.toLowerCase());
      }
      return { data: filtered };
    }
  },
  createResource: async (resData) => {
    const resources = getResourcesData();
    const newRes = { id: Date.now(), ...resData };
    resources.unshift(newRes);
    saveResourcesData(resources);

    try {
      await api.post('/resources', resData);
    } catch (e) {}
    return { data: newRes };
  },
  updateResource: async (id, resData) => {
    const resources = getResourcesData().map(r => r.id == id ? { ...r, ...resData } : r);
    saveResourcesData(resources);

    try {
      await api.put(`/resources/${id}`, resData);
    } catch (e) {}
    return { data: resData };
  },
  deleteResource: async (id) => {
    const resources = getResourcesData().filter(r => r.id != id);
    saveResourcesData(resources);

    try {
      await api.delete(`/resources/${id}`);
    } catch (e) {}
    return { data: { success: true } };
  },
};

export default api;
