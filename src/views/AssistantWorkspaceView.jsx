import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  Square, 
  Send, 
  Volume2, 
  Settings, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askAyuSwarBrain, AI_PROVIDERS, getAiConfig, saveAiConfig } from '../services/aiBrainService';
import { speechService } from '../services/indicSpeechService';
import DoctorAvatarFace from '../components/DoctorAvatarFace';

export default function AssistantWorkspaceView() {
  const { selectedLanguage, setSelectedLanguage, speechProviderStatus } = useApp();

  const [role, setRole] = useState('receptionist'); // 'receptionist' | 'doctor' | 'patient'
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste! Welcome to AyuSwar Virtual Assistant workspace. How can I assist you with hospital navigation, appointment scheduling, or spoken prescription demonstrations today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings
  const [aiProvider, setAiProvider] = useState(() => getAiConfig().provider);
  const [apiKey, setApiKey] = useState(() => getAiConfig().apiKey);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    setInputText('');
    const userMsg = { id: `user_${Date.now()}`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await askAyuSwarBrain(text, role);
      const assistantMsg = { id: `bot_${Date.now()}`, sender: 'assistant', text: response };
      setMessages(prev => [...prev, assistantMsg]);

      // Read out in selected language
      setIsSpeaking(true);
      speechService.speak(response, {
        langCode: selectedLanguage,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue processing that query. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleMic = () => {
    if (isListeningMic) {
      speechService.stopLiveRecognition();
      setIsListeningMic(false);
      return;
    }

    setIsListeningMic(true);
    speechService.startLiveRecognition({
      langCode: selectedLanguage,
      onResult: ({ finalTranscript }) => {
        if (finalTranscript) {
          setInputText(finalTranscript);
          handleSendMessage(finalTranscript);
          speechService.stopLiveRecognition();
          setIsListeningMic(false);
        }
      },
      onError: (err) => {
        setIsListeningMic(false);
      },
      onStatusChange: ({ isListening }) => {
        setIsListeningMic(isListening);
      }
    });
  };

  const handleSaveSettings = () => {
    saveAiConfig(aiProvider, apiKey);
    setSettingsOpen(false);
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Virtual Assistant Workspace</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,139,139,0.1)', color: '#008B8B', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Bot size={14} />
            <span>DEDICATED CONVERSATIONAL WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
            AyuSwar Multilingual Assistant
          </h1>
          <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
            Demonstrates voice and text assistance for clinic reception, patient navigation, and clinical co-pilot draft documentation notes.
          </p>
        </div>

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#0A2540',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Settings size={15} color="#008B8B" />
          <span>{settingsOpen ? 'Close Settings' : 'Assistant Settings'}</span>
        </button>
      </div>

      {/* Settings Drawer / Panel if open */}
      {settingsOpen && (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #CBD5E1', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
            AI Engine & Provider Configuration
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Active AI Reasoning Provider:
              </label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0A2540' }}
              >
                {AI_PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                External API Key (Optional — stored in your browser localStorage only):
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Leave blank to use free local heuristic demo"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0A2540' }}
              />
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#008B8B', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
          >
            Save Configuration
          </button>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Chat Conversation Stream */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', height: '620px', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
          {/* Persona Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', marginBottom: '16px' }}>
            {[
              { id: 'receptionist', label: 'Hospital Receptionist' },
              { id: 'patient', label: 'Patient Wellness Guide' },
              { id: 'doctor', label: 'Doctor Co-Pilot (Draft Notes)' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === p.id ? '#0A2540' : '#F1F5F9',
                  color: role === p.id ? '#FFFFFF' : '#475569',
                  fontSize: '12px',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '6px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {msg.sender === 'assistant' && (
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E6F7F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="#008B8B" />
                  </div>
                )}
                <div style={{
                  background: msg.sender === 'user' ? '#0A2540' : '#F8FAFC',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', paddingLeft: '40px' }}>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button
              onClick={handleToggleMic}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                border: 'none',
                background: isListeningMic ? '#DC2626' : '#F1F5F9',
                color: isListeningMic ? '#FFFFFF' : '#0A2540',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title={isListeningMic ? "Stop Microphone" : "Speak via Microphone"}
            >
              {isListeningMic ? <Square size={16} fill="#FFF" /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question in English, Telugu, or Hindi..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                color: '#0A2540'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isProcessing || !inputText.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                border: 'none',
                background: '#008B8B',
                color: '#FFFFFF',
                cursor: isProcessing || !inputText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Virtual Avatar Box (Cleanly contained, NOT floating over working screen!) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#041322', borderRadius: '16px', border: '1.5px solid rgba(0,139,139,0.3)', overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00F5D4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Virtual Avatar Assistant
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {isSpeaking ? 'Speaking' : isListeningMic ? 'Listening' : 'Idle'}
              </span>
            </div>

            <DoctorAvatarFace
              doctorName={role === 'doctor' ? 'Dr. Priya Sharma, MD' : 'AyuSwar Assistant'}
              isSpeaking={isSpeaking}
              isListening={isListeningMic}
              isEmergency={false}
            />

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                {role === 'doctor' ? 'Dr. Priya Sharma (Co-Pilot)' : 'AyuSwar Hospital Guide'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                Synthesized Virtual Assistant Animation
              </div>
            </div>
          </div>

          {/* Quick Guidance Prompts */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
              Sample Demo Questions:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'How do I book an OPD token in Telugu?',
                'What is an ABHA digital health account?',
                'Where is Room 104 in the hospital?',
                'నాకు దగ్గు ఎక్కువగా ఉంది, ఏ విభాగానికి వెళ్ళాలి?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#0A2540',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
