import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  ChevronDown, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Lock, 
  Unlock, 
  Globe, 
  Server, 
  Database, 
  Code, 
  Wifi, 
  Eye,
  BookOpen,
  ExternalLink,
  Download,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Terminal,
  FileText,
  Users,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';

// Interactive Demo Components
const HTTPRequestDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "1. User Types URL",
      description: "User enters 'https://example.com' in browser",
      visual: "🌐",
      code: "URL: https://example.com",
      explanation: "The journey begins when a user types a URL or clicks a link"
    },
    {
      title: "2. DNS Resolution",
      description: "Browser asks DNS servers for IP address",
      visual: "🔍",
      code: "DNS Query: example.com → 93.184.216.34",
      explanation: "Browser needs to convert the domain name to an IP address"
    },
    {
      title: "3. HTTP Request Sent",
      description: "Browser sends GET request to server",
      visual: "📤",
      code: `GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0...
Accept: text/html,application/xhtml+xml`,
      explanation: "Browser creates and sends an HTTP request with headers"
    },
    {
      title: "4. Server Processing",
      description: "Server processes request and prepares response",
      visual: "⚙️",
      code: "Server processing request...\nGenerating HTML content...",
      explanation: "Server runs application logic and generates the response"
    },
    {
      title: "5. HTTP Response",
      description: "Server sends response back to browser",
      visual: "📥",
      code: `HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024

<html><head><title>Example</title>...`,
      explanation: "Server responds with status code, headers, and content"
    },
    {
      title: "6. Page Rendered",
      description: "Browser displays the webpage to user",
      visual: "🎨",
      code: "Parsing HTML...\nApplying CSS...\nExecuting JavaScript...",
      explanation: "Browser processes the response and renders the final page"
    }
  ];

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <button
          onClick={playDemo}
          disabled={isPlaying}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-full font-bold flex items-center transition-all duration-300 transform hover:scale-105"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Playing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Demo
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              index === currentStep
                ? 'bg-blue-900/50 border-blue-400 scale-105 shadow-lg shadow-blue-500/30'
                : index < currentStep
                  ? 'bg-green-900/30 border-green-600'
                  : 'bg-gray-900/30 border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{step.visual}</div>
              <h4 className="font-bold text-white text-sm">{step.title}</h4>
              <p className="text-gray-300 text-xs mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/50 border border-gray-600 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-green-400" />
              Current Step
            </h4>
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <h5 className="font-bold text-blue-400 mb-2">{steps[currentStep].title}</h5>
              <p className="text-gray-300 text-sm mb-3">{steps[currentStep].explanation}</p>
              <div className="text-6xl text-center">{steps[currentStep].visual}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-yellow-400" />
              Technical Details
            </h4>
            <div className="bg-black border border-gray-700 rounded p-4">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {steps[currentStep].code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DNSLookupDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lookupDomain, setLookupDomain] = useState('example.com');

  const steps = [
    {
      title: "1. Browser Cache Check",
      description: "Browser checks its local DNS cache first",
      visual: "💻",
      code: `Checking browser cache for: ${lookupDomain}
Cache result: NOT FOUND`,
      explanation: "Browser first looks in its own cache to see if it already knows the IP"
    },
    {
      title: "2. OS Cache Check",
      description: "Operating system checks its DNS cache",
      visual: "🖥️",
      code: `Checking OS cache for: ${lookupDomain}
OS cache result: NOT FOUND`,
      explanation: "If browser cache misses, OS checks its own DNS cache"
    },
    {
      title: "3. Router Cache Check",
      description: "Local router checks its DNS cache",
      visual: "📡",
      code: `Querying local router for: ${lookupDomain}
Router cache result: NOT FOUND`,
      explanation: "Router may have cached DNS results from recent queries"
    },
    {
      title: "4. ISP DNS Server",
      description: "Query sent to ISP's DNS resolver",
      visual: "🏢",
      code: `Querying ISP DNS server: 8.8.8.8
Query type: A record for ${lookupDomain}`,
      explanation: "ISP's DNS server acts as a recursive resolver"
    },
    {
      title: "5. Root Server Query",
      description: "ISP queries root nameservers",
      visual: "🌍",
      code: `Query to root server: a.root-servers.net
Response: Try .com TLD server at 192.5.6.30`,
      explanation: "Root servers direct queries to appropriate TLD servers"
    },
    {
      title: "6. TLD Server Query",
      description: "Query sent to .com TLD server",
      visual: "🏛️",
      code: `Query to TLD server: 192.5.6.30
Response: Authoritative server at 93.184.216.119`,
      explanation: "TLD server provides authoritative nameserver information"
    },
    {
      title: "7. Authoritative Server",
      description: "Final query to authoritative nameserver",
      visual: "🎯",
      code: `Query to authoritative server: 93.184.216.119
Response: ${lookupDomain} → 93.184.216.34`,
      explanation: "Authoritative server provides the actual IP address"
    },
    {
      title: "8. Response Cached",
      description: "IP address cached and returned to browser",
      visual: "✅",
      code: `${lookupDomain} → 93.184.216.34
TTL: 3600 seconds
Result cached at all levels`,
      explanation: "Result is cached at multiple levels for future use"
    }
  ];

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4 mb-6">
        <input
          type="text"
          value={lookupDomain}
          onChange={(e) => setLookupDomain(e.target.value)}
          className="bg-black border border-gray-600 text-white px-4 py-2 rounded font-mono"
          placeholder="Enter domain name"
        />
        <button
          onClick={playDemo}
          disabled={isPlaying}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-full font-bold flex items-center transition-all duration-300 transform hover:scale-105"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Resolving...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Lookup Domain
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all duration-500 ${
              index === currentStep
                ? 'bg-orange-900/50 border-orange-400 scale-105 shadow-lg shadow-orange-500/30'
                : index < currentStep
                  ? 'bg-green-900/30 border-green-600'
                  : 'bg-gray-900/30 border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{step.visual}</div>
              <h4 className="font-bold text-white text-xs">{step.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/50 border border-gray-600 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-orange-400" />
              Current Step
            </h4>
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <h5 className="font-bold text-orange-400 mb-2">{steps[currentStep].title}</h5>
              <p className="text-gray-300 text-sm mb-3">{steps[currentStep].explanation}</p>
              <div className="text-4xl text-center">{steps[currentStep].visual}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-green-400" />
              DNS Query Details
            </h4>
            <div className="bg-black border border-gray-700 rounded p-4">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {steps[currentStep].code}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-blue-400 font-bold mb-2">💡 Did You Know?</h4>
        <p className="text-gray-300 text-sm">
          DNS queries happen for every new domain you visit, but caching makes subsequent visits much faster. 
          The entire process typically takes less than 100 milliseconds!
        </p>
      </div>
    </div>
  );
};

// Web Technologies Evolution Demo
const WebEvolutionDemo = () => {
  const [currentEra, setCurrentEra] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const webEras = [
    {
      period: "1990-1995",
      title: "Web 1.0 - Static Web",
      visual: "📄",
      technologies: ["HTML", "HTTP", "URL"],
      characteristics: ["Static pages", "Read-only", "Simple links", "Basic text/images"],
      example: "<html><body><h1>Welcome!</h1><p>This is a static page.</p></body></html>",
      color: "from-gray-600 to-gray-400"
    },
    {
      period: "1995-2005",
      title: "Dynamic Web Emerges",
      visual: "⚡",
      technologies: ["JavaScript", "CSS", "CGI", "PHP"],
      characteristics: ["Client-side scripting", "Form submissions", "Basic styling", "Server-side processing"],
      example: "document.getElementById('content').innerHTML = 'Dynamic content!';",
      color: "from-blue-600 to-blue-400"
    },
    {
      period: "2005-2010",
      title: "Web 2.0 - Social Web",
      visual: "👥",
      technologies: ["AJAX", "jQuery", "Social Media APIs", "RSS"],
      characteristics: ["User-generated content", "Social networking", "Rich interactions", "Asynchronous updates"],
      example: "$.ajax({ url: '/api/posts', success: function(data) { updateUI(data); } });",
      color: "from-green-600 to-green-400"
    },
    {
      period: "2010-2020",
      title: "Modern Web Applications",
      visual: "🚀",
      technologies: ["React", "Angular", "Node.js", "REST APIs"],
      characteristics: ["Single Page Apps", "Component architecture", "Real-time features", "Mobile-first"],
      example: "const [data, setData] = useState([]); // React Hook for state management",
      color: "from-purple-600 to-purple-400"
    },
    {
      period: "2020-Present",
      title: "Web 3.0 - Intelligent Web",
      visual: "🧠",
      technologies: ["AI/ML", "WebAssembly", "Progressive Web Apps", "Blockchain"],
      characteristics: ["AI-powered features", "Near-native performance", "Decentralized apps", "Smart contracts"],
      example: "const model = await tf.loadLayersModel('/model.json'); // TensorFlow.js",
      color: "from-pink-600 to-pink-400"
    }
  ];

  const playEvolution = () => {
    setIsPlaying(true);
    setCurrentEra(0);
    
    const interval = setInterval(() => {
      setCurrentEra(prev => {
        if (prev >= webEras.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <button
          onClick={playEvolution}
          disabled={isPlaying}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-500 text-white px-8 py-3 rounded-full font-bold flex items-center transition-all duration-300 transform hover:scale-105"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Evolving...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Evolution
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-3 mb-6">
        {webEras.map((era, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all duration-500 cursor-pointer ${
              index === currentEra
                ? 'bg-purple-900/50 border-purple-400 scale-105 shadow-lg shadow-purple-500/30'
                : index < currentEra
                  ? 'bg-green-900/30 border-green-600'
                  : 'bg-gray-900/30 border-gray-600'
            }`}
            onClick={() => setCurrentEra(index)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{era.visual}</div>
              <h4 className="font-bold text-white text-sm mb-1">{era.period}</h4>
              <p className="text-gray-300 text-xs">{era.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/50 border border-gray-600 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              Current Era: {webEras[currentEra].period}
            </h4>
            <div className={`bg-gradient-to-r ${webEras[currentEra].color} p-4 rounded border`}>
              <h5 className="font-bold text-white mb-3">{webEras[currentEra].title}</h5>
              <div className="text-6xl text-center mb-4">{webEras[currentEra].visual}</div>
              <div className="space-y-2">
                <h6 className="font-semibold text-white">Key Technologies:</h6>
                <div className="flex flex-wrap gap-2">
                  {webEras[currentEra].technologies.map((tech, i) => (
                    <span key={i} className="bg-black/30 px-2 py-1 rounded text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-white mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-green-400" />
              Characteristics & Code
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <h6 className="font-semibold text-blue-400 mb-2">Key Features:</h6>
                <ul className="space-y-1">
                  {webEras[currentEra].characteristics.map((char, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center">
                      <Star className="w-3 h-3 mr-2 text-yellow-400" />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-black border border-gray-700 rounded p-4">
                <h6 className="font-semibold text-green-400 mb-2">Code Example:</h6>
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {webEras[currentEra].example}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h4 className="text-blue-400 font-bold mb-2">🌐 Evolution Insight</h4>
        <p className="text-gray-300 text-sm">
          Each era of web development built upon the previous one, adding new capabilities and solving emerging challenges. 
          We've gone from static documents to intelligent, interactive applications!
        </p>
      </div>
    </div>
  );
};

// Frontend vs Backend Battle Demo
const FrontendBackendDemo = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedSide, setSelectedSide] = useState(null);

  const frontendTech = {
    title: "Frontend - The Beautiful Face",
    color: "from-pink-600 to-purple-600",
    icon: "🎨",
    technologies: [
      { name: "HTML", role: "Structure", example: "<div class='header'>Welcome!</div>" },
      { name: "CSS", role: "Styling", example: ".header { color: blue; font-size: 24px; }" },
      { name: "JavaScript", role: "Interactivity", example: "button.onclick = () => alert('Hello!');" },
      { name: "React", role: "Components", example: "const Button = () => <button>Click me</button>;" }
    ],
    responsibilities: [
      "User Interface Design",
      "User Experience (UX)",
      "Client-side Logic",
      "Browser Compatibility",
      "Performance Optimization"
    ],
    challenges: [
      "Multiple browser support",
      "Responsive design",
      "Performance optimization",
      "Accessibility compliance"
    ]
  };

  const backendTech = {
    title: "Backend - The Powerful Engine",
    color: "from-blue-600 to-green-600",
    icon: "⚙️",
    technologies: [
      { name: "Node.js", role: "Runtime", example: "const server = http.createServer();" },
      { name: "Express", role: "Framework", example: "app.get('/api/users', (req, res) => {...});" },
      { name: "Database", role: "Storage", example: "SELECT * FROM users WHERE active = 1;" },
      { name: "APIs", role: "Communication", example: "POST /api/auth/login { username, password }" }
    ],
    responsibilities: [
      "Server Logic",
      "Database Management",
      "API Development",
      "Security & Authentication",
      "Data Processing"
    ],
    challenges: [
      "Scalability planning",
      "Security vulnerabilities",
      "Database optimization",
      "Server maintenance"
    ]
  };

  const renderTechStack = (stack) => (
    <div className={`bg-gradient-to-br ${stack.color} p-6 rounded-2xl text-white`}>
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{stack.icon}</div>
        <h3 className="text-2xl font-bold">{stack.title}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-bold mb-3">🔧 Core Technologies:</h4>
          <div className="space-y-2">
            {stack.technologies.map((tech, i) => (
              <div key={i} className="bg-black/20 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{tech.name}</span>
                  <span className="text-sm opacity-80">{tech.role}</span>
                </div>
                <code className="text-xs bg-black/30 p-2 rounded block font-mono">
                  {tech.example}
                </code>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3">📋 Key Responsibilities:</h4>
          <ul className="space-y-1">
            {stack.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-center text-sm">
                <Star className="w-4 h-4 mr-2" />
                {resp}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">⚠️ Common Challenges:</h4>
          <ul className="space-y-1">
            {stack.challenges.map((challenge, i) => (
              <li key={i} className="flex items-center text-sm">
                {/* <AlertTriangle className="w-4 h-4 mr-2" /> */}
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setCurrentView('overview')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            currentView === 'overview' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setCurrentView('comparison')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            currentView === 'comparison' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          ⚔️ Battle
        </button>
        <button
          onClick={() => setCurrentView('workflow')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            currentView === 'workflow' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🔄 Workflow
        </button>
      </div>

      {currentView === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {renderTechStack(frontendTech)}
          {renderTechStack(backendTech)}
        </div>
      )}

      {currentView === 'comparison' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">⚔️ Frontend vs Backend Battle</h3>
            <p className="text-gray-300">Click on each side to see their strengths!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="cursor-pointer transform transition-all hover:scale-105"
              onClick={() => setSelectedSide(selectedSide === 'frontend' ? null : 'frontend')}
            >
              <div className={`p-6 rounded-2xl border-2 ${
                selectedSide === 'frontend' 
                  ? 'border-pink-400 bg-pink-900/30' 
                  : 'border-gray-600 bg-gray-900/30'
              }`}>
                <div className="text-center">
                  <div className="text-8xl mb-4">🎨</div>
                  <h4 className="text-2xl font-bold text-pink-400">FRONTEND</h4>
                  <p className="text-gray-300 mt-2">The User's Window</p>
                  
                  {selectedSide === 'frontend' && (
                    <div className="mt-4 space-y-2 text-left">
                      <h5 className="font-bold text-pink-400">💪 Strengths:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Direct user interaction</li>
                        <li>• Immediate visual feedback</li>
                        <li>• Creative expression</li>
                        <li>• User experience control</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              className="cursor-pointer transform transition-all hover:scale-105"
              onClick={() => setSelectedSide(selectedSide === 'backend' ? null : 'backend')}
            >
              <div className={`p-6 rounded-2xl border-2 ${
                selectedSide === 'backend' 
                  ? 'border-blue-400 bg-blue-900/30' 
                  : 'border-gray-600 bg-gray-900/30'
              }`}>
                <div className="text-center">
                  <div className="text-8xl mb-4">⚙️</div>
                  <h4 className="text-2xl font-bold text-blue-400">BACKEND</h4>
                  <p className="text-gray-300 mt-2">The Hidden Power</p>
                  
                  {selectedSide === 'backend' && (
                    <div className="mt-4 space-y-2 text-left">
                      <h5 className="font-bold text-blue-400">💪 Strengths:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Data processing power</li>
                        <li>• Security implementation</li>
                        <li>• Scalability management</li>
                        <li>• Business logic control</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'workflow' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center mb-6">🔄 Full Stack Workflow</h3>
          
          <div className="bg-black/50 border border-gray-600 rounded-lg p-6">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { step: 1, title: "User Interaction", icon: "👆", desc: "User clicks button" },
                { step: 2, title: "Frontend Logic", icon: "🎨", desc: "JS processes click" },
                { step: 3, title: "API Request", icon: "📡", desc: "Send data to server" },
                { step: 4, title: "Backend Processing", icon: "⚙️", desc: "Server handles request" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-gray-900 rounded-lg">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-gray-300 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-300">
                Modern web development requires both frontend and backend skills working together seamlessly!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
        <h4 className="text-purple-400 font-bold mb-2">🤝 The Truth About Frontend vs Backend</h4>
        <p className="text-gray-300 text-sm">
          The best web applications are built when frontend and backend developers work together as a team. 
          Each brings unique skills that complement the other!
        </p>
      </div>
    </div>
  );
};

function App() {
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [interactiveDemo, setInteractiveDemo] = useState(null);

  // Comprehensive tech reference data
  const techReference = {
    http: {
      title: "HTTP Protocol",
      description: "The foundation of data communication on the World Wide Web",
      details: {
        overview: "HTTP (HyperText Transfer Protocol) is an application-layer protocol for transmitting hypermedia documents, such as HTML. It was originally designed for communication between web browsers and web servers.",
        methods: [
          { name: "GET", desc: "Retrieves data from a server", example: "GET /api/users" },
          { name: "POST", desc: "Sends data to create a resource", example: "POST /api/users" },
          { name: "PUT", desc: "Updates an existing resource", example: "PUT /api/users/123" },
          { name: "DELETE", desc: "Removes a resource", example: "DELETE /api/users/123" },
          { name: "PATCH", desc: "Partially updates a resource", example: "PATCH /api/users/123" }
        ],
        statusCodes: [
          { code: "200", name: "OK", desc: "Request successful" },
          { code: "404", name: "Not Found", desc: "Resource doesn't exist" },
          { code: "500", name: "Internal Server Error", desc: "Server encountered an error" },
          { code: "401", name: "Unauthorized", desc: "Authentication required" }
        ],
        headers: [
          { name: "Content-Type", desc: "Specifies the media type of the resource" },
          { name: "Authorization", desc: "Contains credentials for authenticating" },
          { name: "Cache-Control", desc: "Directives for caching mechanisms" }
        ]
      }
    },
    https: {
      title: "HTTPS Security",
      description: "Secure version of HTTP with encryption",
      details: {
        overview: "HTTPS (HTTP Secure) is HTTP over TLS/SSL. It provides authentication of the website and associated web server, and protects against man-in-the-middle attacks.",
        benefits: [
          "Data encryption in transit",
          "Server authentication",
          "Data integrity verification",
          "SEO ranking boost",
          "User trust and confidence"
        ],
        implementation: [
          "Obtain SSL/TLS certificate",
          "Configure web server",
          "Redirect HTTP to HTTPS",
          "Update internal links",
          "Test security configuration"
        ],
        certificates: [
          { type: "Domain Validated (DV)", desc: "Basic encryption, quick issuance" },
          { type: "Organization Validated (OV)", desc: "Medium assurance, business verification" },
          { type: "Extended Validation (EV)", desc: "Highest assurance, green address bar" }
        ]
      }
    },
    dns: {
      title: "Domain Name System",
      description: "The phonebook of the internet",
      details: {
        overview: "DNS translates human-readable domain names into IP addresses that computers use to identify each other on the network.",
        recordTypes: [
          { type: "A", desc: "Maps domain to IPv4 address", example: "example.com → 192.168.1.1" },
          { type: "AAAA", desc: "Maps domain to IPv6 address", example: "example.com → 2001:db8::1" },
          { type: "CNAME", desc: "Canonical name alias", example: "www.example.com → example.com" },
          { type: "MX", desc: "Mail exchange server", example: "example.com → mail.example.com" },
          { type: "TXT", desc: "Text records for verification", example: "SPF, DKIM records" }
        ],
        process: [
          "Browser queries local DNS cache",
          "Query sent to recursive resolver",
          "Resolver queries root nameserver",
          "Root directs to TLD nameserver",
          "TLD directs to authoritative nameserver",
          "Authoritative returns IP address"
        ]
      }
    },
    webSecurity: {
      title: "Web Security",
      description: "Protecting web applications and users",
      details: {
        overview: "Web security involves protecting websites and web applications from various cyber threats and vulnerabilities.",
        threats: [
          { name: "Cross-Site Scripting (XSS)", desc: "Injecting malicious scripts into web pages" },
          { name: "SQL Injection", desc: "Inserting malicious SQL code into queries" },
          { name: "Cross-Site Request Forgery (CSRF)", desc: "Unauthorized commands from trusted users" },
          { name: "Man-in-the-Middle", desc: "Intercepting communication between parties" }
        ],
        protection: [
          "Input validation and sanitization",
          "Use HTTPS everywhere",
          "Implement Content Security Policy",
          "Regular security updates",
          "Authentication and authorization",
          "Security headers (HSTS, X-Frame-Options)"
        ]
      }
    }
  };

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system
  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      life: 1,
      decay: Math.random() * 0.02 + 0.005,
      color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]
    });

    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.speedX,
        y: particle.y + particle.speedY,
        life: particle.life - particle.decay
      })).filter(p => p.life > 0).concat(
        Array.from({ length: Math.random() > 0.95 ? 1 : 0 }, createParticle)
      ));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const text = "Get Ready for the Most Amazing Friday Pathshala Ever!";
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Enhanced GSAP-like animations with more interactivity
    const tl = {
      fromTo: (target, from, to, delay = 0) => {
        const element = document.querySelector(target);
        if (element) {
          Object.assign(element.style, from);
          setTimeout(() => {
            element.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.320, 1)';
            Object.assign(element.style, to);
          }, delay);
        }
      },
      staggerFromTo: (targets, from, to, stagger = 100) => {
        const elements = document.querySelectorAll(targets);
        elements.forEach((element, index) => {
          Object.assign(element.style, from);
          setTimeout(() => {
            element.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.320, 1)';
            Object.assign(element.style, to);
          }, index * stagger);
        });
      }
    };

    setTimeout(() => {
      setIsLoaded(true);
      
      // Spectacular hero animations
      tl.fromTo('.hero-title', 
        { opacity: '0', transform: 'translateY(100px) scale(0.5) rotateX(90deg)' },
        { opacity: '1', transform: 'translateY(0px) scale(1) rotateX(0deg)' },
        300
      );
      
      tl.fromTo('.hero-subtitle',
        { opacity: '0', transform: 'translateY(50px) rotateY(45deg)' },
        { opacity: '1', transform: 'translateY(0px) rotateY(0deg)' },
        800
      );
      
      tl.fromTo('.hero-question',
        { opacity: '0', transform: 'translateY(30px) scale(0.8)' },
        { opacity: '1', transform: 'translateY(0px) scale(1)' },
        1200
      );
    }, 200);
    
    // Enhanced ScrollTrigger with more effects
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Advanced parallax with rotation
        const parallaxElements = section.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
          const speed = element.dataset.speed || 0.5;
          const yPos = -(scrollY - sectionTop) * speed;
          const rotation = (scrollY - sectionTop) * 0.1;
          element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
        
        // 3D tilt effect based on scroll
        const tiltElements = section.querySelectorAll('.tilt-3d');
        tiltElements.forEach(element => {
          const progress = Math.max(0, Math.min(1, (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight)));
          const tiltX = (progress - 0.5) * 20;
          const tiltY = (progress - 0.5) * 10;
          element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        if (scrollY >= sectionTop - windowHeight * 0.8 && !section.classList.contains('animated')) {
          section.classList.add('animated');
          
          // Explosive timeline animations
          const timelineItems = section.querySelectorAll('.timeline-item');
          timelineItems.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0) scale(1) rotateZ(0deg)';
              item.style.filter = 'blur(0px)';
            }, i * 300);
          });
          
          // 3D flip tech cards
          const techCards = section.querySelectorAll('.tech-card');
          techCards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg) scale(1)';
              card.style.filter = 'blur(0px)';
            }, i * 200);
          });
          
          // Bouncy process steps
          const processSteps = section.querySelectorAll('.process-step');
          processSteps.forEach((step, i) => {
            setTimeout(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0) scale(1) rotate(0deg)';
              step.style.filter = 'drop-shadow(0 10px 20px rgba(0,255,255,0.3))';
            }, i * 250);
          });
          
          // Spectacular recap items
          const recapItems = section.querySelectorAll('.recap-item');
          recapItems.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) rotate(0deg)';
              item.style.filter = 'brightness(1.2)';
            }, i * 150);
          });
        }
        
        if (scrollY >= sectionTop - windowHeight / 2 && scrollY < sectionTop + sectionHeight) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector(`#section-${currentSection + 1}`);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const createFirework = () => {
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 2000);
  };

  return (
    <div ref={containerRef} className="bg-black text-white overflow-x-hidden relative">
      {/* Interactive Cursor */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-200"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: activeCard ? 'scale(2)' : 'scale(1)'
        }}
      />

      {/* Dynamic Particle System */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              transform: `scale(${particle.life})`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* Fireworks Effect */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Section 1: Epic Intro with Spline 3D Earth */}
      <section id="section-0" className="section min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
        {/* Spline 3D Holographic Earth Background */}
        <div className="absolute inset-0 z-0">
          <iframe 
            src='https://my.spline.design/holographicearthwithdynamiclines-6svxoF5TqPjGkIhhgGUVVVwh/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="opacity-70"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>

        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
              style={{ left: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
              style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 z-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        
      </section>
      <div className="text-center z-20 px-4">
          <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent filter drop-shadow-2xl">
            WEB UNLOCKED
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300 font-light tracking-wide">
            TECHNICAL COUNCIL VIT 
          </p>
          <div className="hero-question text-base sm:text-lg md:text-xl mb-12 p-6 sm:p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl hover:scale-105 transition-all duration-500">
            <Globe className="inline-block mr-3 text-cyan-400 animate-spin" size={28} />
            <span className="text-cyan-300 font-semibold">{typedText}<span className="animate-pulse">|</span></span>
          </div>
          
          <div className="animate-bounce cursor-pointer group" onClick={scrollToNext}>
            <div className="relative">
              <ChevronDown size={60} className="mx-auto text-white/60 group-hover:text-white transition-colors group-hover:scale-125 transform duration-300" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            </div>
            <p className="text-sm text-gray-400 mt-4 group-hover:text-white transition-colors">Scroll to explore the magic</p>
          </div>
        </div>

      {/* Section 1.5: The Epic Story of the World Wide Web */}
      <section id="section-1-5" className="section min-h-screen py-20 bg-gradient-to-b from-black via-purple-900/50 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className="text-2xl">
                {['🌍', '💡', '🔗', '📡', '⚡', '🚀', '🌟'][Math.floor(Math.random() * 7)]}
              </div>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              🌟 THE EPIC TALE 🌟
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How the World Wide Web Changed Everything
            </h3>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          {/* Story Timeline with Visual Narrative */}
          <div className="max-w-6xl mx-auto space-y-16">
            
            {/* Chapter 1: The Vision */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md p-8 rounded-3xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:-rotate-1 shadow-2xl hover:shadow-blue-500/30">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl animate-pulse">
                      💡
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">1989</span>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">The Brilliant Vision</h4>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      🏢 <strong>At CERN, Switzerland</strong> - Tim Berners-Lee, a young British scientist, was frustrated. 
                      Scientists worldwide had amazing research, but sharing it was nearly impossible. Information was trapped 
                      in isolated computers, like books locked in separate rooms across the globe.
                    </p>
                    <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-400/30">
                      <p className="text-blue-200 italic">
                        💭 "What if we could connect all computers and make information universally accessible? 
                        What if knowledge could flow freely across the world?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 2: The Breakthrough */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md p-8 rounded-3xl border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:rotate-1 shadow-2xl hover:shadow-green-500/30">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl animate-bounce">
                      🔗
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">1990</span>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">The Magical Breakthrough</h4>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      ⚡ <strong>The Eureka Moment!</strong> Tim invented three revolutionary concepts that would change history:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-green-800/30 p-4 rounded-xl text-center border border-green-400/30">
                        <div className="text-2xl mb-2">🌐</div>
                        <div className="font-bold text-green-300">HTML</div>
                        <div className="text-sm text-gray-400">The language of web pages</div>
                      </div>
                      <div className="bg-green-800/30 p-4 rounded-xl text-center border border-green-400/30">
                        <div className="text-2xl mb-2">📡</div>
                        <div className="font-bold text-green-300">HTTP</div>
                        <div className="text-sm text-gray-400">The communication protocol</div>
                      </div>
                      <div className="bg-green-800/30 p-4 rounded-xl text-center border border-green-400/30">
                        <div className="text-2xl mb-2">🔗</div>
                        <div className="font-bold text-green-300">URLs</div>
                        <div className="text-sm text-gray-400">Unique addresses for everything</div>
                      </div>
                    </div>
                    <div className="bg-green-900/30 p-4 rounded-xl border border-green-400/30">
                      <p className="text-green-200 italic">
                        🎯 "These three simple concepts would create an interconnected web spanning the entire planet!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 3: The First Website */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-8 rounded-3xl border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 hover:-rotate-1 shadow-2xl hover:shadow-yellow-500/30">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-3xl animate-spin-slow">
                      🚀
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm">1991</span>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">Launch Day: The First Website</h4>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      🎉 <strong>Historic Moment!</strong> On August 6, 1991, Tim launched <code className="bg-yellow-800/30 px-2 py-1 rounded text-yellow-300">info.cern.ch</code> - 
                      the world's very first website! It was simple, revolutionary, and changed everything.
                    </p>
                    <div className="bg-black/50 p-6 rounded-xl border border-yellow-400/30 font-mono text-sm mb-4">
                      <div className="text-yellow-400 mb-2">📄 The First Webpage Content:</div>
                      <div className="text-green-300">
                        "The WorldWideWeb (W3) is a wide-area hypermedia information<br/>
                        retrieval initiative aiming to give universal access to a large<br/>
                        universe of documents."
                      </div>
                    </div>
                    <div className="bg-yellow-900/30 p-4 rounded-xl border border-yellow-400/30">
                      <p className="text-yellow-200 italic">
                        🌟 "From this simple page, the entire internet as we know it was born!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 4: The Gift to Humanity */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md p-8 rounded-3xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:rotate-1 shadow-2xl hover:shadow-purple-500/30">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl animate-pulse">
                      🎁
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm">1993</span>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">The Greatest Gift to Humanity</h4>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      💝 <strong>An Act of Pure Generosity!</strong> Tim Berners-Lee made a decision that would define the modern world. 
                      Instead of patenting his invention and becoming the richest person on Earth, he gave it away for FREE!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-purple-800/30 p-4 rounded-xl border border-purple-400/30">
                        <div className="text-xl mb-2">💰 He Could Have Made</div>
                        <div className="text-3xl font-bold text-purple-300">TRILLIONS</div>
                        <div className="text-sm text-gray-400">By owning the web</div>
                      </div>
                      <div className="bg-pink-800/30 p-4 rounded-xl border border-pink-400/30">
                        <div className="text-xl mb-2">🌍 Instead He Chose</div>
                        <div className="text-3xl font-bold text-pink-300">FREEDOM</div>
                        <div className="text-sm text-gray-400">For all humanity</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-400/30">
                      <p className="text-center text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-bold">
                        "The web should be free for everyone to use, forever!"
                      </p>
                      <p className="text-center text-sm text-gray-400 mt-2">- Tim Berners-Lee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 5: The Global Impact */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-8 rounded-3xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 hover:-rotate-1 shadow-2xl hover:shadow-cyan-500/30">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl animate-bounce">
                      🌍
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-cyan-500 text-black px-4 py-2 rounded-full font-bold text-sm">TODAY</span>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">The World Transformed</h4>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      🚀 <strong>From 1 website to 2 billion!</strong> Tim's vision became reality beyond imagination:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-cyan-800/30 p-4 rounded-xl text-center border border-cyan-400/30 hover:scale-110 transition-all">
                        <div className="text-3xl mb-2">5B+</div>
                        <div className="text-cyan-300 font-bold">Internet Users</div>
                      </div>
                      <div className="bg-blue-800/30 p-4 rounded-xl text-center border border-blue-400/30 hover:scale-110 transition-all">
                        <div className="text-3xl mb-2">2B+</div>
                        <div className="text-blue-300 font-bold">Websites</div>
                      </div>
                      <div className="bg-purple-800/30 p-4 rounded-xl text-center border border-purple-400/30 hover:scale-110 transition-all">
                        <div className="text-3xl mb-2">∞</div>
                        <div className="text-purple-300 font-bold">Possibilities</div>
                      </div>
                      <div className="bg-green-800/30 p-4 rounded-xl text-center border border-green-400/30 hover:scale-110 transition-all">
                        <div className="text-3xl mb-2">🌟</div>
                        <div className="text-green-300 font-bold">Your Future</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-md p-12 rounded-3xl border border-purple-500/30 max-w-4xl mx-auto">
              <h3 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                🚀 YOUR WEB JOURNEY STARTS NOW! 🚀
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                You're about to learn the same technologies that power this incredible web! 
                From HTML to JavaScript, from simple pages to complex applications - 
                <strong className="text-yellow-400"> you're joining the legacy of web creators!</strong>
              </p>
              <div className="flex justify-center items-center gap-4 text-2xl">
                <span>🌟</span>
                <span className="text-cyan-400 font-bold">Ready to build the future web?</span>
                <span>🌟</span>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Section 1 Web Evolution Timeline */}
      <section id="section-4" className="section min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tilt-3d">
            Evolution of Web Technologies
          </h2>
          
          <div className="max-w-6xl mx-auto relative">
            {/* Interactive Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"></div>
            
            <div className="space-y-20">
              <InteractiveTimelineItem 
                year="1989" 
                title="Tim Berners-Lee's Vision" 
                description="At CERN, Tim Berners-Lee proposed a revolutionary system for sharing information between researchers worldwide."
                position="left"
                icon={<Globe className="text-blue-400 animate-pulse" size={28} />}
                color="from-blue-500 to-cyan-500"
              />
              
              <InteractiveTimelineItem 
                year="1991" 
                title="First Website Goes Live" 
                description="info.cern.ch becomes the world's first website, explaining what the World Wide Web is."
                position="right"
                icon={<Code className="text-green-400 animate-bounce" size={28} />}
                color="from-green-500 to-emerald-500"
              />
              
              <InteractiveTimelineItem 
                year="1993" 
                title="Web Goes Public" 
                description="CERN announces that the Web will be free for everyone to use - changing the world forever."
                position="left"
                icon={<Unlock className="text-yellow-400 animate-spin" size={28} />}
                color="from-yellow-500 to-orange-500"
              />

              <InteractiveTimelineItem 
                year="1995" 
                title="JavaScript is Born" 
                description="Brendan Eich creates JavaScript in just 10 days, bringing interactivity to static web pages."
                position="right"
                icon={<Zap className="text-yellow-400 animate-pulse" size={28} />}
                color="from-yellow-500 to-orange-500"
              />

              <InteractiveTimelineItem 
                year="1998" 
                title="CSS Revolution" 
                description="CSS becomes widely adopted, separating content from presentation and enabling better web design."
                position="left"
                icon={<FileText className="text-blue-400 animate-bounce" size={28} />}
                color="from-blue-500 to-purple-500"
              />
              
              <InteractiveTimelineItem 
                year="2000s" 
                title="Web 2.0 Revolution" 
                description="Interactive websites, social media, and user-generated content transform how we connect and share."
                position="right"
                icon={<Wifi className="text-purple-400 animate-pulse" size={28} />}
                color="from-purple-500 to-pink-500"
              />

              <InteractiveTimelineItem 
                year="2008" 
                title="HTML5 & Modern Web" 
                description="HTML5 introduces video, audio, canvas, and semantic elements - the foundation of modern web apps."
                position="left"
                icon={<Play className="text-green-400 animate-bounce" size={28} />}
                color="from-green-500 to-teal-500"
              />

              <InteractiveTimelineItem 
                year="2010s" 
                title="Mobile-First Era" 
                description="Responsive design becomes essential as mobile internet usage surpasses desktop worldwide."
                position="right"
                // icon={<Smartphone className="text-cyan-400 animate-pulse" size={28} />}
                color="from-cyan-500 to-blue-500"
              />

              <InteractiveTimelineItem 
                year="2020s" 
                title="AI-Powered Web" 
                description="Machine learning, AI assistants, and intelligent web applications reshape user experiences."
                position="left"
                // icon={<Brain className="text-purple-400 animate-pulse" size={28} />}
                color="from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </div>
      </section>

       {/* Section 2: How Websites Work - The Request-Response Cycle */}
      <section id="section-2" className="section min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-7xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 tilt-3d">
            How Websites Work
          </h2>
          
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <AnimatedProcessStep 
                step="1" 
                title="DNS Lookup" 
                description="Browser converts domain name to IP address using DNS servers worldwide"
                icon="🔍"
                color="from-blue-500 to-cyan-500"
                delay={0}
              />
              
              <AnimatedProcessStep 
                step="2" 
                title="TCP Connection" 
                description="Browser establishes secure connection with the web server"
                icon="🔗"
                color="from-green-500 to-emerald-500"
                delay={200}
              />
              
              <AnimatedProcessStep 
                step="3" 
                title="HTTP Request" 
                description="Browser sends request with headers, method, and user information"
                icon="📤"
                color="from-purple-500 to-pink-500"
                delay={400}
              />
              
              <AnimatedProcessStep 
                step="4" 
                title="Server Response" 
                description="Server processes request and returns HTML, CSS, JS, and data"
                icon="📥"
                color="from-orange-500 to-red-500"
                delay={600}
              />
            </div>
          </div>
        </div>
      </section>
 {/* Section 3: 3D Tech Cards */}
      <section id="section-2" className="section min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-7xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 tilt-3d">
            Evolution of Web Technologies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Interactive3DTechCard 
              title="HTML" 
              subtitle="Structure & Foundation" 
              description="The backbone of web pages, defining content structure and semantic meaning for the entire web."
              color="from-orange-500 via-red-500 to-pink-500"
              icon="🏗️"
              glowColor="orange"
            />
            
            <Interactive3DTechCard 
              title="CSS" 
              subtitle="Style & Beauty" 
              description="Makes websites visually stunning with colors, layouts, animations, and responsive designs."
              color="from-blue-500 via-cyan-500 to-teal-500"
              icon="🎨"
              glowColor="cyan"
            />
            
            <Interactive3DTechCard 
              title="JavaScript" 
              subtitle="Dynamic Behavior" 
              description="Brings life and interactivity to web pages with dynamic functionality and real-time updates."
              color="from-yellow-500 via-orange-500 to-red-500"
              icon="⚡"
              glowColor="yellow"
            />
            
            <Interactive3DTechCard 
              title="Web 2.0" 
              subtitle="Social Revolution" 
              description="User-generated content, social media platforms, and collaborative web applications emerge."
              color="from-purple-500 via-pink-500 to-rose-500"
              icon="👥"
              glowColor="purple"
            />
            
            <Interactive3DTechCard 
              title="Modern Web" 
              subtitle="App-like Magic" 
              description="PWAs, SPAs, and advanced frameworks creating native-like experiences in the browser."
              color="from-green-500 via-emerald-500 to-teal-500"
              icon="🚀"
              glowColor="green"
            />
            
            <Interactive3DTechCard 
              title="Web3" 
              subtitle="Decentralized Future" 
              description="Blockchain technology, cryptocurrency, and decentralized applications reshaping the internet."
              color="from-indigo-500 via-purple-500 to-blue-500"
              icon="🔗"
              glowColor="indigo"
            />
          </div>
        </div>
      </section>
       {/* Section 3: Frontend vs Backend Architecture */}
      <section id="section-3" className="section min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 tilt-3d">
            Frontend vs Backend
          </h2>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Frontend */}
              <BattleCard
                side="frontend"
                title="Frontend"
                subtitle="The Beautiful Face"
                // icon={<Monitor className="text-pink-400" size={40} />}
                color="from-pink-500 to-purple-500"
                items={[
                  "✨ User Interface Magic",
                  "🎨 Visual Design Wizardry", 
                  "⚡ Interactive Experiences",
                  "📱 Responsive Layouts"
                ]}
                analogy={{
                  emoji: "🍽️",
                  title: "Restaurant Front",
                  desc: "The elegant dining room, beautiful menu, and friendly waiters - everything customers see and love."
                }}
              />

              {/* Backend */}
              <BattleCard
                side="backend"
                title="Backend"
                subtitle="The Powerful Engine"
                icon={<Server className="text-blue-400" size={40} />}
                color="from-blue-500 to-green-500"
                items={[
                  "🔧 Server Logic Power",
                  "🗄️ Database Management", 
                  "🔐 Security & Auth",
                  "⚡ API Orchestration"
                ]}
                analogy={{
                  emoji: "👨‍🍳",
                  title: "Kitchen Mastery",
                  desc: "The bustling kitchen, master chefs, and food storage - all the incredible work behind the scenes."
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Section 3: Web Development Fundamentals - The Building Blocks */}
      <section id="web-fundamentals" className="section min-h-screen py-20 bg-gradient-to-b from-black via-purple-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
              Web Development Fundamentals
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Master the essential building blocks of modern web development
            </p>
          </div>

          {/* HTML Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 mb-4">🏗️ HTML - Structure</h3>
              <p className="text-gray-300 text-base sm:text-lg">The skeleton of every webpage</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md p-6 rounded-xl border border-orange-500/30">
                <h4 className="text-xl font-bold text-orange-400 mb-4">Basic Structure</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Welcome!</h1>
  <p>Hello World</p>
</body>
</html>`}
                </pre>
              </div>
              
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md p-6 rounded-xl border border-orange-500/30">
                <h4 className="text-xl font-bold text-orange-400 mb-4">Semantic Elements</h4>
                <ul className="text-gray-300 space-y-2">
                  <li><code>&lt;header&gt;</code> - Page header</li>
                  <li><code>&lt;nav&gt;</code> - Navigation</li>
                  <li><code>&lt;main&gt;</code> - Main content</li>
                  <li><code>&lt;article&gt;</code> - Article content</li>
                  <li><code>&lt;section&gt;</code> - Content section</li>
                  <li><code>&lt;aside&gt;</code> - Sidebar content</li>
                  <li><code>&lt;footer&gt;</code> - Page footer</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md p-6 rounded-xl border border-orange-500/30">
                <h4 className="text-xl font-bold text-orange-400 mb-4">Forms & Input</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`<form action="/submit" method="POST">
  <input type="text" name="username" 
         placeholder="Username" required>
  <input type="email" name="email" 
         placeholder="Email" required>
  <textarea name="message" 
            placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>`}
                </pre>
              </div>
            </div>
          </div>

          {/* CSS Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-4">🎨 CSS - Styling</h3>
              <p className="text-gray-300 text-base sm:text-lg">Making websites look beautiful</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md p-6 rounded-xl border border-blue-500/30">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Selectors</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`/* Element Selector */
h1 { color: blue; }

/* Class Selector */
.header { font-size: 24px; }

/* ID Selector */
#main { margin: 20px; }

/* Attribute Selector */
[type="text"] { border: 1px solid; }`}
                </pre>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md p-6 rounded-xl border border-blue-500/30">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Flexbox Layout</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 20px;
}

.item {
  flex: 1;
  padding: 10px;
}`}
                </pre>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-md p-6 rounded-xl border border-blue-500/30">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Grid Layout</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}

.header { grid-column: 1 / -1; }
.sidebar { grid-row: 2; }
.main { grid-row: 2; }
.footer { grid-column: 1 / -1; }`}
                </pre>
              </div>
            </div>
          </div>

          {/* JavaScript Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">⚡ JavaScript - Interactivity</h3>
              <p className="text-gray-300 text-base sm:text-lg">Bringing websites to life</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 rounded-xl border border-yellow-500/30">
                <h4 className="text-xl font-bold text-yellow-400 mb-4">DOM Manipulation</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`// Select elements
const button = document.getElementById('myButton');
const heading = document.querySelector('h1');

// Modify content
heading.textContent = 'New Title';
heading.innerHTML = '<span>HTML Content</span>';

// Add event listeners
button.addEventListener('click', function() {
  alert('Button clicked!');
});`}
                </pre>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 rounded-xl border border-yellow-500/30">
                <h4 className="text-xl font-bold text-yellow-400 mb-4">Functions & Variables</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`// Variables
let userName = 'John';
const PI = 3.14159;
var age = 25;

// Functions
function greetUser(name) {
  return 'Hello, ' + name + '!';
}

// Arrow Functions
const calculateArea = (radius) => {
  return PI * radius * radius;
};`}
                </pre>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md p-6 rounded-xl border border-yellow-500/30">
                <h4 className="text-xl font-bold text-yellow-400 mb-4">Async Operations</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`// Fetch API
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Promises
fetch('/api/users')
  .then(response => response.json())
  .then(users => displayUsers(users));`}
                </pre>
              </div>
            </div>
          </div>

          {/* Responsive Design Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-4">📱 Responsive Design</h3>
              <p className="text-gray-300 text-base sm:text-lg">Websites that work on all devices</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md p-6 rounded-xl border border-green-500/30">
                <h4 className="text-xl font-bold text-green-400 mb-4">Media Queries</h4>
                <pre className="text-green-400 text-sm bg-black/50 p-3 rounded overflow-x-auto">
{`/* Mobile First Approach */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet */
@media screen and (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media screen and (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}`}
                </pre>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-md p-6 rounded-xl border border-green-500/30">
                <h4 className="text-xl font-bold text-green-400 mb-4">Responsive Units</h4>
                <ul className="text-gray-300 space-y-3">
                  <li><strong>rem</strong> - Relative to root font size (16px default)</li>
                  <li><strong>em</strong> - Relative to parent element font size</li>
                  <li><strong>vh/vw</strong> - Viewport height/width percentage</li>
                  <li><strong>%</strong> - Percentage of parent element</li>
                  <li><strong>fr</strong> - Fraction unit for CSS Grid</li>
                  <li><strong>clamp()</strong> - Responsive between min/max values</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Web Security & Best Practices */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400 mb-4">🔒 Security & Best Practices</h3>
            <p className="text-gray-300 text-base sm:text-lg">Building secure and accessible websites</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-md p-6 rounded-xl border border-red-500/30">
              <h4 className="text-lg font-bold text-red-400 mb-3">🛡️ HTTPS</h4>
              <p className="text-gray-300 text-sm">Always use HTTPS to encrypt data transmission and protect user privacy.</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-md p-6 rounded-xl border border-red-500/30">
              <h4 className="text-lg font-bold text-red-400 mb-3">🔐 Input Validation</h4>
              <p className="text-gray-300 text-sm">Validate and sanitize all user inputs to prevent XSS and injection attacks.</p>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-md p-6 rounded-xl border border-red-500/30">
              <h4 className="text-lg font-bold text-red-400 mb-3">♿ Accessibility</h4>
              <p className="text-gray-300 text-sm">Use semantic HTML, alt text, proper contrast, and keyboard navigation.</p>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-md p-6 rounded-xl border border-red-500/30">
              <h4 className="text-lg font-bold text-red-400 mb-3">⚡ Performance</h4>
              <p className="text-gray-300 text-sm">Optimize images, minify code, use CDNs, and implement lazy loading.</p>
            </div>
          </div>
        </div>
      </section>

     

     

    

      {/* Section 5: Interactive Demo Hub */}
      <section id="tech-reference" className="section min-h-screen py-20 bg-gradient-to-b from-black via-indigo-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Interactive Learning Hub
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Complete learning resource for web technologies. Click on any topic for detailed explanations, examples, and interactive demos.
            </p>
          </div>

          {/* Interactive Demos */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">🚀 Interactive Demos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                onClick={() => setInteractiveDemo('httpRequest')}
                className="bg-gradient-to-br from-green-900/50 to-teal-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              >
                <div className="text-center">
                  <Terminal className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 mx-auto mb-2 sm:mb-3 group-hover:animate-pulse" />
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">HTTP Request Demo</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Step-by-step HTTP process</p>
                  <div className="mt-2 sm:mt-3 flex items-center justify-center text-green-400 text-xs sm:text-sm">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Try Demo
                  </div>
                </div>
              </div>

              <div
                onClick={() => setInteractiveDemo('dnsLookup')}
                className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              >
                <div className="text-center">
                  <Database className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 mx-auto mb-2 sm:mb-3 group-hover:animate-pulse" />
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">DNS Lookup Demo</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Domain to IP resolution</p>
                  <div className="mt-2 sm:mt-3 flex items-center justify-center text-orange-400 text-xs sm:text-sm">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Try Demo
                  </div>
                </div>
              </div>

              <div
                onClick={() => setInteractiveDemo('webEvolution')}
                className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              >
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mx-auto mb-2 sm:mb-3 group-hover:animate-pulse" />
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Web Evolution</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">History of web technology</p>
                  <div className="mt-2 sm:mt-3 flex items-center justify-center text-purple-400 text-xs sm:text-sm">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Explore
                  </div>
                </div>
              </div>

              <div
                onClick={() => setInteractiveDemo('frontendBackend')}
                className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              >
                <div className="text-center">
                  {/* <GitBranch className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 mx-auto mb-2 sm:mb-3 group-hover:animate-pulse" /> */}
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Frontend vs Backend</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Architecture exploration</p>
                  <div className="mt-2 sm:mt-3 flex items-center justify-center text-blue-400 text-xs sm:text-sm">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Explore
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Reference Cards */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">📚 Tech Reference Guide</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {Object.entries(techReference).map(([key, tech]) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedTech(key);
                    setShowTechDetails(true);
                  }}
                  className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-rotate-1 shadow-2xl hover:shadow-purple-500/30 group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                      {key === 'http' && <Globe className="w-8 h-8 text-white" />}
                      {key === 'https' && <Shield className="w-8 h-8 text-white" />}
                      {key === 'dns' && <Server className="w-8 h-8 text-white" />}
                      {key === 'webSecurity' && <Lock className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{tech.title}</h3>
                    <p className="text-gray-300 text-sm">{tech.description}</p>
                    <div className="mt-4 flex items-center justify-center text-blue-400 text-sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">50+</div>
              <div className="text-gray-300 text-sm sm:text-base">Code Examples</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 sm:mb-2">100+</div>
              <div className="text-gray-300 text-sm sm:text-base">Concepts Covered</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-1 sm:mb-2">25+</div>
              <div className="text-gray-300 text-sm sm:text-base">Interactive Demos</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">∞</div>
              <div className="text-gray-300 text-sm sm:text-base">Learning Potential</div>
            </div>
          </div>
        </div>
      </section>


     


     

      {/* Section 6: Practice & Game Launch */}
      <section id="section-6" className="section min-h-screen py-20 bg-gradient-to-b from-black via-purple-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 tilt-3d">
            You're Now a Web Wizard! 🧙‍♂️
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              <MagicalRecapItem icon="�️" title="HTML Structure" />
              <MagicalRecapItem icon="🎨" title="CSS Styling" />
              <MagicalRecapItem icon="⚡" title="JavaScript Magic" />
              <MagicalRecapItem icon="📱" title="Responsive Design" />
              <MagicalRecapItem icon="🔍" title="HTTP Requests" />
              <MagicalRecapItem icon="🏛️" title="Frontend/Backend" />
              <MagicalRecapItem icon="🚀" title="Web Evolution" />
              <MagicalRecapItem icon="🛡️" title="Web Security" />
            </div>
            
            <div className="text-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-12 rounded-3xl border border-white/20">
                  <h3 className="text-3xl font-bold mb-6">🎉 Congratulations, Web Master! 🎉</h3>
                  <p className="text-xl mb-8 opacity-90">You've unlocked the secrets of how the internet works!</p>
                  <p className="text-lg mb-8 opacity-80">Now test your knowledge with our interactive escape game!</p>
                  <button 
                    onClick={() => window.location.href = '/game'}
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-12 py-4 rounded-full font-bold text-xl hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">🎮 Start the Epic Web Game & Quiz!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

    {/* Interactive Demo Modal */}
    {interactiveDemo && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/30 relative">
          <button
            onClick={() => setInteractiveDemo(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors z-10"
          >
            ✕
          </button>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {interactiveDemo === 'httpRequest' && '🌐 HTTP Request Demo'}
                {interactiveDemo === 'dnsLookup' && '🔍 DNS Lookup Demo'}
                {interactiveDemo === 'webEvolution' && '🚀 Web Technologies Evolution'}
                {interactiveDemo === 'frontendBackend' && '⚔️ Frontend vs Backend Battle'}
              </h2>
              <p className="text-gray-300">
                {interactiveDemo === 'httpRequest' && 'Interactive simulation of HTTP request/response cycle'}
                {interactiveDemo === 'dnsLookup' && 'Step-by-step DNS resolution process'}
                {interactiveDemo === 'webEvolution' && 'Journey through the evolution of web technologies'}
                {interactiveDemo === 'frontendBackend' && 'Explore the differences between frontend and backend development'}
              </p>
            </div>

            {interactiveDemo === 'httpRequest' && <HTTPRequestDemo />}
            {interactiveDemo === 'dnsLookup' && <DNSLookupDemo />}
            {interactiveDemo === 'webEvolution' && <WebEvolutionDemo />}
            {interactiveDemo === 'frontendBackend' && <FrontendBackendDemo />}
          </div>
        </div>
      </div>
    )}
    
    
    </div>
  );
}

// Enhanced Interactive Components
const InteractiveTimelineItem = ({ year, title, description, position, icon, color }) => (
  <div className={`timeline-item flex items-center ${position === 'left' ? 'justify-start' : 'justify-end'} relative opacity-0 transition-all duration-1000 ${position === 'left' ? 'translate-x-[-200px]' : 'translate-x-[200px]'} scale-75 blur-sm rotateZ-[15deg]`}>
    <div className={`w-1/2 ${position === 'left' ? 'pr-12 text-right' : 'pl-12 text-left'} group`}>
      <div className={`bg-gradient-to-br ${color}/20 backdrop-blur-md p-8 rounded-2xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-110 hover:-rotate-2 shadow-2xl hover:shadow-cyan-500/30 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            {position === 'left' && <span className="mr-4 text-3xl">{icon}</span>}
            <span className="text-4xl font-bold text-white">{year}</span>
            {position === 'right' && <span className="ml-4 text-3xl">{icon}</span>}
          </div>
          <h3 className="text-2xl font-bold mb-3 text-cyan-300">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
    
    {/* Central Timeline Dot */}
    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full border-4 border-white shadow-lg shadow-cyan-500/50 z-10 group-hover:scale-150 transition-all duration-300"></div>
  </div>
);

const Interactive3DTechCard = ({ title, subtitle, description, color, icon, glowColor }) => (
  <div 
    className="tech-card opacity-0 translate-y-[100px] rotateY-[45deg] rotateX-[45deg] scale-75 blur-sm transition-all duration-1000 group cursor-pointer"
    onMouseEnter={() => setActiveCard(title)}
    onMouseLeave={() => setActiveCard(null)}
  >
    <div className={`relative bg-gradient-to-br ${color}/20 backdrop-blur-md p-8 rounded-3xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 hover:rotate-3 shadow-2xl hover:shadow-${glowColor}-500/30 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 text-center">
        <div className="text-6xl mb-4 animate-bounce">{icon}</div>
        <h3 className="text-3xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-lg text-cyan-300 mb-4 font-semibold">{subtitle}</p>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        <div className="mt-6">
          <div className={`w-full h-2 bg-gradient-to-r ${color} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
        </div>
      </div>
    </div>
  </div>
);

const BattleCard = ({ side, title, subtitle, icon, color, items, analogy }) => (
  <div className="relative group">
    <div className={`bg-gradient-to-br ${color}/20 backdrop-blur-md p-10 rounded-3xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-purple-500/30 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          {icon}
          <div className="ml-4">
            <h3 className="text-4xl font-bold text-white">{title}</h3>
            <p className="text-xl text-gray-300">{subtitle}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center text-lg text-gray-300 hover:text-white transition-colors">
              <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
              {item}
            </div>
          ))}
        </div>
        
        <div className={`bg-gradient-to-r ${color}/30 p-6 rounded-2xl border border-white/20`}>
          <div className="flex items-center mb-3">
            <span className="text-4xl mr-3">{analogy.emoji}</span>
            <h4 className="text-2xl font-bold text-white">{analogy.title}</h4>
          </div>
          <p className="text-gray-300">{analogy.desc}</p>
        </div>
      </div>
    </div>
  </div>
);

const AnimatedProcessStep = ({ step, title, description, icon, color, delay }) => (
  <div className="process-step opacity-0 translate-y-[100px] scale-75 rotate-[15deg] transition-all duration-1000 group">
    <div className={`relative bg-gradient-to-br ${color}/20 backdrop-blur-md p-8 rounded-3xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-110 hover:-rotate-3 shadow-2xl hover:shadow-cyan-500/30 overflow-hidden text-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 animate-pulse`}>
          {step}
        </div>
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        
        {step !== "4" && (
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
            <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  </div>
);

const SecurityCard = ({ type, title, icon, description, features, color }) => (
  <div className="relative group">
    <div className={`bg-gradient-to-br ${color}/20 backdrop-blur-md p-10 rounded-3xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 shadow-2xl overflow-hidden ${type === 'insecure' ? 'hover:shadow-red-500/30' : 'hover:shadow-green-500/30'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 text-center">
        <div className="mb-6">
          {icon}
        </div>
        <h3 className="text-4xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-xl text-gray-300 mb-8">{description}</p>
        
        <div className="space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="text-lg text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              {feature}
            </div>
          ))}
        </div>
        
        <div className={`mt-8 w-full h-3 bg-gradient-to-r ${color} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
      </div>
    </div>
  </div>
);

const MagicalRecapItem = ({ icon, title }) => (
  <div className="recap-item opacity-0 scale-75 rotate-[15deg] transition-all duration-1000 group cursor-pointer">
    <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-110 hover:-rotate-3 shadow-2xl hover:shadow-purple-500/30 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="text-4xl mb-3 animate-bounce">{icon}</div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>
    </div>
  </div>
);

export default App;