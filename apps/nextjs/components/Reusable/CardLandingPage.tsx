import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CheckCircle } from "lucide-react";
import { ReactNode } from "react";

type props = { icon: ReactNode; title: string; description: string; content: string[] };

const CardLandingPage = ({ icon, title, description, content }: props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content.map((item) => (
          <ul key={item} className="space-y-2">
            <li className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {item}
            </li>
          </ul>
        ))}
      </CardContent>
    </Card>
  );
};

export default CardLandingPage;
