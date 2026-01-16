import { Button } from "@/components/ui/Button";

export function CallToAction({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#0B0F14]">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#E6EDF3]">
            {title || "Let's Build Something Together"}
          </h2>
          <p className="text-[#9CA3AF] max-w-xl">
            {subtitle ||
              "I am currently open to new opportunities and collaborations. Check out my full project portfolio or reach out directly."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/about#contact">
              <Button variant="primary" size="md">
                Contact Me
              </Button>
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md">
                Download Resume
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
