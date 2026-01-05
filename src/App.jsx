import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, BookOpen, PenTool, Link, Image as ImageIcon, 
  ShieldCheck, HelpCircle, DollarSign, Info
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
    pub_journal_justification: '', pub_acceptance_evidence: null,
    pub_id_document: null, pub_linkedin_profile: ''
  });

  useEffect(() => { fetchSubmissionCount(); }, []);

  const fetchSubmissionCount = async () => {
    const { count, error } = await supabase.from('pub_bio_info_submissions').select('*', { count: 'exact', head: true });
    if (!error) setTotalSubmissions(count || 0);
  };

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
      setMessage({ text: 'Form Submitted Successfully!', type: 'success' });
      setFormData({
        pub_full_name: '', pub_email: '', pub_phone: '', pub_discipline: '', pub_manuscript_writer: '', pub_competence_score: '', 
        pub_group_source: '', pub_referral: '', pub_group_duration: '', pub_coauthors_count: '', pub_charge_per_author: '', 
        pub_journal_name: '', pub_journal_accepted: '', pub_journal_justification: '', pub_acceptance_evidence: null, 
        pub_id_document: null, pub_linkedin_profile: ''
      });
      fetchSubmissionCount();
      window.scrollTo(0, 0);
    } catch (err) { setMessage({ text: err.message, type: 'error' }); } finally { setLoading(false); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim().toLowerCase();
    const p = e.target.password.value.trim();
    if (u === 'publication' && p === 'publication') { setView('admin'); fetchSubmissions(); } 
    else { setMessage({ text: 'Invalid Credentials', type: 'error' }); }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pub_bio_info_submissions').select('*').order('pub_submitted_at', { ascending: false });
    if (!error) { setSubmissions(data); setTotalSubmissions(data.length); }
    setLoading(false);
  };

  const s = {
    body: { backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", Tahoma, sans-serif' },
    card: { maxWidth: '850px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '40px', position: 'relative' },
    counter: { position: 'absolute', top: '15px', left: '25px', fontSize: '12px', fontWeight: 'bold', color: '#64748b' },
    header: { textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginTop: '10px' },
    title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 },
    section: { marginBottom: '40px' },
    secHead: { fontSize: '18px', fontWeight: '700', color: '#4f46e5', marginBottom: '20px', borderLeft: '5px solid #4f46e5', paddingLeft: '15px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#334155' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box', marginBottom: '20px' },
    radioGrp: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' },
    radioBtn: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px' },
    note: { backgroundColor: '#fffbeb', color: '#92400e', padding: '15px', borderRadius: '8px', fontSize: '13px', fontStyle: 'italic', borderLeft: '4px solid #f59e0b', marginBottom: '25px' },
    btn: { width: '100%', padding: '16px', borderRadius: '10px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer' },
    adminBox: { padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '20px' },
    dataLabel: { fontWeight: '700', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', display: 'block' },
    img: { width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px' }
  };

  return (
    <div style={s.body}>
      <div style={s.card}>
        <div style={s.counter}>
          <span style={{color:'#4f46e5'}}>{totalSubmissions}/100</span> — When reach 100 contact administrator to upgrade
        </div>

        <header style={s.header}>
          <h1 style={s.title}>Publication Group Form</h1>
          {view === 'form' ? 
            <button style={{marginTop:'15px', color:'#4f46e5', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}} onClick={()=>setView('login')}>Admin Access</button> :
            <button style={{marginTop:'15px', color:'#4f46e5', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}} onClick={()=>setView('form')}>Back to Form</button>
          }
        </header>

        {message.text && <div style={{padding:'15px', borderRadius:'8px', marginBottom:'20px', backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b', border:'1px solid currentColor'}}>{message.text}</div>}

        {view === 'form' && (
          <form onSubmit={handleSubmit}>
            {/* --- BIO INFO --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Bio-Info</h2>
              <label style={s.label}>Full Name</label><input style={s.input} type="text" name="pub_full_name" required onChange={handleInputChange} value={formData.pub_full_name} />
              <label style={s.label}>Email Address</label><input style={s.input} type="email" name="pub_email" required onChange={handleInputChange} value={formData.pub_email} />
              <label style={s.label}>Phone Number</label><input style={s.input} type="tel" name="pub_phone" required onChange={handleInputChange} value={formData.pub_phone} />
              <label style={s.label}>Discipline</label>
              <select style={s.input} name="pub_discipline" required onChange={handleInputChange} value={formData.pub_discipline}>
                <option value="">Select...</option>
                {['Engineering','Computer Science','Health Sciences','Physical Sciences','Social Sciences','Art','Eduction','Other'].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>

            {/* --- MANUSCRIPT STANDARD --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Info about the standard of the manuscript</h2>
              <label style={s.label}>Who wrote the manuscript?</label>
              <div style={s.radioGrp}>
                {['Copied Online', 'Yourself', 'Hired a professional writer'].map(o => (
                  <label key={o} style={s.radioBtn}><input type="radio" name="pub_manuscript_writer" value={o} required onChange={handleInputChange} /> {o}</label>
                ))}
              </div>
              <label style={s.label}>Score your research writing competence and knowledge of research paper</label>
              <div style={s.radioGrp}>
                {['Less than 10', 'Over 10'].map(o => (
                  <label key={o} style={s.radioBtn}><input type="radio" name="pub_competence_score" value={o} required onChange={handleInputChange} /> {o}</label>
                ))}
              </div>
            </div>

            {/* --- ORIGIN --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Info about the authors origin on group</h2>
              <label style={s.label}>How did you hear about the group?</label>
              <div style={s.radioGrp}>
                {['Recommendation by a strong member (preferably)', 'Join via'].map(o => (
                  <label key={o} style={s.radioBtn}><input type="radio" name="pub_group_source" value={o} required onChange={handleInputChange} /> {o}</label>
                ))}
              </div>
              <label style={s.label}>Drop the name and number of the person who recommend the of the group you got the publication link from</label>
              <textarea style={{...s.input, minHeight:'80px'}} name="pub_referral" onChange={handleInputChange} value={formData.pub_referral}></textarea>
              <label style={s.label}>How many months have you spent on the group?</label>
              <div style={s.radioGrp}>
                {['A year or over a year', '6 months or less', 'Less than 2 month.'].map(o => (
                  <label key={o} style={s.radioBtn}><input type="radio" name="pub_group_duration" value={o} required onChange={handleInputChange} /> {o}</label>
                ))}
              </div>
            </div>

            {/* --- SOURCING --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Info about the sourcing</h2>
              <label style={s.label}>How many co-authors are you looking at?</label>
              <input style={s.input} type="number" name="pub_coauthors_count" required onChange={handleInputChange} value={formData.pub_coauthors_count} />
              <label style={s.label}>How much are you charging per author ?</label>
              <input style={s.input} type="text" name="pub_charge_per_author" required onChange={handleInputChange} value={formData.pub_charge_per_author} />
              <div style={s.note}>Note: Authors cannot accumulate more than 150k from the group. i.e regardless of number of co-authors you want to source, the total amount you can accumulate per paper is 150k</div>
            </div>

            {/* --- JOURNALS --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Info about journals</h2>
              <label style={s.label}>What journal are you using?</label>
              <input style={s.input} type="text" name="pub_journal_name" required onChange={handleInputChange} value={formData.pub_journal_name} />
              <label style={s.label}>Have you submitted to the journal and has it been accepted?</label>
              <div style={s.radioGrp}>
                {['Yes', 'No'].map(o => (
                  <label key={o} style={s.radioBtn}><input type="radio" name="pub_journal_accepted" value={o} required onChange={handleInputChange} /> {o}</label>
                ))}
              </div>
              <label style={s.label}>Justify why you are using the journal and drop the journal link.</label>
              <textarea style={{...s.input, minHeight:'80px'}} name="pub_journal_justification" required onChange={handleInputChange} value={formData.pub_journal_justification}></textarea>
              <label style={s.label}>Screenshot and upload evidence of Acceptance</label>
              <input type="file" name="pub_acceptance_evidence" onChange={handleFileChange} accept="image/*" style={{marginBottom:'25px'}} />
            </div>

            {/* --- ID --- */}
            <div style={s.section}>
              <h2 style={s.secHead}>Info about means of Identification</h2>
              <label style={s.label}>Snap and upload your NIN, or International Passport or photograph passport ( optional)</label>
              <input type="file" name="pub_id_document" onChange={handleFileChange} accept="image/*" style={{marginBottom:'25px'}} />
              <label style={s.label}>Drop the link of your LinkedIn profile. (Compulsory)</label>
              <input style={s.input} type="url" name="pub_linkedin_profile" required onChange={handleInputChange} value={formData.pub_linkedin_profile} placeholder="https://linkedin.com/in/..." />
            </div>

            <button type="submit" disabled={loading} style={{...s.btn, opacity: loading ? 0.7 : 1}}>
              {loading ? 'Processing...' : 'Submit Application'}
            </button>
          </form>
        )}

        {view === 'login' && (
          <form onSubmit={handleLogin} style={{maxWidth:'350px', margin:'50px auto'}}>
            <h2 style={{textAlign:'center', marginBottom:'25px'}}>Admin Login</h2>
            <label style={s.label}>Username</label><input style={s.input} type="text" name="username" required />
            <label style={s.label}>Password</label><input style={s.input} type="password" name="password" required />
            <button style={s.btn}>Login</button>
          </form>
        )}

        {view === 'admin' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
              <h2 style={{display:'flex', alignItems:'center', gap:'10px'}}><ShieldCheck color="#10b981"/> Admin Dashboard ({totalSubmissions})</h2>
              <button style={{color:'red', fontWeight:'bold', cursor:'pointer', border:'none', background:'none'}} onClick={()=>setView('form')}>Logout</button>
            </div>
            {submissions.map(row => (
              <div key={row.id} style={s.adminBox}>
                <div style={{borderBottom:'2px solid #f8fafc', paddingBottom:'10px', marginBottom:'15px', fontWeight:'800', fontSize:'18px', color:'#1e293b'}}>{row.pub_full_name}</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
                  <div><span style={s.dataLabel}>Email / Phone</span>{row.pub_email}<br/>{row.pub_phone}</div>
                  <div><span style={s.dataLabel}>Discipline</span>{row.pub_discipline}</div>
                  <div><span style={s.dataLabel}>Journal</span>{row.pub_journal_name} (Accepted: {row.pub_journal_accepted})</div>
                  <div><span style={s.dataLabel}>Writer</span>{row.pub_manuscript_writer}</div>
                </div>
                <div style={{marginTop:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', backgroundColor:'#f8fafc', padding:'15px', borderRadius:'8px'}}>
                  <div><span style={s.dataLabel}>Origin Info</span>Source: {row.pub_group_source}<br/>Spent: {row.pub_group_duration}<br/>Referrer: {row.pub_referral || 'N/A'}</div>
                  <div><span style={s.dataLabel}>Sourcing Details</span>Co-Authors: {row.pub_coauthors_count}<br/>Charge: {row.pub_charge_per_author}</div>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={s.dataLabel}>Justification / Link</span><p style={{fontSize:'13px', margin:0}}>{row.pub_journal_justification}</p>
                </div>
                <div style={{display:'flex', gap:'30px', marginTop:'20px', alignItems:'flex-end'}}>
                   <div><span style={s.dataLabel}>Acceptance</span>{row.pub_acceptance_evidence ? <img src={row.pub_acceptance_evidence} style={s.img} /> : 'None'}</div>
                   <div><span style={s.dataLabel}>ID Document</span>{row.pub_id_document ? <img src={row.pub_id_document} style={s.img} /> : 'None'}</div>
                   <div style={{marginLeft:'auto'}}><a href={row.pub_linkedin_profile} target="_blank" style={{color:'#4f46e5', fontWeight:'bold', fontSize:'14px'}}>LinkedIn</a></div>
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