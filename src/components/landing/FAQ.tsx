import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is my financial data really private?",
    answer: "Yes, 100%. FinTrack runs entirely in your browser. Your data is stored in localStorage on your device and is never sent to any server. We have no backend, no database, and no way to access your information. You can verify this by checking your browser's network tab — you'll see zero data transmission after the initial page load.",
  },
  {
    question: "What CSV formats are supported?",
    answer: "FinTrack supports most bank statement CSV formats from Indian banks including HDFC, ICICI, SBI, Axis, Kotak, and others. The app automatically detects common column names like Date, Description, Debit, Credit, and Balance. If auto-detection doesn't work perfectly, you can manually map columns to match your specific CSV format.",
  },
  {
    question: "Can I customize the spending categories?",
    answer: "Absolutely! FinTrack comes with 13 pre-built categories optimized for Indian merchants (Food & Dining, Groceries, Shopping, etc.). You can create unlimited custom categories, edit existing ones, add your own keywords for better matching, and assign custom colors. All category settings are saved locally.",
  },
  {
    question: "What's the transaction limit?",
    answer: "FinTrack supports up to 5,000 transactions to ensure smooth performance within browser localStorage limits. This is typically enough for 1-2 years of transaction history. You can export your data anytime and clear old transactions to make room for new ones.",
  },
  {
    question: "Does the app work offline?",
    answer: "Yes! Once FinTrack is loaded in your browser, it works completely offline. You can import CSV files, view your dashboard, filter transactions, and manage categories without any internet connection. This is possible because all data is stored locally on your device.",
  },
  {
    question: "Is FinTrack really free?",
    answer: "Yes, FinTrack is completely free with no hidden costs, premium tiers, or in-app purchases. Since there's no server infrastructure to maintain (all processing happens in your browser), we can offer the full feature set at no cost. No account required, no credit card needed.",
  },
  {
    question: "How do I backup or transfer my data?",
    answer: "You can export all your transactions as a CSV file anytime from the Settings page. This gives you a complete backup of your categorized data. To transfer to another device, simply export from one browser and import into FinTrack on the new device. Note that category customizations are stored separately and would need to be recreated.",
  },
  {
    question: "Why build another finance tracker?",
    answer: "Most finance apps require connecting your bank account or uploading sensitive data to their servers. We believe you shouldn't have to trade privacy for convenience. FinTrack proves you can have powerful financial insights while keeping your data completely under your control.",
  },
];

function FAQItem({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="font-medium pr-4 group-hover:text-primary transition-colors">
          {question}
        </span>
        <CaretDown 
          weight="bold" 
          className={cn(
            "size-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-muted-foreground leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about FinTrack
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-2xl border border-border/50 px-6 sm:px-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
