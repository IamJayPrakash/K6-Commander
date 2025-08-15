
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Rocket, Database, Shield, Code, Github, BarChart2, Search, Zap, Layers, Share2, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    const techStack = [
        { name: 'Frontend', value: 'Next.js & React', description: 'For a fast, server-rendered user interface.' },
        { name: 'Styling', value: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.' },
        { name: 'UI Components', value: 'shadcn/ui', description: 'Beautifully designed, accessible, and reusable components.' },
        { name: 'AI Integration', value: 'Genkit', description: 'Powers the AI-driven SEO analysis and recommendations.' },
        { name: 'Load Testing', value: 'k6', description: 'A powerful, open-source load testing tool from Grafana Labs.' },
        { name: 'Auditing', value: 'Lighthouse', description: 'Google\'s automated tool for improving web page quality.' },
        { name: 'Metrics DB', value: 'InfluxDB', description: 'A time-series database for storing k6 test metrics.' },
        { name: 'Dashboards', value: 'Grafana', description: 'The open standard for beautiful analytics and monitoring.' },
        { name: 'Orchestration', value: 'Docker', description: 'To containerize and run all services in an isolated environment.' },
    ];
    
    return (
        <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit border-2 border-dashed border-primary/20">
                        <Rocket className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold pt-4">K6 Commander: Your Local Test Ops Center</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        A powerful, local-first testing platform designed for developers to ensure applications are performant, accessible, and SEO-friendly without the complexity of cloud services.
                    </CardDescription>
                </CardHeader>
            </Card>

             <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Zap className="text-primary" />
                        Core Philosophy: Local & Powerful
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-base text-foreground/80">
                   <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                        <Database size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-lg">Local First Data</h3>
                            <p className="text-sm text-muted-foreground">Your test configurations, history, and results are stored exclusively in your browser's LocalStorage. No cloud accounts, no data transmission, full privacy.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                        <Layers size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-lg">Unified Tooling</h3>
                            <p className="text-sm text-muted-foreground">Access sophisticated load testing, detailed web audits, and essential SEO checks from a single, cohesive interface, orchestrated seamlessly with Docker.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-1 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <BarChart2 size={32} className="text-accent mb-2" />
                        <CardTitle>k6 Load Testing</CardTitle>
                        <CardDescription>Simulate traffic to find performance bottlenecks before your users do.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p>
                            <strong>How it Works:</strong> K6 Commander abstracts the complexity of running load tests. When you configure a test in the UI, the application dynamically generates a k6 JavaScript file. It then spins up a dedicated `grafana/k6` Docker container, passing your configuration (URL, method, headers, VUs, stages, etc.) as environment variables.
                        </p>
                        <p>
                            As the test runs, the k6 engine sends detailed performance metrics (like `http_req_duration`, `http_req_failed`, `vus`) over the local Docker network to an InfluxDB container. InfluxDB, a high-performance time-series database, stores this data. Simultaneously, a pre-configured Grafana instance queries InfluxDB in real-time, displaying live charts and statistics on a dashboard. This gives you immediate insight into how your application performs under stress.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <Shield size={32} className="text-accent mb-2" />
                        <CardTitle>Lighthouse Audits</CardTitle>
                        <CardDescription>Audit for performance, accessibility, best practices, and SEO with Google's industry-standard tool.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p>
                            <strong>How it Works:</strong> This feature leverages Google Lighthouse directly, executed within the application's backend environment. When you start a Lighthouse audit, the server spawns a new process running `npx lighthouse`. It programmatically launches a headless instance of Google Chrome to navigate to your target URL and collect data.
                        </p>
                        <p>
                            Lighthouse then runs its full suite of audits, analyzing everything from page load performance and image optimization to accessibility standards (ARIA attributes, color contrast) and basic SEO checks. The results are saved as both a JSON object for the summary view in the UI and a full, interactive HTML report that you can open for a granular, shareable deep-dive into every metric and recommendation.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                         <BrainCircuit size={32} className="text-accent mb-2" />
                        <CardTitle>AI-Powered SEO Analysis</CardTitle>
                        <CardDescription>Go beyond basic checks with a deep, AI-driven analysis of on-page SEO factors.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p>
                           <strong>How it Works:</strong> This isn't just a simple tag checker; it's an AI agent. When you initiate an SEO analysis, a Genkit flow is triggered. This flow first fetches the raw HTML content of the target URL. It then sends this HTML to the Gemini Pro model with a specialized, engineered prompt.
                        </p>
                        <p>
                           This prompt instructs the AI to act as an expert Technical SEO Analyst. It analyzes the content for critical elements like title tags, meta descriptions, H1 headings, canonical URLs, and Open Graph tags. For each element, it determines if it's present and optimal. If an element is missing or could be improved (e.g., a title tag is too long), the AI generates a concise, actionable recommendation, providing you with expert-level advice on how to fix it.
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Code className="text-primary" />
                        Technology Stack
                    </CardTitle>
                    <CardDescription>
                        Built with modern, powerful, and developer-friendly technologies.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {techStack.map((tech) => (
                           <li key={tech.name} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                               <div>
                                   <strong className="font-semibold text-base text-foreground">{tech.value}</strong>
                                   <p className="text-muted-foreground">{tech.description}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

             <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Share2 className="text-primary" />
                        Getting Involved
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-4">
                   <p>K6 Commander is an open-source project. We welcome contributions of all kinds, from bug reports and feature requests to code contributions.</p>
                   <Link href="https://github.com/your-username/k6-commander" target="_blank">
                        <Button variant="outline">
                            <Github size={16} className="mr-2" />
                            View on GitHub
                        </Button>
                   </Link>
                </CardContent>
            </Card>
        </div>
    );
}
