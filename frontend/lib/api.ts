const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5257";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export interface ContinueLesson {
  id: string;
  title: string;
  grammarPoint: string;
  order: number;
}

export interface WeeklyStudyDay {
  day: string;
  completed: boolean;
}

export interface RecentActivity {
  lessonId: string;
  lessonTitle: string;
  completedAt: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface StudentDashboardData {
  streak: number;
  lessonsCompleted: number;
  wordsLearned: number;
  courseProgress: number;
  courseTitle: string;
  courseLevel: string;
  courseLessonsCompleted: number;
  totalCourseLessons: number;
  lessonsRemaining: number;
  continueLesson: ContinueLesson | null;
  weeklyGoal: WeeklyStudyDay[];
  recentActivity: RecentActivity[];
  latestAchievement: Achievement | null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("brightbytes_token") ??
        sessionStorage.getItem("brightbytes_token")
      : null;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getCurrentUser() {
  return apiFetch<CurrentUser>("/api/auth/me");
}

export function getStudentDashboard() {
  return apiFetch<StudentDashboardData>("/api/student/dashboard");
}