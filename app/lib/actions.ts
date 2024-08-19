"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //允许将任何可以转换为数字的值（如字符串 "123"）强制转换为数字类型
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true }); //表示从 FormSchema 中移除了 id 和 date 字段

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  //   const rawFormData = Object.fromEntries(formData.entries());
  // Test it out:
  //   console.log(rawFormData);
}
