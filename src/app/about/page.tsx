
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Rocket, Database, Shield, Code, Github, BarChart2, Zap, Layers, Share2, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, TECH_STACK, TEXT_CONSTANTS } from "@/lib/constants";

export default function AboutPage() {
    
    return (
        <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit border-2 border-dashed border-primary/20">
                        <Rocket className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold pt-4">{TEXT_CONSTANTS.aboutTitle}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        {TEXT_CONSTANTS.aboutDescription}
                    </CardDescription>
                </CardHeader>
            </Card>

             <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Zap className="text-primary" />
                        {TEXT_CONSTANTS.philosophyTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-base text-foreground/80">
                   <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                        <Database size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-lg">{TEXT_CONSTANTS.localFirstTitle}</h3>
                            <p className="text-sm text-muted-foreground">{TEXT_CONSTANTS.localFirstDescription}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50">
                        <Layers size={24} className="text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-lg">{TEXT_CONSTANTS.unifiedToolingTitle}</h3>
                            <p className="text-sm text-muted-foreground">{TEXT_CONSTANTS.unifiedToolingDescription}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-1 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <BarChart2 size={32} className="text-accent mb-2" />
                        <CardTitle>{TEXT_CONSTANTS.k6FeatureTitle}</CardTitle>
                        <CardDescription>{TEXT_CONSTANTS.k6FeatureDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.k6HowItWorks }} />
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.k6HowItWorks2 }} />
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <Shield size={32} className="text-accent mb-2" />
                        <CardTitle>{TEXT_CONSTANTS.lighthouseFeatureTitle}</CardTitle>
                        <CardDescription>{TEXT_CONSTANTS.lighthouseFeatureDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.lighthouseHowItWorks }} />
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.lighthouseHowItWorks2 }} />
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                         <BrainCircuit size={32} className="text-accent mb-2" />
                        <CardTitle>{TEXT_CONSTANTS.seoFeatureTitle}</CardTitle>
                        <CardDescription>{TEXT_CONSTANTS.seoFeatureDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.seoHowItWorks }} />
                        <p dangerouslySetInnerHTML={{ __html: TEXT_CONSTANTS.seoHowItWorks2 }} />
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Code className="text-primary" />
                        {TEXT_CONSTANTS.stackTitle}
                    </CardTitle>
                    <CardDescription>
                        {TEXT_CONSTANTS.stackDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {TECH_STACK.map((tech) => (
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
                        {TEXT_CONSTANTS.involvedTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-4">
                   <p>{TEXT_CONSTANTS.involvedDescription}</p>
                   <Link href={APP_CONFIG.githubUrl} target="_blank">
                        <Button variant="outline">
                            <Github size={16} className="mr-2" />
                            {TEXT_CONSTANTS.githubButton}
                        </Button>
                   </Link>
                </CardContent>
            </Card>
        </div>
    );
}
