import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Security Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-bold text-xl pt-4">Our Security Philosophy</h2>
          <p>
            K6 Commander is designed with a "local-first" security model. Our primary security feature is that your sensitive data and test results never leave your local environment unless you explicitly action it.
          </p>

          <h2 className="font-bold text-xl pt-4">Application Architecture</h2>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>
                <strong>Containerization:</strong> All components of the application (the Next.js app, InfluxDB, Grafana) run in isolated Docker containers on your local machine, orchestrated by Docker Compose. This minimizes interference with your host system.
            </li>
            <li>
                <strong>Local Network:</strong> The services communicate with each other over a private Docker bridge network (`k6-network`). Ports are exposed to your `localhost` for access, but not to the public internet.
            </li>
             <li>
                <strong>No Cloud Dependencies:</strong> The core functionality does not rely on any external cloud databases or authentication services. All data is stored locally.
            </li>
          </ul>

          <h2 className="font-bold text-xl pt-4">Responsible Usage</h2>
          <p className="font-bold text-destructive">
            The most significant security consideration is how you use this tool. You are responsible for ensuring you only test applications and services you own or have explicit permission to test. Unauthorized load testing can be considered a denial-of-service (DoS) attack and may have legal consequences.
          </p>
          
           <h2 className="font-bold text-xl pt-4">Reporting Vulnerabilities</h2>
          <p>
            If you believe you have found a security vulnerability in K6 Commander, please report it to us responsibly. We will make every effort to address it promptly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
