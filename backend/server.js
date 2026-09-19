const http = require('http');
const url = require('url');

const PORT = 8000;

// Demo Data Storage
let users = [
  {
    id: 1,
    name: "Dr. Arun Kumar",
    email: "arun.kumar@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "IIT Madras - Department of CSE",
  },
  {
    id: 2,
    name: "Prof. Sarah Chen",
    email: "sarah.chen@reslink.edu",
    password: "password123",
    role: "Research Scholar",
    affiliation: "Stanford University - AI Lab",
  },
  {
    id: 3,
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "IISc Bangalore - Supercomputer Education",
  },
  {
    id: 4,
    name: "Elena Rostova",
    email: "elena.rostova@reslink.edu",
    password: "password123",
    role: "Student Researcher",
    affiliation: "MIT - Media Lab",
  },
  {
    id: 5,
    name: "Marcus Vance",
    email: "marcus.vance@reslink.edu",
    password: "password123",
    role: "Industry Partner",
    affiliation: "Google Research Labs",
  },
  {
    id: 6,
    name: "Priyanshu Patel",
    email: "priyanshu.patel@reslink.edu",
    password: "password123",
    role: "Student Researcher",
    affiliation: "IIT Bombay - Centre for ML",
  },
  {
    id: 7,
    name: "Dr. Anita Roy",
    email: "anita.roy@reslink.edu",
    password: "password123",
    role: "Faculty Member",
    affiliation: "Carnegie Mellon University",
  },
  {
    id: 8,
    name: "Alex Mercer",
    email: "alex.mercer@reslink.edu",
    password: "password123",
    role: "Research Scholar",
    affiliation: "ETH Zurich - Systems Lab",
  },
];

let profiles = {
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
    bio: "Expert in Cloud & Distributed Systems, High-Performance Computing, and scalable infrastructure for AI acceleration.",
    interests: ["Cloud Computing", "Distributed Systems", "Parallel Computing", "Kubernetes"],
    experience: "15 years HPC cluster optimization, GPU scheduling, and Docker/K8s orchestration.",
    expertise: "AWS, GCP, Distributed Training, Ray, Docker, Kubernetes, C++",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Data Science", category: "Data Science", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
      { name: "Cybersecurity", category: "Cybersecurity", proficiency: 3 },
    ],
  },
  4: {
    user_id: 4,
    bio: "Graduate researcher working on Computer Vision, Multimodal Generative AI, and Autonomous Robotics.",
    interests: ["Computer Vision", "Deep Learning", "Generative AI", "PyTorch"],
    experience: "3 years computer vision research, OpenCV image processing, diffusion models.",
    expertise: "OpenCV, Diffusion Models, NeRFs, PyTorch, CUDA",
    skills: [
      { name: "Computer Vision", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Deep Learning", category: "Artificial Intelligence", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
  5: {
    user_id: 5,
    bio: "Principal AI Scientist at Google Research leading enterprise cloud ML infrastructure and privacy-preserving ML.",
    interests: ["Cloud Computing", "Cybersecurity", "Federated Learning", "Machine Learning"],
    experience: "10 years industry R&D at Google, TensorFlow Core contributor.",
    expertise: "Enterprise ML Architectures, Differential Privacy, Federated ML",
    skills: [
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 5 },
      { name: "Cybersecurity", category: "Cybersecurity", proficiency: 5 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 5 },
    ],
  },
  6: {
    user_id: 6,
    bio: "M.Tech scholar exploring IoT sensor networks, Edge AI deployment, and embedded ML optimizations.",
    interests: ["IoT", "Edge AI", "Embedded Systems", "Machine Learning"],
    experience: "2 years embedded systems development, MicroPython, Edge Impulse.",
    expertise: "Raspberry Pi, ESP32, TensorRT, TinyML",
    skills: [
      { name: "IoT", category: "Domain Research", proficiency: 4 },
      { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 3 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
  7: {
    user_id: 7,
    bio: "Associate Professor researching Blockchain protocols, Cryptography, Smart Contracts, and Decentralized Identity.",
    interests: ["Blockchain", "Cybersecurity", "Zero-Knowledge Proofs", "Cryptography"],
    experience: "9 years research in cryptographic protocols & decentralized security.",
    expertise: "Solidity, Ethereum, ZK-SNARKs, Distributed Consensus",
    skills: [
      { name: "Blockchain", category: "Cybersecurity", proficiency: 5 },
      { name: "Cybersecurity", category: "Cybersecurity", proficiency: 5 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
  8: {
    user_id: 8,
    bio: "PhD candidate working on High-Performance Distributed Computing, Data Engineering, and Real-time Analytics.",
    interests: ["Data Science", "Cloud Computing", "Apache Spark", "Distributed Databases"],
    experience: "4 years Big Data pipeline architecture & stream processing.",
    expertise: "Spark, Kafka, Scala, SQL, Distributed Algorithms",
    skills: [
      { name: "Data Science", category: "Data Science", proficiency: 5 },
      { name: "Cloud Computing", category: "Cloud & Systems", proficiency: 4 },
      { name: "Python", category: "Software Engineering", proficiency: 4 },
    ],
  },
};

let projects = [
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
    milestones: [
      { id: 3, title: "Dataset Curation & Validation", description: "Annotate parallel corpora.", due_date: "2026-03-31", status: "Completed" },
    ],
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

let publications = [
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

let patents = [
  {
    id: 1,
    project_id: 1,
    title: "Method and System for Privacy-Preserving Clinical Risk Scoring via Neural Vector Quantization",
    inventors: "Dr. Arun Kumar, Marcus Vance",
    filing_date: "2026-02-14",
    patent_number: "US20260049281A1",
    status: "Under Review",
  },
];

let resources = [
  {
    id: 1,
    name: "MIMIC-IV De-identified Clinical Dataset",
    type: "Dataset",
    description: "Comprehensive electronic health records covering thousands of ICU patient stays for predictive medical modeling.",
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
  {
    id: 3,
    name: "Ray Distributed AI Cluster Toolkit",
    type: "Tool",
    description: "Open-source unified framework for scaling AI and Python applications effortlessly across GPU nodes.",
    url: "https://www.ray.io/",
    domain: "Cloud & Distributed Systems",
  },
];

// Helper parsing JSON body
function getJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

// Simple Cosine Similarity Matcher for AI Recommendations
function computeMatch(project, userProfile, userObj) {
  const reqSkills = project.required_skills ? project.required_skills.map(s => (s.name || s).toLowerCase()) : [];
  const profSkills = userProfile.skills ? userProfile.skills.map(s => (s.name || s).toLowerCase()) : [];

  const matched = reqSkills.filter(s => profSkills.some(ps => ps.includes(s) || s.includes(ps)));
  
  // Calculate score 65% - 98% based on skill overlap & background alignment
  let score = 65;
  if (reqSkills.length > 0) {
    const overlapRatio = matched.length / reqSkills.length;
    score = Math.min(98, Math.max(68, Math.round(overlapRatio * 30 + 68)));
  }

  // Boost for domain match in bio/interests
  const interestsText = (userProfile.interests || []).join(' ').toLowerCase();
  if (project.domain && interestsText.includes(project.domain.toLowerCase())) {
    score = Math.min(98, score + 5);
  }

  const matchedFormatted = matched.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  const whyRecommended = `High semantic affinity in ${matchedFormatted.length > 0 ? matchedFormatted.join(', ') : 'AI & Computing domains'} with ${userObj.role} expertise.`;

  return {
    id: userObj.id,
    name: userObj.name,
    email: userObj.email,
    role: userObj.role,
    affiliation: userObj.affiliation,
    bio: userProfile.bio,
    interests: userProfile.interests,
    experience: userProfile.experience,
    expertise: userProfile.expertise,
    skills: userProfile.skills,
    match_score: score,
    matched_skills: matchedFormatted.length > 0 ? matchedFormatted : profSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    why_recommended: whyRecommended
  };
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    // Auth Routes
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await getJsonBody(req);
      const newId = users.length + 1;
      const newUser = {
        id: newId,
        name: body.name || 'New Researcher',
        email: body.email,
        password: body.password || 'password123',
        role: body.role || 'Student Researcher',
        affiliation: body.affiliation || 'University',
      };
      users.push(newUser);
      profiles[newId] = {
        user_id: newId,
        bio: 'Research profile initialized.',
        interests: ['Artificial Intelligence', 'Data Science'],
        experience: 'Academic research enthusiast.',
        expertise: 'Python, Data Analysis',
        skills: [{ name: 'Python', category: 'Software Engineering', proficiency: 4 }],
      };
      return sendJson(200, { token: `reslink_jwt_token_${newId}`, user: newUser });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await getJsonBody(req);
      const user = users.find(u => u.email === body.email);
      if (user) {
        return sendJson(200, { token: `reslink_jwt_token_${user.id}`, user });
      } else {
        return sendJson(401, { detail: 'Invalid email or password.' });
      }
    }

    // Profile Routes
    if (pathname === '/api/profiles/me' && method === 'GET') {
      const authHeader = req.headers.authorization || '';
      let userId = 1;
      if (authHeader.includes('token_')) {
        userId = parseInt(authHeader.split('token_')[1]) || 1;
      }
      const userObj = users.find(u => u.id === userId) || users[0];
      const profObj = profiles[userId] || profiles[1];
      return sendJson(200, { ...profObj, ...userObj });
    }

    if (pathname === '/api/profiles/me' && method === 'PUT') {
      const body = await getJsonBody(req);
      const authHeader = req.headers.authorization || '';
      let userId = 1;
      if (authHeader.includes('token_')) {
        userId = parseInt(authHeader.split('token_')[1]) || 1;
      }
      if (profiles[userId]) {
        profiles[userId] = { ...profiles[userId], ...body };
      }
      return sendJson(200, { ...profiles[userId], user_id: userId });
    }

    if (pathname === '/api/profiles/all' && method === 'GET') {
      const allRes = users.map(u => ({ ...u, ...(profiles[u.id] || {}) }));
      return sendJson(200, allRes);
    }

    if (pathname.startsWith('/api/profiles/') && method === 'GET') {
      const pId = parseInt(pathname.split('/')[3]);
      const userObj = users.find(u => u.id === pId);
      if (userObj) {
        return sendJson(200, { ...userObj, ...(profiles[pId] || {}) });
      }
    }

    // Projects Routes
    if (pathname === '/api/projects' && method === 'GET') {
      return sendJson(200, projects);
    }

    if (pathname === '/api/projects' && method === 'POST') {
      const body = await getJsonBody(req);
      const newProj = {
        id: projects.length + 1,
        creator_id: 1,
        title: body.title,
        description: body.description,
        domain: body.domain,
        status: body.status || 'Team Formation',
        start_date: body.start_date,
        end_date: body.end_date,
        required_skills: body.required_skills || [],
        team_members: [{ id: 1, name: 'Dr. Arun Kumar', role: 'Project Creator', affiliation: 'IIT Madras' }],
        milestones: [],
      };
      projects.unshift(newProj);
      return sendJson(200, newProj);
    }

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'GET') {
      const projId = parseInt(pathname.split('/')[3]);
      const proj = projects.find(p => p.id === projId);
      if (proj) {
        // Hydrate publications & resources
        const projPubs = publications.filter(pub => pub.project_id === projId);
        const projPatents = patents.filter(pat => pat.project_id === projId);
        const projResources = resources.filter(res => res.domain === proj.domain);
        return sendJson(200, {
          ...proj,
          publications: projPubs,
          patents: projPatents,
          resources: projResources,
        });
      } else {
        return sendJson(404, { detail: 'Project not found' });
      }
    }

    // AI Recommendations Route (Module 3)
    if (pathname.match(/^\/api\/projects\/\d+\/recommendations$/) && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const proj = projects.find(p => p.id === projId) || projects[0];

      let candidateUsers = users.filter(u => u.id !== proj.creator_id);

      let results = candidateUsers.map(u => computeMatch(proj, profiles[u.id] || {}, u));
      results.sort((a, b) => b.match_score - a.match_score);

      return sendJson(200, results);
    }

    // Skill Gap Analysis Route (Module 4)
    if (pathname.match(/^\/api\/projects\/\d+\/skill-gap$/) && method === 'GET') {
      const projId = parseInt(pathname.split('/')[3]);
      const proj = projects.find(p => p.id === projId) || projects[0];

      const reqSkills = proj.required_skills ? proj.required_skills.map(s => s.name || s) : [];
      
      // Combined skills of all current team members
      let teamSkillsSet = new Set();
      if (proj.team_members) {
        proj.team_members.forEach(member => {
          const userProf = profiles[member.id] || {};
          if (userProf.skills) {
            userProf.skills.forEach(s => teamSkillsSet.add((s.name || s).toLowerCase()));
          }
        });
      }

      let covered = [];
      let missing = [];

      reqSkills.forEach(skill => {
        const lowerS = skill.toLowerCase();
        let isFound = false;
        teamSkillsSet.forEach(ts => {
          if (ts.includes(lowerS) || lowerS.includes(ts)) {
            isFound = true;
          }
        });

        if (isFound) covered.push(skill);
        else missing.push(skill);
      });

      const total = reqSkills.length || 1;
      const coveragePct = Math.round((covered.length / total) * 100);
      const gapPct = 100 - coveragePct;

      return sendJson(200, {
        project_id: projId,
        total_required: total,
        covered_count: covered.length,
        missing_count: missing.length,
        covered_skills: covered,
        missing_skills: missing,
        coverage_percentage: coveragePct,
        gap_percentage: gapPct,
      });
    }

    // Team Routes
    if (pathname.match(/^\/api\/projects\/\d+\/team$/) && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const proj = projects.find(p => p.id === projId);
      const userToAdd = users.find(u => u.id === body.user_id);
      if (proj && userToAdd) {
        if (!proj.team_members.some(m => m.id === userToAdd.id)) {
          proj.team_members.push({
            id: userToAdd.id,
            name: userToAdd.name,
            role: body.role || userToAdd.role,
            affiliation: userToAdd.affiliation,
          });
        }
        return sendJson(200, proj);
      }
    }

    if (pathname.match(/^\/api\/projects\/\d+\/team\/\d+$/) && method === 'DELETE') {
      const projId = parseInt(pathname.split('/')[3]);
      const userId = parseInt(pathname.split('/')[5]);
      const proj = projects.find(p => p.id === projId);
      if (proj) {
        proj.team_members = proj.team_members.filter(m => m.id !== userId);
        return sendJson(200, proj);
      }
    }

    // Milestones Routes
    if (pathname.match(/^\/api\/projects\/\d+\/milestones$/) && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const proj = projects.find(p => p.id === projId);
      if (proj) {
        const newMs = {
          id: Date.now(),
          title: body.title,
          description: body.description,
          due_date: body.due_date,
          status: body.status || 'Pending',
        };
        proj.milestones.push(newMs);
        return sendJson(200, newMs);
      }
    }

    if (pathname.match(/^\/api\/milestones\/\d+$/) && method === 'PUT') {
      const msId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      projects.forEach(p => {
        p.milestones = p.milestones.map(m => m.id === msId ? { ...m, ...body } : m);
      });
      return sendJson(200, { success: true });
    }

    // Publications Routes (Module 5)
    if (pathname === '/api/publications' && method === 'GET') {
      return sendJson(200, publications);
    }
    if (pathname === '/api/publications' && method === 'POST') {
      const body = await getJsonBody(req);
      const newPub = { id: Date.now(), ...body };
      publications.unshift(newPub);
      return sendJson(200, newPub);
    }
    if (pathname.match(/^\/api\/publications\/\d+$/) && method === 'DELETE') {
      const pId = parseInt(pathname.split('/')[3]);
      publications = publications.filter(p => p.id !== pId);
      return sendJson(200, { success: true });
    }

    // Patents Routes (Module 5)
    if (pathname === '/api/patents' && method === 'GET') {
      return sendJson(200, patents);
    }
    if (pathname === '/api/patents' && method === 'POST') {
      const body = await getJsonBody(req);
      const newPat = { id: Date.now(), ...body };
      patents.unshift(newPat);
      return sendJson(200, newPat);
    }
    if (pathname.match(/^\/api\/patents\/\d+$/) && method === 'DELETE') {
      const pId = parseInt(pathname.split('/')[3]);
      patents = patents.filter(p => p.id !== pId);
      return sendJson(200, { success: true });
    }

    // Resources Routes (Module 5)
    if (pathname === '/api/resources' && method === 'GET') {
      const querySearch = (parsedUrl.query.search || '').toLowerCase();
      const queryType = (parsedUrl.query.type || '').toLowerCase();
      let resList = resources.filter(r => {
        const mSearch = !querySearch || r.name.toLowerCase().includes(querySearch) || (r.description || '').toLowerCase().includes(querySearch) || r.domain.toLowerCase().includes(querySearch);
        const mType = !queryType || r.type.toLowerCase() === queryType;
        return mSearch && mType;
      });
      return sendJson(200, resList);
    }
    if (pathname === '/api/resources' && method === 'POST') {
      const body = await getJsonBody(req);
      const newRes = { id: Date.now(), ...body };
      resources.unshift(newRes);
      return sendJson(200, newRes);
    }
    if (pathname.match(/^\/api\/resources\/\d+$/) && method === 'DELETE') {
      const rId = parseInt(pathname.split('/')[3]);
      resources = resources.filter(r => r.id !== rId);
      return sendJson(200, { success: true });
    }

    return sendJson(404, { detail: 'Endpoint not found' });
  } catch (err) {
    console.error('API Server Error:', err);
    return sendJson(500, { detail: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`ResLink Backend API Server running live on http://localhost:${PORT}`);
});
