import { TippingModule } from "@/components/tipping-module";

export const metadata = {
  title: "Complete Your Donation | GoSupportMe",
};

export default function TippingPage() {
  return (
    <div className="min-h-screen bg-bg-gray flex items-center justify-center px-4 py-8">
      <TippingModule
        fundraiserTitle="Wildfire Safety Alerts"
        amountCents={10000}
      />
    </div>
  );
}
