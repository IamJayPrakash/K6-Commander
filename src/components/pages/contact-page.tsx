import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function ContactPage() {
    return (
        <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Mail className="text-primary" />
                    Contact Us
                </CardTitle>
                <CardDescription>
                    Have questions or feedback? We'd love to hear from you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <Input type="text" placeholder="Your Name" />
                    <Input type="email" placeholder="Your Email" />
                    <Textarea placeholder="Your message..." rows={6} />
                    <Button className="w-full" type="submit">
                        <Send className="mr-2 h-4 w-4"/>
                        Send Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
