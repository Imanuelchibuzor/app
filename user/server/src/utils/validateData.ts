// utils/validateData.ts
import { Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

type Source = "body" | "query" | "params";

function validateData<T extends ZodTypeAny>(
  req: Request,
  res: Response,
  schema: T,
  source: Source = "body"
): z.infer<T> | undefined {
  const raw =
    source === "body" ? req.body : source === "query" ? req.query : req.params;

  const result = schema.safeParse(raw);
  if (!result.success) {
    res.status(400).json({
      success: false,
      errors: result.error.issues.map((i) => i.message),
    });
    return undefined;
  }
  return result.data;
}

export default validateData;