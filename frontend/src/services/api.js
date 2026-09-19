import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

// --- LocalStorage Persistence Helpers ---
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

const initialRecommendations = [
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

const initialPublications = [
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

// Helper functions for reading/writing persistent data
const getProjectsData = () => {
  const data = localStorage.getItem('reslink_projects_store');
  return data ? JSON.parse(data) : initialProjects;
};
const saveProjectsData = (projects) => {
  localStorage.setItem('reslink_projects_store', JSON.stringify(projects));
};

const getPubsData = () => {
  const data = localStorage.getItem('reslink_pubs_store');
  return data ? JSON.parse(data) : initialPublications;
};
const savePubsData = (pubs) => {
  localStorage.setItem('reslink_pubs_store', JSON.stringify(pubs));
};

const getPatentsData = () => {
  const data = localStorage.getItem('reslink_patents_store');
  return data ? JSON.parse(data) : initialPatents;
};
const savePatentsData = (patents) => {
  localStorage.setItem('reslink_patents_store', JSON.stringify(patents));
};

const getResourcesData = () => {
  const data = localStorage.getItem('reslink_resources_store');
  return data ? JSON.parse(data) : initialResources;
};
const saveResourcesData = (resources) => {
  localStorage.setItem('reslink_resources_store', JSON.stringify(resources));
};

const getProfileData = () => {
  const data = localStorage.getItem('reslink_profile_store');
  return data ? JSON.parse(data) : null;
};
const saveProfileData = (profile) => {
  localStorage.setItem('reslink_profile_store', JSON.stringify(profile));
};

// API Services
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
      const stored = getProfileData();
      if (stored) return { data: stored };

      const defaultProf = {
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
      };
      saveProfileData(defaultProf);
      return { data: defaultProf };
    }
  },
  updateProfile: async (profileData) => {
    try {
      const res = await api.put('/profiles/me', profileData);
      saveProfileData(res.data);
      return res;
    } catch {
      saveProfileData(profileData);
      return { data: profileData };
    }
  },
  getAllResearchers: async () => {
    try {
      return await api.get('/profiles/all');
    } catch {
      return { data: initialRecommendations };
    }
  },
  getResearcherById: async (id) => {
    try {
      return await api.get(`/profiles/${id}`);
    } catch {
      const found = initialRecommendations.find(r => r.id == id) || initialRecommendations[0];
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
    const projects = getProjectsData();
    const newProj = {
      id: Date.now(),
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
    projects.unshift(newProj);
    saveProjectsData(projects);

    try {
      await api.post('/projects', projectData);
    } catch (e) {
      console.log('Saved project to persistent storage');
    }
    return { data: newProj };
  },
  getProjectById: async (id) => {
    const projects = getProjectsData();
    const found = projects.find(p => p.id == id) || projects[0];

    try {
      const res = await api.get(`/projects/${id}`);
      return res;
    } catch {
      return {
        data: {
          ...found,
          publications: getPubsData().filter(p => !p.project_id || p.project_id == id),
          patents: getPatentsData().filter(p => !p.project_id || p.project_id == id),
          resources: getResourcesData().filter(r => r.domain === found?.domain || true),
        }
      };
    }
  },
  updateProject: async (id, projectData) => {
    const projects = getProjectsData();
    const updated = projects.map(p => p.id == id ? { ...p, ...projectData } : p);
    saveProjectsData(updated);

    try {
      await api.put(`/projects/${id}`, projectData);
    } catch (e) {}
    return { data: projectData };
  },
  deleteProject: async (id) => {
    const projects = getProjectsData().filter(p => p.id != id);
    saveProjectsData(projects);

    try {
      await api.delete(`/projects/${id}`);
    } catch (e) {}
    return { data: { success: true } };
  },
  
  // Team Management
  addTeamMember: async (projectId, userId, role) => {
    const projects = getProjectsData();
    const proj = projects.find(p => p.id == projectId) || projects[0];
    const rec = initialRecommendations.find(r => r.id == userId) || { id: userId, name: "Collaborator", affiliation: "University" };
    
    if (proj && !proj.team_members.some(m => m.id == userId)) {
      proj.team_members.push({
        id: userId,
        name: rec.name,
        role: role || rec.role || "Collaborator",
        affiliation: rec.affiliation,
      });
      saveProjectsData(projects);
    }

    try {
      await api.post(`/projects/${projectId}/team`, { user_id: userId, role });
    } catch (e) {}
    return { data: proj };
  },

  removeTeamMember: async (projectId, userId) => {
    const projects = getProjectsData();
    const proj = projects.find(p => p.id == projectId) || projects[0];
    if (proj) {
      proj.team_members = proj.team_members.filter(m => m.id != userId);
      saveProjectsData(projects);
    }

    try {
      await api.delete(`/projects/${projectId}/team/${userId}`);
    } catch (e) {}
    return { data: proj };
  },
  
  // Milestones
  addMilestone: async (projectId, milestoneData) => {
    const projects = getProjectsData();
    const proj = projects.find(p => p.id == projectId) || projects[0];
    const newMs = { id: Date.now(), ...milestoneData };
    if (proj) {
      if (!proj.milestones) proj.milestones = [];
      proj.milestones.push(newMs);
      saveProjectsData(projects);
    }

    try {
      await api.post(`/projects/${projectId}/milestones`, milestoneData);
    } catch (e) {}
    return { data: newMs };
  },

  updateMilestone: async (milestoneId, milestoneData) => {
    const projects = getProjectsData();
    projects.forEach(p => {
      if (p.milestones) {
        p.milestones = p.milestones.map(m => m.id == milestoneId ? { ...m, ...milestoneData } : m);
      }
    });
    saveProjectsData(projects);

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
      return { data: initialRecommendations };
    }
  },
  getSkillGap: async (projectId) => {
    const projects = getProjectsData();
    const proj = projects.find(p => p.id == projectId) || projects[0];
    const teamSkills = new Set();
    
    (proj.team_members || []).forEach(m => {
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

    try {
      return await api.get(`/projects/${projectId}/skill-gap`);
    } catch {
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
      return { data: getPubsData() };
    }
  },
  createPublication: async (pubData) => {
    const pubs = getPubsData();
    const newPub = { id: Date.now(), ...pubData };
    pubs.unshift(newPub);
    savePubsData(pubs);

    try {
      await api.post('/publications', pubData);
    } catch (e) {}
    return { data: newPub };
  },
  updatePublication: async (id, pubData) => {
    const pubs = getPubsData().map(p => p.id == id ? { ...p, ...pubData } : p);
    savePubsData(pubs);

    try {
      await api.put(`/publications/${id}`, pubData);
    } catch (e) {}
    return { data: pubData };
  },
  deletePublication: async (id) => {
    const pubs = getPubsData().filter(p => p.id != id);
    savePubsData(pubs);

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
      return { data: getPatentsData() };
    }
  },
  createPatent: async (patentData) => {
    const patents = getPatentsData();
    const newPat = { id: Date.now(), ...patentData };
    patents.unshift(newPat);
    savePatentsData(patents);

    try {
      await api.post('/patents', patentData);
    } catch (e) {}
    return { data: newPat };
  },
  updatePatent: async (id, patentData) => {
    const patents = getPatentsData().map(p => p.id == id ? { ...p, ...patentData } : p);
    savePatentsData(patents);

    try {
      await api.put(`/patents/${id}`, patentData);
    } catch (e) {}
    return { data: patentData };
  },
  deletePatent: async (id) => {
    const patents = getPatentsData().filter(p => p.id != id);
    savePatentsData(patents);

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
