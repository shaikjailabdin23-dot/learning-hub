import React from 'react';
import { Link } from 'react-router-dom';

const TopicCard = ({ topic, hubSlug = 'technical' }) => {
  const diffClass =
    topic.difficulty === 'Beginner'
      ? 'badge-beginner'
      : topic.difficulty === 'Intermediate'
      ? 'badge-intermediate'
      : 'badge-advanced';

  return (
    <Link to={`/topic/${topic.slug || topic.id}`} className="topic-card">
      <div className="topic-card-header">
        <span className={`badge ${diffClass}`}>{topic.difficulty || 'All Levels'}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ⏱️ {topic.estimatedTime || '20 mins'}
        </span>
      </div>

      <h4 className="topic-card-title">{topic.title}</h4>
      <p className="topic-card-desc">{topic.description}</p>

      <div className="topic-card-footer">
        <span style={{ color: 'var(--accent-secondary)', fontWeight: 500 }}>
          {topic.category}
        </span>
        {topic.isCompleted ? (
          <span className="topic-completed-indicator">✓ Completed</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Start Lesson →</span>
        )}
      </div>
    </Link>
  );
};

export default TopicCard;
