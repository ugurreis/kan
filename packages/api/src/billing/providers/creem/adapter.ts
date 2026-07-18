import type {
  BillingGateway,
  CheckoutParams,
  CheckoutResult,
  NeutralWebhookEvent,
  PortalParams,
  PortalResult,
  WebhookInput,
} from "../../types";
import { BillingSignatureError } from "../../types";
import { createCreemCheckout, createCreemPortal } from "./client";
import { parseCreemEvent } from "./parse";
import { verifyCreemSignature } from "./signature";

/** Creem implementation of the neutral BillingGateway. */
export function createCreemGateway(): BillingGateway {
  return {
    provider: "creem",

    async createCheckoutSession(
      params: CheckoutParams,
    ): Promise<CheckoutResult> {
      const { checkoutUrl } = await createCreemCheckout(params);
      return { url: checkoutUrl };
    },

    async createPortalSession(params: PortalParams): Promise<PortalResult> {
      const { portalUrl } = await createCreemPortal({
        providerCustomerId: params.providerCustomerId,
      });
      return { url: portalUrl };
    },

    verifyAndParseWebhook(input: WebhookInput): NeutralWebhookEvent {
      if (!verifyCreemSignature(input.rawBody, input.signature, input.secret)) {
        throw new BillingSignatureError();
      }
      return parseCreemEvent(input.rawBody);
    },
  };
}
