/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Code, 
  MessageSquare, 
  ChevronLeft, 
  Zap,
  Globe,
  Settings,
  Terminal
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Constants (Urdu Content) ---

const CONTENT = {
  hero: {
    title: "گوگل اے آئی اسٹوڈیو کے ساتھ ایپس بنائیں",
    subtitle: "جدید ترین آرٹیفیشل انٹیلیجنس ماڈلز (Gemini) کو اپنی ایپلی کیشنز میں ضم کرنے کا سب سے آسان طریقہ۔",
    cta: "ابھی شروع کریں"
  },
  sections: [
    {
      id: 'intro',
      title: "گوگل اے آئی اسٹوڈیو کیا ہے؟",
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      text: "گوگل اے آئی اسٹوڈیو ایک براؤزر بیسڈ ٹول ہے جو ڈویلپرز کو گوگل کے طاقتور ترین اے آئی ماڈلز (Gemini) کے ساتھ تیزی سے پروٹو ٹائپنگ اور ایپس بنانے کی اجازت دیتا ہے۔ یہ بالکل مفت ہے اور اس کے ذریعے آپ آسانی سے API کی حاصل کر سکتے ہیں۔"
    },
    {
      id: 'features',
      title: "اہم خصوصیات",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      features: [
        { name: "Gemini 1.5 Pro & Flash", desc: "دنیا کے جدید ترین ملٹی موڈل ماڈلز تک رسائی۔" },
        { name: "Long Context Window", desc: "لاکھوں ٹوکنز کے ڈیٹا کو ایک ساتھ پراسیس کرنے کی صلاحیت۔" },
        { name: "System Instructions", desc: "ماڈل کے رویے کو اپنی ضرورت کے مطابق ڈھالیں۔" },
        { name: "Structured Output", desc: "JSON فارمیٹ میں جوابات حاصل کریں تاکہ کوڈ میں استعمال آسان ہو۔" }
      ]
    },
    {
      id: 'steps',
      title: "ڈویلپمنٹ کا طریقہ",
      icon: <Terminal className="w-6 h-6 text-green-500" />,
      steps: [
        "1. aistudio.google.com پر لاگ ان کریں",
        "2. اپنا پامپٹ (Prompt) لکھیں اور ٹیسٹ کریں",
        "3. Get Code بٹن دبائیں اور اپنی پسند کی زبان (Python, JS, Node.js) منتخب کریں",
        "4. API Key حاصل کریں اور اسے اپنے پروجیکٹ میں استعمال کریں"
      ]
    }
  ]
};

// --- Components ---

function ChatInterface() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "سلام! میں گوگل اے آئی اسٹوڈیو کا اردو اسسٹنٹ ہوں۔ آپ مجھ سے ڈویلپمنٹ کے بارے میں کچھ بھی پوچھ سکتے ہیں۔" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "آپ گوگل اے آئی اسٹوڈیو کے ماہر اسسٹنٹ ہیں۔ آپ کا کام ڈویلپرز کی اردو میں مدد کرنا ہے۔ ہمیشہ مددگار، دوستانہ اور تکنیکی طور پر درست جواب اردو میں دیں۔",
        },
        contents: userMessage,
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "معذرت، میں ابھی جواب نہیں دے سکا۔" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f12] rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col h-[500px]">
      <div className="p-5 bg-gradient-to-r from-amber-500/20 to-transparent border-b border-white/5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold urdu-text">اے آئی معاون (AI Assistant)</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0a0b]/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-amber-500/10 text-amber-100 border border-amber-500/20 rounded-tr-none' 
                : 'bg-[#1a1a1e] text-slate-200 shadow-sm border border-white/5 rounded-tl-none'
            }`}>
              <div className="urdu-text text-sm markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-[#1a1a1e] p-4 rounded-2xl shadow-sm border border-white/5 animate-pulse">
              <span className="text-slate-400 font-urdu">لکھ رہا ہے...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0f0f12] flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اپنا سوال یہاں لکھیں..."
          className="flex-1 px-5 py-3 bg-[#1a1a1e] text-white border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-urdu text-right"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-amber-500 text-black p-3 rounded-full hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <div className="min-h-screen bg-sophisticated-gradient text-slate-300 font-sans selection:bg-amber-500/30">
      {/* --- Header --- */}
      <nav className="sticky top-0 z-50 bg-[#0f0f12]/80 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-black font-bold text-2xl shadow-lg shadow-orange-900/20">
            AI
          </div>
          <div className="flex flex-col">
            <span className="font-urdu font-bold text-xl text-white">گوگل اے آئی اسٹوڈیو</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">ایپ ڈویلپمنٹ پورٹل</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://aistudio.google.com" target="_blank" className="text-sm font-urdu font-medium text-slate-400 hover:text-amber-500 transition-colors">
            اسٹوڈیو پر جائیں
          </a>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* --- Right Column: Content --- */}
          <div className="space-y-16">
            <header className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-amber-500"
              >
                <div className="h-[1px] w-8 bg-amber-500/50"></div>
                <span className="text-xs uppercase tracking-[0.3em] font-bold">جدید مصنوعی ذہانت</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl lg:text-7xl font-bold font-urdu leading-tight text-white"
              >
                گوگل اے آئی اسٹوڈیو کے ذریعے <span className="text-amber-500">اردو ایپس</span> کی تیاری
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl urdu-text text-slate-400 max-w-lg leading-relaxed"
              >
                {CONTENT.hero.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-6"
              >
                <button className="bg-white text-black px-10 py-4 rounded-full font-urdu font-bold text-lg hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/20 transition-all transform active:scale-95">
                  {CONTENT.hero.cta}
                </button>
                <button className="border border-white/10 bg-white/5 text-white px-10 py-4 rounded-full font-urdu font-medium text-lg hover:bg-white/10 transition-all">
                  ٹیوٹیوریل دیکھیں
                </button>
              </motion.div>
            </header>

            <section className="space-y-10">
              <div className="flex border-b border-white/5">
                {CONTENT.sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    className={`px-8 py-4 font-urdu font-bold transition relative ${
                      activeTab === s.id ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s.title}
                    {activeTab === s.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" 
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-8 bg-[#0f0f12] rounded-3xl shadow-xl border border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16"></div>
                    
                    {activeTab === 'intro' && (
                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            {CONTENT.sections.find(s => s.id === 'intro')?.icon}
                          </div>
                          <h3 className="font-urdu font-bold text-2xl text-white">{CONTENT.sections.find(s => s.id === 'intro')?.title}</h3>
                        </div>
                        <p className="urdu-text text-slate-400 leading-relaxed text-lg">
                          {CONTENT.sections.find(s => s.id === 'intro')?.text}
                        </p>
                      </div>
                    )}

                    {activeTab === 'features' && (
                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            {CONTENT.sections.find(s => s.id === 'features')?.icon}
                          </div>
                          <h3 className="font-urdu font-bold text-2xl text-white">{CONTENT.sections.find(s => s.id === 'features')?.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {CONTENT.sections.find(s => s.id === 'features')?.features?.map((f, i) => (
                            <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                              <h4 className="font-bold text-amber-400 group-hover:text-amber-300 transition-colors">{f.name}</h4>
                              <p className="font-urdu text-sm text-slate-400 mt-2">{f.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'steps' && (
                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                            {CONTENT.sections.find(s => s.id === 'steps')?.icon}
                          </div>
                          <h3 className="font-urdu font-bold text-2xl text-white">{CONTENT.sections.find(s => s.id === 'steps')?.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {CONTENT.sections.find(s => s.id === 'steps')?.steps?.map((step, i) => (
                            <div key={i} className="flex gap-5 items-center p-4 bg-white/5 rounded-2xl border border-white/5 urdu-text text-slate-300 group hover:bg-white/10 transition-all">
                              <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                {i + 1}
                              </div>
                              <span className="text-lg">{step.split('. ')[1]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* --- Left Column: AI Assistant --- */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <ChatInterface />
            
            <div className="p-10 bg-[#0f0f12] rounded-3xl text-white border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] -mr-40 -mt-40"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-full border-[8px] border-white/5 flex items-center justify-center">
                   <Globe className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-3xl font-bold font-serif italic text-white">عالمی معیار کی ڈویلپمنٹ</h3>
                <p className="urdu-text text-slate-400 text-lg leading-relaxed">
                  اردو میں سیکھیں اور عالمی مارکیٹ کے لیے ایپس بنائیں۔ گوگل اے آئی اسٹوڈیو ہر قدم پر آپ کے ساتھ ہے۔
                </p>
                <div className="pt-4 border-t border-white/5 flex items-center gap-4 text-xs font-mono text-amber-500 uppercase tracking-widest">
                  <Terminal className="w-4 h-4" />
                  <span>gemini-sdk v1.5 flash</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-32 border-t border-white/5 py-12 px-8 bg-[#0f0f12]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-medium">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
            <span className="font-urdu text-xs tracking-normal">گوگل ڈویلپر کمیونٹی کے تعاون سے</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-amber-500 transition-colors">تحریری گائیڈ</a>
            <a href="#" className="hover:text-amber-500 transition-colors">ٹیوٹوریلز</a>
            <a href="#" className="hover:text-amber-500 transition-colors">بلاگز</a>
          </div>
          <p className="font-urdu text-xs tracking-normal opacity-50">جملہ حقوق محفوظ ہیں © {new Date().getFullYear()}گوگل اے آئی اسٹوڈیو اردو</p>
        </div>
      </footer>
    </div>
  );
}

