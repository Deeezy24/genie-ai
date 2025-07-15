import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReactNode } from "react";

type props = { icon: ReactNode; title: string; description: string };

const CardLandingPage = ({ icon, title, description }: props) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-md">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CardLandingPage;
