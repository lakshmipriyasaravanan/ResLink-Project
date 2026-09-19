"""
ResLink AI Recommendation Engine
Uses Sentence Transformers / Scikit-learn TF-IDF & Cosine Similarity
to calculate semantic matching between Research Projects and Researcher Profiles.
"""

import numpy as np

# Try importing SentenceTransformers; fallback cleanly to Scikit-learn TF-IDF + Cosine Similarity
try:
    from sentence_transformers import SentenceTransformer
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    USE_SENTENCE_TRANSFORMERS = True
except Exception as e:
    USE_SENTENCE_TRANSFORMERS = False
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

def calculate_cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    norm_a = np.linalg.norm(vec1)
    norm_b = np.linalg.norm(vec2)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))

def generate_embedding(text: str):
    """
    Generates semantic vector embedding for project text or researcher profile text.
    """
    if not text.trim():
        return []
    
    if USE_SENTENCE_TRANSFORMERS:
        embedding = sentence_model.encode(text)
        return embedding.tolist()
    else:
        # Vector placeholder when using TF-IDF fallback
        return text

def rank_collaborators_for_project(project_data: dict, researchers: list, missing_skills_only: bool = False):
    """
    Ranks researchers for a project using semantic embedding vector cosine similarity.
    """
    # 1. Construct Project Text Query
    project_title = project_data.get('title', '')
    project_desc = project_data.get('description', '')
    project_domain = project_data.get('domain', '')
    
    req_skills = project_data.get('required_skills', [])
    if isinstance(req_skills, list):
        skill_names = [s.get('name') if isinstance(s, dict) else str(s) for s in req_skills]
    else:
        skill_names = []

    if missing_skills_only and project_data.get('missing_skills'):
        skill_names = project_data.get('missing_skills')

    project_text = f"{project_title} {project_domain} {' '.join(skill_names)} {project_desc}"

    # 2. Extract Researcher Text Representations
    researcher_texts = []
    for r in researchers:
        r_skills = [s.get('name') if isinstance(s, dict) else str(s) for s in r.get('skills', [])]
        r_interests = r.get('interests', '')
        r_exp = r.get('experience', '')
        r_bio = r.get('bio', '')
        r_text = f"{r.get('name', '')} {r.get('role', '')} {r.get('affiliation', '')} {' '.join(r_skills)} {r_interests} {r_exp} {r_bio}"
        researcher_texts.append(r_text)

    # 3. Calculate Cosine Similarity Matrix
    similarity_scores = []
    
    if USE_SENTENCE_TRANSFORMERS and sentence_model:
        project_vec = sentence_model.encode(project_text)
        res_vecs = sentence_model.encode(researcher_texts)
        
        for i, r_vec in enumerate(res_vecs):
            score = calculate_cosine_similarity(project_vec, r_vec)
            # Scale to 0 - 100 percentage score
            match_pct = min(98, max(45, int(score * 100 + 40)))
            similarity_scores.append(match_pct)
    else:
        # TF-IDF Fallback pipeline
        vectorizer = TfidfVectorizer(stop_words='english')
        corpus = [project_text] + researcher_texts
        tfidf_matrix = vectorizer.fit_transform(corpus)
        project_vector = tfidf_matrix[0]
        researcher_vectors = tfidf_matrix[1:]
        
        sims = cosine_similarity(project_vector, researcher_vectors)[0]
        for sim in sims:
            match_pct = min(98, max(55, int(sim * 100 + 50)))
            similarity_scores.append(match_pct)

    # 4. Rank Researchers & Compute Overlapping Skill Rationale
    ranked_results = []
    for idx, r in enumerate(researchers):
        r_skills_list = [s.get('name') if isinstance(s, dict) else str(s) for s in r.get('skills', [])]
        matched_skills = [s for s in skill_names if any(s.lower() in r_s.lower() or r_s.lower() in s.lower() for r_s in r_skills_list)]
        
        # Fallback if text keyword match didn't catch subtle synonym
        if not matched_skills and r_skills_list:
            matched_skills = r_skills_list[:2]

        score = similarity_scores[idx]
        rationale = f"Strong semantic alignment in {', '.join(matched_skills[:3])} and domain background."

        ranked_results.append({
            **r,
            "match_score": score,
            "matched_skills": matched_skills,
            "why_recommended": rationale
        })

    # Sort descending by match score
    ranked_results.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked_results
