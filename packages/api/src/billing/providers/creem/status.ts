import type {
  BillingEventKind,
  PlanKey,
  SubscriptionStatus,
} from "../../types";

/** Map a Creem subscription object status string to a neutral status. */
export function mapCreemStatus(raw: string | undefined): SubscriptionStatus {
  switch ((raw ?? "").trim().toLowerCase()) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    case "paused":
      return "paused";
    case "canceled":
    case "cancelled":
    case "expired":
      return "canceled";
    default:
      // Safe default: never leave paid access open on an unknown status.
      return "canceled";
  }
}

/** Map a Creem eventType to the entitlement action kind. */
export function kindFromCreemEvent(eventType: string): BillingEventKind {
  switch (eventType) {
    case "subscription.active":
    case "subscription.paid":
    case "subscription.trialing":
      return "activated";
    case "subscription.update":
    case "subscription.scheduled_cancel":
    case "subscription.paused":
      return "updated";
    case "subscription.canceled":
    case "subscription.expired":
    case "refund.created":
    case "dispute.created":
      return "revoked";
    case "subscription.past_due":
      return "past_due";
    default:
      return "ignored";
  }
}

/** Statuses that keep a workspace on its paid plan. */
export function isEntitledStatus(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}

/**
 * Map a neutral planKey to the existing workspace_plan enum value.
 *
 * The enum rename (team->standard, pro->premium) is intentionally deferred: it
 * would touch many callers and require a risky enum-value migration. The neutral
 * planKey is persisted separately on the subscription row, so entitlement stays
 * provider-neutral while workspace.plan keeps its current vocabulary.
 */
export function workspacePlanFromKey(
  planKey: PlanKey | null,
): "free" | "team" | "pro" {
  switch (planKey) {
    case "standard":
      return "team";
    case "premium":
      return "pro";
    default:
      return "free";
  }
}
