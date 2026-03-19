"use client";

type AnalyticsEventMap = {
  sign_in_submitted: {
    method: "password";
  };
  sign_up_submitted: {
    method: "password";
  };
  search_submitted: {
    query_length: number;
    has_query: boolean;
  };
  search_suggestion_selected: {
    suggestion_id: string;
    query_length: number;
  };
  create_fundraiser_cta_clicked: {
    placement: "desktop" | "mobile";
    signed_in: boolean;
  };
  create_charity_cta_clicked: {
    placement: "desktop" | "mobile";
    signed_in: boolean;
  };
  donation_modal_opened: {
    fundraiser_id: string;
  };
  donation_submitted: {
    fundraiser_id: string;
    amount_cents: number;
  };
  fundraiser_follow_toggled: {
    fundraiser_id: string;
    action: "followed" | "unfollowed";
  };
  charity_request_submitted: {
    has_cover_image: boolean;
    location_entered: boolean;
  };
};

export function trackEvent<EventName extends keyof AnalyticsEventMap>(
  name: EventName,
  properties?: AnalyticsEventMap[EventName]
) {
  // Analytics is intentionally disabled until a replacement provider is added.
  void name;
  void properties;
}
