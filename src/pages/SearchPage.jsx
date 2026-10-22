import { useEffect, useRef, useState } from "react";
import './SearchPage.css';

const examples = ["paracetamol", "crocin", "metformin 500", "pantoprazole", "amlodipine"];
const initialRecent = ["paracetamol", "metformin 500", "pantoprazole 40", "amlodipine 5", "telmisartan 40"];

function PillIcon() { return <span className="brand-mark" aria-hidden="true"><span /></span>; }
function Header() {
  return <header className="site-header"><a className="brand" href="/" aria-label="DawaWise home"><PillIcon /><span>Dawa<span className="brand-accent">Wise</span></span></a><nav className="main-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/search" aria-current="page">Search</a></nav><span className="source-badge"><span aria-hidden="true">✚</span> Jan Aushadhi Focus</span></header>;
}
function SearchSection({ onSearch }) {
  const [query, setQuery] = useState("");
  function submit(event) { event.preventDefault(); if (query.trim()) onSearch(query.trim()); }
  return <section className="intro-section" aria-labelledby="page-title"><p className="eyebrow">MEDICINE INFORMATION, MADE CLEAR</p><h1 id="page-title">Make Medicine<br className="desktop-break" /> Decisions <span>Wisely.</span></h1><p className="intro-copy">Search medicine details and explore Jan Aushadhi information with clear source and verification labels.</p><form className="search-form" onSubmit={submit}><label className="sr-only" htmlFor="medicine-query">Search medicine, brand or molecule</label><span className="search-icon" aria-hidden="true">⌕</span><input id="medicine-query" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicine, brand or molecule..." autoComplete="off" /><button type="submit" disabled={!query.trim()}>Search <span aria-hidden="true">→</span></button></form><p className="examples"><strong>Try:</strong>{" "}{examples.map((item, i) => <span key={item}><button type="button" onClick={() => onSearch(item)}>{item}</button>{i < examples.length - 1 ? <span className="comma">·</span> : ""}</span>)}</p></section>;
}
function RecentSearches({ searches, onSearch, onClear }) {
  return <section className="recent-section" aria-labelledby="recent-title"><div className="section-heading"><div><span className="section-icon" aria-hidden="true">◷</span><h2 id="recent-title">Recent searches</h2></div>{searches.length > 0 && <button className="text-button" type="button" onClick={onClear}>Clear all</button>}</div>{searches.length === 0 ? <p className="empty-recent">Your searches will appear here.</p> : <div className="recent-chips">{searches.map(item => <button className="recent-chip" key={item} type="button" onClick={() => onSearch(item)}><span aria-hidden="true">⌕</span>{item}</button>)}</div>}</section>;
}

function Detail({ label, value }) { return <div className="medicine-detail"><dt>{label}</dt><dd>{value || "Not listed"}</dd></div>; }
function displayPrice(value) {
  const amount = Number(value);
  return value !== null && value !== undefined && String(value).trim() !== "" && Number.isFinite(amount) && amount > 0
    ? `₹${amount.toFixed(2)}` : "Price unavailable";
}
export function SavingsPanel({ medicine }) {
  const [packsPerMonth, setPacksPerMonth] = useState("");
  const savings = medicine?.net_savings;
  const available = savings?.available === true;
  const packs = Number(packsPerMonth);
  const monthly = available && packsPerMonth !== "" && Number.isFinite(packs) && packs > 0 && packs <= 1000
    ? Number(savings.savings_per_pack) * packs : null;
  const money = value => Number.isFinite(Number(value)) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value)) : "Price unavailable";
  return <section className={`savings-panel ${available ? "savings-verified" : "savings-unverified"}`} aria-label="Medicine price comparison">
    <div className="savings-heading"><span className="savings-icon" aria-hidden="true">{available ? "✓" : "₹"}</span><div><strong>{available ? "Verified price comparison" : "Savings not verified yet"}</strong><p>{savings?.message || "Savings cannot be calculated until both prices and pack comparability are verified."}</p></div></div>
    {available && <div className="savings-figures"><div><span>Savings per comparable pack</span><strong>{money(savings.savings_per_pack)}</strong></div><div><span>Savings percentage</span><strong>{Number(savings.savings_percentage).toFixed(2)}%</strong></div></div>}
    <div className="savings-sources">
      <p><span>Jan Aushadhi price</span><span>{displayPrice(medicine?.jan_aushadhi_price)} · {medicine?.jan_price_status || "status unavailable"}{medicine?.jan_price_date ? ` · ${medicine.jan_price_date}` : ""}{medicine?.jan_price_source_url && <> · <a href={medicine.jan_price_source_url} target="_blank" rel="noreferrer">source</a></>}</span></p>
      <p><span>Branded MRP</span><span>{displayPrice(medicine?.branded_mrp)} · {medicine?.branded_mrp_status || "status unavailable"}{medicine?.branded_mrp_date ? ` · ${medicine.branded_mrp_date}` : ""}{medicine?.branded_mrp_source_url && <> · <a href={medicine.branded_mrp_source_url} target="_blank" rel="noreferrer">source</a></>}</span></p>
      {medicine?.market_mrp && <p><span>Observed market price</span><span>{displayPrice(medicine.market_mrp)} · {medicine?.market_price_status || "status unavailable"}{medicine?.market_price_date ? ` · ${medicine.market_price_date}` : ""}{medicine?.market_price_source_url && <> · <a href={medicine.market_price_source_url} target="_blank" rel="noreferrer">source</a></>}</span></p>}
    </div>
    {available && <div className="monthly-estimate"><label htmlFor="packs-per-month">Estimated comparable packs per month (optional)</label><input id="packs-per-month" type="number" min="0.01" max="1000" step="0.01" inputMode="decimal" value={packsPerMonth} onChange={event => setPacksPerMonth(event.target.value)} placeholder="Enter packs per month"/>{monthly !== null && <p>Estimated monthly savings: <strong>{money(monthly)}</strong></p>}<small>Estimate uses only the pack count you enter; it is not medicine-use guidance.</small></div>}
  </section>;
}
function SearchResultDialog({ query, result, loading, onClose, onRetry, onChooseCandidate }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!query) return;
    const previousFocus = document.activeElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener("keydown", onKey); if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, [query]);
  if (!query) return null;
  const medicine = result?.medicine;
  const status = result?.status;
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title" aria-busy={loading}>
    <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button><p className="eyebrow">DAWAWISE SEARCH</p><h2 id="result-title">{loading ? "Searching catalogue" : medicine?.name || "Search result"}</h2><p className="query-pill">{query}</p>
    {loading && <div className="loading-state" role="status"><span className="loading-spinner" aria-hidden="true"/><strong>Searching medicine catalogue…</strong><span>Checking possible matches…</span></div>}
    {!loading && status === "matched" && <><div className={`match-banner ${result.match_source === "openrouter" ? "ai-banner" : ""}`}><strong>{result.match_source === "openrouter" ? "AI-assisted match — verify medicine details" : "Catalogue match"}</strong><span>{medicine?.verification_status || "Dataset record"}{medicine?.as_of_date ? ` · data date ${medicine.as_of_date}` : ""}</span></div><dl className="medicine-details"><Detail label="Generic / molecule" value={medicine?.generic_name}/><Detail label="Ingredients as listed" value={medicine?.ingredients}/><Detail label="Brand name" value={medicine?.branded_product_name}/><Detail label="Strength" value={medicine?.strength}/><Detail label="Dosage form" value={medicine?.dosage_form}/><Detail label="Pack size" value={medicine?.pack_size}/><Detail label="Observed market price" value={`${displayPrice(medicine?.market_mrp)} (${medicine?.market_price_status || "status unavailable"})`}/></dl><SavingsPanel medicine={medicine}/>{result.match_source === "openrouter" && <p className="notice-box">Please verify the medicine name, ingredients, strength, dosage form and pack before relying on this match.</p>}</>}
    {!loading && status === "clarification_required" && <><p className="dialog-message">{result.question || "Please choose the intended catalogue item."}</p><div className="choice-list">{(result.candidates || []).map((item, i) => <button type="button" className="choice-card" key={item.candidate_id || `${item.name}-${i}`} onClick={() => onChooseCandidate(item)}><strong>{item.name || "Catalogue item"}</strong><span>{[item.ingredients || item.generic_name, item.strength, item.dosage_form, item.pack_size].filter(Boolean).join(" · ")}</span></button>)}</div><p className="helper-text">Choosing a row confirms that exact catalogue record.</p></>}
    {!loading && status === "not_found" && <div className="notice-box">No reliable catalogue match found. Edit your query and try again.</div>}
    {!loading && status === "error" && <div className="notice-box">{result.message || "Medicine search is temporarily unavailable."}</div>}
    {!loading && (status === "not_found" || status === "error") && <button className="primary-button" type="button" onClick={onRetry}>Retry search</button>}
    {!loading && status === "matched" && <p className="medical-note">Medicine information only. This is not prescribing advice; do not start, stop or substitute medication based on this search.</p>}
  </section></div>;
}

export default function SearchPage() {
  const [recent, setRecent] = useState(initialRecent);
  const [activeQuery, setActiveQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);
  async function search(query) {
    const clean = query.trim(); if (!clean) return;
    const id = ++requestRef.current;
    setActiveQuery(clean); setResult(null); setLoading(true);
    setRecent(current => [clean, ...current.filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
    try {
      const response = await fetch("http://localhost:8000/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: clean }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Medicine search is temporarily unavailable.");
      if (requestRef.current === id) setResult(body);
    } catch (error) {
      if (requestRef.current === id) setResult({ status: "error", message: error.message || "Medicine search is temporarily unavailable." });
    } finally { if (requestRef.current === id) setLoading(false); }
  }
  function close() { requestRef.current += 1; setActiveQuery(""); setLoading(false); }
  function chooseCandidate(medicine) { requestRef.current += 1; setLoading(false); setResult({ status: "matched", match_source: "csv", medicine, requires_confirmation: false }); }
  return <div className="app-shell"><Header/><main className="page-content"><SearchSection onSearch={search}/><RecentSearches searches={recent} onSearch={search} onClear={() => setRecent([])}/></main><footer className="site-footer"><p>Medicine information only. Confirm medication changes with a qualified pharmacist or prescriber.</p></footer><SearchResultDialog query={activeQuery} result={result} loading={loading} onClose={close} onRetry={() => search(activeQuery)} onChooseCandidate={chooseCandidate}/></div>;
}
