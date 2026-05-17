import ResumeUpload from "@/components/ResumeUpload";
import { getCurrentUser } from "@/lib/actions/auth.action";

const ResumePage = async () => {
  const user = await getCurrentUser();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2>Upload Your Resume</h2>
        <p className="text-gray-400 mt-2">
          Upload your resume to generate personalized interview questions based
          on your skills and experience
        </p>
      </div>
      <ResumeUpload userId={user?.id} />
    </section>
  );
};

export default ResumePage;
