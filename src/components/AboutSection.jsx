import React from 'react';
import {
  FileText, Search, IndianRupee, Pill, ShieldCheck, HeartPulse,
  ArrowRight, ArrowUpRight, AlertTriangle, Eye, CheckCircle2,
  Sparkles, Stethoscope, HelpCircle, Layers, Scale
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      {/* A. About Hero */}
      <div className="section-container">
        <div className="about-hero">
          <div className="about-hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> ABOUT DAWAWISE
            </div>
            <h2 id="about-heading" className="about-main-title">
              Making Medicine Information <span>Easier to Understand</span>
            </h2>
            <p className="about-hero-desc">
              DawaWise is designed to help people understand medicine names, explore generic alternatives,
              and compare listed prices so they can have more informed conversations with healthcare professionals.
            </p>
            <div className="about-hero-actions">
              <a href="#how-it-works" className="btn-primary">
                Explore How It Works <ArrowRight size={18} />
              </a>
              <a href="#data-sources" className="btn-secondary">
                Explore Data Sources <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-card-visual">
              <div className="visual-header">
                <span className="visual-tag"><ShieldCheck size={14} /> Clarity Preview</span>
                <span className="visual-badge">Educational Demo</span>
              </div>
              <div className="visual-medicine">
                <div className="visual-icon-wrap"><Pill size={24} /></div>
                <div>
                  <strong>Active Molecule Breakdown</strong>
                  <p>Paracetamol (Acetaminophen) • 500mg Oral Tablet</p>
                </div>
              </div>
              <div className="visual-comparison-preview">
                <div className="preview-row">
                  <span>Branded Market Reference</span>
                  <strong>₹24.00 / 10 tabs</strong>
                </div>
                <div className="preview-row generic-highlight">
                  <span>Jan Aushadhi Generic Scheme</span>
                  <strong className="text-success">₹2.80 / 10 tabs</strong>
                </div>
              </div>
              <div className="visual-footer">
                <span className="clarity-meter-label">Clarity Index: High</span>
                <div className="clarity-meter-bar">
                  <div className="clarity-fill" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* B. Our Mission */}
        <div className="mission-block">
          <div className="mission-badge">
            <HeartPulse size={20} />
          </div>
          <div className="mission-content">
            <span className="section-kicker">OUR PURPOSE</span>
            <h3>Our Mission</h3>
            <p>
              DawaWise aims to make medicine information easier to understand and help people ask better,
              more specific questions about treatment options and medicine costs when consulting their physicians
              and pharmacists. By translating complicated medical packaging and brand nomenclatures into accessible
              active-molecule facts, we strive to build a more informed community.
            </p>
          </div>
        </div>

        {/* C. The Problem We Want to Solve */}
        <div className="subsection">
          <div className="subsection-header">
            <span className="section-kicker">CHALLENGES IN HEALTHCARE</span>
            <h3>The Problems We Want to Solve</h3>
            <p>Navigating medication choices can be overwhelming. We focus on three everyday hurdles:</p>
          </div>

          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <Pill size={26} />
              </div>
              <h4>1. Confusing Medicine Names</h4>
              <p>
                Patients often struggle to distinguish between trade brand names, generic formulations,
                and underlying active chemical salts.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon">
                <Scale size={26} />
              </div>
              <h4>2. Price Comparison Challenges</h4>
              <p>
                Comparing medicine costs is complex when strip sizes, strengths (e.g. 250mg vs 500mg),
                and release profiles differ widely across brands.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon">
                <FileText size={26} />
              </div>
              <h4>3. Difficult-to-Understand Information</h4>
              <p>
                Complex package leaflets and medical terminology make it difficult for patients to find
                clear, neutral facts before clinical appointments.
              </p>
            </div>
          </div>
        </div>

        {/* D. How DawaWise Helps */}
        <div className="subsection">
          <div className="subsection-header">
            <span className="section-kicker">WHAT WE ARE BUILDING</span>
            <h3>How DawaWise Helps</h3>
            <p>Tools designed to illuminate your options while clearly distinguishing live integrations from demonstration prototypes.</p>
          </div>

          <div className="solutions-grid">
            <div className="solution-card">
              <div className="solution-top">
                <span className="solution-icon"><FileText size={22} /></span>
                <span className="status-badge badge-demo">Demonstration Prototype</span>
              </div>
              <h4>Prescription Assistance</h4>
              <p>
                Designed to assist users in reading handwritten or digital prescriptions to identify medicine names
                for exploration.
              </p>
              <div className="feature-disclaimer">
                <span>Note:</span> File upload currently runs as a client-side preview and is not yet connected to an OCR backend.
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-top">
                <span className="solution-icon"><Search size={22} /></span>
                <span className="status-badge badge-demo">Interactive Sample</span>
              </div>
              <h4>Medicine Search</h4>
              <p>
                Search by medicine name, brand, or active ingredient when supported by the connected database
                to inspect dosage forms and strengths.
              </p>
              <div className="feature-disclaimer">
                <span>Note:</span> Currently searches an illustrative sample catalogue of popular Indian formulations.
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-top">
                <span className="solution-icon"><IndianRupee size={22} /></span>
                <span className="status-badge badge-demo">Sample Dataset</span>
              </div>
              <h4>Price Comparison</h4>
              <p>
                Compare available listed price information across appropriately matched products with standardized
                unit-level calculations.
              </p>
              <div className="feature-disclaimer">
                <span>Note:</span> Demonstrates comparative price views; live API price feeds are planned for future integration.
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-top">
                <span className="solution-icon"><Sparkles size={22} /></span>
                <span className="status-badge badge-demo">Educational Preview</span>
              </div>
              <h4>Generic Alternatives</h4>
              <p>
                Explore potential verified generic alternatives sharing identical active molecules to discuss
                with your doctor or pharmacist.
              </p>
              <div className="feature-disclaimer">
                <span>Note:</span> For discussion purposes only; any brand substitution requires medical professional consent.
              </div>
            </div>
          </div>
        </div>

        {/* E. Our Principles */}
        <div className="subsection">
          <div className="subsection-header">
            <span className="section-kicker">CORE VALUES</span>
            <h3>Our Guiding Principles</h3>
            <p>Every feature in DawaWise is guided by honesty, patient safety, and transparency.</p>
          </div>

          <div className="principles-grid">
            <div className="principle-card">
              <span className="principle-icon"><Eye size={20} /></span>
              <div>
                <strong>Clarity</strong>
                <p>We translate complex pharmaceutical jargon into simple, plain English without sacrificing nuance.</p>
              </div>
            </div>

            <div className="principle-card">
              <span className="principle-icon"><ShieldCheck size={20} /></span>
              <div>
                <strong>Transparency</strong>
                <p>We openly disclose data sources, collection timestamps, and the exact boundaries of what our software can and cannot do.</p>
              </div>
            </div>

            <div className="principle-card">
              <span className="principle-icon"><Layers size={20} /></span>
              <div>
                <strong>Privacy</strong>
                <p>Prescription images selected in this browser demo stay strictly in your local device memory and are not uploaded.</p>
              </div>
            </div>

            <div className="principle-card">
              <span className="principle-icon"><Stethoscope size={20} /></span>
              <div>
                <strong>Responsible Use</strong>
                <p>We actively reinforce clinical consultation, emphasizing that software never replaces licensed medical expertise.</p>
              </div>
            </div>
          </div>
        </div>

        {/* F. Medical Disclaimer */}
        <div className="medical-disclaimer-card" role="note" aria-label="Medical Disclaimer">
          <div className="disclaimer-icon-wrap">
            <AlertTriangle size={28} />
          </div>
          <div className="disclaimer-body">
            <strong>Medical Disclaimer &amp; Patient Safety Notice</strong>
            <p>
              DawaWise provides informational assistance only. It does not diagnose medical conditions,
              prescribe medicines, or replace advice from a qualified doctor or pharmacist. Do not start,
              stop, substitute, or change a medicine based only on information displayed on this website.
            </p>
          </div>
        </div>

        {/* G. About Section CTA */}
        <div className="section-cta-row">
          <a href="#how-it-works" className="btn-secondary">
            See How It Works <ArrowRight size={16} />
          </a>
          <a href="#data-sources" className="btn-primary">
            View Data Sources <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
