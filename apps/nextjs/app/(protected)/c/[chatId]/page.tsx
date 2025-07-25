import ChatPage from "@/components/ChatPage/ChatPage";

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;
  return <ChatPage chatId={chatId} />;
};

export default page;
