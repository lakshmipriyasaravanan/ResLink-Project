# ResLink — System Architecture & Software Requirements Specification (SRS)

**Course**: Object-Oriented Software Engineering (OOSE) Lab  
**Project Title**: ResLink – AI-Powered Research Team Builder & Collaboration Platform  
**System Architecture**: 3-Tier Client-Server Architecture (React SPA + RESTful API Backend + SQLite/SQLAlchemy Data Layer)

---

## 1. Executive Summary & Problem Statement

Modern academic research requires multidisciplinary collaboration across engineering, computer science, healthcare, and domain sciences. However, traditional team formation relies on informal networks, leading to skill gaps, sub-optimal team composition, and unallocated project requirements.

**ResLink** solves this problem by using **Object-Oriented Design principles**, **RESTful microservices**, and **Cosine Similarity Vector Embeddings** to automatically match research project requirements with ideal collaborators and quantify team skill deficits.

---

## 2. Object-Oriented Architecture & Design Patterns

The system adheres strictly to classical OOSE design patterns:

### A. 3-Tier Architecture Pattern
1. **Presentation Layer (Frontend)**: Modular React Component Hierarchy (`Navbar`, `Sidebar`, `SkillBadge`, `Modal`, `Toast`, Pages) styled with Tailwind CSS design system tokens.
2. **Application Logic Layer (Backend REST API)**: Modular Controller/Router pattern mapping HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to service functions.
3. **Data Access Layer (Persistence)**: Object-Relational Mapping (ORM) using SQLAlchemy / relational entities mapping Python domain models to underlying SQLite/PostgreSQL tables.

### B. Applied Design Patterns
- **Singleton Pattern**: Database engine connection pooling (`database.py`) and Axios HTTP client instance (`api.js`).
- **Factory / Router Pattern**: Endpoint handlers separated by entity responsibility (`auth`, `profiles`, `projects`, `recommendations`, `skill_gap`, `outputs`).
- **Observer / Context Pattern**: React Context API (`AuthContext.jsx`) managing global user authentication state, JWT tokens, and active project context across the component tree.
- **Strategy Pattern**: Recommendation Engine abstraction allowing dynamic switching between Sentence Transformers semantic embeddings and Scikit-Learn TF-IDF Cosine Similarity vector models.

---

## 3. Entity-Relationship (ER) Diagram

```
+----------------+       +-------------------+       +--------------------+
|     USERS      |1     1| RESEARCH_PROFILES |1     *|   PROFILE_SKILLS   |
|----------------|-------|-------------------|-------|--------------------|
| id (PK)        |       | id (PK)           |       | id (PK)            |
| email          |       | user_id (FK)      |       | profile_id (FK)    |
| password_hash  |       | bio               |       | skill_id (FK)      |
| role           |       | interests         |       | proficiency        |
| affiliation    |       | expertise         |       +--------------------+
+----------------+       +-------------------+
        |1                         
        |                          
        |*                         
+-------------------+1     *+-------------------+       +--------------------+
| RESEARCH_PROJECTS |-------|   PROJECT_SKILLS  |       |     MILESTONES     |
|-------------------|       |-------------------|       |--------------------|
| id (PK)           |       | id (PK)           |       | id (PK)            |
| creator_id (FK)   |       | project_id (FK)   |       | project_id (FK)    |
| title             |       | skill_id (FK)     |       | title              |
| description       |       | proficiency       |       | due_date           |
| domain            |       +-------------------+       | status             |
| status            |                                   +--------------------+
+-------------------+
        |1                                              +--------------------+
        |*                                              |    PUBLICATIONS    |
        +-----------------------------------------------|--------------------|
        |                                               | id (PK)            |
        |*                                              | project_id (FK)    |
        +-----------------------------------------------| title              |
                                                        | authors, venue, doi|
                                                        +--------------------+
```

---

## 4. Algorithmic Specifications

### A. Semantic AI Collaborator Matching Engine
1. **Query Encoding ($V_{project}$)**:  
   Construct text representation:  
   $$T_{project} = \text{Title} + \text{Domain} + \text{RequiredSkills} + \text{Description}$$
   Convert to dense vector using Sentence Transformers / TF-IDF:  
   $$V_{project} = \text{Embed}(T_{project})$$

2. **Candidate Profile Encoding ($V_{researcher}$)**:  
   Construct researcher profile text:  
   $$T_{researcher} = \text{Skills} + \text{Interests} + \text{Expertise} + \text{Bio}$$
   Convert to vector:  
   $$V_{researcher} = \text{Embed}(T_{researcher})$$

3. **Cosine Similarity Computation**:  
   $$\text{Cosine Similarity}(V_p, V_r) = \frac{V_p \cdot V_r}{\|V_p\| \|V_r\|} = \frac{\sum_{i=1}^n V_{p,i} V_{r,i}}{\sqrt{\sum_{i=1}^n V_{p,i}^2} \sqrt{\sum_{i=1}^n V_{r,i}^2}}$$
   Linear scaling converts the distance metric to a normalized 0–100% Match Percentage.

### B. Team Skill Gap Quantification
Given Required Project Skills $S_{req} = \{s_1, s_2, \dots, s_n\}$ and Current Team Member Skills $S_{team} = \bigcup_{m \in \text{Team}} \text{Skills}(m)$:

- **Covered Skills**: $S_{covered} = S_{req} \cap S_{team}$
- **Missing Skills**: $S_{missing} = S_{req} \setminus S_{team}$
- **Skill Coverage Percentage**:  
  $$\text{Coverage \%} = \left( \frac{|S_{covered}|}{|S_{req}|} \right) \times 100$$
- **Skill Deficit Gap Percentage**:  
  $$\text{Gap \%} = 100 - \text{Coverage \%}$$

---

## 5. Security & REST API Contracts

- **Authentication**: Stateful JWT Tokens signed with SHA-256 HMAC algorithm.
- **Authorization**: Protected Route component guards in React DOM with bearer token interceptors.
- **Data Protection**: Input sanitization via Pydantic request models & parameter binding preventing SQL Injection.

---

## 6. How to Run the System Independently

Execute the following standard terminal commands in PowerShell or Command Prompt:

### Terminal 1: Backend Server
```powershell
cd "d:\Lakshmi Priya\backend"
node server.js
```
*(Runs backend REST API on `http://localhost:8000`)*

### Terminal 2: Frontend Client
```powershell
cd "d:\Lakshmi Priya\frontend"
npm run preview -- --port 3000
```
*(Runs React Web App on `http://localhost:3000`)*
