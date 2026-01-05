import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Mail, Phone, BookOpen, PenTool, Link, 
  Image as ImageIcon, CheckCircle, LogOut, ShieldCheck, Search 
} from 'lucide-react';

// Initialize Supabase
const SUPABASE_URL = 'https://watrosnylvkiuvuptdtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdHJvc255bHZraXV2dXB0ZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzE2NzEsImV4cCI6MjA4MjUwNzY3MX0.ku6_Ngf2JRJ8fxLs_Q-EySgCU37MjUK3WofpO9bazds';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const App = () => {
  const [view, setView] = useState('form'); // form, login, admin
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submissions, setSubmissions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    pub_full_name: '',
    pub_email: '',
    pub_phone: '',
    pub_discipline: '',
    pub_manuscript_writer: '',
    pub_referral: '',
    pub_coauthors_count: 0,
    pub_journal_name: '',
    pub_linkedin_profile: '',
    pub_acceptance_evidence: null,
    pub_id_document: null
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle File to Base64
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('pub_bio_info_submissions')
        .insert([{ ...formData, pub_submitted_at: new Date().toISOString() }]);

      if (error) throw error;

      setMessage({ text: 'Application submitted successfully!', type: 'success' });
      setFormData({
        pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '',
        pub_manuscript_writer: '', pub_referral: '', pub_coauthors_count: 0,
        pub_journal_name: '', pub_linkedin_profile: '',
        pub_acceptance_evidence: null, pub_id_document: null
      });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    const user = e.target.username.value;
    const pass = e.target.password.value;

    if (user === 'publication' && pass === 'publication') {
      setView('admin');
      fetchSubmissions();
    } else {
      setMessage({ text: 'Invalid Credentials', type: 'error' });
    }
  };

  // Fetch Data for Admin
  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pub_bio_info_submissions')
      .select('*')
      .order('pub_submitted_at', { ascending: false });
    
    if (!error) setSubmissions(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <BookOpen size={24} /> Bio-Info Portal
          </h1>
          {view === 'form' ? (
            <button onClick={() => setView('login')} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition">
              Admin Access
            </button>
          ) : (
            <button onClick={() => setView('form')} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition">
              Back to Form
            </button>
          )}
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <CheckCircle size={20} /> {message.text}
          </div>
        )}

        {/* VIEW: SUBMISSION FORM */}
        {view === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <User size={20} className="text-indigo-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input type="text" name="pub_full_name" required value={formData.pub_full_name} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg focus:ring-2 ring-indigo-100 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" name="pub_email" required value={formData.pub_email} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg focus:ring-2 ring-indigo-100 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" name="pub_phone" required value={formData.pub_phone} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg focus:ring-2 ring-indigo-100 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discipline *</label>
                  <select name="pub_discipline" required value={formData.pub_discipline} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none">
                    <option value="">Select...</option>
                    <option>Engineering</option><option>Computer Science</option><option>Health Sciences</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <PenTool size={20} className="text-indigo-500" /> Publication Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Who wrote the manuscript? *</label>
                  <div className="flex flex-wrap gap-4">
                    {['Copied Online', 'Yourself', 'Professional'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input type="radio" name="pub_manuscript_writer" value={opt} onChange={handleInputChange} required /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Journal Name *</label>
                  <input type="text" name="pub_journal_name" required value={formData.pub_journal_name} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn Profile URL *</label>
                  <input type="url" name="pub_linkedin_profile" required value={formData.pub_linkedin_profile} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <ImageIcon size={20} className="text-indigo-500" /> Evidence & Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-dashed rounded-xl text-center">
                  <label className="block text-sm font-semibold mb-2">Acceptance Proof</label>
                  <input type="file" name="pub_acceptance_evidence" onChange={handleFileChange} className="text-xs" />
                </div>
                <div className="p-4 border-2 border-dashed rounded-xl text-center">
                  <label className="block text-sm font-semibold mb-2">ID Card (NIN/Passport)</label>
                  <input type="file" name="pub_id_document" onChange={handleFileChange} className="text-xs" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition disabled:bg-slate-300">
              {loading ? 'Processing Submission...' : 'Submit Application'}
            </button>
          </form>
        )}

        {/* VIEW: LOGIN */}
        {view === 'login' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-2xl font-black text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" name="username" placeholder="Username" required className="w-full p-3 border rounded-xl outline-none" />
              <input type="password" name="password" placeholder="Password" required className="w-full p-3 border rounded-xl outline-none" />
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Access Dashboard</button>
            </form>
          </div>
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {view === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> Admin Dashboard</h2>
              <button onClick={() => setView('form')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><LogOut size={20} /></button>
            </div>

            {loading ? (
              <p className="text-center py-10 text-slate-500">Fetching records...</p>
            ) : submissions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No submissions found in the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {submissions.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-indigo-900">{item.pub_full_name}</h3>
                        <p className="text-sm text-slate-500">{new Date(item.pub_submitted_at).toLocaleString()}</p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-bold">{item.pub_discipline}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div><span className="block text-slate-400 font-medium">Email</span>{item.pub_email}</div>
                      <div><span className="block text-slate-400 font-medium">Phone</span>{item.pub_phone}</div>
                      <div><span className="block text-slate-400 font-medium">Journal</span>{item.pub_journal_name}</div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                      {item.pub_acceptance_evidence && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Acceptance</p>
                          <img src={item.pub_acceptance_evidence} alt="Evidence" className="h-16 w-24 object-cover rounded border" />
                        </div>
                      )}
                      {item.pub_id_document && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">ID Document</p>
                          <img src={item.pub_id_document} alt="ID" className="h-16 w-24 object-cover rounded border" />
                        </div>
                      )}
                      <div className="ml-auto self-end">
                         <a href={item.pub_linkedin_profile} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 font-bold hover:underline"><Link size={14}/> LinkedIn</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
