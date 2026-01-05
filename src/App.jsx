import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, BookOpen, PenTool, Link, Image as ImageIcon, 
  ShieldCheck, Info, HelpCircle, FileText, DollarSign, Clock
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
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const [formData, setFormData] = useState({
    pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '',
    pub_manuscript_writer: '', pub_competence_score: '', pub_group_source: '',
    pub_referral: '', pub_group_duration: '', pub_coauthors_count: '',
    pub_charge_per_author: '', pub_journal_name: '', pub_journal_accepted: '',
    pub_journal_justification: '', pub_linkedin_profile: '',
    pub_acceptance_evidence: null, pub_id_document: null
  });

  useEffect(() => {
    fetchSubmissionCount();
  }, []);

  const fetchSubmissionCount = async () => {
    const { count, error } = await supabase
      .from('pub_bio_info_submissions')
      .select('*', { count: 'exact', head: true });
    if (!error) setTotalSubmissions(count || 0);
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [name]: reader.result }));
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('pub_bio_info_submissions').insert([{ ...formData, pub_submitted_at: new Date().toISOString() }]);
      if (error) throw error;
      setMessage({ text: 'Application Submitted Successfully!', type: 'success' });
      setFormData({
        pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '', pub_manuscript_writer: '', pub_competence_score: '', 
        pub_group_source: '', pub_referral: '', pub_group_duration: '', pub_coauthors_count: '', pub_charge_per_author: '', 
        pub_journal_name: '', pub_journal_accepted: '', pub_journal_justification: '', pub_linkedin_profile: '', 
        pub_acceptance_evidence: null, pub_id_document: null
      });
      fetchSubmissionCount();
      window.scrollTo(0, 0);
    } catch (err) { setMessage({ text: err.message, type: 'error' }); } finally { setLoading(false); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim().toLowerCase();
    const p = e.target.password.value.trim();
    // Valid login check
    if (u === 'publication' && p === 'publication') { 
      setView('admin'); 
      fetchSubmissions(); 
    } 
    else { 
      setMessage({ text: 'Invalid Credentials', type: 'error' }); // Removed password reveal
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pub_bio_info_submissions').select('*').order('pub_submitted_at', { ascending: false });
    if (!error) {
        setSubmissions(data);
        setTotalSubmissions(data.length);
    }
    setLoading(false);
  };

  // --- Styles ---
  const s = {
    body: { backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: '"Inter", sans-serif' },
    card: { maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '35px', position: 'relative' },
    counterBox: { position: 'absolute', top: '10px', left: '20px', fontSize: '11px', fontWeight: '700', color: '#6b7280' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginTop: '10px' },
    title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '800', color: '#111827' },
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #f3f4f6', borderRadius: '10px', backgroundColor: '#fafafa' },
    secTitle: { fontSize: '16px', fontWeight: '700', color: '#4f46e5', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' },
    btnPrimary: { backgroundColor: '#4f46e5', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', width: '100%' },
    btnSec: { backgroundColor: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
    adminBox: { padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '20px', backgroundColor: '#fff' },
    adminGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
    dataLabel: { fontWeight: '700', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', display: 'block' },
    img: { width: '100px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee', marginTop: '5px' }
  };

  return (
    <div style={s.body}>
      <div style={s.card}>
        <div style={s.counterBox}>
            <span style={{color: '#4f46e5'}}>{totalSubmissions}/100</span> — When reach 100 contact administrator to upgrade
        </div>

        <header style={s.header}>
          <div style={s.title}><BookOpen size={26} color="#4f46e5" /> Publication Group Form</div>
          <button style={s.btnSec} onClick={() => view === 'admin' || view === 'login' ? setView('form') : setView('login')}>
            {view === 'form' ? 'Admin Login' : 'Back to Form'}
          </button>
        </header>

        {message.text && <div style={{...s.section, backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border: '1px solid currentColor', marginBottom: '20px'}}>{message.text}</div>}

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={s.section}>
              <div style={s.secTitle}><User size={18} /> 1. Personal & Discipline</div>
              <div style={s.grid}>
                <div><label style={s.label}>Full Name *</label><input style={s.input} type="text" name="pub_full_name" required onChange={handleInputChange} value={formData.pub_full_name} /></div>
                <div><label style={s.label}>Email Address *</label><input style={s.input} type="email" name="pub_email" required onChange={handleInputChange} value={formData.pub_email} /></div>
                <div><label style={s.label}>Phone Number *</label><input style={s.input} type="tel" name="pub_phone" required onChange={handleInputChange} value={formData.pub_phone} /></div>
                <div><label style={s.label}>Discipline *</label><input style={s.input} name="pub_discipline" required onChange={handleInputChange} value={formData.pub_discipline} /></div>
              </div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><PenTool size={18} /> 2. Manuscript Standard</div>
              <div style={s.grid}>
                <div><label style={s.label}>Who wrote it? *</label><select style={s.input} name="pub_manuscript_writer" required onChange={handleInputChange} value={formData.pub_manuscript_writer}><option value="">Select...</option><option>Copied Online</option><option>Yourself</option><option>Professional</option></select></div>
                <div><label style={s.label}>Competence Score *</label><select style={s.input} name="pub_competence_score" required onChange={handleInputChange} value={formData.pub_competence_score}><option value="">Select...</option><option>Less than 10</option><option>Over 10</option></select></div>
              </div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><HelpCircle size={18} /> 3. Group Origin</div>
              <div style={s.grid}>
                <div><label style={s.label}>How did you hear about us? *</label><select style={s.input} name="pub_group_source" required onChange={handleInputChange} value={formData.pub_group_source}><option value="">Select...</option><option>Recommendation</option><option>Join via Link</option></select></div>
                <div><label style={s.label}>Months spent in group? *</label><select style={s.input} name="pub_group_duration" required onChange={handleInputChange} value={formData.pub_group_duration}><option value="">Select...</option><option>A year or more</option><option>6 months or less</option><option>Less than 2 months</option></select></div>
              </div>
              <div style={{marginTop:'15px'}}><label style={s.label}>Referrer Name/Number</label><textarea style={{...s.input, minHeight:'60px'}} name="pub_referral" onChange={handleInputChange} value={formData.pub_referral}></textarea></div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><DollarSign size={18} /> 4. Sourcing & Journal</div>
              <div style={s.grid}>
                <div><label style={s.label}>Co-authors count *</label><input style={s.input} type="number" name="pub_coauthors_count" required onChange={handleInputChange} value={formData.pub_coauthors_count} /></div>
                <div><label style={s.label}>Charge per author</label><input style={s.input} type="text" name="pub_charge_per_author" onChange={handleInputChange} value={formData.pub_charge_per_author} /></div>
                <div><label style={s.label}>Journal Name *</label><input style={s.input} type="text" name="pub_journal_name" required onChange={handleInputChange} value={formData.pub_journal_name} /></div>
                <div><label style={s.label}>Already Accepted? *</label><select style={s.input} name="pub_journal_accepted" required onChange={handleInputChange} value={formData.pub_journal_accepted}><option value="">Select...</option><option>Yes</option><option>No</option></select></div>
              </div>
              <div style={{marginTop:'15px'}}><label style={s.label}>Journal Justification & Link *</label><textarea style={{...s.input, minHeight:'60px'}} name="pub_journal_justification" required onChange={handleInputChange} value={formData.pub_journal_justification}></textarea></div>
              <div style={{marginTop:'15px', padding:'15px', border:'1px dashed #ccc', borderRadius:'8px'}}><label style={s.label}>Evidence of Acceptance (Image)</label><input type="file" name="pub_acceptance_evidence" onChange={handleFileChange} accept="image/*" /></div>
            </div>

            <div style={s.section}>
              <div style={s.secTitle}><ShieldCheck size={18} /> 5. Verification</div>
              <div style={s.grid}>
                <div><label style={s.label}>LinkedIn Profile URL *</label><input style={s.input} type="url" name="pub_linkedin_profile" required onChange={handleInputChange} value={formData.pub_linkedin_profile} /></div>
                <div><label style={s.label}>ID (NIN/Passport/Photo)</label><input type="file" name="pub_id_document" onChange={handleFileChange} accept="image/*" /></div>
              </div>
            </div>
            <button type="submit" disabled={loading} style={s.btnPrimary}>{loading ? 'Submitting...' : 'Submit Publication Form'}</button>
          </form>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} style={{maxWidth:'350px', margin:'40px auto'}}>
            <h2 style={{textAlign:'center', marginBottom:'20px'}}>Admin Login</h2>
            <div style={{marginBottom:'15px'}}><label style={s.label}>Username</label><input style={s.input} type="text" name="username" required /></div>
            <div style={{marginBottom:'25px'}}><label style={s.label}>Password</label><input style={s.input} type="password" name="password" required /></div>
            <button style={s.btnPrimary}>Login</button>
          </form>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {view === 'admin' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2><ShieldCheck color="#10b981" /> Dashboard ({totalSubmissions})</h2>
              <button style={{...s.btnSec, color:'red', borderColor:'red'}} onClick={() => setView('form')}>Logout</button>
            </div>
            {submissions.map(row => (
              <div key={row.id} style={s.adminBox}>
                <div style={{borderBottom:'1px solid #f0f0f0', paddingBottom:'10px', marginBottom:'15px', fontWeight:'800', fontSize:'18px'}}>{row.pub_full_name}</div>
                <div style={s.adminGrid}>
                  <div><span style={s.dataLabel}>Email / Phone</span>{row.pub_email}<br/>{row.pub_phone}</div>
                  <div><span style={s.dataLabel}>Discipline</span>{row.pub_discipline}</div>
                  <div><span style={s.dataLabel}>Manuscript Writer</span>{row.pub_manuscript_writer}</div>
                  <div><span style={s.dataLabel}>Co-Authors / Charge</span>{row.pub_coauthors_count} authors | {row.pub_charge_per_author || 'N/A'}</div>
                </div>
                <div style={s.adminGrid}>
                  <div><span style={s.dataLabel}>Comp. Score</span>{row.pub_competence_score}</div>
                  <div><span style={s.dataLabel}>Group Info</span>{row.pub_group_source} ({row.pub_group_duration})</div>
                  <div><span style={s.dataLabel}>Journal</span>{row.pub_journal_name} (Accepted: {row.pub_journal_accepted})</div>
                  <div><span style={s.dataLabel}>Submitted At</span>{new Date(row.pub_submitted_at).toLocaleString()}</div>
                </div>
                <div style={{backgroundColor:'#f9fafb', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                   <span style={s.dataLabel}>Referrer</span><p style={{fontSize:'13px', margin:0}}>{row.pub_referral || 'N/A'}</p>
                </div>
                <div style={{backgroundColor:'#f9fafb', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                   <span style={s.dataLabel}>Justification</span><p style={{fontSize:'13px', margin:0}}>{row.pub_journal_justification}</p>
                </div>
                <div style={{display:'flex', gap:'20px', alignItems:'flex-end'}}>
                   <div><span style={s.dataLabel}>Acceptance</span>{row.pub_acceptance_evidence ? <img src={row.pub_acceptance_evidence} style={s.img} /> : 'None'}</div>
                   <div><span style={s.dataLabel}>ID Card</span>{row.pub_id_document ? <img src={row.pub_id_document} style={s.img} /> : 'None'}</div>
                   <div style={{marginLeft:'auto'}}><a href={row.pub_linkedin_profile} target="_blank" style={{color:'#4f46e5', fontWeight:'700', fontSize:'13px'}}>LinkedIn Profile</a></div>
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