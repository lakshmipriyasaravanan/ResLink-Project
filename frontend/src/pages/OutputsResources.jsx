import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Award, 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Filter, 
  Layers,
  FileText
} from 'lucide-react';
import { publicationAPI, patentAPI, resourceAPI, projectAPI } from '../services/api';

const OutputsResources = () => {
  const { activeProjectId } = useAuth();
  const [activeTab, setActiveTab] = useState('PUBLICATIONS'); // PUBLICATIONS | PATENTS | RESOURCES
  const [projects, setProjects] = useState([]);

  // Data lists
  const [publications, setPublications] = useState([]);
  const [patents, setPatents] = useState([]);
  const [resources, setResources] = useState([]);

  // Filters & Search
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Modal forms
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [isPatentModalOpen, setIsPatentModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Form states
  const [pubForm, setPubForm] = useState({
    title: '',
    authors: '',
    venue: '',
    publication_date: new Date().toISOString().split('T')[0],
    doi: '',
    project_id: '',
  });

  const [patentForm, setPatentForm] = useState({
    title: '',
    inventors: '',
    filing_date: new Date().toISOString().split('T')[0],
    patent_number: '',
    status: 'Filed',
    project_id: '',
  });

  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'Dataset',
    description: '',
    url: '',
    domain: 'Artificial Intelligence',
  });

  useEffect(() => {
    fetchInitialData();
  }, [resourceSearch, resourceTypeFilter]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pubRes, patentRes, resRes, projRes] = await Promise.all([
        publicationAPI.getPublications(),
        patentAPI.getPatents(),
        resourceAPI.getResources(resourceSearch, resourceTypeFilter),
        projectAPI.getProjects(),
      ]);
      setPublications(pubRes.data);
      setPatents(patentRes.data);
      setResources(resRes.data);
      setProjects(projRes.data);
    } catch (err) {
      setToast({ message: 'Failed to load research outputs and resources.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Publications Handlers
  const handleAddPublication = async (e) => {
    e.preventDefault();
    try {
      await publicationAPI.createPublication(pubForm);
      setIsPubModalOpen(false);
      setPubForm({ title: '', authors: '', venue: '', publication_date: new Date().toISOString().split('T')[0], doi: '', project_id: '' });
      setToast({ message: 'Publication added successfully!', type: 'success' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to add publication.', type: 'error' });
    }
  };

  const handleDeletePublication = async (id) => {
    if (!window.confirm('Delete this publication?')) return;
    try {
      await publicationAPI.deletePublication(id);
      setToast({ message: 'Publication deleted.', type: 'info' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to delete publication.', type: 'error' });
    }
  };

  // Patents Handlers
  const handleAddPatent = async (e) => {
    e.preventDefault();
    try {
      await patentAPI.createPatent(patentForm);
      setIsPatentModalOpen(false);
      setPatentForm({ title: '', inventors: '', filing_date: new Date().toISOString().split('T')[0], patent_number: '', status: 'Filed', project_id: '' });
      setToast({ message: 'Patent registered successfully!', type: 'success' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to add patent.', type: 'error' });
    }
  };

  const handleDeletePatent = async (id) => {
    if (!window.confirm('Delete this patent entry?')) return;
    try {
      await patentAPI.deletePatent(id);
      setToast({ message: 'Patent deleted.', type: 'info' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to delete patent.', type: 'error' });
    }
  };

  // Resources Handlers
  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await resourceAPI.createResource(resourceForm);
      setIsResourceModalOpen(false);
      setResourceForm({ name: '', type: 'Dataset', description: '', url: '', domain: 'Artificial Intelligence' });
      setToast({ message: 'Research resource added!', type: 'success' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to add resource.', type: 'error' });
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await resourceAPI.deleteResource(id);
      setToast({ message: 'Resource removed.', type: 'info' });
      fetchInitialData();
    } catch (err) {
      setToast({ message: 'Failed to delete resource.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={activeProjectId} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-flex mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Core Module 5 — Outputs & Resource Hub</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Research Outputs & Resource Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage scholarly publications, patents, datasets, and domain learning resources.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'PUBLICATIONS' && (
                <button
                  onClick={() => setIsPubModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Publication</span>
                </button>
              )}
              {activeTab === 'PATENTS' && (
                <button
                  onClick={() => setIsPatentModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Patent</span>
                </button>
              )}
              {activeTab === 'RESOURCES' && (
                <button
                  onClick={() => setIsResourceModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Resource</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
            <button
              onClick={() => setActiveTab('PUBLICATIONS')}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                activeTab === 'PUBLICATIONS'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Publications ({publications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PATENTS')}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                activeTab === 'PATENTS'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Patents ({patents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('RESOURCES')}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                activeTab === 'RESOURCES'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Research Resources ({resources.length})</span>
            </button>
          </div>

          {/* Tab 1: Publications */}
          {activeTab === 'PUBLICATIONS' && (
            <div className="space-y-4">
              {publications.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3">
                  <BookOpen className="h-10 w-10 text-brand-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Publications Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add your research papers, conference proceedings, or journal articles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm flex flex-col justify-between space-y-3 group hover:border-brand-200 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                            {pub.venue}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{pub.publication_date}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                          {pub.title}
                        </h3>
                        <p className="text-xs text-slate-600">Authors: {pub.authors}</p>
                        {pub.doi && (
                          <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                            DOI: {pub.doi}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeletePublication(pub.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Publication"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Patents */}
          {activeTab === 'PATENTS' && (
            <div className="space-y-4">
              {patents.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3">
                  <Award className="h-10 w-10 text-brand-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Patents Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Register patent filings, intellectual property, or innovation grants.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patents.map((pat) => (
                    <div
                      key={pat.id}
                      className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm flex flex-col justify-between space-y-3 group hover:border-brand-200 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                            Patent #{pat.patent_number}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            pat.status === 'Granted' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {pat.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                          {pat.title}
                        </h3>
                        <p className="text-xs text-slate-600">Inventors: {pat.inventors}</p>
                        <div className="text-[11px] text-slate-500">Filed: {pat.filing_date}</div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeletePatent(pat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Research Resources (Searchable by name, type, domain) */}
          {activeTab === 'RESOURCES' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-brand-100 shadow-2xs">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    placeholder="Search resources by name, description, or domain..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                  <select
                    value={resourceTypeFilter}
                    onChange={(e) => setResourceTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <option value="">All Resource Types</option>
                    <option value="Dataset">Dataset</option>
                    <option value="Tool">Tool</option>
                    <option value="Framework">Framework</option>
                    <option value="Learning Resource">Learning Resource</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
              </div>

              {/* Resources List */}
              {resources.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3">
                  <Database className="h-10 w-10 text-brand-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Research Resources Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add datasets, open-source frameworks, or reference tools for research projects.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-5 rounded-3xl border border-brand-100 shadow-sm flex flex-col justify-between space-y-3 group hover:border-brand-200 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {res.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{res.domain}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                          {res.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Publication Modal */}
      <Modal isOpen={isPubModalOpen} onClose={() => setIsPubModalOpen(false)} title="Add Research Publication">
        <form onSubmit={handleAddPublication} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Title *</label>
            <input
              type="text"
              required
              value={pubForm.title}
              onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              placeholder="e.g. Deep Learning Approaches to Healthcare Time Series Prediction"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Authors *</label>
            <input
              type="text"
              required
              value={pubForm.authors}
              onChange={(e) => setPubForm({ ...pubForm, authors: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="Dr. Arun Kumar, Prof. Sarah Chen"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Journal / Conference *</label>
              <input
                type="text"
                required
                value={pubForm.venue}
                onChange={(e) => setPubForm({ ...pubForm, venue: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="IEEE / NeurIPS / Nature AI"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Publication Date</label>
              <input
                type="date"
                required
                value={pubForm.publication_date}
                onChange={(e) => setPubForm({ ...pubForm, publication_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">DOI (Digital Object Identifier)</label>
            <input
              type="text"
              value={pubForm.doi}
              onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              placeholder="10.1109/IEEE.2024.104928"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Related Project</label>
            <select
              value={pubForm.project_id}
              onChange={(e) => setPubForm({ ...pubForm, project_id: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="">-- Unlinked --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsPubModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">Add Publication</button>
          </div>
        </form>
      </Modal>

      {/* Add Patent Modal */}
      <Modal isOpen={isPatentModalOpen} onClose={() => setIsPatentModalOpen(false)} title="Register Patent Filing">
        <form onSubmit={handleAddPatent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Patent Title *</label>
            <input
              type="text"
              required
              value={patentForm.title}
              onChange={(e) => setPatentForm({ ...patentForm, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              placeholder="e.g. Federated Privacy-Preserving Neural Architecture Search"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Inventors *</label>
              <input
                type="text"
                required
                value={patentForm.inventors}
                onChange={(e) => setPatentForm({ ...patentForm, inventors: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="Dr. Arun Kumar, Elena Rostova"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Patent Number *</label>
              <input
                type="text"
                required
                value={patentForm.patent_number}
                onChange={(e) => setPatentForm({ ...patentForm, patent_number: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                placeholder="US2024018293A1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Filing Date</label>
              <input
                type="date"
                required
                value={patentForm.filing_date}
                onChange={(e) => setPatentForm({ ...patentForm, filing_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Patent Status</label>
              <select
                value={patentForm.status}
                onChange={(e) => setPatentForm({ ...patentForm, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Filed">Filed</option>
                <option value="Under Review">Under Review</option>
                <option value="Granted">Granted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsPatentModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">Register Patent</button>
          </div>
        </form>
      </Modal>

      {/* Add Resource Modal */}
      <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Add Research Resource">
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resource Name *</label>
            <input
              type="text"
              required
              value={resourceForm.name}
              onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              placeholder="e.g. MIMIC-IV Clinical Dataset / HuggingFace Transformers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resource Type</label>
              <select
                value={resourceForm.type}
                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Dataset">Dataset</option>
                <option value="Tool">Tool</option>
                <option value="Framework">Framework</option>
                <option value="Learning Resource">Learning Resource</option>
                <option value="Research Paper">Research Paper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Research Domain</label>
              <input
                type="text"
                required
                value={resourceForm.domain}
                onChange={(e) => setResourceForm({ ...resourceForm, domain: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="Artificial Intelligence"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resource URL *</label>
            <input
              type="url"
              required
              value={resourceForm.url}
              onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              placeholder="https://physionet.org/content/mimiciv/"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={resourceForm.description}
              onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="De-identified electronic health records for predictive medical modeling..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsResourceModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">Add Resource</button>
          </div>
        </form>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};

export default OutputsResources;
