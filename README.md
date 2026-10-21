# DawaWise 💊

### Make Medicine Decisions Wisely

DawaWise is a medicine-information and price-comparison project designed to help users search for medicines, explore generic alternatives listed in the catalogue, and understand medicine pricing with clear source and verification labels.

## 🚀 Core Features

* **Medicine Search:** Search using a medicine name, brand, or active ingredient.
* **CSV-First Lookup:** Search the local medicine catalogue before calling an AI model.
* **AI-Assisted Search:** Use an LLM to interpret misspellings and ambiguous queries when local search cannot find a confident match.
* **Result Popup:** Display medicine details, available prices, data sources, and verification status in a modal.
* **Transparent Pricing:** Show unavailable or unverified prices clearly rather than inventing values.
* **Future Scope:** Prescription text extraction and additional verified medicine catalogues.

## 🧠 AI Architecture

DawaWise uses two separate AI workflows for medicine search and prescription processing.

### 1. OpenRouter — Intelligent Medicine Search

**Model:** NVIDIA Nemotron 3 Ultra 550B (`nvidia/nemotron-3-ultra-550b-a55b`)

OpenRouter is used as the AI gateway for interpreting user-entered medicine queries when local catalogue search cannot confidently find a match.

Responsibilities:

* Interpret misspelled medicine names and ambiguous queries.
* Help identify possible medicine matches from existing catalogue candidates.
* Support clarification when multiple medicines could match the input.

**Workflow:**

`User Input → Local CSV Search → OpenRouter / Nemotron Fallback → Catalogue Validation → Result Popup`

The CSV remains the source of truth. Nemotron must not invent medicine records, prices, or verified medical facts.

### 2. Google Gemma — Prescription Understanding

Gemma is intended for prescription image understanding and structured text extraction.

Responsibilities:

* Process an uploaded prescription image.
* Extract visible medicine names and available details such as strength, dosage form, and written dosage instructions.
* Return structured extraction results for user review.
* Help prepare extracted medicine names for catalogue matching.

**Workflow:**

`Prescription Image → Gemma → Structured Extraction → User Verification → Medicine Catalogue Search → Result Popup`

Prescription handwriting may be unclear or ambiguous. The application must show uncertain fields for confirmation and must not guess missing dosage instructions or silently substitute medicines.

### 🔒 Validation and Safety

Both AI workflows are assistive rather than authoritative.

* All medicine matches must be validated against the available catalogue.
* Prices must come from the dataset or verified sources, never from model-generated estimates.
* Users must review prescription extraction before proceeding.
* Different strengths, ingredients, dosage forms, and combinations must not be silently treated as equivalent.
* Prescription interpretation does not replace advice from a qualified healthcare professional.

### ⚙️ Configuration

Keep API credentials on the backend. Use environment variables for provider configuration, and never expose secret keys in frontend code.

The OpenRouter model ID and the selected Gemma deployment must be configured explicitly in the backend. The Gemma inference provider and exact model ID will depend on the deployment selected for the project.

## 🏗️ Technology Stack 

| Component            | Technology             |
| -------------------- | ---------------------- |
| Frontend             | React, Vite            |
| Backend              | Python, FastAPI        |
| Catalogue processing | Pandas, CSV            |
| AI gateway           | OpenRouter             |
| Language model       | Gemma, when configured |
| Configuration        | Environment variables  |

## 🔎 Search Workflow

1. The user enters a medicine query and submits it.
2. FastAPI searches the local catalogue.
3. If a confident match exists, the catalogue record is returned directly.
4. Otherwise, the backend can call the configured OpenRouter model to interpret the query and suggest possible catalogue matches.
5. The backend validates any suggestion against the original dataset.
6. The frontend displays the result, clarification request, or not-found message in a popup.

## ⚙️ Local Setup

### 1. Frontend

From the project root:

```bash
npm install
npm run dev
```

### 2. Python Backend

Create a virtual environment:

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies and start FastAPI:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The frontend and backend should run in separate terminals.

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:8000`
* API documentation: `http://localhost:8000/docs`

Adjust these commands if the actual project structure differs.

## 🔐 Environment Configuration

Store the OpenRouter API key on the backend only.

Example `.env`:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Never commit real API keys to version control. Add `.env` to `.gitignore` and provide a `.env.example` without secrets.

## 🛡️ Data Integrity and Safety

* Catalogue records are the source of truth for listed medicine details and prices.
* AI output is a search aid, not a verified medical source.
* Missing prices must be displayed as unavailable.
* Savings should only be calculated using verified, comparable prices and pack sizes.
* Different strengths, ingredients, and dosage forms must not be silently treated as equivalent.
* DawaWise provides medicine information and is not a substitute for a qualified healthcare professional.

## 🗺️ Roadmap

* [ ] Complete CSV-backed medicine search
* [ ] Configure OpenRouter model fallback
* [ ] Add query clarification and result validation
* [ ] Finish responsive result modal
* [ ] Verify catalogue prices against current official sources
* [ ] Add prescription extraction with user confirmation
* [ ] Expand regional catalogue and currency support where verified data is available

---

**DawaWise — Clearer medicine information. More transparent decisions.**
