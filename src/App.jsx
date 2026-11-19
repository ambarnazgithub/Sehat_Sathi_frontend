import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  HeartPulse,
  History,
  Languages,
  Loader2,
  Lock,
  Menu,
  MessageSquareText,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/health`;



const SAMPLE_PROMPTS = [
  "Mujhe 2 din se tez bukhar aur thand lag rahi hai",
  "Severe headache with sensitivity to light since morning",
  "Khansi aur gale me dard hai, sans lene me koi dikkat nahi",
  "Mild chest congestion and persistent dry cough",
  "Pet me dard aur subah se vomiting feel ho rahi hai",
];

const FAQS = [
  {
    q: "Kya Sehat Saathi doctor ka mutabadil (replacement) hai?",
    a: "Hargiz nahi. Sehat Saathi ek AI triage aur informational tool hai jo aapko symptoms samajhne aur sahi waqt par doctor se rujoo karne me rehnumai deta hai.",
  },
  {
    q: "Kya mera health data safe aur private hai?",
    a: "Ji haan, aapki query confidential hoti hai aur hum personal identity logs ko kisi third-party service ke sath share nahi karte.",
  },
  {
    q: "Emergency ki soorat me kya karna chahiye?",
    a: "Agar severe chest pain, behoshi, ya shadeed saans ki takleef ho to foran Rescue 1122 ya nazdeeki emergency room se raabta karein.",
  },
];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (section) => {
    setMobileMenu(false);
    setActiveSection(section);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to analyze symptoms.");
      }

      setResult(data.data);
      setActiveSection("analyzer");
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/history`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load history.");
      }
      setHistory(data.data || []);
      setActiveSection("history");
      setTimeout(() => {
        document.getElementById("history")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load history. Backend might be down.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const startNewAnalysis = () => {
    setSymptoms("");
    setResult(null);
    setError("");
    scrollToSection("analyzer");
  };

  const getUrgencyStyles = (urgency) => {
    if (urgency === "Emergency") {
      return {
        wrapper: "border-red-300 bg-red-50/90 shadow-red-500/10",
        icon: "bg-red-100 text-red-600 ring-4 ring-red-100/50",
        text: "text-red-700",
        badge: "bg-red-600 text-white shadow-md shadow-red-600/30",
        border: "border-red-200",
      };
    }
    if (urgency === "Doctor Visit") {
      return {
        wrapper: "border-amber-300 bg-amber-50/90 shadow-amber-500/10",
        icon: "bg-amber-100 text-amber-700 ring-4 ring-amber-100/50",
        text: "text-amber-800",
        badge: "bg-amber-600 text-white shadow-md shadow-amber-600/30",
        border: "border-amber-200",
      };
    }
    return {
      wrapper: "border-emerald-300 bg-emerald-50/90 shadow-emerald-500/10",
      icon: "bg-emerald-100 text-emerald-700 ring-4 ring-emerald-100/50",
      text: "text-emerald-800",
      badge: "bg-emerald-700 text-white shadow-md shadow-emerald-700/30",
      border: "border-emerald-200",
    };
  };

  const urgencyStyles = result
    ? getUrgencyStyles(result.urgency)
    : getUrgencyStyles("Home Care");

  return (
    <div className="min-h-screen bg-[#fafcfb] text-[#0f2d33] selection:bg-teal-500 selection:text-white">
      {/* PAKISTAN EMERGENCY HELPLINE TICKER */}
      <aside aria-label="Emergency helpline" className="bg-[#b91c1c] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <ShieldAlert size={14} className="animate-pulse" />
          <span>Medical Emergency in Pakistan? Call</span>
          <a href="tel:1122" className="rounded bg-white/20 px-1.5 py-0.5 font-bold underline">Rescue 1122</a>
          <span>or</span>
          <a href="tel:115" className="rounded bg-white/20 px-1.5 py-0.5 font-bold underline">Edhi 115</a>
        </div>
      </aside>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fafcfb]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            onClick={() => scrollToSection("home")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0f766e] to-[#14b8a6] text-white shadow-md shadow-teal-900/15 transition group-hover:scale-105">
              <HeartPulse size={24} />
            </div>
            <div className="text-left">
              <div className="text-xl font-black tracking-tight text-[#0f2d33]">
                Sehat Saathi
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f766e]">
                AI Health Companion
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {["home", "how-it-works", "features", "faq"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm font-semibold capitalize transition hover:text-[#0f766e] ${
                  activeSection === item ? "text-[#0f766e]" : "text-slate-600"
                }`}
              >
                {item.replace("-", " ")}
              </button>
            ))}

            <button
              onClick={loadHistory}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-[#0f766e]"
            >
              <History size={16} />
              History
            </button>

            <button
              onClick={() => scrollToSection("analyzer")}
              className="group flex items-center gap-2 rounded-full bg-[#0f2d33] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0f2d33]/15 transition hover:bg-[#14444d]"
            >
              <Zap size={14} className="text-teal-400" />
              Check Symptoms
            </button>
          </nav>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 md:hidden"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-6 py-6 md:hidden">
            <div className="flex flex-col gap-4 font-semibold text-slate-700">
              <button onClick={() => scrollToSection("home")} className="text-left">Home</button>
              <button onClick={() => scrollToSection("how-it-works")} className="text-left">How It Works</button>
              <button onClick={() => scrollToSection("features")} className="text-left">Features</button>
              <button onClick={() => scrollToSection("faq")} className="text-left">FAQs</button>
              <button onClick={loadHistory} className="flex items-center gap-2 text-left">
                <History size={18} /> History
              </button>
              <button
                onClick={() => scrollToSection("analyzer")}
                className="mt-2 rounded-xl bg-[#0f2d33] py-3 text-center text-white"
              >
                Start Symptom Check
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative overflow-hidden px-5 pb-20 pt-10 lg:px-8 lg:pb-32 lg:pt-20"
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-[400px] w-[400px] rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            

            <h1 className="text-4xl font-extrabold tracking-tight text-[#0f2d33] sm:text-5xl lg:text-6xl">
              Get clarity on your symptoms{" "}
              <span className="bg-gradient-to-r from-[#0f766e] to-[#0d9488] bg-clip-text text-transparent">
                in seconds.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Apni takleef aam zaban me likhein. Sehat Saathi provides instant,
              responsible AI health analysis in English, Urdu aur Roman Urdu.
            </p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <button
                onClick={() => scrollToSection("analyzer")}
                className="group flex items-center justify-center gap-2.5 rounded-2xl bg-[#0f2d33] px-7 py-4 font-bold text-white shadow-xl shadow-[#0f2d33]/20 transition hover:-translate-y-0.5 hover:bg-[#14444d]"
              >
                Start Symptom Check
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>

              <button
                onClick={loadHistory}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-[#0f766e]"
              >
                <History size={18} />
                Saved History
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6">
              <div>
                <p className="text-2xl font-black text-[#0f2d33]">100%</p>
                <p className="text-xs font-semibold text-slate-500">Free to Use</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#0f766e]">Roman Urdu</p>
                <p className="text-xs font-semibold text-slate-500">& English Ready</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#0f2d33]">3-Tier</p>
                <p className="text-xs font-semibold text-slate-500">Urgency Triage</p>
              </div>
            </div>
          </div>

          {/* INTERACTIVE HERO CARD PREVIEW */}
          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-teal-900/10 backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-400">Live AI Assessment</span>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-[#0f766e]">v1.0</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User Query</p>
                  <p className="mt-1 italic">"Gala kharab hai aur kal raat se 101 fever araha hai..."</p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase text-emerald-600">Urgency Level</p>
                      <p className="text-lg font-black text-emerald-900">Doctor Visit Recommended</p>
                    </div>
                    <Stethoscope size={28} className="text-emerald-600" />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                    High fever with severe throat irritation warrants a physical exam to check for viral vs bacterial infection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-slate-200/90 bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <TrustItem
            icon={<Languages size={22} />}
            title="Multi-lingual & Roman Urdu"
            description="Type comfortably in Roman Urdu, Urdu, or plain English."
          />
          <TrustItem
            icon={<ShieldCheck size={22} />}
            title="Safe & Non-Diagnostic"
            description="Constructive guidance without dangerous medical prescriptions."
          />
          <TrustItem
            icon={<Lock size={22} />}
            title="Private & Anonymous"
            description="Analyze your concerns with zero mandatory registration."
          />
        </div>
      </section>

      {/* SYMPTOM ANALYZER */}
      <section id="analyzer" className="scroll-mt-20 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0f766e]">
              <Stethoscope size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0f2d33] sm:text-4xl">
              Describe Your Health Symptoms
            </h2>
            <p className="mt-3 text-slate-600">
              Provide as much detail as possible (duration, pain level, specific feeling).
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            {/* Quick Chips */}
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Examples (Click to test):</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptoms(prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-400 hover:bg-teal-50/50 hover:text-[#0f766e]"
                  >
                    + {prompt.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={symptoms}
                onChange={(e) => {
                  setSymptoms(e.target.value);
                  if (error) setError("");
                }}
                rows={5}
                placeholder="Misal: Mujhe 3 din se gala kharab hai, halka bukhar hai aur badan dard kar raha hai..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-[#f9fbfa] p-5 text-base leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
              {symptoms && (
                <button
                  type="button"
                  onClick={() => setSymptoms("")}
                  className="absolute right-4 top-4 rounded-lg bg-slate-200/70 p-1 text-slate-600 hover:bg-slate-300"
                  title="Clear text"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{symptoms.length} characters</span>
              <span>English, Roman Urdu, or Urdu supported</span>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                <TriangleAlert size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400 sm:max-w-xs">
                Sehat Saathi guidance is algorithmic and informational. Not a replacement for a doctor.
              </p>

              <button
                onClick={analyzeSymptoms}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0f2d33] px-8 py-4 font-bold text-white shadow-lg shadow-[#0f2d33]/20 transition hover:bg-[#14444d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    Analyze Now
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RESULT CARD */}
          {result && (
            <div id="result" className="mt-12 scroll-mt-24">
              <div className={`rounded-3xl border-2 p-6 sm:p-8 ${urgencyStyles.wrapper} ${urgencyStyles.border}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${urgencyStyles.icon}`}>
                      <HeartPulse size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgency Assessment</p>
                      <h3 className={`text-2xl font-black ${urgencyStyles.text}`}>{result.urgency}</h3>
                    </div>
                  </div>
                  <span className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${urgencyStyles.badge}`}>
                    {result.urgency}
                  </span>
                </div>

                <div className="mt-6 rounded-2xl bg-white/90 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Reasoning</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-800">{result.urgencyReason}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <ResultCard icon={<MessageSquareText size={20} />} title="Identified Symptoms">
                  <ul className="space-y-2.5">
                    {(result.symptoms || []).map((item, index) => (
                      <li key={index} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </ResultCard>

                <ResultCard icon={<Stethoscope size={20} />} title="Recommended Specialist">
                  <p className="text-xs text-slate-400">Consultation suggested with:</p>
                  <div className="mt-3 inline-block rounded-xl bg-teal-50 px-4 py-2.5 text-base font-bold text-[#0f766e]">
                    {result.possibleSpecialist}
                  </div>
                </ResultCard>

                <ResultCard icon={<Brain size={20} />} title="Possible Considerations">
                  <div className="flex flex-wrap gap-2">
                    {(result.possibleConditions || []).map((item, index) => (
                      <span key={index} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </ResultCard>

                <ResultCard icon={<CheckCircle2 size={20} />} title="Immediate Self-Care Steps">
                  <ul className="space-y-2">
                    {(result.advice || []).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0f766e]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              </div>

              {result.disclaimer && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-700">Medical Notice: </span>
                  {result.disclaimer}
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={startNewAnalysis}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Start Another Check
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-slate-200 bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Simple 3 Steps</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#0f2d33] sm:text-4xl">How Sehat Saathi Works</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <StepCard number="01" icon={<MessageSquareText size={22} />} title="Describe Symptoms" description="Explain what you are going through in regular words or audio transcript." />
            <StepCard number="02" icon={<Brain size={22} />} title="AI Reasoning" description="Our engine scans key signs, urgency metrics, and potential red flags." />
            <StepCard number="03" icon={<HeartPulse size={22} />} title="Actionable Guidance" description="Get clarity on home care steps or when to immediately see a doctor." />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#0f2d33] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Responsible Design</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Engineered for Safe Healthcare Access</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<Brain size={20} />} title="Clinical NLP" description="Understands complex colloquial terms used across Pakistan." />
            <FeatureCard icon={<ShieldCheck size={20} />} title="Zero Prescriptions" description="Avoids illegal automated medication prescriptions." />
            <FeatureCard icon={<History size={20} />} title="Local Storage" description="Review previous sessions stored securely in your MongoDB history." />
            <FeatureCard icon={<Clock3 size={20} />} title="Rapid Triage" description="Get responses in under 3 seconds using fast LLM endpoints." />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#0f2d33]">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-slate-500">Aam tor par pooche janay walay sawalat</p>
          </div>
          <div className="mt-10 space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-[#0f2d33]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`transition ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY SECTION */}
      <section id="history" className="border-t border-slate-200 bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0f2d33]">Previous Health Records</h2>
              <p className="text-sm text-slate-500">History saved across your sessions</p>
            </div>
            <button
              onClick={loadHistory}
              disabled={historyLoading}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {historyLoading ? <Loader2 size={16} className="animate-spin" /> : <History size={16} />}
              Refresh History
            </button>
          </div>

          {history.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <History size={32} className="mx-auto text-slate-400" />
              <p className="mt-3 font-semibold text-slate-700">No prior checkups found</p>
              <button
                onClick={() => scrollToSection("analyzer")}
                className="mt-4 rounded-xl bg-[#0f2d33] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Analyze Symptoms Now
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {history.map((item) => (
                <div key={item._id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-[#0f766e]">
                        {item.urgency}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-700">{item.userSymptoms}</p>
                  </div>
                  <button
                    onClick={() => {
                      setResult(item);
                      setSymptoms(item.userSymptoms || "");
                      scrollToSection("analyzer");
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0f766e]"
                  >
                    View Result <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-[#fafcfb] px-5 py-8 text-center text-xs text-slate-500">
        <p className="font-bold text-[#0f2d33]">Sehat Saathi — Responsible AI Triage for Pakistan</p>
        <p className="mt-1">For educational and guidance purposes only.</p>
      </footer>
    </div>
  );
}

function TrustItem({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0f766e]">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#0f2d33]">{title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function StepCard({ number, icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-[#f9fbfa] p-7 transition hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0f766e] shadow-sm">
          {icon}
        </div>
        <span className="text-sm font-black text-slate-300">{number}</span>
      </div>
      <h3 className="mt-6 text-lg font-bold text-[#0f2d33]">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
        {icon}
      </div>
      <h4 className="mt-4 font-bold text-white">{title}</h4>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">{description}</p>
    </div>
  );
}

function ResultCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
          {icon}
        </div>
        <h4 className="font-bold text-[#0f2d33]">{title}</h4>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default App;