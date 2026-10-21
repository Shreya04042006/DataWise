import React, { useState, useEffect } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, FilePlus2,
  Globe, HeartPulse, List, Menu, Mic, Pill, Search, ShieldCheck, Sparkles,
  Upload, X, IndianRupee, BookOpen, Stethoscope, FileText
} from 'lucide-react';
import './App.css';
import './sections.css';
import AboutSection from './components/AboutSection.jsx';
import DataSourcesSection from './components/DataSourcesSection.jsx';
import HelpSection from './components/HelpSection.jsx';
import NearbyStoresSection from './components/NearbyStoresSection.jsx';

const popularMedicines = ['Paracetamol', 'Amoxicillin', 'Pantoprazole', 'Azithromycin', 'Metformin'];

function Logo() {
  return (
    <a className="brand" href="#home" aria-label="DawaWise home">
      <span className="brand-mark"><Pill size={26} strokeWidth={2.6} /></span>
      <span>Dawa<span>Wise</span></span>
    </a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [activeNav, setActiveNav] = useState('Home');

  const navItems = [
    ['Home', '#home'], ['How it Works', '#how-it-works'], ['Nearby Stores', '#nearby-stores'],
    ['About', '#about'], ['Data Sources', '#data-sources'], ['Help', '#help']
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['home', 'how-it-works', 'nearby-stores', 'about', 'data-sources', 'help'];
      const scrollPos = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          const matched = navItems.find(([, href]) => href === `#${id}`);
          if (matched) {
            setActiveNav(matched[0]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const runSearch = (value = search) => {
    const query = value.trim();
    if (!query) {
      setNotice('Type a medicine name to start your search.');
      return;
    }
    setSearch(query);
    setNotice(`Demo search ready for “${query}”. Connect a verified medicine database to show live results.`);
  };

  const handleUpload = () => {
    document.getElementById('prescription-file')?.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setNotice(`Selected “${file.name}”. Prescription scanning is a demo and is not connected yet.`);
  };

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a key={label} className={activeNav === label ? 'active' : ''} href={href}
                onClick={() => { setActiveNav(label); setMenuOpen(false); }}>
                {label}
              </a>
            ))}
          </nav>
          <div className="language-wrap">
            <button className="language-button" onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}>
              <Globe size={18} /> {language} <ChevronDown size={16} />
            </button>
            {languageOpen && (
              <div className="language-menu">
                {['English', 'हिन्दी', 'বাংলা', 'தமிழ்'].map((item) => (
                  <button key={item} onClick={() => { setLanguage(item); setLanguageOpen(false); }}>
                    {item}{language === item && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> FOR A HEALTHIER, MORE INFORMED INDIA</div>
            <h1>Make Medicine<br /><span>Decisions Wisely.</span></h1>
            <p className="hero-description">Understand your prescription, find verified generic alternatives and compare prices — all in one place.</p>

            <div className="hero-actions">
              <button className="action-card primary-action" onClick={handleUpload}>
                <span className="action-icon"><Upload size={31} /></span>
                <span className="action-text"><strong>Upload Prescription</strong><small>Scan &amp; find medicines</small></span>
                <span className="action-arrow"><ArrowRight size={20} /></span>
              </button>
              <input id="prescription-file" type="file" accept="image/*,.pdf" hidden onChange={onFileChange} />
              <form className="action-card search-action" onSubmit={(e) => { e.preventDefault(); runSearch(); }}>
                <span className="search-large"><Search size={36} /></span>
                <span className="search-content">
                  <strong>Search Medicine</strong>
                  <span className="search-input-wrap">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="By name or brand" aria-label="Medicine name" />
                  </span>
                </span>
                <button className="action-arrow search-submit" aria-label="Search medicine" type="submit"><ArrowRight size={20} /></button>
              </form>
            </div>

            {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={16} /></button></div>}

            <div className="trust-row">
              <div className="trust-item"><span className="trust-icon"><ShieldCheck /></span><span>Verified<br />Information</span></div>
              <div className="trust-item"><span className="trust-icon rupee"><IndianRupee /></span><span>Compare<br />Prices</span></div>
              <div className="trust-item"><span className="trust-icon"><Sparkles /></span><span>Supports<br />Misspellings</span></div>
              <div className="trust-item"><span className="trust-icon"><FileText /></span><span>Trusted<br />Sources</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of the DawaWise medicine comparison app">
            <div className="visual-halo" />
            <div className="phone">
              <div className="phone-top"><span /><i /></div>
              <div className="phone-screen">
                <div className="phone-brand"><Logo /><Menu size={19} /></div>
                <div className="phone-search"><Search size={17} /><span>Search medicine, brand or molecule...</span><Mic size={15} /></div>
                <div className="phone-shortcuts">
                  <button onClick={handleUpload}><Upload /><span>Upload<br />Prescription</span></button>
                  <button onClick={() => document.getElementById('medicine-search')?.focus()}><Search /><span>Search<br />Medicine</span></button>
                </div>
                <div className="popular-head"><strong>Popular Searches</strong><a href="#popular">See all</a></div>
                <div className="medicine-list" id="popular">
                  {popularMedicines.map((medicine) => (
                    <button key={medicine} onClick={() => { setSearch(medicine); runSearch(medicine); }}>
                      <span className="list-search"><Search size={14} /></span><span>{medicine}</span><ChevronDown className="list-chevron" size={15} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="prescription-paper">
              <div className="rx">℞</div>
              <div className="paper-rule" />
              <div className="handwritten">1. Paracetamol 500<br /><span>1 - 0 - 1</span></div>
              <div className="handwritten">2. Azithromycin 500<br /><span>1 - 0 - 0</span></div>
              <div className="handwritten">3. Pantoprazole 40<br /><span>1 - 0 - 1</span></div>
              <div className="handwritten">4. Cetirizine 10<br /><span>0 - 0 - 1</span></div>
            </div>
            <div className="compare-card">
              <h3>Paracetamol 500 mg <span>(Tablet)</span></h3>
              <div className="compare-options">
                <div className="price-option branded">
                  <small>Branded</small><strong>Crocin 500</strong><b>₹240</b><span>MRP (10 tablets)</span>
                </div>
                <div className="price-option generic">
                  <small>Generic</small><strong>Paracetamol 500</strong><b>₹28</b><span>Jan Aushadhi (10 tablets)</span>
                </div>
              </div>
              <div className="savings"><TrendingIcon /> You can save up to ₹212</div>
            </div>
            <div className="blister blister-one"><span /><span /><span /><span /></div>
            <div className="blister blister-two"><span /><span /><span /><span /></div>
            <div className="loose-pill pill-one" /><div className="loose-pill pill-two" />
          </div>
        </div>
        <div className="hero-bottom-fade" />
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-kicker">SIMPLE. CLEAR. INFORMED.</span>
          <h2>How <span>DawaWise</span> Works</h2>
          <p>A simple way to understand your medicines and explore affordable options.</p>
        </div>
        <div className="steps">
          <div className="step-card"><span className="step-icon"><FilePlus2 /></span><div><h3>1. Upload or Search</h3><p>Upload a prescription or search by medicine name.</p></div></div>
          <ArrowRight className="step-arrow" />
          <div className="step-card"><span className="step-icon"><Search /></span><div><h3>2. Identify Medicines</h3><p>We extract and match medicine names accurately.</p></div></div>
          <ArrowRight className="step-arrow" />
          <div className="step-card"><span className="step-icon"><List /></span><div><h3>3. Compare Options</h3><p>View verified generic alternatives and prices.</p></div></div>
          <ArrowRight className="step-arrow" />
          <div className="step-card"><span className="step-icon"><ShieldCheck /></span><div><h3>4. Make Informed Decisions</h3><p>Understand your options and consult your doctor or pharmacist.</p></div></div>
        </div>
      </section>

      <NearbyStoresSection />

      <AboutSection />

      <DataSourcesSection />

      <HelpSection />

      <footer className="footer-extended">
        <div className="footer-inner-grid">
          <div className="footer-brand-col">
            <Logo />
            <p>
              An informational platform designed to make Indian medicine names, generic alternatives,
              and comparative price structures clearer and easier to understand.
            </p>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#how-it-works">How DawaWise Works</a></li>
              <li><a href="#nearby-stores">Nearby Stores</a></li>
              <li><a href="#about">About DawaWise</a></li>
              <li><a href="#data-sources">Data Sources &amp; Transparency</a></li>
              <li><a href="#help">Help &amp; FAQs</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Important Notice</h5>
            <p style={{ margin: 0, color: '#9cb5db', fontSize: '13px', lineHeight: '1.6' }}>
              DawaWise is an educational technology demonstration and does not provide medical advice, diagnosis, or prescription replacement.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>© {new Date().getFullYear()} DawaWise. All rights reserved.</p>
          <span className="footer-note" style={{ color: '#9cb5db' }}>
            <BookOpen size={14} /> Informational Educational Prototype — Not Medical Advice.
          </span>
        </div>
      </footer>
    </main>
  );
}

function TrendingIcon() {
  return <ArrowUpRight size={18} strokeWidth={2.5} />;
}

export default App;