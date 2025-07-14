import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
    <br />
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview Ready with AI-Powered Practice & Feedback</h2>
          
          <p className="text-lg"> Practice on rael Interview questions &  get instant feedback </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>

        </div> 
        <Image src="/robot.png" alt="robots" width={400} height={400} className="max-sm:hidden"></Image>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) = > (
            <InterviewCard/>
          ))} 
        </div>
      </section>
    
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          <p>There are no interviews Available</p>
        </div>
      </section>
    </>
  )
};

export default page;
