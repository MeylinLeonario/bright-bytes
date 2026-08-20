const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5257";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
  weeklyGoalDays: number;
  studyActivity: Array<{ date: string; intensity: number }>;
  recentActivity: RecentActivity[];
  latestAchievement: Achievement | null;
}

export interface StudentCourse {
  id: string;
  title: string;
  description: string;
  level: string;
  enrolled: boolean;
  lessons: Array<{ id: string; title: string; grammarPoint: string; order: number; completed: boolean }>;
}

export interface ReviewLesson {
  id: string;
  title: string;
  order: number;
  courseTitle: string;
  vocabulary: Array<{ id: string; word: string; meaning: string; example: string }>;
}

export interface StudentLesson {
  id: string;
  title: string;
  grammarPoint: string;
  grammarExplanation: string;
  writingPrompt: string;
  speakingPrompt: string;
  order: number;
  courseId: string;
  courseTitle: string;
  completed: boolean;
  previousLessonId: string | null;
  nextLessonId: string | null;
  writingAttemptsUsed: number;
  speakingAttemptsUsed: number;
  vocabulary: Array<{ id: string; word: string; meaning: string; example: string; audioUrl: string | null }>;
  readings: Array<{ id: string; title: string; text: string; audioUrl: string | null }>;

}

export interface ExerciseCorrection {
  correctedText: string;
  feedback: string;
  attemptNumber: number;
  attemptsRemaining: number;
  syncedToGoogleSheets: boolean;
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

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)){
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
    const errorBody = await response.json().catch(() => null) as {
      detail?: string;
      message?: string;
      traceId?: string;
    } | null;
    const message = errorBody?.message ?? errorBody?.detail ?? `API error ${response.status}`;
    const traceSuffix = errorBody?.traceId ? ` (Trace ID: ${errorBody.traceId})` : "";

    throw new Error(`${message}${traceSuffix}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }


  return response.json() as Promise<T>;
}

export function enrollInStudentCourse(courseId: string) {
  return apiFetch<{ courseId: string; enrolled: boolean; enrolledAt: string }>(
    `/api/student/courses/${courseId}/enroll`,
    { method: "POST" }
  );
}

export function getCurrentUser() {
  return apiFetch<CurrentUser>("/api/auth/me");
}

export function getStudentDashboard() {
  return apiFetch<StudentDashboardData>("/api/student/dashboard");
}

export function getStudentCourses() {
  return apiFetch<StudentCourse[]>("/api/student/courses");
}

export function getStudentLesson(lessonId: string) {
  return apiFetch<StudentLesson>(`/api/student/lessons/${lessonId}`);
}

export function completeStudentLesson(lessonId: string) {
  return apiFetch<{ completed: boolean; completedAt: string }>(
    `/api/student/lessons/${lessonId}/complete`, { method: "POST" }
  );
}


export function correctStudentExercise(lessonId: string, exerciseType: "writing" | "speaking", text: string) {
  return apiFetch<ExerciseCorrection>(`/api/student/lessons/${lessonId}/corrections`, {
    method: "POST",
    body: JSON.stringify({ exerciseType, text }),
  });
}

export function correctStudentSpeakingExercise(lessonId: string, audio: Blob, durationSeconds: number) {
  const form = new FormData();
  const extension = audio.type.includes("ogg")
    ? "ogg"
    : audio.type.includes("mp4")
      ? "m4a"
      : audio.type.includes("wav")
        ? "wav"
        : "webm";
  form.append("audio", audio, `speaking.${extension}`);
  form.append("durationSeconds", durationSeconds.toString());

  return apiFetch<ExerciseCorrection>(`/api/student/lessons/${lessonId}/speaking-corrections`, {
    method: "POST",
    body: form,
  });
}

export function updateWeeklyGoal(days: number) {
  return apiFetch<{ days: number }>("/api/student/weekly-goal", {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
}

export function getReviewLessons() {
  return apiFetch<ReviewLesson[]>("/api/student/review-lessons");
}