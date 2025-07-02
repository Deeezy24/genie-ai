import { User } from "@clerk/backend";
import type { FastifyRequest } from "fastify";

export type FastifyRequestWithUser = FastifyRequest & { user: User };
