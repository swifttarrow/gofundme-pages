import { CharityWizard } from "@/components/charity/wizard";

export const metadata = {
  title: "Start a Charity | GoSupportMe",
  description: "Create a lasting cause impact. Start your charity fundraiser on GoSupportMe.",
};

export default function CharityNewPage() {
  return (
    <div className="relative min-h-screen bg-bg-faint">
      <CharityWizard />
    </div>
  );
}
