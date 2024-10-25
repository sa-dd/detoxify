// App.jsx
import { useState } from 'react';

const ModelResult = ({ name, text }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="font-medium text-black mb-2">{name}</h3>
    <p className="text-[#666] whitespace-pre-wrap">
      {text}
    </p>
  </div>
);

const ResultsPopup = ({ onClose, results, onSendToAll }) => (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-2xl mx-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium">Results</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {results.map((result, index) => (
          <ModelResult key={index} {...result} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
      </div>
    </div>
  </div>
);

const App = () => {
  const [inputText, setInputText] = useState('');
  const [toxicityThreshold, setToxicityThreshold] = useState(0.27);
  const [isRandomize, setIsRandomize] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [glad, setGlad] = useState("");
  const [modelArray, setModelArray] = useState([])
  
  // Sample results - replace with actual API response
  const results = [
    {
      name: 'GLAD',
      text: glad
    },
    {
      name: 'ParaGeDi',
      text: 'The future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.\nThe future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.'
    },
    {
      name: 'CondBERT',
      text: 'The future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.\nThe future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.'
    },
    {
      name: 'ruT5',
      text: 'The future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.\nThe future of the economy is uncertain, but it\'s clear that we need to adapt to a new type of business model.'
    } 
  ];

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulated API call - replace with actual implementation
        fetch('http://127.0.0.1:5000/api/process', {
             method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_text: inputText }),
            })
        .then(response => response.json())
        .then(data => {
            console.log('Output from server:', JSON.parse(data.output_text)); 
            console.log(JSON.parse(data.output_text)["nonToxic"])
            setGlad(JSON.parse(data.output_text)["nonToxic"])
             let glabObj = {
                name: 'GLAD',
                text: glad
            }
            setModelArray([glabObj])
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      setShowResults(true);
      setIsLoading(false);
    } catch (err) {
      setError('Request Failed: error');
      setIsLoading(false);
    }
  };

  const handleSendToAll = () => {
    // Implement send to all functionality
    setShowResults(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <div className="w-full bg-[#1e1e1e] text-white p-4">
        <h1 className="text-lg">Chat Detoxifier</h1>
      </div>

      {/* Navigation */}
      <div className="w-full bg-[#1e1e1e]">
        <button className="bg-[#2d2d2d] text-[#0075ff] px-4 py-2 rounded-t-md ml-4">
          Detoxification
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full p-4 bg-[#1e1e1e] overflow-auto">
        <div className="w-full bg-[#2d2d2d] rounded-lg p-6">
          {/* Text Input */}
          <textarea
            className="w-full h-40 p-4 bg-[#1e1e1e] text-white rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-[#0075ff] resize-none"
            placeholder="Enter text to label..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Randomize Checkbox */}
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={isRandomize}
                  onChange={(e) => setIsRandomize(e.target.checked)}
                  className="form-checkbox bg-[#1e1e1e] border border-[#3d3d3d] rounded text-[#0075ff] focus:ring-0 focus:ring-offset-0"
                />
                <span>Randomize</span>
              </label>

              {/* Toxicity Threshold */}
              <div className="flex items-center space-x-2">
                <span className="text-white whitespace-nowrap">Toxicity threshold:</span>
                <div className="w-32 flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={toxicityThreshold}
                    onChange={(e) => setToxicityThreshold(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#3d3d3d] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white min-w-[40px]">{toxicityThreshold}</span>
                </div>
              </div>
            </div>

            {/* Rewrite Button */}
            <button
              onClick={handleRewrite}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg text-white ${
                isLoading ? 'bg-[#0075ff]/50 cursor-not-allowed' : 'bg-[#0075ff] hover:bg-[#0075ff]/90'
              }`}
            >
              Rewrite
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-[#2d2d2d] rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* Results Popup */}
      {showResults && (
        <ResultsPopup
          results={modelArray}
          onClose={() => setShowResults(false)}
          onSendToAll={handleSendToAll}
        />
      )}
    </div>
  );
};

export default App;
