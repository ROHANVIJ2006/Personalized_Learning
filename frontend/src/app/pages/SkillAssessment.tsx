import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, CheckCircle, Award, Sparkles, Clock, ArrowRight, X } from 'lucide-react';
import { api } from '../../lib/api';

type Phase = 'list' | 'taking' | 'result';

export function SkillAssessment() {
  const [phase, setPhase] = useState<Phase>('list');
  const [skills, setSkills] = useState<any[]>([]);
  const [assessment, setAssessment] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Assessment state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.getSkills().then(setSkills).catch(console.error).finally(() => setLoading(false));
    api.getAssessmentHistory().then(setHistory).catch(console.error);
  }, []);

  const startAssessment = async (skillId: number) => {
    try {
      const data = await api.startAssessment(skillId);
      setAssessment(data);
      setCurrentQ(0);
      setAnswers({});
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setPhase('taking');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const selectAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQ]: answer }));
  };

  const nextQuestion = () => {
    setQuestionStartTime(Date.now());
    setCurrentQ(prev => prev + 1);
  };

  const submitAssessment = async () => {
    if (!assessment) return;
    setSubmitting(true);
    const responses = assessment.questions.map((q: any, i: number) => ({
      question_id: q.id,
      answer: answers[i] || '',
      time_taken_seconds: 30, // simplified timing
    }));
    try {
      const res = await api.submitAssessment(assessment.skill_id, responses);
      setResult(res);
      setPhase('result');
      // Refresh history
      api.getAssessmentHistory().then(setHistory).catch(console.error);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── RESULT VIEW ──
  if (phase === 'result' && result) {
    const pct = result.percentage;
    const color = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500';
    return (
      <div className="px-8 py-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border-2 border-indigo-200 p-8 text-center shadow-lg">
          <div className={`text-6xl font-bold mb-2 ${color}`}>{pct}%</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{result.skill_name} Assessment</h2>
          <p className="text-gray-500 mb-4">{result.score}/{result.total_questions} correct</p>

          <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">MT-KT Mastery Analysis</span>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Mastery Probability: </span>
              <span className="text-indigo-600 font-bold">{(result.mastery_probability * 100).toFixed(1)}%</span>
              <span className="text-gray-500 ml-2">({result.ai_insight} confidence)</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              XP Gained: +{result.xp_gained}
            </div>
          </div>

          <div className="space-y-2 mb-6 text-left">
            {result.recommendations?.map((r: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                {r}
              </div>
            ))}
          </div>

          {/* Per-question review */}
          <details className="text-left mb-6">
            <summary className="cursor-pointer text-sm font-semibold text-indigo-600 mb-3">Review Answers</summary>
            <div className="space-y-3 mt-3">
              {result.graded_responses?.map((gr: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg border ${gr.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {gr.correct
                      ? <CheckCircle size={14} className="text-green-600" />
                      : <X size={14} className="text-red-500" />}
                    <span className="text-sm font-semibold">Q{i + 1}</span>
                    <span className="text-xs text-gray-500">Your answer: {gr.answer} | Correct: {gr.correct_answer}</span>
                  </div>
                  {gr.explanation && <p className="text-xs text-gray-600 mt-1">{gr.explanation}</p>}
                </div>
              ))}
            </div>
          </details>

          <button onClick={() => setPhase('list')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            Back to Assessments
          </button>
        </motion.div>
      </div>
    );
  }

  // ── TAKING VIEW ──
  if (phase === 'taking' && assessment) {
    const q = assessment.questions[currentQ];
    const isLast = currentQ === assessment.questions.length - 1;
    const progress = ((currentQ + 1) / assessment.questions.length) * 100;

    return (
      <div className="px-8 py-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Question {currentQ + 1} of {assessment.questions.length}
            </span>
            <span className="text-sm text-indigo-600 font-semibold">{assessment.skill_name}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                q.difficulty === 'Advanced' ? 'bg-red-100 text-red-600' :
                q.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>{q.difficulty}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">{q.question_text}</h3>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const text = q[`option_${opt.toLowerCase()}`];
                const selected = answers[currentQ] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium
                      ${selected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700'
                      }`}
                  >
                    <span className="font-bold mr-3">{opt}.</span>{text}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setPhase('list')}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={isLast ? submitAssessment : nextQuestion}
                disabled={!answers[currentQ] || submitting}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submitting ? 'Scoring with MT-KT...' : isLast ? 'Submit' : 'Next'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="px-8 py-5 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <ClipboardList size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Skill Assessments</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Real questions graded by the MT-KT Transformer model (AUC 0.7641)
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Available Assessments */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Available Assessments</h2>
          <div className="space-y-3">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{skill.category}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        skill.difficulty_level === 'Advanced' ? 'bg-red-100 text-red-600' :
                        skill.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{skill.difficulty_level}</span>
                      <span className="text-xs text-gray-500">{skill.question_count} questions</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startAssessment(skill.id)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Start
                  </button>
                </div>
              </motion.div>
            ))}
            {skills.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No skills found. Run seed_database.py to populate.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">Recent Scores</h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice(0, 6).map((h: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{h.skill_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(h.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${h.score >= 80 ? 'text-green-600' : h.score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {h.score}%
                      </div>
                      {h.mastery_probability > 0 && (
                        <div className="text-xs text-indigo-600">
                          Mastery: {(h.mastery_probability * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400">
              <Award size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No assessments taken yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
