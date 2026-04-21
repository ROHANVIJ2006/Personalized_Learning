const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

function getToken(): string | null {
  return localStorage.getItem('skillnova_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; career_goal?: string; location?: string }) =>
    request<{ access_token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // User
  getMe: () => request<any>('/users/me'),
  updateMe: (data: any) => request<any>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

  // Dashboard
  getDashboard: () => request<any>('/progress/dashboard'),

  // Assessments
  getSkills: () => request<any[]>('/assessments/skills'),
  startAssessment: (skill_id: number) =>
    request<any>('/assessments/start', { method: 'POST', body: JSON.stringify({ skill_id }) }),
  submitAssessment: (skill_id: number, responses: any[]) =>
    request<any>('/assessments/submit', { method: 'POST', body: JSON.stringify({ skill_id, responses }) }),
  getAssessmentHistory: () => request<any[]>('/assessments/history'),

  // Courses
  getCourses: (params?: { govt_only?: boolean; level?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any[]>(`/courses${q ? '?' + q : ''}`);
  },
  enrollCourse: (course_id: number) =>
    request<any>(`/courses/${course_id}/enroll`, { method: 'POST' }),
  getEnrolled: () => request<any[]>('/courses/enrolled'),

  // Recommendations
  getRecommendations: () => request<any>('/recommendations'),

  // Learning Path
  getLearningPaths: () => request<any[]>('/learning-paths'),
  getMyPath: () => request<any>('/learning-paths/my'),

  // Progress
  getSkillProgress: () => request<any[]>('/progress/skills'),
  getMonthlyProgress: () => request<any[]>('/progress/monthly'),

  // Chatbot
  chat: (message: string, conversation_history: any[] = []) =>
    request<any>('/chatbot', { method: 'POST', body: JSON.stringify({ message, conversation_history }) }),

  // Auth extras
  forgotPassword: (email: string) =>
    request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

export function saveToken(token: string) {
  localStorage.setItem('skillnova_token', token);
}

export function clearToken() {
  localStorage.removeItem('skillnova_token');
  localStorage.removeItem('skillnova_user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
