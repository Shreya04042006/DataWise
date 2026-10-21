import React, { useState, useId } from 'react';
import {
  HelpCircle, Search, Upload, IndianRupee, Database, ChevronDown,
  ChevronUp, Send, CheckCircle2, AlertTriangle, X, PhoneCall,
  FileQuestion, Mail, ShieldAlert, Sparkles, Stethoscope, ArrowRight, Info
} from 'lucide-react';

const faqsData = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is DawaWise?',
    answer: 'DawaWise is an informational healthcare education platform designed to make Indian medicine names, active ingredients, and comparative price structures easier to understand for everyday citizens and caregivers.'
  },
  {
    id: 'faq-2',
    category: 'medical',
    question: 'Is DawaWise a medical advice service?',
    answer: 'No. DawaWise is strictly an educational and informational tool. It does not provide medical consultations, diagnosis, clinical opinions, or prescription approvals. Always consult a qualified medical professional for health guidance.'
  },
  {
    id: 'faq-3',
    category: 'medical',
    question: 'Can DawaWise diagnose a condition?',
    answer: 'No. DawaWise does not possess diagnostic capabilities and never assesses symptoms or patient conditions. If you are experiencing symptoms or health concerns, consult a licensed clinician immediately.'
  },
  {
    id: 'faq-4',
    category: 'medicines',
    question: 'Can I replace a branded medicine with a generic medicine?',
    answer: 'Not without professional medical consultation. While certified generics feature identical active ingredients, differences in bioequivalence, release profile (such as sustained-release), inactive excipients, or therapeutic windows must be evaluated by your prescribing doctor or pharmacist before making any substitution.'
  },
  {
    id: 'faq-5',
    category: 'pricing',
    question: 'Are the displayed medicine prices always current?',
    answer: 'No. In this demonstration prototype, displayed prices represent sample snapshot estimates. Pharmaceutical prices fluctuate across states, pharmacies, and new gazette revisions. Live pricing sync requires connected pharmacy integrations.'
  },
  {
    id: 'faq-6',
    category: 'data',
    question: 'Where does medicine information come from?',
    answer: 'DawaWise is designed around public health databases such as the Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) catalogue, the National Pharmaceutical Pricing Authority (NPPA), and CDSCO regulatory registries. In this demonstration, a curated mock subset is displayed.'
  },
  {
    id: 'faq-7',
    category: 'prescription',
    question: 'Does prescription upload automatically identify medicines?',
    answer: 'In the current frontend build, no. The upload button allows you to select a document locally to demonstrate the intended interface workflow. Optical character recognition (OCR) and AI assistance are planned for future backend integration.'
  },
  {
    id: 'faq-8',
    category: 'privacy',
    question: 'What happens to my prescription image?',
    answer: 'Nothing is uploaded. Files selected in your browser remain entirely in local client memory and are never transmitted across the network, stored on remote disks, or shared with third parties.'
  },
  {
    id: 'faq-9',
    category: 'search',
    question: 'Why might a medicine search return no results?',
    answer: 'Currently, the client-side search query is connected to a small demonstration dataset of common Indian formulations (e.g., Paracetamol, Amoxicillin, Pantoprazole, Metformin, Azithromycin). Full coverage will become available when connected to a comprehensive commercial database.'
  },
  {
    id: 'faq-10',
    category: 'general',
    question: 'How can I report incorrect medicine information?',
    answer: 'Because DawaWise is currently an informational technology demonstration without an active editorial queue, an automated reporting workflow is not yet deployed. You can reach out via the demonstration feedback form below.'
  },
  {
    id: 'faq-11',
    category: 'general',
    question: 'Is DawaWise available in multiple languages?',
    answer: 'A language switcher is available in the navigation bar to demonstrate future multilingual capability (supporting Hindi, Bengali, and Tamil). Currently, the website content is primarily in English.'
  },
  {
    id: 'faq-12',
    category: 'safety',
    question: 'Can I use DawaWise in a medical emergency?',
    answer: 'No. Never use DawaWise during a medical crisis. In an emergency, immediately call national emergency helplines (112 or 108 in India) or proceed to the nearest hospital casualty emergency department.'
  }
];

export default function HelpSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordion, setOpenAccordion] = useState('faq-1');
  const [activeGuideTab, setActiveGuideTab] = useState('search');

  // Contact form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const nameInputId = useId();
  const emailInputId = useId();
  const subjectInputId = useId();
  const messageInputId = useId();
  const consentInputId = useId();

  // Filter FAQs based on search
  const filteredFaqs = faqsData.filter((faq) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q) || faq.category.toLowerCase().includes(q);
  });

  const handleQuickHelpClick = (filterKeyword, targetGuideTab) => {
    setSearchQuery(filterKeyword);
    setActiveGuideTab(targetGuideTab);
    const element = document.getElementById('guides-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      errors.fullName = 'Please enter your full name.';
    } else if (trimmedName.length < 2) {
      errors.fullName = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Please provide an email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (!formData.subject) {
      errors.subject = 'Please choose a subject for your enquiry.';
    }

    if (!trimmedMessage) {
      errors.message = 'Please write your message.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    if (!formData.consent) {
      errors.consent = 'You must confirm that you understand this is an informational demo.';
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      // Realistic simulated async demonstration submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 700);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: '',
      consent: false
    });
    setFormErrors({});
    setSubmitSuccess(false);
  };

  return (
    <section className="help-section" id="help" aria-labelledby="help-heading">
      <div className="section-container">
        {/* A. Help Hero */}
        <div className="section-intro">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> WE’RE HERE TO HELP
          </div>
          <h2 id="help-heading" className="section-title">
            How Can We <span>Help You?</span>
          </h2>
          <p className="section-desc">
            Find guidance on searching for medicines, understanding price comparisons, and using DawaWise responsibly.
          </p>

          {/* Interactive Help Search */}
          <div className="help-search-wrapper">
            <div className="help-search-bar">
              <Search className="help-search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics: e.g. generic, prescription, pricing, emergency..."
                aria-label="Search frequently asked questions and help topics"
                className="help-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="help-search-stats" aria-live="polite">
              {searchQuery ? (
                <span>Showing {filteredFaqs.length} of {faqsData.length} questions matching &ldquo;{searchQuery}&rdquo;</span>
              ) : (
                <span>Browse all {faqsData.length} frequently asked questions or select a topic below</span>
              )}
            </div>
          </div>
        </div>

        {/* B. Quick-Help Cards */}
        <div className="quick-help-grid">
          <button
            type="button"
            className={`quick-card ${activeGuideTab === 'search' ? 'active-quick' : ''}`}
            onClick={() => handleQuickHelpClick('search', 'search')}
          >
            <span className="quick-icon"><Search size={22} /></span>
            <strong>Searching for Medicines</strong>
            <p>5-step guide on looking up brands and active salts</p>
          </button>

          <button
            type="button"
            className={`quick-card ${activeGuideTab === 'upload' ? 'active-quick' : ''}`}
            onClick={() => handleQuickHelpClick('prescription', 'upload')}
          >
            <span className="quick-icon"><Upload size={22} /></span>
            <strong>Uploading a Prescription</strong>
            <p>How the prescription file demonstration works</p>
          </button>

          <button
            type="button"
            className={`quick-card ${activeGuideTab === 'price' ? 'active-quick' : ''}`}
            onClick={() => handleQuickHelpClick('price', 'price')}
          >
            <span className="quick-icon"><IndianRupee size={22} /></span>
            <strong>Price Comparisons</strong>
            <p>How branded vs generic costs are evaluated</p>
          </button>

          <button
            type="button"
            className={`quick-card ${activeGuideTab === 'data' ? 'active-quick' : ''}`}
            onClick={() => handleQuickHelpClick('data', 'data')}
          >
            <span className="quick-icon"><Database size={22} /></span>
            <strong>Understanding Sources</strong>
            <p>Distinguishing live feeds from mock demo datasets</p>
          </button>
        </div>

        {/* C, D, E. Step-by-Step Interactive Guides */}
        <div className="subsection" id="guides-container">
          <div className="guide-tabs-nav" role="tablist" aria-label="Help Guides">
            <button
              role="tab"
              aria-selected={activeGuideTab === 'search'}
              className={`guide-tab-btn ${activeGuideTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveGuideTab('search')}
            >
              1. Search Instructions
            </button>
            <button
              role="tab"
              aria-selected={activeGuideTab === 'upload'}
              className={`guide-tab-btn ${activeGuideTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveGuideTab('upload')}
            >
              2. Prescription Upload
            </button>
            <button
              role="tab"
              aria-selected={activeGuideTab === 'price'}
              className={`guide-tab-btn ${activeGuideTab === 'price' ? 'active' : ''}`}
              onClick={() => setActiveGuideTab('price')}
            >
              3. Comparing Medicines
            </button>
          </div>

          <div className="guide-content-wrapper">
            {activeGuideTab === 'search' && (
              <div className="guide-pane" role="tabpanel">
                <h3>How to Search for a Medicine</h3>
                <p className="guide-subtext">Follow these steps to explore medicine details on DawaWise:</p>
                <ol className="step-list">
                  <li>
                    <span className="step-num">1</span>
                    <div>
                      <strong>Open the search interface</strong>
                      <p>Navigate to the homepage search box or tap the search icon in the navigation bar.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div>
                      <strong>Enter a medicine name, brand, or molecule</strong>
                      <p>Type a common trade name (e.g., &quot;Crocin&quot;) or active salt (e.g., &quot;Paracetamol&quot;). Even if misspelled, our system attempts matching.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div>
                      <strong>Review matching formulation details</strong>
                      <p>Examine the active ingredient, therapeutic category, and standard available dosages.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">4</span>
                    <div>
                      <strong>Verify strength, formulation, and pack size</strong>
                      <p>Ensure the tablet strength (e.g. 500mg vs 650mg) and delivery format align with your interest.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">5</span>
                    <div>
                      <strong>Consult your healthcare professional</strong>
                      <p>Take the identified active molecule name to your doctor or pharmacist to discuss cost-effective prescriptions.</p>
                    </div>
                  </li>
                </ol>
                <div className="guide-alert-note">
                  <Info size={18} />
                  <span><strong>Database note:</strong> The live search is currently linked to an illustrative sample catalogue. Connecting an exhaustive nationwide registry is in progress.</span>
                </div>
              </div>
            )}

            {activeGuideTab === 'upload' && (
              <div className="guide-pane" role="tabpanel">
                <h3>How to Upload a Prescription (Demonstration Guide)</h3>
                <p className="guide-subtext">Understanding the current prescription workflow in DawaWise:</p>
                <ol className="step-list">
                  <li>
                    <span className="step-num">1</span>
                    <div>
                      <strong>Click the &quot;Upload Prescription&quot; button</strong>
                      <p>Locate the primary blue upload button in the hero section or shortcut menu.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div>
                      <strong>Choose a supported image or PDF</strong>
                      <p>Your operating system will display a file browser accepting JPG, PNG, and PDF formats.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div>
                      <strong>Confirm the selected file</strong>
                      <p>The interface immediately confirms the file name with a local status banner.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">4</span>
                    <div>
                      <strong>Understand what happens next</strong>
                      <p>
                        In this frontend-only release, selecting a file demonstrates the user experience.
                        <strong> Your file is NOT transmitted to a server, stored, or processed by an OCR engine.</strong>
                      </p>
                    </div>
                  </li>
                </ol>
                <div className="guide-alert-note">
                  <ShieldAlert size={18} />
                  <span><strong>Zero Server Storage:</strong> Your private medical documents remain protected inside your browser memory during this demo.</span>
                </div>
              </div>
            )}

            {activeGuideTab === 'price' && (
              <div className="guide-pane" role="tabpanel">
                <h3>How to Understand Medicine Comparisons</h3>
                <p className="guide-subtext">Learn how to read comparative pharmaceutical metrics intelligently:</p>

                <div className="comparison-anatomy-grid">
                  <div className="anatomy-card">
                    <h4>Brand vs. Generic Labels</h4>
                    <p>Branded medicines bear proprietary trademarks marketed by specific pharmaceutical companies. Generics are labeled by their international active chemical salt name.</p>
                  </div>
                  <div className="anatomy-card">
                    <h4>Active Ingredients &amp; Salt Forms</h4>
                    <p>The core therapeutic chemical that delivers the clinical effect. Two brands with the same active molecule perform equivalent primary medical actions when bioequivalent.</p>
                  </div>
                  <div className="anatomy-card">
                    <h4>Strength &amp; Release Profiles</h4>
                    <p>Always inspect the milligram quantity and release speed. Immediate release (IR) cannot be casually swapped for extended release (ER/XR/SR) formulations.</p>
                  </div>
                  <div className="anatomy-card">
                    <h4>Unit Price Normalization</h4>
                    <p>We break down overall pack costs (e.g. ₹240 for 10 tablets) into individual pill rates (₹24/tablet) to enable direct mathematical comparisons with generic strips (₹2.80/tablet).</p>
                  </div>
                </div>

                <div className="sample-mockup-wrapper">
                  <span className="mockup-pill-tag">Illustrative Comparison Breakdown</span>
                  <div className="sample-compare-row">
                    <div className="sample-col branded">
                      <span className="col-badge">Commercial Brand</span>
                      <strong>Crocin 500 Advance</strong>
                      <span>Paracetamol 500mg</span>
                      <b className="price">₹24.00</b>
                      <small>MRP per 15 tablets (₹1.60 / tab)</small>
                    </div>
                    <div className="sample-col generic">
                      <span className="col-badge success">Government Generic</span>
                      <strong>Paracetamol Tablets IP</strong>
                      <span>Paracetamol 500mg</span>
                      <b className="price success">₹3.50</b>
                      <small>PMBJP Kendra rate (₹0.35 / tab)</small>
                    </div>
                  </div>
                  <p className="sample-foot">
                    *Sample prices shown for demonstration. Lower cost does not automatically indicate that a medicine can be changed without doctor approval.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* F. Frequently Asked Questions (Accordion) */}
        <div className="subsection">
          <div className="subsection-header">
            <span className="section-kicker">QUESTIONS &amp; ANSWERS</span>
            <h3>Frequently Asked Questions</h3>
            <p>Clear, direct answers regarding DawaWise capabilities, limitations, and safety commitments.</p>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <FileQuestion size={40} />
              <h4>No matching questions found</h4>
              <p>We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}&rdquo;. Try another term or reset your search.</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSearchQuery('')}
              >
                Show All Questions
              </button>
            </div>
          ) : (
            <div className="faq-accordion-list" role="region" aria-label="Frequently Asked Questions">
              {filteredFaqs.map((faq) => {
                const isOpen = openAccordion === faq.id;
                return (
                  <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenAccordion(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span className="faq-q-text">{faq.question}</span>
                      <span className="faq-chevron" aria-hidden="true">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${faq.id}`}
                        className="faq-answer-panel"
                        role="region"
                      >
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* G. Contact Form */}
        <div className="subsection">
          <div className="contact-wrapper">
            <div className="contact-sidebar">
              <span className="section-kicker">GET IN TOUCH</span>
              <h3>Contact the Project Team</h3>
              <p>
                Have questions, suggestions for additional data registries, or UX feedback?
                Submit a note to the DawaWise development team.
              </p>
              <div className="contact-info-list">
                <div className="c-item">
                  <Mail size={18} />
                  <span>Email: <strong>contact@dawawise.example</strong> (Demo)</span>
                </div>
                <div className="c-item">
                  <Database size={18} />
                  <span>Data Inquiries: <strong>data@dawawise.example</strong> (Demo)</span>
                </div>
              </div>
              <div className="contact-disclaimer-box">
                <Info size={16} />
                <span>
                  <strong>Prototype Notice:</strong> This contact form validates client-side input and demonstrates the submission cycle. Live email dispatch will be configured with our backend release.
                </span>
              </div>
            </div>

            <div className="contact-form-pane">
              {submitSuccess ? (
                <div className="submit-success-card" role="status">
                  <div className="success-icon"><CheckCircle2 size={36} /></div>
                  <h4>Demonstration Submission Confirmed!</h4>
                  <p>
                    Thank you, <strong>{formData.fullName}</strong>. Your message regarding <em>&quot;{formData.subject}&quot;</em> has been validated successfully in the client interface.
                  </p>
                  <p className="success-sub">
                    (Note: In this frontend demonstration, no actual email was transmitted over the wire.)
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleResetForm}
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleFormSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor={nameInputId}>Full Name <span className="required">*</span></label>
                    <input
                      id={nameInputId}
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Kumar / Ananya Sharma"
                      aria-invalid={Boolean(formErrors.fullName)}
                      aria-describedby={formErrors.fullName ? 'name-error' : undefined}
                      className={formErrors.fullName ? 'input-error' : ''}
                    />
                    {formErrors.fullName && (
                      <span id="name-error" className="error-message" role="alert">
                        <AlertTriangle size={13} /> {formErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={emailInputId}>Email Address <span className="required">*</span></label>
                    <input
                      id={emailInputId}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. yourname@domain.com"
                      aria-invalid={Boolean(formErrors.email)}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                      className={formErrors.email ? 'input-error' : ''}
                    />
                    {formErrors.email && (
                      <span id="email-error" className="error-message" role="alert">
                        <AlertTriangle size={13} /> {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={subjectInputId}>Subject <span className="required">*</span></label>
                    <select
                      id={subjectInputId}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      aria-invalid={Boolean(formErrors.subject)}
                      aria-describedby={formErrors.subject ? 'subject-error' : undefined}
                      className={formErrors.subject ? 'input-error' : ''}
                    >
                      <option value="">Select an enquiry category...</option>
                      <option value="General Question">General Question about DawaWise</option>
                      <option value="Data Source Feedback">Data Source or Price Registry Feedback</option>
                      <option value="Prescription Demo">Prescription Upload Feature Feedback</option>
                      <option value="Partnership / Academic">Partnership or Academic Research</option>
                      <option value="Report Bug">Report a Website Display Issue</option>
                    </select>
                    {formErrors.subject && (
                      <span id="subject-error" className="error-message" role="alert">
                        <AlertTriangle size={13} /> {formErrors.subject}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={messageInputId}>Message <span className="required">*</span></label>
                    <textarea
                      id={messageInputId}
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please detail your question or observation here..."
                      aria-invalid={Boolean(formErrors.message)}
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                      className={formErrors.message ? 'input-error' : ''}
                    />
                    {formErrors.message && (
                      <span id="message-error" className="error-message" role="alert">
                        <AlertTriangle size={13} /> {formErrors.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group checkbox-group">
                    <label htmlFor={consentInputId} className="checkbox-label">
                      <input
                        id={consentInputId}
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        aria-invalid={Boolean(formErrors.consent)}
                      />
                      <span>I understand that DawaWise is an informational demonstration, not a medical or clinical consulting service. <span className="required">*</span></span>
                    </label>
                    {formErrors.consent && (
                      <span className="error-message" role="alert">
                        <AlertTriangle size={13} /> {formErrors.consent}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary form-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Validating &amp; Sending...</span>
                    ) : (
                      <>
                        <span>Submit Demo Query</span> <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* H. Safety Information Note */}
        <div className="medical-disclaimer-card safety-note" role="note">
          <div className="disclaimer-icon-wrap safety">
            <Stethoscope size={28} />
          </div>
          <div className="disclaimer-body">
            <strong>Medical Safety Summary &amp; Professional Guidance</strong>
            <p>
              DawaWise is an informational tool, not a substitute for professional medical advice.
              Do not change prescribed medicines based only on a website comparison. Always consult your doctor or pharmacist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
