import { createActor } from "@/backend";
import type { Plan } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export type CheckoutSession = {
  id: string;
  url: string;
};

export type PlanCheckoutInput = {
  plan: Plan;
  priceAED: number;
  billingCycle: "monthly" | "yearly";
  currency: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (input: PlanCheckoutInput): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const priceInCents = Math.round(input.priceAED * 100);
      const productName = `GulfGrowth Pro — ${input.plan.charAt(0).toUpperCase() + input.plan.slice(1)} Plan`;
      const productDescription = `${input.billingCycle === "yearly" ? "Annual" : "Monthly"} subscription — ${input.currency}`;

      const shoppingItems = [
        {
          currency: "aed",
          productName,
          productDescription,
          priceInCents: BigInt(priceInCents),
          quantity: BigInt(1),
        },
      ];

      // @ts-expect-error — createCheckoutSession available when Stripe extension is configured
      const result = await actor.createCheckoutSession(
        shoppingItems,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result as string) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}
