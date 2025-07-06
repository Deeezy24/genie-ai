type props = { icon };

const CardLandingPage = () => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Lightning Fast</CardTitle>
        <CardDescription>
          Experience blazing-fast performance with optimized AI models and real-time processing capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Real-time processing
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Optimized algorithms
          </li>
          <li className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Instant responses
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default CardLandingPage;
