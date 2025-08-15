import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Rocket, Database, BarChart2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Info className="text-primary" />
          About K6 Commander
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-lg text-foreground/80">
        <p>
          K6 Commander is a powerful, local-first testing platform designed for developers who need
          to ensure their applications are performant, accessible, and SEO-friendly. We believe that
          comprehensive testing should be easy to set up and run, without the complexity of cloud
          services for most use cases.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
            <Rocket size={40} className="text-accent mb-2" />
            <h3 className="text-xl font-semibold mb-2">Load Testing</h3>
            <p className="text-sm">
              Run sophisticated load tests using k6, with real-time dashboards powered by InfluxDB
              and Grafana.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
            <BarChart2 size={40} className="text-accent mb-2" />
            <h3 className="text-xl font-semibold mb-2">Lighthouse Audits</h3>
            <p className="text-sm">
              Get detailed Google Lighthouse reports to analyze performance, accessibility, and SEO
              scores.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
            <Database size={40} className="text-accent mb-2" />
            <h3 className="text-xl font-semibold mb-2">Local First</h3>
            <p className="text-sm">
              All your test configurations and history are stored securely in your browser's local
              storage.
            </p>
          </div>
        </div>
        <p>
          This tool is built for developers, by developers. Our goal is to provide a seamless and
          powerful testing experience right on your local machine.
        </p>
      </CardContent>
    </Card>
  );
}
