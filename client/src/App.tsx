import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, AlertTriangle, ShieldQuestion, ServerCrash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [arbitrations, setArbitrations] = useState<any[]>([]);
  const [promptInput, setPromptInput] = useState('What is the capital of France and explain its history in two sentences?');
  const [outputInput, setOutputInput] = useState('The capital of France is Paris. It was founded in 1999 by Napoleon, which makes it a very modern city with no medieval history.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/arbitrations');
      setArbitrations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleArbitrate = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/v1/arbitrate', {
        originalPrompt: promptInput,
        originalOutput: outputInput
      });
      await fetchHistory();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent inline-flex items-center gap-3">
          <ShieldCheck size={40} className="text-indigo-400" />
          LLM Output Arbitration System
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Submit any LLM output to be evaluated by three independent parallel Critics (Accuracy, Logic, Completeness). An Adjudicator Agent resolves disagreements and provides a final verdict.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">New Arbitration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Original Prompt</label>
              <textarea 
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">LLM Output to Evaluate</label>
              <textarea 
                value={outputInput}
                onChange={e => setOutputInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 min-h-[150px]"
              />
            </div>
            <button 
              onClick={handleArbitrate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-pulse">Arbitrating (may take 20s)...</span> : 'Run Arbitration Pipeline'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {arbitrations.map((arb, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Arbitration #{arb.id}</h3>
                  <p className="text-gray-400 line-clamp-2">Prompt: {arb.original_prompt}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-indigo-400">{arb.final_verdict?.overallScore}/10</div>
                  <div className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Overall Score</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Adjudicator Summary</h4>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 text-gray-300">
                    <ReactMarkdown>{arb.final_verdict?.summary}</ReactMarkdown>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <CriticCard title="Accuracy Critic" data={arb.accuracy_critique} />
                  <CriticCard title="Logic Critic" data={arb.logic_critique} />
                  <CriticCard title="Completeness Critic" data={arb.completeness_critique} />
                </div>

                {arb.disagreements?.length > 0 && (
                  <div className="mb-8 p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
                    <h4 className="text-sm uppercase tracking-wider text-orange-400 font-bold mb-3 flex items-center gap-2">
                      <ShieldQuestion size={18} /> Detected Disagreements
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-orange-200 text-sm">
                      {arb.disagreements.map((d: string, j: number) => <li key={j}>{d}</li>)}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm uppercase tracking-wider text-red-400 font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} /> Confirmed Issues
                  </h4>
                  {arb.final_verdict?.confirmedIssues.length === 0 ? (
                    <p className="text-gray-500 italic">No issues confirmed.</p>
                  ) : (
                    <div className="space-y-3">
                      {arb.final_verdict?.confirmedIssues.map((issue: any, j: number) => (
                         <div key={j} className="bg-red-900/10 border border-red-900/50 p-4 rounded-lg">
                           <p className="text-red-400 text-sm font-semibold mb-1">Severity: {issue.severity}/5</p>
                           <blockquote className="border-l-2 border-red-500/50 pl-3 italic text-gray-400 mb-2">"{issue.quote}"</blockquote>
                           <p className="text-gray-300">{issue.description}</p>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CriticCard({ title, data }: { title: string, data: any }) {
  if (!data) return <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 animate-pulse h-32"></div>;
  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
      <h4 className="text-gray-400 font-bold mb-2 flex items-center gap-2">
        {data.score >= 4 ? <ShieldCheck size={18} className="text-green-400" /> : <ServerCrash size={18} className="text-red-400" />}
        {title}
      </h4>
      <div className="text-2xl font-black text-white mb-2">{data.score}/5</div>
      <p className="text-sm text-gray-500">{data.issues?.length || 0} issues flagged</p>
    </div>
  )
}
