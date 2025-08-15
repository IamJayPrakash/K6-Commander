import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How do I run my first test?",
        answer: "Navigate to the home page, fill in the target URL, select the test suites you want to run (Load Test, Lighthouse, SEO), configure the parameters, and click 'Run Test(s)'. It's that simple!"
    },
    {
        question: "Where is my test history stored?",
        answer: "Your test history is stored exclusively in your browser's LocalStorage. No data is sent to any external server, ensuring your privacy and security."
    },
    {
        question: "Can I export my test results?",
        answer: "Yes! From the history page, you can export your entire test history as a JSON file. Individual test reports can also be exported as PDF or HTML from the summary view."
    },
    {
        question: "What is the difference between the test presets?",
        answer: "Baseline is for a standard check. Spike tests short, intense bursts of traffic. Stress tests how your system behaves under extreme load. Soak tests for prolonged periods to check for memory leaks or performance degradation over time."
    }
];

export default function HelpPage() {
    return (
        <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <HelpCircle className="text-primary" />
                    Help & FAQs
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-foreground/80">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
