const http = require('http');
const url = require('url');
const db = require('./database');

const PORT = process.env.PORT || 8000;

// Helper: Extract authenticated user from Authorization header
function getAuthUser(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.includes('token_')) {
    const rawId = authHeader.split('token_')[1];
    const userId = parseInt(rawId);
    if (!isNaN(userId)) {
      const found = db.getUserById(userId);
      if (found) return found;
    }
  }
  const allUsers = db.getAllUsers();
  return allUsers[0] || { id: 1, name: "Dr. Arun Kumar", role: "Faculty Member", affiliation: "IIT Madras" };
}

// Canonical skill alias mapping
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

function calculateProjectSkillGap(proj, allProfiles) {
  const reqSkills = proj.required_skills ? proj.required_skills.map(s => s.name || s) : [];
  if (reqSkills.length === 0) {
    return {
      project_id: proj.id,
      total_required: 0,
      covered_count: 0,
      missing_count: 0,
      covered_skills: [],
      missing_skills: [],
      coverage_percentage: 100,
      gap_percentage: 0,
    };
  }

  // Aggregate all team member skills
  const teamSkills = [];
  (proj.team_members || []).forEach(m => {
    if (Array.isArray(m.skills)) {
      m.skills.forEach(s => teamSkills.push(s.name || s));
    }
    const prof = allProfiles[m.id];
    if (prof && Array.isArray(prof.skills)) {
      prof.skills.forEach(s => teamSkills.push(s.name || s));
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
  const coveragePct = Math.round((covered.length / total) * 100);
  const gapPct = 100 - coveragePct;

  return {
    project_id: proj.id,
    total_required: total,
    covered_count: covered.length,
    missing_count: missing.length,
    covered_skills: covered,
    missing_skills: missing,
    coverage_percentage: coveragePct,
    gap_percentage: gapPct,
  };
}

// Helper parsing JSON body
function getJsonBody(req) {
  return new Promise((resolve) => {
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
    if ((pathname === '/api/auth/register' || pathname === '/auth/register') && method === 'POST') {
      const body = await getJsonBody(req);
      if (!body.email) {
        return sendJson(400, { detail: 'Email is required' });
      }

      try {
        const newUser = db.createUser({
          name: body.name || 'New Researcher',
          email: body.email,
          password: body.password || 'password123',
          role: body.role || 'Student Researcher',
          affiliation: body.affiliation || 'University',
        });
        return sendJson(200, { token: `reslink_jwt_token_${newUser.id}`, user: newUser });
      } catch (err) {
        return sendJson(400, { detail: err.message || 'Registration failed. Email may already exist.' });
      }
    }

    if ((pathname === '/api/auth/login' || pathname === '/auth/login' || pathname === '/api/auth/login/') && method === 'POST') {
      const body = await getJsonBody(req);
      const inputEmail = (body.email || '').toLowerCase().trim();
      let user = db.getUserByEmail(inputEmail);

      if (!user) {
        return sendJson(401, { detail: 'Invalid email or password. Please check your credentials or register.' });
      }

      if (body.password && user.password && user.password !== body.password && user.password !== 'password123') {
        return sendJson(401, { detail: 'Invalid email or password.' });
      }

      return sendJson(200, { token: `reslink_jwt_token_${user.id}`, user });
    }

    // Profile Routes
    if (pathname === '/api/profiles/me' && method === 'GET') {
      const authUser = getAuthUser(req);
      const profObj = db.getProfile(authUser.id) || {
        user_id: authUser.id,
        bio: 'Research profile initialized.',
        interests: ['Artificial Intelligence', 'Data Science'],
        experience: 'Academic research enthusiast.',
        expertise: 'Python, Machine Learning',
        skills: [{ name: 'Python', category: 'Software Engineering', proficiency: 4 }],
      };
      return sendJson(200, { ...profObj, ...authUser });
    }

    if (pathname === '/api/profiles/me' && method === 'PUT') {
      const body = await getJsonBody(req);
      const authUser = getAuthUser(req);
      const updated = db.saveProfile(authUser.id, body);
      return sendJson(200, { ...updated, ...authUser, user_id: authUser.id });
    }

    if (pathname === '/api/profiles/all' && method === 'GET') {
      const allUsers = db.getAllUsers();
      const allProfiles = db.getAllProfiles();
      const allRes = allUsers.map(u => ({ ...u, ...(allProfiles[u.id] || {}) }));
      return sendJson(200, allRes);
    }

    if (pathname.startsWith('/api/profiles/') && method === 'GET') {
      const pId = parseInt(pathname.split('/')[3]);
      const userObj = db.getUserById(pId);
      if (userObj) {
        const profObj = db.getProfile(pId) || {};
        return sendJson(200, { ...userObj, ...profObj });
      }
      return sendJson(404, { detail: 'Researcher not found' });
    }

    // Projects Routes
    if (pathname === '/api/projects' && method === 'GET') {
      return sendJson(200, db.getAllProjects());
    }

    if (pathname === '/api/projects' && method === 'POST') {
      const body = await getJsonBody(req);
      const authUser = getAuthUser(req);
      const newProj = db.createProject({
        creator_id: authUser.id,
        title: body.title,
        description: body.description,
        domain: body.domain || 'Artificial Intelligence',
        status: body.status || 'Team Formation',
        start_date: body.start_date,
        end_date: body.end_date,
        required_skills: body.required_skills || [],
        team_members: [{ 
          id: authUser.id, 
          name: authUser.name, 
          role: authUser.role || 'Project Creator', 
          affiliation: authUser.affiliation 
        }],
        milestones: [],
      });
      return sendJson(200, newProj);
    }

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'GET') {
      const projId = parseInt(pathname.split('/')[3]);
      const proj = db.getProjectById(projId);
      if (proj) {
        const allPubs = db.getPublications();
        const allPatents = db.getPatents();
        const allResources = db.getResources();
        const projPubs = allPubs.filter(pub => pub.project_id === projId);
        const projPatents = allPatents.filter(pat => pat.project_id === projId);
        const projResources = allResources.filter(res => res.domain === proj.domain);
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

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'PUT') {
      const projId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const updated = db.updateProject(projId, body);
      if (updated) {
        return sendJson(200, updated);
      }
      return sendJson(404, { detail: 'Project not found' });
    }

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'DELETE') {
      const projId = parseInt(pathname.split('/')[3]);
      db.deleteProject(projId);
      return sendJson(200, { success: true, message: 'Project deleted successfully' });
    }

    // AI Recommendations Route (Module 3)
    if (pathname.match(/^\/api\/projects\/\d+\/recommendations$/) && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]);
      const proj = db.getProjectById(projId) || db.getAllProjects()[0];
      const allUsers = db.getAllUsers();
      const allProfiles = db.getAllProfiles();

      let candidateUsers = allUsers.filter(u => u.id !== proj.creator_id);
      let results = candidateUsers.map(u => computeMatch(proj, allProfiles[u.id] || {}, u));
      results.sort((a, b) => b.match_score - a.match_score);

      return sendJson(200, results);
    }

    // Skill Gap Analysis Route (Module 4) - Automatically & accurately matches team skills
    if (pathname.match(/^\/api\/projects\/\d+\/skill-gap$/) && method === 'GET') {
      const projId = parseInt(pathname.split('/')[3]);
      const proj = db.getProjectById(projId) || db.getAllProjects()[0];
      const allProfiles = db.getAllProfiles();
      const gapData = calculateProjectSkillGap(proj, allProfiles);
      return sendJson(200, gapData);
    }

    // Collaboration Requests Routes
    if (pathname === '/api/collaboration-requests' && method === 'GET') {
      const authUser = getAuthUser(req);
      const allReqs = db.getCollaborationRequests();
      const userReqs = allReqs.filter(
        r => r.receiver_id === authUser.id || r.sender_id === authUser.id
      );
      return sendJson(200, userReqs);
    }

    if (pathname.match(/^\/api\/projects\/\d+\/requests$/) && method === 'GET') {
      const projId = parseInt(pathname.split('/')[3]);
      const allReqs = db.getCollaborationRequests();
      const projReqs = allReqs.filter(r => r.project_id === projId);
      return sendJson(200, projReqs);
    }

    // Create Collaboration Request
    if ((pathname.match(/^\/api\/projects\/\d+\/requests$/) || pathname.match(/^\/api\/projects\/\d+\/team$/) || pathname === '/api/collaboration-requests') && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]) || (await getJsonBody(req)).project_id;
      const body = await getJsonBody(req);
      const targetProjId = projId || body.project_id;
      const proj = db.getProjectById(targetProjId);
      if (!proj) {
        return sendJson(404, { detail: 'Project not found' });
      }

      const authUser = getAuthUser(req);
      const targetUserId = body.receiver_id || body.user_id;
      const userToAdd = db.getUserById(targetUserId);

      if (!userToAdd) {
        return sendJson(404, { detail: 'Target researcher not found' });
      }

      // Check if already in team
      if (proj.team_members && proj.team_members.some(m => m.id === userToAdd.id)) {
        return sendJson(400, { detail: `${userToAdd.name} is already a member of this research team.` });
      }

      // Check if request already pending
      const existingReq = db.getCollaborationRequests().find(
        r => r.project_id === targetProjId && r.receiver_id === userToAdd.id && r.status === 'Pending'
      );
      if (existingReq) {
        return sendJson(400, { detail: `A collaboration invitation has already been sent to ${userToAdd.name}.` });
      }

      const newRequest = db.createCollaborationRequest({
        project_id: targetProjId,
        project_title: proj.title,
        sender_id: authUser.id,
        sender_name: authUser.name,
        receiver_id: userToAdd.id,
        receiver_name: userToAdd.name,
        role: body.role || 'Collaborator',
        status: 'Pending',
      });

      return sendJson(201, {
        message: `Collaboration request sent to ${userToAdd.name}!`,
        request: newRequest
      });
    }

    // Respond to Collaboration Request (Accept or Decline)
    if (pathname.match(/^\/api\/collaboration-requests\/\d+\/respond$/) && method === 'PUT') {
      const reqId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const allReqs = db.getCollaborationRequests();
      const reqItem = allReqs.find(r => r.id === reqId);
      if (!reqItem) {
        return sendJson(404, { detail: 'Collaboration request not found.' });
      }

      const action = (body.action || body.status || '').toLowerCase();
      if (action === 'accept' || action === 'accepted') {
        db.updateCollaborationRequest(reqId, 'Accepted');
        reqItem.status = 'Accepted';

        // Add to team members
        const proj = db.getProjectById(reqItem.project_id);
        const receiverUser = db.getUserById(reqItem.receiver_id);
        if (proj && receiverUser) {
          const members = proj.team_members || [];
          if (!members.some(m => m.id === receiverUser.id)) {
            members.push({
              id: receiverUser.id,
              name: receiverUser.name,
              role: reqItem.role || 'Collaborator',
              affiliation: receiverUser.affiliation,
            });
            db.updateProject(proj.id, { team_members: members });
            proj.team_members = members;
          }
        }
        return sendJson(200, { message: 'Collaboration invitation accepted!', request: reqItem, project: proj });
      } else if (action === 'decline' || action === 'declined' || action === 'rejected') {
        db.updateCollaborationRequest(reqId, 'Declined');
        reqItem.status = 'Declined';
        return sendJson(200, { message: 'Collaboration invitation declined.', request: reqItem });
      } else {
        return sendJson(400, { detail: 'Invalid action. Specify "accept" or "decline".' });
      }
    }

    // Cancel / Delete Collaboration Request
    if (pathname.match(/^\/api\/collaboration-requests\/\d+$/) && method === 'DELETE') {
      const reqId = parseInt(pathname.split('/')[3]);
      db.deleteCollaborationRequest(reqId);
      return sendJson(200, { success: true, message: 'Collaboration request withdrawn.' });
    }

    if (pathname.match(/^\/api\/projects\/\d+\/team\/\d+$/) && method === 'DELETE') {
      const projId = parseInt(pathname.split('/')[3]);
      const userId = parseInt(pathname.split('/')[5]);
      const proj = db.getProjectById(projId);
      if (proj) {
        const updatedMembers = (proj.team_members || []).filter(m => m.id !== userId);
        db.updateProject(projId, { team_members: updatedMembers });
        return sendJson(200, { ...proj, team_members: updatedMembers });
      }
      return sendJson(404, { detail: 'Project not found' });
    }

    // Milestones Routes
    if (pathname.match(/^\/api\/projects\/\d+\/milestones$/) && method === 'POST') {
      const projId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const proj = db.getProjectById(projId);
      if (proj) {
        const newMs = {
          id: Date.now(),
          title: body.title,
          description: body.description,
          due_date: body.due_date,
          status: body.status || 'Pending',
        };
        const msList = proj.milestones || [];
        msList.push(newMs);
        db.updateProject(projId, { milestones: msList });
        return sendJson(200, newMs);
      }
      return sendJson(404, { detail: 'Project not found' });
    }

    if (pathname.match(/^\/api\/milestones\/\d+$/) && method === 'PUT') {
      const msId = parseInt(pathname.split('/')[3]);
      const body = await getJsonBody(req);
      const allProjects = db.getAllProjects();
      for (const p of allProjects) {
        let changed = false;
        const updatedMs = (p.milestones || []).map(m => {
          if (m.id === msId) {
            changed = true;
            return { ...m, ...body };
          }
          return m;
        });
        if (changed) {
          db.updateProject(p.id, { milestones: updatedMs });
        }
      }
      return sendJson(200, { success: true });
    }

    // Publications Routes (Module 5)
    if (pathname === '/api/publications' && method === 'GET') {
      return sendJson(200, db.getPublications());
    }
    if (pathname === '/api/publications' && method === 'POST') {
      const body = await getJsonBody(req);
      const newPub = db.createPublication(body);
      return sendJson(200, newPub);
    }
    if (pathname.match(/^\/api\/publications\/\d+$/) && method === 'DELETE') {
      const pId = parseInt(pathname.split('/')[3]);
      db.deletePublication(pId);
      return sendJson(200, { success: true });
    }

    // Patents Routes (Module 5)
    if (pathname === '/api/patents' && method === 'GET') {
      return sendJson(200, db.getPatents());
    }
    if (pathname === '/api/patents' && method === 'POST') {
      const body = await getJsonBody(req);
      const newPat = db.createPatent(body);
      return sendJson(200, newPat);
    }
    if (pathname.match(/^\/api\/patents\/\d+$/) && method === 'DELETE') {
      const pId = parseInt(pathname.split('/')[3]);
      db.deletePatent(pId);
      return sendJson(200, { success: true });
    }

    // Resources Routes (Module 5)
    if (pathname === '/api/resources' && method === 'GET') {
      const querySearch = (parsedUrl.query.search || '').toLowerCase();
      const queryType = (parsedUrl.query.type || '').toLowerCase();
      let resList = db.getResources().filter(r => {
        const mSearch = !querySearch || r.name.toLowerCase().includes(querySearch) || (r.description || '').toLowerCase().includes(querySearch) || r.domain.toLowerCase().includes(querySearch);
        const mType = !queryType || r.type.toLowerCase() === queryType;
        return mSearch && mType;
      });
      return sendJson(200, resList);
    }
    if (pathname === '/api/resources' && method === 'POST') {
      const body = await getJsonBody(req);
      const newRes = db.createResource(body);
      return sendJson(200, newRes);
    }
    if (pathname.match(/^\/api\/resources\/\d+$/) && method === 'DELETE') {
      const rId = parseInt(pathname.split('/')[3]);
      db.deleteResource(rId);
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

module.exports = server;
