import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Rocket, Search, ChevronRight, CheckCircle2, AlertCircle, Loader2, GitBranch, Terminal } from "lucide-react";
import { 
  useGetRepositoriesQuery, 
  useGetWorkflowsQuery, 
  useGetBranchesQuery, 
  useTriggerDeploymentMutation 
} from "../../../store/api/githubApi";

export const NewDeploymentModal = ({ isOpen, onClose, onToast }) => {
  const [step, setStep] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedRef, setSelectedRef] = useState("main");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: repositories = [], isLoading: loadingRepos } = useGetRepositoriesQuery();
  const { data: workflows = [], isLoading: loadingWorkflows } = useGetWorkflowsQuery(
    { owner: selectedRepo?.owner?.login, repo: selectedRepo?.name },
    { skip: !selectedRepo }
  );
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery(
    { owner: selectedRepo?.owner?.login, repo: selectedRepo?.name },
    { skip: !selectedRepo }
  );

  const [triggerDeployment, { isLoading: isTriggering }] = useTriggerDeploymentMutation();

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedRepo(null);
      setSelectedWorkflow(null);
      setSelectedRef("main");
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrigger = async () => {
    try {
      await triggerDeployment({
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        workflowId: selectedWorkflow.id.toString(),
        ref: selectedRef
      }).unwrap();
      
      onToast?.(`Deployment triggered for ${selectedRepo.name}!`);
      onClose();
    } catch (err) {
      onToast?.("Failed to trigger deployment. Ensure the workflow supports manual dispatch.");
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0061AA] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Rocket size={20} />
            </div>
            <div>
              <h2 className="text-[17px] font-black text-gray-900 tracking-tight">Launch Deployment</h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Step {step} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col">
          {/* Step 1: Select Repository */}
          {step === 1 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0061AA]/10"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-2">
                {loadingRepos ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0061AA]" /></div>
                ) : filteredRepos.map(repo => (
                  <button 
                    key={repo.id}
                    onClick={() => { setSelectedRepo(repo); setStep(2); }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#0061AA]/30 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-[#0061AA]">
                        <Terminal size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{repo.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0061AA]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Workflow */}
          {step === 2 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Available Workflows</h3>
              <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2">
                {loadingWorkflows ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0061AA]" /></div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm italic">No workflows found in this repo.</div>
                ) : workflows.map(wf => (
                  <button 
                    key={wf.id}
                    onClick={() => { setSelectedWorkflow(wf); setStep(3); }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#0061AA]/30 hover:bg-blue-50/30 transition-all group text-left"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-700">{wf.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{wf.path}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0061AA]" />
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest flex items-center gap-1"
              >
                ← Back to Repositories
              </button>
            </div>
          )}

          {/* Step 3: Final Configuration */}
          {step === 3 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Target Branch</label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                      value={selectedRef}
                      onChange={(e) => setSelectedRef(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none appearance-none"
                    >
                      {loadingBranches ? <option>Loading branches...</option> : branches.map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <h4 className="text-[11px] font-black text-blue-800 uppercase tracking-widest mb-2">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Repository</span>
                      <span className="font-bold text-gray-800">{selectedRepo?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Workflow</span>
                      <span className="font-bold text-gray-800">{selectedWorkflow?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-6 bg-gray-50 text-gray-600 rounded-2xl text-sm font-bold border border-gray-100"
                >
                  Back
                </button>
                <button 
                  onClick={handleTrigger}
                  disabled={isTriggering}
                  className="flex-[2] py-3 px-6 bg-[#0061AA] text-white rounded-2xl text-sm font-black hover:bg-[#004d8a] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isTriggering ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
                  Launch Deployment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
