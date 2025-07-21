import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/types";

const useUserHook = () => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(["user-info"]);

  return user;
};

export default useUserHook;
