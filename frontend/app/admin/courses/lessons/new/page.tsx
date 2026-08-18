import LessonForm from "./lesson-form";

type NewLessonPageProps = {
  searchParams: Promise<{
    courseId?: string | string[];
  }>;
};

export default async function NewLessonPage({
  searchParams,
}: NewLessonPageProps) {
  const { courseId: courseIdParam } = await searchParams;
  const courseId = Array.isArray(courseIdParam)
    ? (courseIdParam[0] ?? "")
    : (courseIdParam ?? "");
 return <LessonForm courseId={courseId} />;
}