import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # Student Researcher, Faculty Member, Research Scholar, Industry Partner
    affiliation = Column(String(150), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("ResearchProfile", back_populates="user", uselist=False)
    created_projects = relationship("ResearchProject", back_populates="creator")


class ResearchProfile(Base):
    __tablename__ = "research_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    interests = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    expertise = Column(Text, nullable=True)
    embedding = Column(Text, nullable=True)  # JSON stored embedding vector

    user = relationship("User", back_populates="profile")
    profile_skills = relationship("ProfileSkill", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)


class ProfileSkill(Base):
    __tablename__ = "profile_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("research_profiles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency = Column(Integer, default=3)  # 1 to 5

    profile = relationship("ResearchProfile", back_populates="profile_skills")
    skill = relationship("Skill")


class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False)
    status = Column(String(50), default="Planning")  # Planning, Team Formation, In Progress, Completed
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="created_projects")
    project_skills = relationship("ProjectSkill", back_populates="project")
    team = relationship("TeamMember", back_populates="project")
    milestones = relationship("Milestone", back_populates="project")
    publications = relationship("Publication", back_populates="project")
    patents = relationship("Patent", back_populates="project")


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency = Column(Integer, default=3)
    is_mandatory = Column(Boolean, default=True)

    project = relationship("ResearchProject", back_populates="project_skills")
    skill = relationship("Skill")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), default="Collaborator")
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("ResearchProject", back_populates="team")
    user = relationship("User")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(String(50), nullable=True)
    status = Column(String(50), default="Pending")  # Pending, In Progress, Completed

    project = relationship("ResearchProject", back_populates="milestones")


class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Publication(Base):
    __tablename__ = "publications"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=True)
    title = Column(String(255), nullable=False)
    authors = Column(Text, nullable=False)
    venue = Column(String(255), nullable=False)
    publication_date = Column(String(50), nullable=True)
    doi = Column(String(100), nullable=True)

    project = relationship("ResearchProject", back_populates="publications")


class Patent(Base):
    __tablename__ = "patents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"), nullable=True)
    title = Column(String(255), nullable=False)
    inventors = Column(Text, nullable=False)
    filing_date = Column(String(50), nullable=True)
    patent_number = Column(String(100), nullable=False)
    status = Column(String(50), default="Filed")  # Filed, Under Review, Granted, Rejected

    project = relationship("ResearchProject", back_populates="patents")


class ResearchResource(Base):
    __tablename__ = "research_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # Dataset, Tool, Framework, Learning Resource, Research Paper
    description = Column(Text, nullable=True)
    url = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=False)
