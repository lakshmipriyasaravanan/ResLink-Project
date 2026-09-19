import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
const mockProjects = [
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

const mockRecommendations = [
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

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const profileAPI = {
  getProfile: () => api.get('/profiles/me'),
  updateProfile: (profileData) => api.put('/profiles/me', profileData),
  getAllResearchers: () => api.get('/profiles/all'),
  getResearcherById: (id) => api.get(`/profiles/${id}`),
};

export const projectAPI = {
  getProjects: async () => {
    try {
      return await api.get('/projects');
    } catch {
      return { data: mockProjects };
    }
  },
  createProject: (projectData) => api.post('/projects', projectData),
  getProjectById: async (id) => {
    try {
      return await api.get(`/projects/${id}`);
    } catch {
      const found = mockProjects.find(p => p.id == id) || mockProjects[0];
      return { data: found };
    }
  },
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  // Team
  addTeamMember: (projectId, userId, role) => api.post(`/projects/${projectId}/team`, { user_id: userId, role }),
  removeTeamMember: (projectId, userId) => api.delete(`/projects/${projectId}/team/${userId}`),
  
  // Milestones
  addMilestone: (projectId, milestoneData) => api.post(`/projects/${projectId}/milestones`, milestoneData),
  updateMilestone: (milestoneId, milestoneData) => api.put(`/milestones/${milestoneId}`, milestoneData),
  
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
      return {
        data: {
          project_id: projectId,
          total_required: 5,
          covered_count: 3,
          missing_count: 2,
          covered_skills: ["Machine Learning", "Python", "NLP"],
          missing_skills: ["Cloud Computing", "Data Science"],
          coverage_percentage: 60,
          gap_percentage: 40,
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
      return {
        data: [
          {
            id: 1,
            project_id: 1,
            title: "Transformer Architectures for Predictive Healthcare Analytics",
            authors: "Dr. Arun Kumar, Prof. Sarah Chen",
            venue: "IEEE Journal of Biomedical & Health Informatics",
            publication_date: "2026-01-20",
            doi: "10.1109/JBHI.2026.381920",
          }
        ]
      };
    }
  },
  createPublication: (pubData) => api.post('/publications', pubData),
  updatePublication: (id, pubData) => api.put(`/publications/${id}`, pubData),
  deletePublication: (id) => api.delete(`/publications/${id}`),
};

export const patentAPI = {
  getPatents: async (projectId = null) => {
    try {
      return await api.get('/patents', { params: { project_id: projectId } });
    } catch {
      return {
        data: [
          {
            id: 1,
            project_id: 1,
            title: "Privacy-Preserving Clinical Risk Scoring via Neural Vector Quantization",
            inventors: "Dr. Arun Kumar, Marcus Vance",
            filing_date: "2026-02-14",
            patent_number: "US20260049281A1",
            status: "Under Review",
          }
        ]
      };
    }
  },
  createPatent: (patentData) => api.post('/patents', patentData),
  updatePatent: (id, patentData) => api.put(`/patents/${id}`, patentData),
  deletePatent: (id) => api.delete(`/patents/${id}`),
};

export const resourceAPI = {
  getResources: async (search = '', type = '', domain = '') => {
    try {
      return await api.get('/resources', { params: { search, type, domain } });
    } catch {
      return {
        data: [
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
        ]
      };
    }
  },
  createResource: (resData) => api.post('/resources', resData),
  updateResource: (id, resData) => api.put(`/resources/${id}`, resData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

export default api;
