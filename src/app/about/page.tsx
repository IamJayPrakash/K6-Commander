
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Rocket, Database, Shield, Code, Github, BarChart2, Search, Zap, Layers, Share2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const techStack = [
        { name: 'Frontend', value: 'Next.js & React', description: 'For a fast, server-rendered user interface.' },
        { name: 'Styling', value: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.' },
        { name: 'UI Components', value: 'shadcn/ui', description: 'Beautifully designed, accessible, and reusable components.' },
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

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <BarChart2 size={32} className="text-accent mb-2" />
                        <CardTitle>k6 Load Testing</CardTitle>
                        <CardDescription>Simulate traffic to find performance bottlenecks.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Leverage the full power of Grafana k6 to understand how your system behaves under load. Configure virtual users (VUs), duration, and custom ramping stages.</p>
                        <p>Live results are streamed to a pre-configured Grafana dashboard, giving you real-time insights into request rates, response times, and errors.</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <Shield size={32} className="text-accent mb-2" />
                        <CardTitle>Lighthouse Audits</CardTitle>
                        <CardDescription>Audit for performance, accessibility, and more.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Run Google Lighthouse audits directly from the UI. Get scores for Performance, Accessibility, Best Practices, and SEO.</p>
                        <p>The application provides a high-level summary, and you can access the full, interactive HTML report for a deep-dive analysis and actionable recommendations.</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                         <Search size={32} className="text-accent mb-2" />
                        <CardTitle>Basic SEO Checks</CardTitle>
                        <CardDescription>Verify on-page SEO fundamentals instantly.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>Get a quick, automated check of the most critical on-page SEO elements to ensure your pages are optimized for search engines.</p>
                        <p>This includes checks for the presence and length of title tags, meta descriptions, H1 headings, and the proper implementation of canonical tags.</p>
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
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
