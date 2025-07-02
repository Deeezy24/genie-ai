import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const UserOnboardingSchema = z.object({
  foundUsOn: z.string().min(1),
  purpose: z.string().min(1),
  interests: z.array(z.string()).min(1),
});

class UserOnboardingDto extends createZodDto(UserOnboardingSchema) {}

export { UserOnboardingDto };
