
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Mail, Phone, BookOpen, PenTool, Link, 
  Image as ImageIcon, CheckCircle, LogOut, ShieldCheck, Search 
} from 'lucide-react';

// --- Supabase Config ---
const SUPABASE_URL = 'https://watrosnylvkiuvuptdtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdHJvc255bHZraXV2dXB0ZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzE2NzEsImV4cCI6MjA4MjUwNzY3MX0.ku6_Ngf2JRJ8fxLs_Q-EySgCU37MjUK3WofpO9bazds';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const App = () => {
  const [view, setView] = useState('form'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submissions, setSubmissions] = useState([]);

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

  // --- Logic Functions ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('pub_bio_info_submissions')
        .insert([{ ...formData, pub_submitted_at: new Date().toISOString() }]);
      if (error) throw error;
      setMessage({ text: 'Form submitted successfully!', type: 'success' });
      setFormData({
        pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '',
        pub_manuscript_writer: '', pub_referral: '', pub_coauthors_count: 0,
        pub_journal_name: '', pub_linkedin_profile: '',
        pub_acceptance_evidence: null, pub_id_document: null
      });
      window.scrollTo(0, 0);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.username.value === 'publication' && e.target.password.value === 'publication') {
      setView('admin');
      fetchSubmissions();
    } else {
      setMessage({ text: 'Invalid Credentials', type: 'error' });
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pub_bio_info_submissions').select('*').order('pub_submitted_at', { ascending: false });
    if (!error) setSubmissions(data);
    setLoading(false);
  };

  // --- Inline Styles Object ---
  const s = {
    wrapper: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, sans-serif' },
    container: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '15px' },
    title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '800', color: '#1a1a1a' },
    section: { marginBottom: '25px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '8px' },
    secTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' },
    field: { marginBottom: '15px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#444' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },
    navBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #4f46e5', color: '#4f46e5', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600' },
    msg: (type) => ({ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: type === 'success' ? '#ecfdf5' : '#fef2f2', color: type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'}` }),
    card: { border: '1px solid #eee', padding: '15px', borderRadius: '10px', marginBottom: '10px' },
    img: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }
  };

  return (
    <div style={s.wrapper}>
      {/* Global Style Injection for Hover and Mobile */}
      <style>{`
        button:hover { opacity: 0.9; transform: translateY(-1px); transition: 0.2s; }
        input:focus { outline: 2px solid #4f46e5; border-color: transparent; }
        @media (max-width: 600px) { .main-container { padding: 15px !important; } }
      `}</style>

      <div style={s.container} className="main-container">
        <header style={s.header}>
          <div style={s.title}><BookOpen color="#4f46e5" /> Publication Group Form</div>
          {view === 'form' ? 
            <button style={s.navBtn} onClick={() => setView('login')}>Admin</button> : 
            <button style={s.navBtn} onClick={() => setView('form')}>Back</button>
          }
        </header>

        {message.text && <div style={s.msg(message.type)}>{message.text}</div>}

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={s.section}>
              <div style={s.secTitle}><User size={18} /> Personal Information</div>
              <div style={s.grid}>
                <div style={s.field}><label style={s.label}>Full Name *</label><input style={s.input} type="text" name="pub_full_name" required onChange={handleInputChange} value={formData.pub_full_name} /></div>
                <div style={s.field}><label style={s.label}>Email *</label><input style={s.input} type="email" name="pub_email" required onChange={handleInputChange} value={formData.pub_email} /></div>
              </div>
              <div style={s.grid}>
                <div style={s.field}><label style={s.label}>Phone *</label><input style={s.input} type="tel" name="pub_phone" required onChange={handleInputChange} value={formData.pub_phone} /></div>
                <div style={s.field}>
                  <label style={s.label}>Discipline *</label>
                  <select style={s.input} name="pub_discipline" required onChange={handleInputChange} value={formData.pub_discipline}>
                    <option value="">Select...</option>
                    <option>Engineering</option><option>Computer Science</option><option>Health Sciences</option><option>Physical Sciences</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><PenTool size={18} /> Manuscript & Referral</div>
              <div style={s.field}>
                <label style={s.label}>Who wrote it? *</label>
                <div style={{display:'flex', gap:'15px'}}>
                  {['Yourself', 'Professional', 'Other'].map(v => (
                    <label key={v} style={{fontSize:'14px'}}><input type="radio" name="pub_manuscript_writer" value={v} required onChange={handleInputChange} /> {v}</label>
                  ))}
                </div>
              </div>
              <div style={s.field}><label style={s.label}>Referral Info</label><input style={s.input} type="text" name="pub_referral" onChange={handleInputChange} value={formData.pub_referral} placeholder="Name/Number of referrer" /></div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><Link size={18} /> Journal & Identity</div>
              <div style={s.grid}>
                <div style={s.field}><label style={s.label}>Journal Name *</label><input style={s.input} type="text" name="pub_journal_name" required onChange={handleInputChange} value={formData.pub_journal_name} /></div>
                <div style={s.field}><label style={s.label}>LinkedIn Profile *</label><input style={s.input} type="url" name="pub_linkedin_profile" required onChange={handleInputChange} value={formData.pub_linkedin_profile} placeholder="https://..." /></div>
              </div>
              <div style={s.grid}>
                <div style={s.field}><label style={s.label}>Acceptance Proof</label><input type="file" accept="image/*" name="pub_acceptance_evidence" onChange={handleFileChange} /></div>
                <div style={s.field}><label style={s.label}>ID Document (NIN)</label><input type="file" accept="image/*" name="pub_id_document" onChange={handleFileChange} /></div>
              </div>
            </div>

            <button style={{...s.btn, backgroundColor: loading ? '#ccc' : '#4f46e5'}} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Form'}
            </button>
          </form>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <div style={{maxWidth:'350px', margin:'50px auto'}}>
            <h2 style={{textAlign:'center'}}>Admin Access</h2>
            <form onSubmit={handleLogin}>
              <div style={s.field}><label style={s.label}>Username</label><input style={s.input} type="text" name="username" required /></div>
              <div style={s.field}><label style={s.label}>Password</label><input style={s.input} type="password" name="password" required /></div>
              <button style={s.btn}>Login</button>
            </form>
          </div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {view === 'admin' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
              <h2 style={{display:'flex', alignItems:'center', gap:'8px'}}><ShieldCheck color="#10b981"/> Submissions</h2>
              <button style={{...s.navBtn, color:'red', borderColor:'red'}} onClick={() => setView('form')}>Logout</button>
            </div>
            {submissions.map(sub => (
              <div key={sub.id} style={s.card}>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', marginBottom:'10px'}}>
                  <span>{sub.pub_full_name}</span>
                  <span style={{fontSize:'12px', color:'#888'}}>{new Date(sub.pub_submitted_at).toLocaleDateString()}</span>
                </div>
                <div style={{fontSize:'14px', color:'#555', marginBottom:'10px'}}>
                  {sub.pub_email} | {sub.pub_phone} | <b>{sub.pub_discipline}</b>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                  {sub.pub_acceptance_evidence && <img src={sub.pub_acceptance_evidence} style={s.img} alt="Acceptance" />}
                  {sub.pub_id_document && <img src={sub.pub_id_document} style={s.img} alt="ID" />}
                  <div style={{marginLeft:'auto'}}><a href={sub.pub_linkedin_profile} target="_blank" rel="noreferrer" style={{color:'#4f46e5', fontWeight:'600'}}>LinkedIn</a></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
