import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { careerRoadmapsData, careerPathsList } from '../data/careerRoadmapsData';
import careerService from '../services/careerService';
import activityService from '../services/activityService';
import ProgressBar from '../components/ProgressBar';

const CareerHub = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active view tab inside Career Hub
  const [activeTab, setActiveTab] = useState('roadmap');
  // 'roadmap' | 'profile' | 'skillgap' | 'learning' | 'projects' | 'certifications' | 'interview' | 'resume' | 'roles' | 'compare' | 'ai'

  // Selected Career Path
  const [selectedCareer, setSelectedCareer] = useState('Software Developer');

  // Student Career Profile state
  const [profile, setProfile] = useState({
    education: 'B.Tech',
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    currentSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    programmingLanguages: ['JavaScript', 'Python', 'C++'],
    areasOfInterest: ['Full Stack Development', 'Cloud Computing'],
    careerGoal: 'Software Engineer at Top Tech Company',
    skillLevel: 'Intermediate',
    projectsCompleted: 2,
    certifications: ['Full Stack Web Development'],
    preferredTechnology: 'React & Node.js',
  });

  // Track completed skills, completed topics, project statuses, and interview checklist
  const [completedSkills, setCompletedSkills] = useState([
    'Programming Fundamentals',
    'Git & GitHub',
    'HTML5 Semantic Markup',
    'Modern JavaScript (ES6+)',
  ]);
  const [projectStatuses, setProjectStatuses] = useState({
    'sd-proj-1': 'Completed',
    'sd-proj-2': 'In Progress',
  });
  const [completedInterviews, setCompletedInterviews] = useState(['tech-q-0', 'check-0', 'check-1']);
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // AI Recommendation State
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [comparingCareers, setComparingCareers] = useState(['Software Developer', 'Web Developer']);

  // Load persisted student career profile on mount
  useEffect(() => {
    careerService.getProfile().then((data) => {
      if (data) {
        if (data.selectedCareer && careerRoadmapsData[data.selectedCareer]) {
          setSelectedCareer(data.selectedCareer);
        }
        setProfile((prev) => ({
          ...prev,
          education: data.education || prev.education,
          branch: data.branch || prev.branch,
          year: data.year || prev.year,
          currentSkills: data.currentSkills || prev.currentSkills,
          programmingLanguages: data.programmingLanguages || prev.programmingLanguages,
          areasOfInterest: data.areasOfInterest || prev.areasOfInterest,
          careerGoal: data.careerGoal || prev.careerGoal,
          skillLevel: data.skillLevel || prev.skillLevel,
          projectsCompleted: data.projectsCompleted !== undefined ? data.projectsCompleted : prev.projectsCompleted,
          certifications: data.certifications || prev.certifications,
          preferredTechnology: data.preferredTechnology || prev.preferredTechnology,
        }));
        if (data.completedSkills) setCompletedSkills(data.completedSkills);
        if (data.projectProgress) setProjectStatuses(data.projectProgress);
        if (data.interviewProgress) setCompletedInterviews(data.interviewProgress);
      }
    });

    // Telemetry tracking
    activityService.track('Career Hub', 'career_view', { career: selectedCareer });
  }, []);

  // Sync to backend & local storage whenever key progress changes
  const persistChanges = async (newCareer, newSkills, newProjects, newInterviews, newProfile) => {
    const c = newCareer || selectedCareer;
    const s = newSkills || completedSkills;
    const p = newProjects || projectStatuses;
    const i = newInterviews || completedInterviews;
    const prof = newProfile || profile;

    // Calculate updated metrics
    const currentCareerData = careerRoadmapsData[c] || careerRoadmapsData['Software Developer'];
    const totalRequired = currentCareerData.requiredSkills?.length || 10;
    const matched = s.filter((sk) => currentCareerData.requiredSkills.includes(sk)).length;
    const readiness = Math.min(100, Math.round((matched / totalRequired) * 100));

    const totalProjects = currentCareerData.projects?.length || 3;
    const completedCount = Object.values(p).filter((status) => status === 'Completed').length;
    const roadmapPct = Math.min(100, Math.round((readiness * 0.6) + ((completedCount / Math.max(1, totalProjects)) * 40)));

    setSavingStatus(true);
    await careerService.updateProfile({
      selectedCareer: c,
      ...prof,
      completedSkills: s,
      projectProgress: p,
      interviewProgress: i,
      careerReadiness: readiness,
      roadmapProgress: roadmapPct,
      projectsCompleted: completedCount,
    });
    setSavingStatus(false);
  };

  // Get current career roadmap data
  const currentCareerData = useMemo(() => {
    return careerRoadmapsData[selectedCareer] || careerRoadmapsData['Software Developer'];
  }, [selectedCareer]);

  // Skill Gap Analysis calculation
  const skillGapData = useMemo(() => {
    const required = currentCareerData.requiredSkills || [];
    const completed = [];
    const improve = [];
    const missing = [];

    required.forEach((reqSkill) => {
      const isCompleted = completedSkills.some(
        (s) => s.toLowerCase() === reqSkill.toLowerCase() || s.toLowerCase().includes(reqSkill.toLowerCase())
      );
      const isCurrent = profile.currentSkills?.some(
        (s) => s.toLowerCase() === reqSkill.toLowerCase() || s.toLowerCase().includes(reqSkill.toLowerCase())
      );

      if (isCompleted) {
        completed.push(reqSkill);
      } else if (isCurrent) {
        improve.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const readinessPct = Math.min(100, Math.round((completed.length / Math.max(1, required.length)) * 100));

    // Next incomplete skill from missing or improve list
    const nextSkill = improve[0] || missing[0] || 'Advanced System Design';

    return {
      completed,
      improve,
      missing,
      readinessPct,
      nextSkill,
    };
  }, [currentCareerData, completedSkills, profile.currentSkills]);

  // Total projects completed in this career
  const projectsCompletedCount = useMemo(() => {
    const careerProjIds = currentCareerData.projects.map((p) => p.id);
    return careerProjIds.filter((id) => projectStatuses[id] === 'Completed').length;
  }, [currentCareerData, projectStatuses]);

  // Interview preparation readiness calculation
  const interviewReadinessPct = useMemo(() => {
    const checklist = currentCareerData.interviewPreparation?.interviewChecklist || [];
    const questions = currentCareerData.interviewPreparation?.technicalQuestions || [];
    const totalItems = checklist.length + questions.length;
    if (totalItems === 0) return 40;
    const completed = completedInterviews.length;
    return Math.min(100, Math.round((completed / totalItems) * 100));
  }, [currentCareerData, completedInterviews]);

  // Overall Roadmap Progress Percentage
  const overallRoadmapProgress = useMemo(() => {
    const skillScore = skillGapData.readinessPct * 0.5;
    const projectScore = (projectsCompletedCount / Math.max(1, currentCareerData.projects.length)) * 30;
    const interviewScore = interviewReadinessPct * 0.2;
    return Math.min(100, Math.round(skillScore + projectScore + interviewScore));
  }, [skillGapData, projectsCompletedCount, interviewReadinessPct, currentCareerData]);

  // Smart Next-Step System reasoning
  const smartNextStep = useMemo(() => {
    const next = skillGapData.nextSkill;
    const isMissing = skillGapData.missing.includes(next);
    return {
      skill: next,
      action: isMissing ? `Learn ${next} Fundamentals` : `Advance & Practice ${next}`,
      reason: `${next} is a core prerequisite for the ${selectedCareer} roadmap to bridge your skill gap toward ${Math.min(100, skillGapData.readinessPct + 15)}% readiness.`,
    };
  }, [skillGapData, selectedCareer]);

  // Handlers
  const handleCareerChange = (newCareer) => {
    setSelectedCareer(newCareer);
    persistChanges(newCareer, null, null, null, null);
    activityService.track('Career Hub', 'career_change', { career: newCareer });
  };

  const handleToggleSkill = (skillName) => {
    let updated;
    if (completedSkills.includes(skillName)) {
      updated = completedSkills.filter((s) => s !== skillName);
    } else {
      updated = [...completedSkills, skillName];
    }
    setCompletedSkills(updated);
    persistChanges(null, updated, null, null, null);
  };

  const handleProjectStatusChange = (projId, newStatus) => {
    const updated = { ...projectStatuses, [projId]: newStatus };
    setProjectStatuses(updated);
    persistChanges(null, null, updated, null, null);
  };

  const handleToggleInterviewItem = (itemId) => {
    let updated;
    if (completedInterviews.includes(itemId)) {
      updated = completedInterviews.filter((id) => id !== itemId);
    } else {
      updated = [...completedInterviews, itemId];
    }
    setCompletedInterviews(updated);
    persistChanges(null, null, null, updated, null);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    persistChanges(null, null, null, null, profile);
    setSaveMessage('Career profile saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Run AI Career Recommendation logic
  const handleRunAiRecommendation = () => {
    const interests = (profile.areasOfInterest || []).map((i) => i.toLowerCase());
    const skills = (profile.currentSkills || []).map((s) => s.toLowerCase());
    const langs = (profile.programmingLanguages || []).map((l) => l.toLowerCase());
    const allUserTags = [...interests, ...skills, ...langs, profile.branch.toLowerCase()];

    const scored = careerPathsList.map((cName) => {
      const cData = careerRoadmapsData[cName];
      const matchCriteria = cData.aiMatchCriteria || { interests: [], skills: [] };
      let matchCount = 0;

      matchCriteria.interests.forEach((item) => {
        if (allUserTags.some((t) => t.includes(item) || item.includes(t))) matchCount += 2;
      });
      matchCriteria.skills.forEach((item) => {
        if (allUserTags.some((t) => t.includes(item) || item.includes(t))) matchCount += 3;
      });

      const required = cData.requiredSkills || [];
      const userHas = completedSkills.filter((s) => required.some((r) => r.toLowerCase().includes(s.toLowerCase())));
      const missing = required.filter((r) => !userHas.some((u) => r.toLowerCase().includes(u.toLowerCase())));

      const matchPct = Math.min(98, Math.max(45, 50 + matchCount * 6));

      return {
        careerName: cName,
        data: cData,
        matchPct,
        matchReason: `Matches your interest in ${cData.category} and background in ${profile.branch}. Your skills in ${skills.slice(0, 2).join(', ') || 'software'} provide a strong baseline.`,
        requiredSkills: required.slice(0, 4),
        missingSkills: missing.slice(0, 3),
        suggestedNextStep: missing[0] || 'Complete Capstone Project',
      };
    });

    scored.sort((a, b) => b.matchPct - a.matchPct);
    setAiSuggestions(scored.slice(0, 3));
    activityService.track('Career Hub', 'ai_recommendation', { topCareer: scored[0]?.careerName });
  };

  return (
    <div className="career-hub-page animate-fade-in" style={{ padding: '1.5rem 2rem' }}>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.16) 0%, rgba(0, 212, 255, 0.12) 100%)',
          border: '1px solid rgba(108, 99, 255, 0.3)',
          borderRadius: 'var(--radius)',
          padding: '2rem 2.25rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(108, 99, 255, 0.2)', border: '1px solid rgba(108, 99, 255, 0.4)', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
              <span>🎯</span> Complete Career Roadmap & Skill System
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>
              Career Hub & Planning Platform
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.6', margin: 0, maxWidth: '680px' }}>
              Plan your student engineering path, bridge real skill gaps, follow structured Beginner-to-Job Ready roadmaps, build recommended projects, and master interview preparation.
            </p>
          </div>

          {/* Quick Career Selector Dropdown */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem 1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '260px',
            }}
          >
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Current Career Target
            </label>
            <select
              value={selectedCareer}
              onChange={(e) => handleCareerChange(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid var(--accent)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              {careerPathsList.map((cName) => (
                <option key={cName} value={cName} style={{ background: '#0d1b2a', color: '#fff' }}>
                  {careerRoadmapsData[cName]?.icon} {cName}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>
              11 Career Paths Available
            </span>
          </div>
        </div>

        {/* SECTION 25: VISUAL CAREER PROGRESS TRACKER & DASHBOARD */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ background: 'rgba(13, 27, 42, 0.7)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Career Target</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{currentCareerData.icon}</span>
              <span>{selectedCareer}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginTop: '0.2rem' }}>
              {currentCareerData.category}
            </div>
          </div>

          <div style={{ background: 'rgba(13, 27, 42, 0.7)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Roadmap Progress</div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>{overallRoadmapProgress}%</span>
            </div>
            <div style={{ marginTop: '0.45rem' }}>
              <ProgressBar value={overallRoadmapProgress} height="6px" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {completedSkills.length} skills verified
            </div>
          </div>

          <div style={{ background: 'rgba(13, 27, 42, 0.7)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Recommended Next Skill</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ⚡ {skillGapData.nextSkill}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Bridge skill gap
            </div>
          </div>

          <div style={{ background: 'rgba(13, 27, 42, 0.7)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Projects Completed</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e', marginTop: '0.2rem' }}>
              {projectsCompletedCount} / {currentCareerData.projects.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Capstone portfolio items
            </div>
          </div>

          <div style={{ background: 'rgba(13, 27, 42, 0.7)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Interview Readiness</div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ec4899' }}>{interviewReadinessPct}%</span>
            </div>
            <div style={{ marginTop: '0.45rem' }}>
              <ProgressBar value={interviewReadinessPct} height="6px" color="#ec4899" />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Technical + HR questions
            </div>
          </div>
        </div>

        {/* SECTION 26: SMART NEXT-STEP BANNER */}
        <div
          style={{
            marginTop: '1.25rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>💡</span>
            <div>
              <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.88rem' }}>
                What Should I Learn Next? → <span style={{ textDecoration: 'underline' }}>{smartNextStep.action}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {smartNextStep.reason}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            onClick={() => setActiveTab('learning')}
          >
            Start Learning Now →
          </button>
        </div>
      </section>

      {/* Navigation Sub-Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem',
        }}
      >
        {[
          { id: 'roadmap', label: '🗺️ Roadmap' },
          { id: 'skillgap', label: '📊 Skill Gap' },
          { id: 'learning', label: '📖 Learning' },
          { id: 'projects', label: '📁 Projects' },
          { id: 'interview', label: '💼 Interview Prep' },
          { id: 'certifications', label: '📜 Certifications' },
          { id: 'resume', label: '📄 Resume Skills' },
          { id: 'roles', label: '🏢 Job Roles' },
          { id: 'profile', label: '👤 Career Profile' },
          { id: 'compare', label: '⚖️ Compare Careers' },
          { id: 'ai', label: '🤖 AI Advisor' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--surface-active)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {saveMessage && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: '#86efac', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          ✓ {saveMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: STRUCTURED PERSONALIZED CAREER ROADMAP (BEGINNER -> JOB READY)   */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
                {selectedCareer} Learning Roadmap
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Step-by-step milestones from Beginner fundamentals to Job Ready engineer. Check off skills as you learn.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                {savingStatus ? 'Syncing to account...' : 'Progress auto-saved'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentCareerData.stages.map((stage, stageIdx) => (
              <div
                key={stage.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  position: 'relative',
                }}
              >
                {/* Stage Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: stageIdx === 0 ? 'var(--accent)' : stageIdx === 1 ? '#38bdf8' : stageIdx === 2 ? '#ec4899' : '#10b981',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stageIdx + 1}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                        {stage.name} STAGE
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{stage.focus}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '999px', color: 'var(--text-secondary)' }}>
                    Stage {stageIdx + 1} of {currentCareerData.stages.length}
                  </span>
                </div>

                {/* Skills Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {stage.skillsToLearn.map((skill) => {
                    const isDone = completedSkills.includes(skill.name);

                    return (
                      <div
                        key={skill.id}
                        style={{
                          background: isDone ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: isDone ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: isDone ? '#86efac' : '#fff' }}>
                              {isDone ? '✓ ' : ''}{skill.name}
                            </h4>
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => handleToggleSkill(skill.name)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--success)' }}
                              title="Mark skill completed"
                            />
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong>Topics:</strong> {skill.topics.join(' • ')}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            <strong>Practice:</strong> {skill.practice}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                            <strong>Expected Outcome:</strong> {skill.outcome}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {skill.technologies.slice(0, 2).map((tech, idx) => (
                              <span key={idx} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                          {skill.docsUrl && (
                            <Link
                              to={skill.docsUrl}
                              className="btn-outline"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                            >
                              Learn →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SKILL GAP ANALYZER                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'skillgap' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Skill Gap Analysis
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Compare your current verified skills against industry requirements for <strong>{selectedCareer}</strong>.
            </p>
          </div>

          {/* Readiness Meter Card */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem 2rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Target: {selectedCareer}
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>
                Career Readiness: <span style={{ color: skillGapData.readinessPct >= 70 ? '#22c55e' : skillGapData.readinessPct >= 40 ? '#f59e0b' : '#ef4444' }}>{skillGapData.readinessPct}%</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Calculated from your verified completed skills ({skillGapData.completed.length} of {currentCareerData.requiredSkills.length} required skills).
              </p>
            </div>

            <div style={{ minWidth: '220px', flex: '0 1 280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                <span>Milestone Progress</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{skillGapData.readinessPct}%</span>
              </div>
              <ProgressBar value={skillGapData.readinessPct} height="10px" />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                Next Recommended: <strong style={{ color: '#fbbf24' }}>{skillGapData.nextSkill}</strong>
              </div>
            </div>
          </div>

          {/* 3-Column Skill Breakdown: Completed, Skills to Improve, Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Completed */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#22c55e' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Completed Skills ({skillGapData.completed.length})</h3>
              </div>
              {skillGapData.completed.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills marked completed yet. Check off skills in the roadmap tab.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {skillGapData.completed.map((sk, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#86efac', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{sk}</span>
                      <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>VERIFIED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills to Improve */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
                <span style={{ fontSize: '1.2rem' }}>🟡</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Skills to Improve ({skillGapData.improve.length})</h3>
              </div>
              {skillGapData.improve.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add skills in your Career Profile to see which overlap with this track.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {skillGapData.improve.map((sk, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{sk}</span>
                      <button type="button" onClick={() => handleToggleSkill(sk)} style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                        Mark Complete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ef4444' }}>
                <span style={{ fontSize: '1.2rem' }}>🔴</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Missing Skills ({skillGapData.missing.length})</h3>
              </div>
              {skillGapData.missing.length === 0 ? (
                <p style={{ color: '#86efac', fontSize: '0.85rem' }}>🎉 Congratulations! You have covered all required skills for this career!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {skillGapData.missing.map((sk, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{sk}</span>
                      <button type="button" onClick={() => handleToggleSkill(sk)} style={{ background: 'transparent', border: 'none', color: '#fca5a5', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                        Mark Learned
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LEARNING RESOURCES                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'learning' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              {selectedCareer} Learning Library
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Curated student-friendly explanations, recommended learning orders, and direct interactive lessons.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {currentCareerData.stages.flatMap((s) => s.skillsToLearn).map((skill, idx) => (
              <div
                key={skill.id || idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                      Step #{idx + 1} in Learning Order
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: 'rgba(108, 99, 255, 0.2)', color: '#c4b5fd' }}>
                      {skill.difficulty || 'All Levels'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }}>
                    {skill.name}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 0.6rem' }}>
                    {skill.explanation || `Core fundamental component of the ${selectedCareer} technology stack.`}
                  </p>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KEY TOPICS:</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '0.2rem' }}>
                      {skill.topics.join(' • ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Practice: {skill.practice?.substring(0, 30)}...
                  </span>
                  <Link
                    to={skill.docsUrl || '/technical-hub'}
                    className="btn-primary"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    Start Learning →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CAREER PROJECT RECOMMENDATIONS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Recommended {selectedCareer} Projects
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Build real-world portfolio capstones categorized into Beginner, Intermediate, and Advanced tiers. Completed projects contribute directly to your roadmap progress.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {currentCareerData.projects.map((proj) => {
              const currentStatus = projectStatuses[proj.id] || 'Not Started';

              return (
                <div
                  key={proj.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: proj.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.2)' : proj.difficulty === 'Intermediate' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(236, 72, 153, 0.2)', color: proj.difficulty === 'Beginner' ? '#86efac' : proj.difficulty === 'Intermediate' ? '#7dd3fc' : '#f472b6' }}>
                          {proj.difficulty} PROJECT
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {proj.stage} Stage</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>{proj.name}</h3>
                    </div>

                    {/* Project Status Buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                      {['Not Started', 'In Progress', 'Completed'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleProjectStatusChange(proj.id, status)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            background: currentStatus === status ? (status === 'Completed' ? '#22c55e' : status === 'In Progress' ? '#f59e0b' : 'rgba(255,255,255,0.15)') : 'transparent',
                            color: currentStatus === status ? '#fff' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                          }}
                        >
                          {status === 'Completed' ? '✓ ' : ''}{status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Problem Statement:</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0.5rem', lineHeight: '1.5' }}>
                      {proj.problem}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Implementation Overview:</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0', lineHeight: '1.5' }}>
                      {proj.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(108, 99, 255, 0.15)', color: '#c4b5fd' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#86efac' }}>
                      Outcome: {proj.outcome}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CERTIFICATIONS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'certifications' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Industry Recognized Certifications for {selectedCareer}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Recommended credentials to validate your technical competence with global software employers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {currentCareerData.certifications.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{cert.skill}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                      {cert.difficulty}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>{cert.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                    <strong>Why useful:</strong> {cert.whyUseful}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  <a
                    href={cert.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>View Certification Official Page</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INTERVIEW PREPARATION                                              */}
      {/* ========================================================================= */}
      {activeTab === 'interview' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              {selectedCareer} Interview Preparation Center
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Technical whiteboarding, core computer science questions, STAR behavioral frameworks, and interview readiness checklist.
            </p>
          </div>

          {/* Checklist Bar */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                📋 Student Interview Readiness Checklist
              </h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899' }}>
                {interviewReadinessPct}% Completed
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentCareerData.interviewPreparation.interviewChecklist.map((item, idx) => {
                const checkId = `check-${idx}`;
                const isChecked = completedInterviews.includes(checkId);

                return (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: isChecked ? '#86efac' : 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleInterviewItem(checkId)}
                      style={{ accentColor: '#ec4899' }}
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Technical Questions */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Top Technical Interview Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            {currentCareerData.interviewPreparation.technicalQuestions.map((item, idx) => {
              const qId = `tech-q-${idx}`;
              const isChecked = completedInterviews.includes(qId);

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.15rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                        {item.category}
                      </span>
                      <h4 style={{ margin: '0.2rem 0 0.5rem', fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                        Q: {item.q}
                      </h4>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleInterviewItem(qId)}
                      style={{ accentColor: 'var(--success)', cursor: 'pointer' }}
                      title="Mark topic mastered"
                    />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <strong>Optimal Answer:</strong> {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coding & DSA Targets */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Essential Coding Problems for {selectedCareer}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {currentCareerData.interviewPreparation.codingQuestions.map((prob, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>{prob.topic}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: prob.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: prob.difficulty === 'Easy' ? '#86efac' : '#fde68a' }}>
                    {prob.difficulty}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', color: '#fff' }}>{prob.title}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Time: <strong>{prob.timeComplexity}</strong> • Space: <strong>{prob.spaceComplexity}</strong>
                </div>
                <Link to="/coding-hub" className="btn-secondary" style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', padding: '0.3rem', marginTop: '0.75rem' }}>
                  Practice in Coding Hub →
                </Link>
              </div>
            ))}
          </div>

          {/* HR & Behavioral STAR Questions */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            HR & STAR Behavioral Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentCareerData.interviewPreparation.hrQuestions.map((hr, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{hr.q}</div>
                <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  💡 Tip: {hr.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RESUME PREPARATION                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'resume' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Resume Skills & ATS Keywords for {selectedCareer}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Incorporate these tailored technical skills, capstones, and keywords onto your engineering resume to pass recruiter screening.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                🎯 Recommended Technical Keywords
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {currentCareerData.resumeSkills.technicalSkills.map((sk, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(108, 99, 255, 0.2)', border: '1px solid rgba(108, 99, 255, 0.4)', color: '#fff', fontSize: '0.82rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                💻 Technologies & Frameworks
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {currentCareerData.resumeSkills.technologies.map((t, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#7dd3fc', fontSize: '0.82rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                🛠️ Developer Tools & Environments
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {currentCareerData.resumeSkills.tools.map((tool, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fde68a', fontSize: '0.82rem' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem' }}>
                🤝 Engineering Soft Skills
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {currentCareerData.resumeSkills.softSkills.map((s, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.35)', color: '#f472b6', fontSize: '0.82rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: RELATED JOB ROLES                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Related Job Roles for {selectedCareer}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Explore career market titles, role descriptions, required skill sets, and typical compensation bands.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {currentCareerData.relatedJobRoles.map((role, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>{role.title}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {role.salaryRange}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.5', margin: '0 0 0.75rem' }}>
                    {role.description}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
                    <strong>Key Skills:</strong> {role.skills}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem' }}
                    onClick={() => {
                      if (careerRoadmapsData[role.title]) {
                        handleCareerChange(role.title);
                        setActiveTab('roadmap');
                      } else {
                        setActiveTab('roadmap');
                      }
                    }}
                  >
                    View Targeted Roadmap →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: STUDENT CAREER PROFILE                                             */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Student Career Profile
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Update your education, current skills, programming languages, and career goals. This information is saved to your account and powers your personalized roadmaps and AI recommendations.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Degree / Education
                </label>
                <input
                  type="text"
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g. B.Tech / B.E."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Engineering Branch
                </label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Year of Study
                </label>
                <input
                  type="text"
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g. 3rd Year"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Primary Career Goal
              </label>
              <input
                type="text"
                value={profile.careerGoal}
                onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
                style={{ width: '100%' }}
                placeholder="e.g. Software Developer at Top Tech Company"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Current Skills (comma separated)
              </label>
              <input
                type="text"
                value={profile.currentSkills.join(', ')}
                onChange={(e) => setProfile({ ...profile, currentSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                style={{ width: '100%' }}
                placeholder="e.g. HTML, CSS, JavaScript, Git, Python"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Programming Languages Known (comma separated)
              </label>
              <input
                type="text"
                value={profile.programmingLanguages.join(', ')}
                onChange={(e) => setProfile({ ...profile, programmingLanguages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                style={{ width: '100%' }}
                placeholder="e.g. JavaScript, Python, C++, Java"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Areas of Technical Interest (comma separated)
              </label>
              <input
                type="text"
                value={profile.areasOfInterest.join(', ')}
                onChange={(e) => setProfile({ ...profile, areasOfInterest: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                style={{ width: '100%' }}
                placeholder="e.g. Full Stack Development, Cloud, AI"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Current Skill Level
                </label>
                <select
                  value={profile.skillLevel}
                  onChange={(e) => setProfile({ ...profile, skillLevel: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Preferred Technology
                </label>
                <input
                  type="text"
                  value={profile.preferredTechnology}
                  onChange={(e) => setProfile({ ...profile, preferredTechnology: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g. React & Node.js"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                Save Career Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: CAREER COMPARISON                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'compare' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              Career Path Comparison
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Compare two engineering career paths side-by-side to understand skill requirements, tech stacks, and job markets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Career Path A</label>
              <select
                value={comparingCareers[0]}
                onChange={(e) => setComparingCareers([e.target.value, comparingCareers[1]])}
                style={{ padding: '0.5rem', fontWeight: 700 }}
              >
                {careerPathsList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Career Path B</label>
              <select
                value={comparingCareers[1]}
                onChange={(e) => setComparingCareers([comparingCareers[0], e.target.value])}
                style={{ padding: '0.5rem', fontWeight: 700 }}
              >
                {careerPathsList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {comparingCareers.map((cName) => {
              const data = careerRoadmapsData[cName] || careerRoadmapsData['Software Developer'];

              return (
                <div key={cName} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{data.icon}</span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>{data.name}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>{data.description}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Core Required Skills:</strong>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                        {data.requiredSkills.slice(0, 6).map((sk, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Primary Technologies:</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {data.resumeSkills?.technologies?.join(', ') || 'Various'}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#ec4899' }}>Example Capstone Project:</strong>
                      <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem' }}>
                        {data.projects[0]?.name}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#22c55e' }}>Typical Job Titles:</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {data.relatedJobRoles.map((r) => r.title).join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 11: AI CAREER RECOMMENDATION                                          */}
      {/* ========================================================================= */}
      {activeTab === 'ai' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.3rem' }}>
              AI Career Path Recommendation Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Antigravity AI analyzes your skills, branch, interests, and completed projects to evaluate ideal engineering trajectories.
              <em> Recommendations are algorithmic guidance, not guaranteed outcomes.</em>
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', color: '#fff' }}>Evaluate My Student Profile</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  Analyzing: {profile.branch} • {profile.currentSkills.join(', ')} • Interests: {profile.areasOfInterest.join(', ')}
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleRunAiRecommendation}
                style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>✨</span> Generate AI Recommendations
              </button>
            </div>
          </div>

          {aiSuggestions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {aiSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: idx === 0 ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    position: 'relative',
                  }}
                >
                  {idx === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1.25rem',
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Top AI Match: {sug.matchPct}% Fit
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{sug.data.icon}</span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                      {sug.careerName}
                    </h3>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 1rem' }}>
                    <strong>Why this matches:</strong> {sug.matchReason}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 700 }}>Required Skills:</div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '0.2rem' }}>
                        {sug.requiredSkills.join(' • ')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 700 }}>Missing Skills to Acquire:</div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '0.2rem' }}>
                        {sug.missingSkills.join(' • ') || 'None! Ready to build'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>Suggested Next Step:</div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '0.2rem' }}>
                        {sug.suggestedNextStep}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        handleCareerChange(sug.careerName);
                        setActiveTab('roadmap');
                      }}
                    >
                      Switch to this Career Roadmap →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerHub;
