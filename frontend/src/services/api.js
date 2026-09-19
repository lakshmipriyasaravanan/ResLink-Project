import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
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

// Fallback Mock Datasets for seamless Vercel client-side execution
let mockProjects = [
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

let mockRecommendations = [
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

let mockPublications = [
  {
    id: 1,
    project_id: 1,
    title: "Transformer Architectures for Predictive Healthcare Analytics",
    authors: "Dr. Arun Kumar, Prof. Sarah Chen",
    venue: "IEEE Journal of Biomedical & Health Informatics",
    publication_date: "2026-01-20",
    doi: "10.1109/JBHI.2026.381920",
  }
];

let mockPatents = [
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

let mockResources = [
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

export const authAPI = {
  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch {
      return {
        data: {
          token: `reslink_jwt_token_${Date.now()}`,
          user: {
            id: Date.now(),
            name: userData.name || 'New Researcher',
            email: userData.email,
            role: userData.role || 'Student Researcher',
            affiliation: userData.affiliation || 'University',
          }
        }
      };
    }
  },
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch {
      const email = (credentials.email || '').toLowerCase();
      const isSarah = email.includes('sarah');
      const demoUser = {
        id: isSarah ? 2 : 1,
        name: isSarah ? 'Prof. Sarah Chen' : 'Dr. Arun Kumar',
        email: credentials.email,
        role: isSarah ? 'Research Scholar' : 'Faculty Member',
        affiliation: isSarah ? 'Stanford University' : 'IIT Madras - Department of CSE',
      };
      return {
        data: {
          token: `reslink_jwt_token_${demoUser.id}`,
          user: demoUser
        }
      };
    }
  },
};

export const profileAPI = {
  getProfile: async () => {
    try {
      return await api.get('/profiles/me');
    } catch {
      return {
        data: {
          user_id: 1,
          bio: "Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics.",
          interests: ["Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning"],
          experience: "12 years academic & industrial research in Deep Learning & Medical AI.",
          expertise: "Neural Network Architectures, Transformers, PyTorch, Predictive Modeling",
          skills: [
            { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
            { name: "Python", category: "Software Engineering", proficiency: 5 },
            { name: "NLP", category: "Artificial Intelligence", proficiency: 4 },
            { name: "Deep Learning", category: "Artificial Intelligence", proficiency: 5 },
          ]
        }
      };
    }
  },
  updateProfile: async (profileData) => {
    try {
      return await api.put('/profiles/me', profileData);
    } catch {
      return { data: profileData };
    }
  },
  getAllResearchers: async () => {
    try {
      return await api.get('/profiles/all');
    } catch {
      return { data: mockRecommendations };
    }
  },
  getResearcherById: async (id) => {
    try {
      return await api.get(`/profiles/${id}`);
    } catch {
      const found = mockRecommendations.find(r => r.id == id) || mockRecommendations[0];
      return { data: found };
    }
  },
};

export const projectAPI = {
  getProjects: async () => {
    try {
      return await api.get('/projects');
    } catch {
      return { data: mockProjects };
    }
  },
  createProject: async (projectData) => {
    try {
      return await api.post('/projects', projectData);
    } catch {
      const newProj = {
        id: mockProjects.length + 1,
        creator_id: 1,
        title: projectData.title,
        description: projectData.description,
        domain: projectData.domain || 'Artificial Intelligence',
        status: projectData.status || 'Team Formation',
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        required_skills: projectData.required_skills || [],
        team_members: [{ id: 1, name: 'Dr. Arun Kumar', role: 'Project Creator', affiliation: 'IIT Madras' }],
        milestones: [],
      };
      mockProjects.unshift(newProj);
      return { data: newProj };
    }
  },
  getProjectById: async (id) => {
    try {
      return await api.get(`/projects/${id}`);
    } catch {
      const found = mockProjects.find(p => p.id == id) || mockProjects[0];
      return {
        data: {
          ...found,
          publications: mockPublications,
          patents: mockPatents,
          resources: mockResources,
        }
      };
    }
  },
  updateProject: async (id, projectData) => {
    try {
      return await api.put(`/projects/${id}`, projectData);
    } catch {
      return { data: projectData };
    }
  },
  deleteProject: async (id) => {
    try {
      return await api.delete(`/projects/${id}`);
    } catch {
      mockProjects = mockProjects.filter(p => p.id != id);
      return { data: { success: true } };
    }
  },
  
  // Team
  addTeamMember: async (projectId, userId, role) => {
    try {
      return await api.post(`/projects/${projectId}/team`, { user_id: userId, role });
    } catch {
      const proj = mockProjects.find(p => p.id == projectId) || mockProjects[0];
      const rec = mockRecommendations.find(r => r.id == userId) || { id: userId, name: "Collaborator", affiliation: "University" };
      if (!proj.team_members.some(m => m.id == userId)) {
        proj.team_members.push({
          id: userId,
          name: rec.name,
          role: role || rec.role || "Collaborator",
          affiliation: rec.affiliation,
        });
      }
      return { data: proj };
    }
  },
  removeTeamMember: async (projectId, userId) => {
    try {
      return await api.delete(`/projects/${projectId}/team/${userId}`);
    } catch {
      const proj = mockProjects.find(p => p.id == projectId) || mockProjects[0];
      proj.team_members = proj.team_members.filter(m => m.id != userId);
      return { data: proj };
    }
  },
  
  // Milestones
  addMilestone: async (projectId, milestoneData) => {
    try {
      return await api.post(`/projects/${projectId}/milestones`, milestoneData);
    } catch {
      const proj = mockProjects.find(p => p.id == projectId) || mockProjects[0];
      const newMs = { id: Date.now(), ...milestoneData };
      proj.milestones.push(newMs);
      return { data: newMs };
    }
  },
  updateMilestone: async (milestoneId, milestoneData) => {
    try {
      return await api.put(`/milestones/${milestoneId}`, milestoneData);
    } catch {
      return { data: milestoneData };
    }
  },
  
  // AI Recommendations & Skill Gap
  getRecommendations: async (projectId, missingSkillsOnly = false) => {
    try {
      return await api.post(`/projects/${projectId}/recommendations`, { missing_skills_only: missingSkillsOnly });
    } catch {
      return { data: mockRecommendations };
    }
  },
  getSkillGap: async (projectId) => {
    try {
      return await api.get(`/projects/${projectId}/skill-gap`);
    } catch {
      const proj = mockProjects.find(p => p.id == projectId) || mockProjects[0];
      const teamSkills = new Set();
      proj.team_members.forEach(m => {
        if (m.id === 1) {
          teamSkills.add('machine learning');
          teamSkills.add('python');
          teamSkills.add('nlp');
        } else if (m.id === 2) {
          teamSkills.add('nlp');
          teamSkills.add('python');
          teamSkills.add('data science');
        } else if (m.id === 3) {
          teamSkills.add('cloud computing');
          teamSkills.add('python');
        }
      });

      const covered = [];
      const missing = [];

      (proj.required_skills || []).forEach(s => {
        const sName = (s.name || s).toLowerCase();
        if (teamSkills.has(sName)) {
          covered.push(s.name || s);
        } else {
          missing.push(s.name || s);
        }
      });

      const total = (proj.required_skills || []).length || 1;
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
    }
  },
};

export const publicationAPI = {
  getPublications: async (projectId = null) => {
    try {
      return await api.get('/publications', { params: { project_id: projectId } });
    } catch {
      return { data: mockPublications };
    }
  },
  createPublication: async (pubData) => {
    try {
      return await api.post('/publications', pubData);
    } catch {
      const newPub = { id: Date.now(), ...pubData };
      mockPublications.unshift(newPub);
      return { data: newPub };
    }
  },
  updatePublication: async (id, pubData) => {
    try {
      return await api.put(`/publications/${id}`, pubData);
    } catch {
      return { data: pubData };
    }
  },
  deletePublication: async (id) => {
    try {
      return await api.delete(`/publications/${id}`);
    } catch {
      mockPublications = mockPublications.filter(p => p.id != id);
      return { data: { success: true } };
    }
  },
};

export const patentAPI = {
  getPatents: async (projectId = null) => {
    try {
      return await api.get('/patents', { params: { project_id: projectId } });
    } catch {
      return { data: mockPatents };
    }
  },
  createPatent: async (patentData) => {
    try {
      return await api.post('/patents', patentData);
    } catch {
      const newPat = { id: Date.now(), ...patentData };
      mockPatents.unshift(newPat);
      return { data: newPat };
    }
  },
  updatePatent: async (id, patentData) => {
    try {
      return await api.put(`/patents/${id}`, patentData);
    } catch {
      return { data: patentData };
    }
  },
  deletePatent: async (id) => {
    try {
      return await api.delete(`/patents/${id}`);
    } catch {
      mockPatents = mockPatents.filter(p => p.id != id);
      return { data: { success: true } };
    }
  },
};

export const resourceAPI = {
  getResources: async (search = '', type = '', domain = '') => {
    try {
      return await api.get('/resources', { params: { search, type, domain } });
    } catch {
      let filtered = mockResources;
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
    try {
      return await api.post('/resources', resData);
    } catch {
      const newRes = { id: Date.now(), ...resData };
      mockResources.unshift(newRes);
      return { data: newRes };
    }
  },
  updateResource: async (id, resData) => {
    try {
      return await api.put(`/resources/${id}`, resData);
    } catch {
      return { data: resData };
    }
  },
  deleteResource: async (id) => {
    try {
      return await api.delete(`/resources/${id}`);
    } catch {
      mockResources = mockResources.filter(r => r.id != id);
      return { data: { success: true } };
    }
  },
};

export default api;
