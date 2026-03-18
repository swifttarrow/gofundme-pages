import { FundraiserWizard } from "@/components/fundraiser/wizard";

export const metadata = {
  title: "Start a Fundraiser | GoSupportMe",
  description: "Create a fundraiser in minutes and start raising money for a specific cause.",
};

export default function FundraiserNewPage() {
  return (
    <div className="relative min-h-screen bg-bg-faint">
      <FundraiserWizard />
    </div>
  );
}
