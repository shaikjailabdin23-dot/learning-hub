import React, { useState } from 'react';
import { codingLanguages, dsaTopics, codingProblems, codeLibrary } from '../data/codingData';
import SearchBar from '../components/SearchBar';

const CodingHub = () => {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' or 'library'
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProblem, setActiveProblem] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter problems
  const filteredProblems = codingProblems.filter((p) => {
    const matchesTopic = selectedTopic === 'All Topics' || p.topic === selectedTopic;
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesDiff && matchesSearch;
  });

  const handleOpenProblem = (p) => {
    setActiveProblem(p);
    setShowHint(false);
    setShowSolution(false);
    setCopiedCode(false);
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="coding-hub-page animate-fade-in">
      {/* Hero Banner */}
      <section className="hub-hero">
        <div className="hub-hero-header">
          <div className="hub-hero-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            ⚡
          </div>
          <div>
            <h1 className="hub-hero-title">Coding & DSA Hub</h1>
            <p className="hub-hero-desc">
              Master algorithmic problem solving for top tech company interviews. Practice curated Data Structures
              and Algorithms across Arrays, Sliding Window, Trees, and Dynamic Programming.
            </p>
          </div>
        </div>

        <div className="hub-stats-row">
          <div className="hub-stat-item">
            <span className="hub-stat-num">14</span>
            <span className="hub-stat-text">DSA Topics</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">5</span>
            <span className="hub-stat-text">Solved Today</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">88%</span>
            <span className="hub-stat-text">Accuracy Rate</span>
          </div>
          <div className="hub-stat-item">
            <span className="hub-stat-num">7 Days</span>
            <span className="hub-stat-text">Active Streak</span>
          </div>
        </div>
      </section>

      {/* Main Tab Switcher (Problems vs Code Library) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          type="button"
          className={activeTab === 'problems' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('problems')}
        >
          🧩 Practice Problems ({codingProblems.length})
        </button>
        <button
          type="button"
          className={activeTab === 'library' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('library')}
        >
          📖 Code Library & Templates
        </button>
      </div>

      {activeTab === 'problems' ? (
        <>
          {/* Controls Bar */}
          <section className="filter-search-bar">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search problems by name or concept..."
            />

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </section>

          {/* DSA Topic Filter Tabs */}
          <div className="category-tabs" role="tablist">
            {dsaTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`category-tab ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Problems List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredProblems.map((prob) => {
              const diffClass =
                prob.difficulty === 'Easy'
                  ? 'badge-beginner'
                  : prob.difficulty === 'Medium'
                  ? 'badge-intermediate'
                  : 'badge-advanced';

              return (
                <div key={prob.id} className="problem-row">
                  <div className="problem-left">
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <div>
                      <div className="problem-title">{prob.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {prob.topic} • Acceptance: {prob.acceptance}
                      </div>
                    </div>
                  </div>

                  <div className="problem-meta">
                    <span className={`badge ${diffClass}`}>{prob.difficulty}</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleOpenProblem(prob)}
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      Solve Problem →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Code Library & Templates Section */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
              ⚡ Core Algorithm Implementations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {codeLibrary.algorithms.map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                    <span className="badge badge-accent">{item.category}</span>
                  </div>
                  <pre className="code-snippet-box">{item.code}</pre>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleCopyCode(item.code)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    Copy Algorithm Snippet 📋
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
              🛠️ High-Frequency Interview Templates
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {codeLibrary.templates.map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                    <span className="badge badge-intermediate">{item.category}</span>
                  </div>
                  <pre className="code-snippet-box">{item.code}</pre>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleCopyCode(item.code)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    Copy Template Snippet 📋
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Problem Solver Modal */}
      {activeProblem && (
        <div className="modal-overlay" onClick={() => setActiveProblem(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="badge badge-accent">{activeProblem.topic}</span>
                  <span
                    className={`badge ${
                      activeProblem.difficulty === 'Easy'
                        ? 'badge-beginner'
                        : activeProblem.difficulty === 'Medium'
                        ? 'badge-intermediate'
                        : 'badge-advanced'
                    }`}
                  >
                    {activeProblem.difficulty}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.6rem' }}>{activeProblem.title}</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setActiveProblem(null)}
                style={{ fontSize: '1.3rem' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Problem Description</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{activeProblem.description}</p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Input: </strong>
                  <code style={{ color: 'var(--accent-secondary)' }}>{activeProblem.input}</code>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Expected Output: </strong>
                  <code style={{ color: '#4ade80' }}>{activeProblem.output}</code>
                </div>
                <div>
                  <strong>Example Walkthrough: </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{activeProblem.example}</span>
                </div>
              </div>

              {/* Hint Toggle */}
              <div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowHint(!showHint)}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  {showHint ? '🙈 Hide Hint' : '💡 Need a Hint?'}
                </button>
                {showHint && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      borderLeft: '4px solid #fbbf24',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      marginTop: '0.75rem',
                      fontSize: '0.92rem',
                      color: '#fef3c7',
                    }}
                  >
                    {activeProblem.hint}
                  </div>
                )}
              </div>

              {/* Solution Toggle */}
              <div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowSolution(!showSolution)}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
                >
                  {showSolution ? 'Hide Solution' : 'Reveal Optimal Solution 🚀'}
                </button>
                {showSolution && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        JavaScript Implementation
                      </span>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleCopyCode(activeProblem.solution)}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {copiedCode ? '✓ Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="code-snippet-box">{activeProblem.solution}</pre>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      <strong>Why this works:</strong> {activeProblem.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setActiveProblem(null)}>
                Done Practicing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingHub;
