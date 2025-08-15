
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Rocket, Database, Shield, Code, Github } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const techStack = [
        { name: 'Frontend', value: 'Next.js & React' },
        { name: 'Styling', value: 'Tailwind CSS' },
        { name: 'UI', value: 'shadcn/ui' },
        { name: 'Load Testing', value: 'k6' },
        { name: 'Auditing', value: 'Lighthouse' },
        { name: 'Metrics', value: 'InfluxDB' },
        { name: 'Dashboards', value: 'Grafana' },
        { name: 'Orchestration', value: 'Docker' },
    ];
    
    return (
        <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit border-2 border-dashed border-primary/20">
                        <Rocket className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold pt-4">About K6 Commander</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        K6 Commander is a powerful, local-first testing platform designed for developers who need to ensure their applications are performant, accessible, and SEO-friendly without the complexity of cloud services.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex-row items-center gap-4">
                        <Database size={32} className="text-accent flex-shrink-0" />
                        <div>
                            <CardTitle>Local First Philosophy</CardTitle>
                            <CardDescription>Your data stays with you.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        All your test configurations and history are stored securely in your browser's local storage. No cloud account needed, no data transmission, full privacy.
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex-row items-center gap-4">
                        <Shield size={32} className="text-accent flex-shrink-0" />
                        <div>
                            <CardTitle>All-in-One Auditing</CardTitle>
                            <CardDescription>One tool for multiple tests.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        Run sophisticated k6 load tests, get detailed Google Lighthouse reports, and perform basic SEO checks from a single, unified interface.
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex-row items-center gap-4">
                         <Github size={32} className="text-accent flex-shrink-0" />
                        <div>
                            <CardTitle>Open & Extensible</CardTitle>
                            <CardDescription>Built for the community.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        K6 Commander is open-source. Fork it, extend it, and contribute back. Check out the <Link href="https://github.com/your-username/k6-commander" target="_blank" className="text-primary underline">GitHub repository</Link>.
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Code className="text-primary" />
                        Tech Stack
                    </CardTitle>
                    <CardDescription>
                        Built with modern, powerful, and developer-friendly technologies.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {techStack.map((tech) => (
                           <li key={tech.name} className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
                               <strong className="font-semibold">{tech.name}:</strong>{tech.value}
                           </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
