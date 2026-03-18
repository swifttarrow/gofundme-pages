import { CharityWizard } from "@/components/charity/wizard";

export const metadata = {
  title: "Start a Charity | GoSupportMe",
  description: "Create your charity page in minutes and start rallying support on GoSupportMe.",
};

export default function CharityNewPage() {
  return (
    <div className="relative min-h-screen bg-bg-faint">
      <CharityWizard />
    </div>
  );
}
