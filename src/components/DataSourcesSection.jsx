import React, { useState } from 'react';
import {
  Database, ShieldAlert, ExternalLink, Calendar, CheckCircle2,
  AlertCircle, FileCheck, Info, ArrowRight, ArrowUpRight,
  Layers, Building2, Tag, Clock, ShieldX, HelpCircle, Lock
} from 'lucide-react';

const sourceRegistry = [
  {
    id: 'pmbjp-janaushadhi',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
    category: 'Government Generic Formulary',
    url: 'http://janaushadhi.gov.in',
    description: 'Official initiative of the Department of Pharmaceuticals, Government of India, making quality generic medicines accessible at affordable prices.',
    dataFields: ['Generic Drug Code', 'Molecule Name', 'Unit Dosage', 'Max Retail Price (MRP)', 'Pack Size'],
    lastChecked: null, // Honest null for demo
    verificationStatus: 'Reference Benchmark',
    availabilityStatus: 'Demonstration Data',
    limitations: [
      'Static sample dataset modeled after public catalogue rates',
      'Stock availability varies by local Kendra outlets',
      'Not currently fed via a live real-time API sync'
    ]
  },
  {
    id: 'nppa-ceiling-prices',
    name: 'National Pharmaceutical Pricing Authority (NPPA)',
    category: 'Price Regulation & DPCO Orders',
    url: 'https://www.nppaindia.nic.in',
    description: 'Statutory body monitoring and enforcing ceiling prices for scheduled essential medicines under the Drugs (Prices Control) Order.',
    dataFields: ['Formulation Name', 'Dosage & Strength', 'Ceiling Price Per Unit', 'Gazette Notification Reference'],
    lastChecked: null,
    verificationStatus: 'Regulatory Standard',
    availabilityStatus: 'Not Connected',
    limitations: [
      'Applies strictly to scheduled formulations on the National List of Essential Medicines (NLEM)',
      'Retailers may sell below ceiling price, but not above it',
      'Requires manual integration of periodic gazette updates'
    ]
  },
  {
    id: 'cdsco-drug-registry',
    name: 'Central Drugs Standard Control Organization (CDSCO)',
    category: 'Official Regulatory & Approval Reference',
    url: 'https://cdsco.gov.in',
    description: 'National regulatory body for Indian pharmaceuticals, approving new drug molecules, clinical trials, and clinical manufacturing standards.',
    dataFields: ['Approved Molecule Names', 'Approved Indications', 'Therapeutic Class', 'Black Box Warnings'],
    lastChecked: null,
    verificationStatus: 'Official Reference',
    availabilityStatus: 'Not Connected',
    limitations: [
      'Regulatory approval lists do not indicate retail commercial availability',
      'Manufacturing licensing is distributed across state drug licensing authorities',
      'Live automated lookup API is currently in specification phase'
    ]
  },
  {
    id: 'sample-commercial-catalogue',
    name: 'DawaWise Sample Demonstration Catalogue',
    category: 'Illustrative Prototype Database',
    url: '',
    description: 'An internal mock catalogue containing curated active ingredients (Paracetamol, Amoxicillin, Pantoprazole, Metformin) used to demonstrate interface behaviors.',
    dataFields: ['Brand Name', 'Active Salt', 'Strength', 'Sample Branded MRP', 'Sample Generic Price'],
    lastChecked: '2026-10-15',
    verificationStatus: 'Internal Test Dataset',
    availabilityStatus: 'Connected (Mock)',
    limitations: [
      'Strictly illustrative for UX demonstration',
      'Must NOT be used to make actual purchasing or dosage decisions',
      'Prices reflect sample market estimates and do not track daily retail fluctuations'
    ]
  }
];

export default function DataSourcesSection() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredSources = selectedFilter === 'all'
    ? sourceRegistry
    : sourceRegistry.filter((src) =>
        selectedFilter === 'connected' ? src.availabilityStatus.includes('Connected') : !src.availabilityStatus.includes('Connected')
      );

  return (
    <section className="sources-section" id="data-sources" aria-labelledby="sources-heading">
      <div className="section-container">
        {/* A. Section Introduction */}
        <div className="section-intro">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> TRANSPARENCY MATTERS
          </div>
          <h2 id="sources-heading" className="section-title">
            Understand Where <span>Medicine Information Comes From</span>
          </h2>
          <p className="section-desc">
            Medicine names, ingredients, formulations, and prices can come from different sources.
            DawaWise makes the origin, freshness, and limitations of displayed information clear and honest.
          </p>
        </div>

        {/* Compact Info Banner */}
        <div className="transparency-banner" role="status">
          <Info size={22} className="banner-icon" />
          <div className="banner-text">
            <strong>Active Data Integration Notice:</strong> DawaWise is currently in an informational prototype phase.
            Any prices, generic alternatives, or listings shown in the search interface are drawn from curated demonstration sets.
            Live connections to national drug authorities and pharmacy price feeds are marked transparently below.
          </div>
        </div>

        {/* B. Source Categories */}
        <div className="subsection">
          <div className="subsection-header">
            <span className="section-kicker">DATA ARCHITECTURE</span>
            <h3>Six Pillars of Medicine Information</h3>
            <p>Every reliable medicine comparison relies on understanding these distinct data categories:</p>
          </div>

          <div className="source-pillars-grid">
            <div className="pillar-card">
              <span className="pillar-icon"><Building2 size={24} /></span>
              <h4>1. Official Medicine Information</h4>
              <p>
                Details must be cross-checked against authorized regulatory bodies, such as the Central Drugs Standard
                Control Organization (CDSCO) or approved package inserts.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-icon"><Database size={24} /></span>
              <h4>2. Generic Medicine Information</h4>
              <p>
                Matching must evaluate identical active chemical salts, exact milligram strengths, dosage formats
                (e.g., tablet vs suspension), and route of administration.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-icon"><Tag size={24} /></span>
              <h4>3. Medicine Prices</h4>
              <p>
                Costs vary by manufacturer, distributor, region, and date. We clearly distinguish Maximum Retail Price (MRP),
                seller-discounted rates, and subsidized generic rates.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-icon"><Layers size={24} /></span>
              <h4>4. Government &amp; Public Resources</h4>
              <p>
                Initiatives like the Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) offer certified bioequivalent
                generics under public oversight.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-icon"><ShieldAlert size={24} /></span>
              <h4>5. Product &amp; Manufacturer Data</h4>
              <p>
                Brand packaging and trademarked logos identify commercial lines, but identical manufacturers do not guarantee
                interchangeability between distinct strengths or formulations.
              </p>
            </div>

            <div className="pillar-card">
              <span className="pillar-icon"><Clock size={24} /></span>
              <h4>6. Data Freshness</h4>
              <p>
                Prices and formulations evolve constantly. We only display verification timestamps when an authoritative,
                validated sync has occurred.
              </p>
            </div>
          </div>
        </div>

        {/* C & D. Source Registry & Status Indicators */}
        <div className="subsection">
          <div className="registry-header-row">
            <div>
              <span className="section-kicker">TRANSPARENCY LEDGER</span>
              <h3>Source Registry &amp; Connectivity Status</h3>
              <p>Inspect each source, its intended purpose, known limitations, and real connection status.</p>
            </div>
            <div className="registry-filter" role="group" aria-label="Filter data sources">
              <button
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All Sources ({sourceRegistry.length})
              </button>
              <button
                className={`filter-btn ${selectedFilter === 'connected' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('connected')}
              >
                Connected Demo
              </button>
              <button
                className={`filter-btn ${selectedFilter === 'unconnected' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('unconnected')}
              >
                Planned / Specification
              </button>
            </div>
          </div>

          <div className="registry-list">
            {filteredSources.map((source) => (
              <article key={source.id} className="registry-card">
                <div className="registry-card-header">
                  <div>
                    <span className="registry-category">{source.category}</span>
                    <h4 className="registry-name">
                      {source.name}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-source-link"
                          aria-label={`Visit official website of ${source.name} (opens in new tab)`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </h4>
                  </div>
                  <div className="registry-badges">
                    <span className={`status-badge ${source.availabilityStatus.includes('Connected') ? 'badge-connected' : 'badge-disconnected'}`}>
                      {source.availabilityStatus}
                    </span>
                    <span className="status-badge badge-neutral">
                      {source.verificationStatus}
                    </span>
                  </div>
                </div>

                <p className="registry-description">{source.description}</p>

                <div className="registry-metadata-grid">
                  <div className="meta-box">
                    <strong>Supplied Data Fields:</strong>
                    <ul>
                      {source.dataFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="meta-box">
                    <strong>Known Constraints &amp; Limitations:</strong>
                    <ul>
                      {source.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="registry-card-footer">
                  <span className="last-checked">
                    <Calendar size={14} />
                    {source.lastChecked ? `Last verified: ${source.lastChecked}` : 'Live sync timestamp: Not connected'}
                  </span>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-nav-link"
                    >
                      Visit Official Portal <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="source-nav-link text-muted">Internal Demo Catalog</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* F. Medicine Comparison Limitations */}
        <div className="comparison-limitations-box">
          <div className="box-icon-col">
            <ShieldAlert size={30} />
          </div>
          <div className="box-content-col">
            <h4>Essential Clinical Rules: Why Names Alone Are Not Enough</h4>
            <p>
              Two pharmaceutical products cannot be deemed interchangeable based solely on active molecule similarity.
              Accurate, safe evaluation requires matching all of the following parameters:
            </p>
            <div className="clinical-checks-grid">
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Exact Active Salt:</strong> e.g., Metoprolol Tartrate vs Metoprolol Succinate behave differently.</div>
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Strength / Concentration:</strong> 250mg vs 500mg, or % suspension volume.</div>
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Dosage Format:</strong> Enteric-coated tablet, capsule, oral syrup, or topical cream.</div>
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Release Mechanism:</strong> Sustained Release (SR/ER/XR) vs Immediate Release (IR).</div>
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Route of Administration:</strong> Oral ingestion, sublingual, ocular, or subcutaneous.</div>
              <div className="check-item"><CheckCircle2 size={16} /> <strong>Prescription Schedule:</strong> Schedule H, H1, or X regulations requiring mandatory clinician oversight.</div>
            </div>
            <p className="clinical-warning-note">
              <strong>Caution:</strong> Never alter, substitute, or purchase an alternate formulation without explicit written approval
              or guidance from your prescribing medical doctor or licensed pharmacist.
            </p>
          </div>
        </div>

        {/* G. Price Transparency */}
        <div className="transparency-deep-dive">
          <div className="deep-dive-card">
            <h4>Price Transparency Principles</h4>
            <ul>
              <li><strong>Pack Size Normalization:</strong> We compare prices by unit dose (per tablet or ml) rather than raw packaging to avoid misleading strip comparisons.</li>
              <li><strong>MRP vs. Retailer Discounts:</strong> Maximum Retail Price (MRP) is set by manufacturers or price orders. Local pharmacy discounts may vary and are not guaranteed.</li>
              <li><strong>No Invented Savings:</strong> We never generate algorithmic fictional discounts. If exact price matches do not exist, we display &quot;Price unconfirmed&quot; rather than an estimate.</li>
              <li><strong>Temporal Validity:</strong> Medicine prices are subject to state taxation and manufacturing cost updates; historical rates should always be verified prior to purchase.</li>
            </ul>
          </div>

          {/* H. Privacy and Prescription Files */}
          <div className="deep-dive-card">
            <h4>Prescription Privacy &amp; Data Handling</h4>
            <div className="privacy-status-note">
              <Lock size={18} />
              <span>Current Architecture: 100% In-Browser Memory</span>
            </div>
            <p>
              Prescriptions contain sensitive protected health data. In this frontend version:
            </p>
            <ul>
              <li>Files chosen via the &quot;Upload Prescription&quot; button remain exclusively in local browser memory.</li>
              <li>No files, patient names, or images are transmitted over the internet or stored on a server.</li>
              <li>No cookies or telemetry track the medical documents you select.</li>
              <li>When backend OCR services are integrated in future phases, end-to-end encryption and explicit patient opt-in consent will be enforced.</li>
            </ul>
          </div>
        </div>

        {/* I. Data Sources CTA */}
        <div className="section-cta-row">
          <a href="#about" className="btn-secondary">
            About DawaWise <ArrowRight size={16} />
          </a>
          <a href="#help" className="btn-primary">
            Get Help &amp; FAQs <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
