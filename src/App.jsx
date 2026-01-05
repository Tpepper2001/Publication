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
  const [view, setView] = useState('form'); // form, login, admin
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submissions, setSubmissions] = useState([]);

  // Full form state with all fields
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

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (files[0].size > 1024 * 1024) {
        alert("File is too large. Please upload an image under 1MB.");
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
    const u = e.target.username.value.trim();
    const p = e.target.password.value.trim();

    if (u === 'publication' && p === 'publication') {
      setView('admin');
      fetchSubmissions();
    } else {
      setMessage({ text: 'Invalid Credentials. Try again.', type: 'error' });
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
    body: { backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '20px', fontFamily: '"Inter", sans-serif' },
    card: { maxWidth: '850px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '40px', overflow: 'hidden' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px' },
    title: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '26px', fontWeight: '800', color: '#2d3748' },
    section: { marginBottom: '35px', padding: '25px', border: '1px solid #edf2f7', borderRadius: '12px', backgroundColor: '#fafbfc' },
    secTitle: { fontSize: '18px', fontWeight: '700', color: '#4a5568', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4f46e5' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4a5568' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box' },
    radioGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    radioItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' },
    btnPrimary: { backgroundColor: '#4f46e5', color: '#fff', padding: '16px 24px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', width: '100%', transition: '0.3s' },
    btnSecondary: { backgroundColor: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    alert: (type) => ({ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: type === 'success' ? '#def7ec' : '#fde8e8', color: type === 'success' ? '#03543f' : '#9b1c1c', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }),
    note: { fontSize: '13px', color: '#856404', backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ffc107', margin: '15px 0' },
    adminCard: { padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '15px', backgroundColor: '#fff' }
  };

  return (
    <div style={styles.body}>
      <style>{`
        input:focus, textarea:focus, select:focus { border-color: #4f46e5 !important; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        .radio-item:hover { color: #4f46e5; }
      `}</style>

      <div style={styles.card}>
        <header style={styles.header}>
          <div style={styles.title}><BookOpen size={30} color="#4f46e5" /> Publication Group Form</div>
          {view === 'form' ? 
            <button style={styles.btnSecondary} onClick={() => setView('login')}>Admin Access</button> : 
            <button style={styles.btnSecondary} onClick={() => setView('form')}>Back to Form</button>
          }
        </header>

        {message.text && <div style={styles.alert(message.type)}><Info size={18}/> {message.text}</div>}

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            {/* 1. Bio Info */}
            <div style={styles.section}>
              <div style={styles.secTitle}><User size={20} /> Bio-Info</div>
              <div style={styles.grid}>
                <div style={{marginBottom:'15px'}}><label style={styles.label}>Full Name *</label><input style={styles.input} type="text" name="pub_full_name" required onChange={handleInputChange} value={formData.pub_full_name} /></div>
                <div style={{marginBottom:'15px'}}><label style={styles.label}>Email Address *</label><input style={styles.input} type="email" name="pub_email" required onChange={handleInputChange} value={formData.pub_email} /></div>
              </div>
              <div style={styles.grid}>
                <div style={{marginBottom:'15px'}}><label style={styles.label}>Phone Number *</label><input style={styles.input} type="tel" name="pub_phone" required onChange={handleInputChange} value={formData.pub_phone} /></div>
                <div style={{marginBottom:'15px'}}>
                  <label style={styles.label}>Discipline *</label>
                  <select style={styles.input} name="pub_discipline" required onChange={handleInputChange} value={formData.pub_discipline}>
                    <option value="">Select Discipline</option>
                    <option>Engineering</option><option>Computer Science</option><option>Health Sciences</option><option>Physical Sciences</option><option>Social Sciences</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Manuscript Standards */}
            <div style={styles.section}>
              <div style={styles.secTitle}><PenTool size={20} /> Manuscript Standard</div>
              <div style={styles.grid}>
                <div style={{marginBottom:'15px'}}>
                  <label style={styles.label}>Who wrote the manuscript? *</label>
                  <div style={styles.radioGroup}>
                    {['Copied Online', 'Yourself', 'Hired a professional writer'].map(opt => (
                      <label key={opt} style={styles.radioItem}><input type="radio" name="pub_manuscript_writer" value={opt} required onChange={handleInputChange} checked={formData.pub_manuscript_writer === opt}/> {opt}</label>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:'15px'}}>
                  <label style={styles.label}>Research writing competence score *</label>
                  <div style={styles.radioGroup}>
                    {['Less than 10', 'Over 10'].map(opt => (
                      <label key={opt} style={styles.radioItem}><input type="radio" name="pub_competence_score" value={opt} required onChange={handleInputChange} checked={formData.pub_competence_score === opt}/> {opt}</label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Origin Info */}
            <div style={styles.section}>
              <div style={styles.secTitle}><HelpCircle size={20} /> Author's Origin on Group</div>
              <div style={{marginBottom:'20px'}}>
                <label style={styles.label}>How did you hear about the group? *</label>
                <div style={styles.radioGroup}>
                  {['Recommendation by a strong member', 'Join via'].map(opt => (
                    <label key={opt} style={styles.radioItem}><input type="radio" name="pub_group_source" value={opt} required onChange={handleInputChange} checked={formData.pub_group_source === opt}/> {opt}</label>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:'20px'}}>
                <label style={styles.label}>Drop the name/number of referrer or group link source</label>
                <textarea style={styles.textarea} name="pub_referral" onChange={handleInputChange} value={formData.pub_referral}></textarea>
              </div>
              <div style={{marginBottom:'15px'}}>
                <label style={styles.label}>Months spent on the group? *</label>
                <div style={styles.radioGroup}>
                  {['A year or over a year', '6 months or less', 'Less than 2 months'].map(opt => (
                    <label key={opt} style={styles.radioItem}><input type="radio" name="pub_group_duration" value={opt} required onChange={handleInputChange} checked={formData.pub_group_duration === opt}/> {opt}</label>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Sourcing */}
            <div style={styles.section}>
              <div style={styles.secTitle}><ImageIcon size={20} /> Sourcing Info</div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Number of co-authors *</label><input style={styles.input} type="number" name="pub_coauthors_count" required onChange={handleInputChange} value={formData.pub_coauthors_count} /></div>
                <div><label style={styles.label}>Charge per author</label><input style={styles.input} type="text" name="pub_charge_per_author" onChange={handleInputChange} value={formData.pub_charge_per_author} placeholder="e.g. 20k" /></div>
              </div>
              <div style={styles.note}><b>Note:</b> Total amount accumulated per paper cannot exceed 150k regardless of co-author count.</div>
            </div>

            {/* 5. Journal */}
            <div style={styles.section}>
              <div style={styles.secTitle}><BookOpen size={20} /> Journal Info</div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Journal Name *</label><input style={styles.input} type="text" name="pub_journal_name" required onChange={handleInputChange} value={formData.pub_journal_name} /></div>
                <div>
                  <label style={styles.label}>Submitted & Accepted? *</label>
                  <div style={{...styles.radioGroup, flexDirection:'row', gap:'20px', marginTop:'10px'}}>
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} style={styles.radioItem}><input type="radio" name="pub_journal_accepted" value={opt} required onChange={handleInputChange} checked={formData.pub_journal_accepted === opt}/> {opt}</label>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{marginTop:'20px'}}>
                <label style={styles.label}>Journal Link & Justification *</label>
                <textarea style={styles.textarea} name="pub_journal_justification" required onChange={handleInputChange} value={formData.pub_journal_justification} placeholder="Explain why this journal and paste link..."></textarea>
              </div>
            </div>

            {/* 6. ID & Verification */}
            <div style={styles.section}>
              <div style={styles.secTitle}><ShieldCheck size={20} /> Identification</div>
              <div style={{marginBottom:'20px'}}><label style={styles.label}>LinkedIn Profile URL *</label><input style={styles.input} type="url" name="pub_linkedin_profile" required onChange={handleInputChange} value={formData.pub_linkedin_profile} placeholder="https://linkedin.com/in/yourname" /></div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Acceptance Evidence (Image)</label><input type="file" accept="image/*" name="pub_acceptance_evidence" onChange={handleFileChange} /></div>
                <div><label style={styles.label}>ID Document (NIN/Passport)</label><input type="file" accept="image/*" name="pub_id_document" onChange={handleFileChange} /></div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{...styles.btnPrimary, backgroundColor: loading ? '#a5a6f6' : '#4f46e5'}}>
              {loading ? 'Processing...' : 'Submit Publication Form'}
            </button>
          </form>
        )}

        {/* --- LOGIN VIEW --- */}
        {view === 'login' && (
          <div style={{maxWidth:'400px', margin:'40px auto', textAlign:'center'}}>
            <h2 style={{marginBottom:'25px'}}>Admin Dashboard Login</h2>
            <form onSubmit={handleLogin}>
              <div style={{textAlign:'left', marginBottom:'15px'}}><label style={styles.label}>Username</label><input style={styles.input} type="text" name="username" required /></div>
              <div style={{textAlign:'left', marginBottom:'25px'}}><label style={styles.label}>Password</label><input style={styles.input} type="password" name="password" required /></div>
              <button style={styles.btnPrimary}>Login</button>
            </form>
            <p style={{fontSize:'12px', color:'#718096', marginTop:'20px'}}>Credentials are "publication" / "publication"</p>
          </div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {view === 'admin' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
              <h2 style={{display:'flex', alignItems:'center', gap:'10px'}}><ShieldCheck color="#10b981"/> Admin Dashboard</h2>
              <button style={{...styles.btnSecondary, color:'red', borderColor:'red'}} onClick={() => setView('form')}>Logout</button>
            </div>
            
            {loading ? <p>Loading submissions...</p> : submissions.length === 0 ? <p>No submissions found.</p> : (
              <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {submissions.map(sub => (
                  <div key={sub.id} style={styles.adminCard}>
                    <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #f0f0f0', paddingBottom:'10px', marginBottom:'15px'}}>
                      <span style={{fontWeight:'700', color:'#2d3748'}}>{sub.pub_full_name}</span>
                      <span style={{fontSize:'12px', color:'#a0aec0'}}>{new Date(sub.pub_submitted_at).toLocaleString()}</span>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'13px', color:'#4a5568'}}>
                      <p><b>Email:</b> {sub.pub_email}</p>
                      <p><b>Phone:</b> {sub.pub_phone}</p>
                      <p><b>Discipline:</b> {sub.pub_discipline}</p>
                      <p><b>Journal:</b> {sub.pub_journal_name}</p>
                      <p><b>Co-authors:</b> {sub.pub_coauthors_count}</p>
                      <p><b>Writer:</b> {sub.pub_manuscript_writer}</p>
                    </div>
                    <div style={{marginTop:'15px', display:'flex', gap:'10px'}}>
                       {sub.pub_acceptance_evidence && <div style={{textAlign:'center'}}><p style={{fontSize:'10px'}}>Acceptance</p><img src={sub.pub_acceptance_evidence} style={{width:'80px', height:'60px', objectFit:'cover', borderRadius:'4px', border:'1px solid #eee'}} /></div>}
                       {sub.pub_id_document && <div style={{textAlign:'center'}}><p style={{fontSize:'10px'}}>ID Card</p><img src={sub.pub_id_document} style={{width:'80px', height:'60px', objectFit:'cover', borderRadius:'4px', border:'1px solid #eee'}} /></div>}
                       <div style={{marginLeft:'auto', alignSelf:'flex-end'}}><a href={sub.pub_linkedin_profile} target="_blank" rel="noreferrer" style={{color:'#4f46e5', fontWeight:'700', fontSize:'13px'}}>View LinkedIn</a></div>
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