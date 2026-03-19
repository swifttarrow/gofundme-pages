export declare const BADGE_DEFINITIONS: readonly [{
    readonly type: "trust_pioneer";
    readonly label: "First Fundraiser";
    readonly description: "Created your first fundraiser on GoSupportMe";
    readonly icon: "shield-check";
    readonly priority: 100;
}, {
    readonly type: "momentum_builder";
    readonly label: "Momentum Builder";
    readonly description: "Raised 50% of goal within the first 48 hours";
    readonly icon: "trending-up";
    readonly priority: 90;
}, {
    readonly type: "community_champion";
    readonly label: "Influencer";
    readonly description: "Fundraiser reached 500+ donors";
    readonly icon: "users";
    readonly priority: 80;
}, {
    readonly type: "top_donor";
    readonly label: "Top Donor";
    readonly description: "Donated to 10 or more fundraisers";
    readonly icon: "heart";
    readonly priority: 70;
}, {
    readonly type: "first_donation";
    readonly label: "First Donation";
    readonly description: "Made your first donation on GoSupportMe";
    readonly icon: "gift";
    readonly priority: 65;
}, {
    readonly type: "milestone_reacher";
    readonly label: "Milestone Reacher";
    readonly description: "Fundraiser reached its goal";
    readonly icon: "flag";
    readonly priority: 60;
}];
export type BadgeDefinition = (typeof BADGE_DEFINITIONS)[number];
export type BadgeType = BadgeDefinition["type"];
interface EvaluateBadgesOptions {
    sourceEventId?: string;
}
export declare function evaluateAndAwardBadges(userId: string, options?: EvaluateBadgesOptions): Promise<BadgeDefinition[]>;
export {};
