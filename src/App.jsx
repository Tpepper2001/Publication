import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Mail, Phone, BookOpen, PenTool, Link, 
  Image as ImageIcon, CheckCircle, LogOut, ShieldCheck, Search, Info, HelpCircle
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
    pub_competence_score: '',
    pub_group_source: '',
    pub_referral: '',
    pub_group_duration: '',
    pub_coauthors_count: '',
    pub_charge_per_author: '',
    pub_journal_name: '',
    pub_journal_accepted: '',
    pub_journal_justification: '',
    pub_linkedin_profile: '',
    pub_acceptance_evidence: null,
    pub_id_document: null
  });

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
      if (files[0].size > 1.5 * 1024 * 1024) {
        alert("File too large. Please use an image under 1.5MB");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [name]: reader.result }));
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

      setMessage({ text: 'Application Submitted Successfully!', type: 'success' });
      setFormData({
        pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '',
        pub_manuscript_writer: '', pub_competence_score: '', pub_group_source: '',
        pub_referral: '', pub_group_duration: '', pub_coauthors_count: '',
        pub_charge_per_author: '', pub_journal_name: '', pub_journal_accepted: '',
        pub_journal_justification: '', pub_linkedin_profile: '',
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
    const u = e.target.username.value.trim().toLowerCase();
    const p = e.target.password.value.trim();

    if (u === 'publication' && p === 'publication') {
      setView('admin');
      fetchSubmissions();
    } else {
      setMessage({ text: 'Invalid Credentials. Use "publication" for both fields.', type: 'error' });
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pub_bio_info_submissions').select('*').order('pub_submitted_at', { ascending: false });
    if (!error) setSubmissions(data);
    setLoading(false);
  };

  // --- Styles ---
  const styles = {
    body: { backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: '"Inter", sans-serif' },
    card: { maxWidth: '850px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '35px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
    title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '800', color: '#111827' },
    section: { marginBottom: '30px', padding: '20px', border: '1px solid #f3f4f6', borderRadius: '10px', backgroundColor: '#fafafa' },
    secTitle: { fontSize: '17px', fontWeight: '700', color: '#4f46e5', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' },
    input: { width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', minHeight: '70px', fontFamily: 'inherit', boxSizing: 'border-box' },
    radioItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', marginBottom: '8px' },
    btnPrimary: { backgroundColor: '#4f46e5', color: '#fff', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', width: '100%' },
    btnSecondary: { backgroundColor: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', padding: '7px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
    alert: (type) => ({ padding: '12px', borderRadius: '6px', marginBottom: '20px', backgroundColor: type === 'success' ? '#f0fdf4' : '#fef2f2', color: type === 'success' ? '#166534' : '#991b1b', border: '1px solid currentColor' }),
    note: { fontSize: '12px', color: '#92400e', backgroundColor: '#fffbeb', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #f59e0b', margin: '10px 0' },
  };

  return (
    <div style={styles.body}>
      <style>{`
        input:focus, textarea:focus, select:focus { outline: 2px solid #4f46e5; border-color: transparent; }
        button:active { transform: scale(0.98); }
      `}</style>

      <div style={styles.card}>
        <header style={styles.header}>
          <div style={styles.title}><BookOpen size={28} color="#4f46e5" /> Publication Group Form</div>
          {view === 'form' ? 
            <button style={styles.btnSecondary} onClick={() => setView('login')}>Admin</button> : 
            <button style={styles.btnSecondary} onClick={() => setView('form')}>Form</button>
          }
        </header>

        {message.text && <div style={styles.alert(message.type)}>{message.text}</div>}

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            
            <div style={styles.section}>
              <div style={styles.secTitle}><User size={18} /> 1. Bio-Info</div>
              <div style={styles.grid}>
                <div style={{marginBottom:'10px'}}><label style={styles.label}>Full Name *</label><input style={styles.input} type="text" name="pub_full_name" required onChange={handleInputChange} value={formData.pub_full_name} /></div>
                <div style={{marginBottom:'10px'}}><label style={styles.label}>Email Address *</label><input style={styles.input} type="email" name="pub_email" required onChange={handleInputChange} value={formData.pub_email} /></div>
                <div style={{marginBottom:'10px'}}><label style={styles.label}>Phone Number *</label><input style={styles.input} type="tel" name="pub_phone" required onChange={handleInputChange} value={formData.pub_phone} /></div>
                <div style={{marginBottom:'10px'}}>
                  <label style={styles.label}>Discipline *</label>
                  <select style={styles.input} name="pub_discipline" required onChange={handleInputChange} value={formData.pub_discipline}>
                    <option value="">Select...</option>
                    <option>Engineering</option><option>Computer Science</option><option>Health Sciences</option><option>Physical Sciences</option><option>Social Sciences</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.secTitle}><PenTool size={18} /> 2. Manuscript Standard</div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Who wrote the manuscript? *</label>
                  {['Copied Online', 'Yourself', 'Professional Writer'].map(opt => (
                    <label key={opt} style={styles.radioItem}><input type="radio" name="pub_manuscript_writer" value={opt} required onChange={handleInputChange} /> {opt}</label>
                  ))}
                </div>
                <div>
                  <label style={styles.label}>Competence score (Research Writing) *</label>
                  {['Less than 10', 'Over 10'].map(opt => (
                    <label key={opt} style={styles.radioItem}><input type="radio" name="pub_competence_score" value={opt} required onChange={handleInputChange} /> {opt}</label>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.secTitle}><HelpCircle size={18} /> 3. Group Origin</div>
              <label style={styles.label}>How did you hear about the group? *</label>
              <div style={{display:'flex', gap:'20px', marginBottom:'15px'}}>
                {['Recommendation', 'Join via Link'].map(opt => (
                  <label key={opt} style={styles.radioItem}><input type="radio" name="pub_group_source" value={opt} required onChange={handleInputChange} /> {opt}</label>
                ))}
              </div>
              <label style={styles.label}>Referrer details (Name/Number)</label>
              <textarea style={styles.textarea} name="pub_referral" onChange={handleInputChange} value={formData.pub_referral} placeholder="Who recommended you?"></textarea>
              <div style={{marginTop:'15px'}}>
                <label style={styles.label}>Duration in group? *</label>
                <select style={styles.input} name="pub_group_duration" required onChange={handleInputChange} value={formData.pub_group_duration}>
                  <option value="">Select...</option>
                  <option>A year or over a year</option><option>6 months or less</option><option>Less than 2 months</option>
                </select>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.secTitle}><ImageIcon size={18} /> 4. Sourcing Info</div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Co-authors count *</label><input style={styles.input} type="number" name="pub_coauthors_count" required onChange={handleInputChange} value={formData.pub_coauthors_count} /></div>
                <div><label style={styles.label}>Charge per author</label><input style={styles.input} type="text" name="pub_charge_per_author" onChange={handleInputChange} value={formData.pub_charge_per_author} placeholder="e.g. 30,000" /></div>
              </div>
              <div style={styles.note}><b>Note:</b> Maximum accumulation per paper is 150k total.</div>
            </div>

            <div style={styles.section}>
              <div style={styles.secTitle}><BookOpen size={18} /> 5. Journal Information</div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Journal Name *</label><input style={styles.input} type="text" name="pub_journal_name" required onChange={handleInputChange} value={formData.pub_journal_name} /></div>
                <div>
                   <label style={styles.label}>Is it accepted? *</label>
                   <div style={{display:'flex', gap:'20px', marginTop:'10px'}}>
                     {['Yes', 'No'].map(opt => (
                       <label key={opt} style={styles.radioItem}><input type="radio" name="pub_journal_accepted" value={opt} required onChange={handleInputChange} /> {opt}</label>
                     ))}
                   </div>
                </div>
              </div>
              <div style={{marginTop:'15px'}}>
                <label style={styles.label}>Justification & Journal Link *</label>
                <textarea style={styles.textarea} name="pub_journal_justification" required onChange={handleInputChange} value={formData.pub_journal_justification}></textarea>
              </div>
              {/* Evidence moved here */}
              <div style={{marginTop:'15px', padding:'15px', border:'1px dashed #cbd5e0', borderRadius:'8px'}}>
                <label style={styles.label}>Evidence of Acceptance (Screenshot)</label>
                <input type="file" accept="image/*" name="pub_acceptance_evidence" onChange={handleFileChange} />
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.secTitle}><ShieldCheck size={18} /> 6. Verification</div>
              <label style={styles.label}>LinkedIn Profile URL *</label>
              <input style={styles.input} type="url" name="pub_linkedin_profile" required onChange={handleInputChange} value={formData.pub_linkedin_profile} placeholder="https://linkedin.com/in/..." />
              <div style={{marginTop:'15px'}}>
                <label style={styles.label}>ID Document (NIN/Passport/Photograph)</label>
                <input type="file" accept="image/*" name="pub_id_document" onChange={handleFileChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{...styles.btnPrimary, opacity: loading ? 0.7 : 1}}>
              {loading ? 'Submitting Application...' : 'Submit Publication Form'}
            </button>
          </form>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <div style={{maxWidth:'380px', margin:'50px auto'}}>
            <h2 style={{textAlign:'center', marginBottom:'30px'}}>Admin Dashboard Login</h2>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:'15px'}}><label style={styles.label}>Username</label><input style={styles.input} type="text" name="username" required /></div>
              <div style={{marginBottom:'25px'}}><label style={styles.label}>Password</label><input style={styles.input} type="password" name="password" required /></div>
              <button style={styles.btnPrimary}>Login</button>
            </form>
          </div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {view === 'admin' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
              <h2 style={{display:'flex', alignItems:'center', gap:'10px'}}><ShieldCheck color="#10b981"/> Admin Dashboard</h2>
              <button style={{...styles.btnSecondary, color:'red', borderColor:'red'}} onClick={() => setView('form')}>Logout</button>
            </div>
            {loading ? <p>Loading data...</p> : (
              <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {submissions.map(sub => (
                  <div key={sub.id} style={{padding:'20px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'#fff'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', borderBottom:'1px solid #f3f4f6', paddingBottom:'10px'}}>
                      <span style={{fontWeight:'700'}}>{sub.pub_full_name}</span>
                      <span style={{fontSize:'12px', color:'#9ca3af'}}>{new Date(sub.pub_submitted_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'13px'}}>
                       <p><b>Email:</b> {sub.pub_email}</p><p><b>Phone:</b> {sub.pub_phone}</p>
                       <p><b>Journal:</b> {sub.pub_journal_name}</p><p><b>Accepted:</b> {sub.pub_journal_accepted}</p>
                    </div>
                    <div style={{marginTop:'12px', display:'flex', gap:'10px'}}>
                       {sub.pub_acceptance_evidence && <img src={sub.pub_acceptance_evidence} style={{width:'70px', height:'50px', objectFit:'cover', borderRadius:'4px', border:'1px solid #eee'}} alt="Acceptance"/>}
                       {sub.pub_id_document && <img src={sub.pub_id_document} style={{width:'70px', height:'50px', objectFit:'cover', borderRadius:'4px', border:'1px solid #eee'}} alt="ID"/>}
                       <a href={sub.pub_linkedin_profile} target="_blank" rel="noreferrer" style={{marginLeft:'auto', alignSelf:'flex-end', fontSize:'13px', color:'#4f46e5', fontWeight:'600'}}>LinkedIn</a>
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