import { z } from "zod";
import { UserFormSchema } from "../schemas/userSchema";

export type ValidationErrors = {
    [K in keyof z.infer<typeof UserFormSchema>]?: string;
} & {
    general?: string;
}