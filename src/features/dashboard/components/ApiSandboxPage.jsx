import React, { useState } from "react";
import { Play, RotateCw } from "lucide-react";

export function ApiSandboxPage({ onToast }) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.cloudlens.dev/v1/telemetry/stats?repoId=104");
  const [requestBody, setRequestBody] = useState(
    `{\n  "repoId": 104,\n  "environment": "staging",\n  "metrics": [\n    "active_pipelines",\n    "success_rate",\n    "mttr"\n  ]\n}`
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState(null);

  const defaultResponse = {
    status: "success",
    data: {
      repository: "cloudlens-client-v1.0",
      metrics: {
        active_pipelines: 2,
        success_rate: "98.4%",
        avg_build_time: "2m 14s",
        mttr: "1.2h"
      },
      healthy: true,
      timestamp: new Date().toISOString()
    }
  };

  const executePayload = () => {
    setIsExecuting(true);
    onToast("Executing payload simulation...");
    setTimeout(() => {
      setIsExecuting(false);
      try {
        const bodyParsed = method !== "GET" ? JSON.parse(requestBody) : null;
        setResponseOutput({
          status: "success",
          method,
          url,
          timestamp: new Date().toISOString(),
          requestPayload: bodyParsed,
          data: defaultResponse.data
        });
        onToast("Payload execution complete!");
      } catch (err) {
        setResponseOutput({
          error: "Invalid request JSON format",
          timestamp: new Date().toISOString()
        });
        onToast("Execution failed: JSON syntax error");
      }
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-[20px] font-black text-gray-900 tracking-tight">API Testing Sandbox</h2>
        <p className="text-[13px] text-gray-400 font-medium">Verify REST queries and telemetry payloads with the active simulator.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        {/* Control URL bar */}
        <div className="flex gap-2">
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3.5 py-3 rounded-xl border border-gray-200 text-[13px] font-black text-gray-700 bg-gray-50 focus:outline-none shrink-0 cursor-pointer"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-mono focus:outline-none focus:border-[#0061AA] transition-all bg-gray-50/30 font-bold"
          />
          <button
            onClick={executePayload}
            disabled={isExecuting}
            className="px-5 py-3 bg-[#0061AA] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shrink-0 hover:scale-105 active:scale-95 disabled:scale-100"
          >
            {isExecuting ? (
              <RotateCw size={12} className="animate-spin" />
            ) : (
              <Play size={12} fill="white" />
            )}
            Execute
          </button>
        </div>

        {/* Split layout editor */}
        <div className="grid grid-cols-2 gap-6 h-[400px]">
          {/* Left Pane (Headers editor) */}
          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-50/10">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Request Body (JSON)</span>
              <span className="text-[10px] font-bold text-gray-400">application/json</span>
            </div>
            <textarea
              className="flex-1 p-4 font-mono text-[12px] leading-relaxed text-gray-600 bg-white focus:outline-none resize-none focus:ring-1 focus:ring-[#0061AA] transition-all"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </div>

          {/* Right Pane (Response Viewer) */}
          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-50/15">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center shrink-0">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Simulator Output</span>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">200 OK</span>
                <span className="text-gray-400">45ms</span>
              </div>
            </div>
            <pre className="flex-1 p-4 font-mono text-[12px] leading-relaxed text-emerald-700 bg-white overflow-y-auto select-all">
              {JSON.stringify(responseOutput || defaultResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
