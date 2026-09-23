import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import topicService from '../services/topicService';
import { useProgress } from '../hooks/useProgress';

const Topic = () => {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState({});
  const [copiedCode, setCopiedCode] = useState(false);

  const { progress, markTopicComplete } = useProgress();

  useEffect(() => {
    setLoading(true);
    setError(null);
    topicService
      .getTopicById(topicSlug)
      .then((data) => {
        setTopic(data);
      })
      .catch((err) => {
        setError('Topic not found or failed to load.');
      })
      .finally(() => setLoading(false));
  }, [topicSlug]);

  const isCompleted = progress?.completedTopicsList?.includes(topicSlug);

  const handleMarkComplete = async () => {
    await markTopicComplete(topicSlug, topic?.hubSlug || 'technical');
  };

  const handleCopyCode = (codeStr) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleAnswer = (idx) => {
    setShowAnswer((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading topic lesson...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Topic Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          We couldn't locate the curriculum module for "{topicSlug}".
        </p>
        <Link to="/technical-hub" className="btn-primary">
          Back to Technical Hub
        </Link>
      </div>
    );
  }

  const diffClass =
    topic.difficulty === 'Beginner'
      ? 'badge-beginner'
      : topic.difficulty === 'Intermediate'
      ? 'badge-intermediate'
      : 'badge-advanced';

  return (
    <div className="topic-reader-page animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        <Link to="/dashboard">Dashboard</Link>
        <span>/</span>
        <Link to="/technical-hub">Technical Hub</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{topic.title}</span>
      </div>

      <div className="topic-page-layout">
        {/* Main Lesson Content */}
        <div className="topic-reader-main">
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span className={`badge ${diffClass}`}>{topic.difficulty || 'Intermediate'}</span>
              <span className="badge badge-accent">{topic.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ⏱️ {topic.estimatedTime || '20 mins'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{topic.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {topic.description}
            </p>
          </div>

          {/* Section: What Is It? */}
          <div className="topic-section-card">
            <h3>📖 1. What Is It?</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.7 }}>
              {topic.whatIsIt || topic.description}
            </p>
          </div>

          {/* Section: Why Learn It? */}
          <div className="topic-section-card">
            <h3>🎯 2. Why Learn It?</h3>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.7 }}>
              {topic.whyLearnIt || 'Understanding this concept provides essential engineering foundation.'}
            </p>
          </div>

          {/* Section: Simple Explanation */}
          <div
            className="topic-section-card"
            style={{
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(13, 27, 42, 0.8) 100%)',
              border: '1px solid rgba(108, 99, 255, 0.3)',
            }}
          >
            <h3 style={{ color: '#fbbf24' }}>💡 3. Simple Everyday Analogy</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#fef3c7' }}>
              {topic.simpleExplanation || 'Think of this concept like a standard recipe in a kitchen.'}
            </p>
          </div>

          {/* Section: Real-World Example & Industry Use */}
          <div className="topic-section-card">
            <h3>🌍 4. Real-World Applications & Industry Use</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Real-World Example: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{topic.realWorldExample}</span>
            </div>
            <div>
              <strong>Where Used in Production: </strong>
              <span style={{ color: 'var(--accent-secondary)' }}>{topic.whereUsed}</span>
            </div>
          </div>

          {/* Section: Key Points & Advantages */}
          <div className="topic-section-card">
            <h3>⭐ 5. Key Points & Advantages</h3>
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Core Concepts:
                </h4>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                  {topic.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {topic.advantages && topic.advantages.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Key Advantages:
                </h4>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                  {topic.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section: Code Example */}
          {topic.codeExample && (
            <div className="topic-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>💻 6. Implementation & Code Walkthrough</h3>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleCopyCode(topic.codeExample.code)}
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                >
                  {copiedCode ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>

              <pre className="code-snippet-box">{topic.codeExample.code}</pre>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                <strong>Explanation: </strong> {topic.codeExample.explanation}
              </p>
            </div>
          )}

          {/* Section: Practice Questions */}
          {topic.practiceQuestions && topic.practiceQuestions.length > 0 && (
            <div className="topic-section-card">
              <h3>📝 7. Practice Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topic.practiceQuestions.map((pq, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                      Q{idx + 1}: {pq.question}
                    </div>
                    {pq.hint && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        💡 Hint: {pq.hint}
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => toggleAnswer(idx)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                    >
                      {showAnswer[idx] ? 'Hide Answer' : 'Reveal Answer'}
                    </button>
                    {showAnswer[idx] && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem',
                          background: 'rgba(34, 197, 94, 0.1)',
                          borderLeft: '3px solid var(--success)',
                          fontSize: '0.9rem',
                          color: '#86efac',
                        }}
                      >
                        {pq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Sidebar */}
        <aside>
          <div className="topic-sidebar-widget">
            <h4 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Lesson Progress
            </h4>

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Status:
              </div>
              {isCompleted ? (
                <div style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ✓ Completed Lesson
                </div>
              ) : (
                <div style={{ color: '#fbbf24', fontWeight: 600 }}>In Progress</div>
              )}
            </div>

            <button
              type="button"
              className={isCompleted ? 'btn-secondary' : 'btn-primary'}
              onClick={handleMarkComplete}
              style={{ width: '100%' }}
            >
              {isCompleted ? '✓ Marked as Completed' : 'Mark as Complete ✓'}
            </button>

            <Link
              to={`/quiz/${topic.slug || topicSlug}`}
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0284c7 100%)',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
              }}
            >
              Take Topic Quiz ⚡
            </Link>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                Related Curricula:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {topic.relatedTopics?.map((rel, idx) => (
                  <Link
                    key={idx}
                    to={`/topic/${rel}`}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--accent-secondary)',
                      padding: '0.25rem 0',
                    }}
                  >
                    • {rel.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Topic;
