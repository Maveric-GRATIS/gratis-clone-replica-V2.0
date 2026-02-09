export type FAQCategory = "general" | "tribe" | "bottles" | "impact" | "account";

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  // GENERAL
  {
    id: "general-1",
    category: "general",
    question: "What is GRATIS?",
    answer:
      "GRATIS is a social enterprise that distributes premium bottled water for free to TRIBE members, while generating profit through retail sales and advertising. 100% of net profits are transparently allocated to clean water, arts & culture, and education initiatives worldwide.",
  },
  {
    id: "general-2",
    category: "general",
    question: "How does GRATIS make money if the water is free?",
    answer:
      "We generate revenue through three channels: retail sales in stores, advertising partnerships on our bottles, and premium TRIBE memberships. This allows us to give free bottles to our community while funding social impact projects.",
  },
  {
    id: "general-3",
    category: "general",
    question: "Is GRATIS a charity or a business?",
    answer:
      "GRATIS is a for-profit social enterprise with a transparent giving model. We operate as a sustainable business that reinvests 100% of net profits into verified social impact projects. This ensures long-term sustainability and scalability.",
  },
  {
    id: "general-4",
    category: "general",
    question: "Where can I buy GRATIS Water in stores?",
    answer:
      "GRATIS Water is available at select retailers across the Netherlands. Check our Store Locator (coming soon) or sign up for our newsletter to be notified when we launch in your area.",
  },
  {
    id: "general-5",
    category: "general",
    question: "What countries do you ship to?",
    answer:
      "We currently ship free TRIBE bottles to Netherlands, Belgium, Germany, and France. Retail availability varies by region. International expansion is planned for 2026.",
  },

  // TRIBE MEMBERSHIP
  {
    id: "tribe-1",
    category: "tribe",
    question: "What are the TRIBE membership tiers?",
    answer:
      "GRATIS TRIBE has four tiers: Explorer (free, 1 bottle/month), Insider (€9.99/month, 2 bottles + voting), Core (€97/year, 4 bottles + priority voting), and Founder (€247 lifetime, unlimited bottles + 2x voting power). Each tier supports our mission while unlocking different benefits.",
  },
  {
    id: "tribe-2",
    category: "tribe",
    question: "Can I upgrade or downgrade my membership?",
    answer:
      "Yes! You can upgrade or downgrade your TRIBE tier at any time from your Dashboard → Settings → Membership. Changes take effect at the start of your next billing cycle. Founders have lifetime access and cannot downgrade.",
  },
  {
    id: "tribe-3",
    category: "tribe",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards (Visa, Mastercard, Amex), iDEAL, SEPA Direct Debit, and Apple Pay/Google Pay through our secure payment partner Stripe. All transactions are encrypted and secure.",
  },
  {
    id: "tribe-4",
    category: "tribe",
    question: "How does voting work?",
    answer:
      "Insider, Core, and Founder members vote quarterly on how net profits are allocated across our three impact areas: clean water, arts & culture, and education. Each member gets one vote, except Founders who get 2× voting power. Voting opens the first week of each quarter.",
  },
  {
    id: "tribe-5",
    category: "tribe",
    question: "Is there a limit to Founder memberships?",
    answer:
      "Yes, Founder memberships are limited to 1.000 spots worldwide to preserve exclusivity and ensure meaningful voting power. Once sold out, this tier will never be available again. Current availability is shown on our TRIBE page.",
  },
  {
    id: "tribe-6",
    category: "tribe",
    question: "Can I cancel my membership?",
    answer:
      "Yes, you can cancel your Insider or Core membership anytime from Dashboard → Settings → Membership. You'll retain access until the end of your paid period. Founder memberships are lifetime and non-refundable.",
  },

  // BOTTLES
  {
    id: "bottles-1",
    category: "bottles",
    question: "How do I claim my free bottle?",
    answer:
      "Log into your Dashboard and click 'Claim Your Bottle'. Enter your shipping address, confirm your order, and we'll ship it within 3-5 business days. You can track your order status in Dashboard → My Bottles.",
  },
  {
    id: "bottles-2",
    category: "bottles",
    question: "When do my monthly bottles reset?",
    answer:
      "Bottle allowances reset on the 1st of each month at 00:00 CET. For example, if you're an Insider with 2 bottles/month and claimed both in January, you'll get 2 new bottles on February 1st.",
  },
  {
    id: "bottles-3",
    category: "bottles",
    question: "What if I don't use all my bottles this month?",
    answer:
      "Unfortunately, unused bottles do not roll over to the next month. We recommend claiming your bottles before the end of each month to maximize your membership benefits.",
  },
  {
    id: "bottles-4",
    category: "bottles",
    question: "Can I change my shipping address?",
    answer:
      "Yes! You can update your default shipping address in Dashboard → Settings → Profile. You can also use a different address when claiming each bottle.",
  },
  {
    id: "bottles-5",
    category: "bottles",
    question: "What's in GRATIS Water?",
    answer:
      "GRATIS Water is premium natural spring water sourced from protected aquifers in the Netherlands. It contains naturally occurring minerals and has a balanced pH of 7.4. No additives, no processing – just pure hydration.",
  },
  {
    id: "bottles-6",
    category: "bottles",
    question: "How long does shipping take?",
    answer:
      "Netherlands: 1-3 business days. Belgium, Germany, France: 3-5 business days. You'll receive a tracking code via email once your order ships.",
  },
  {
    id: "bottles-7",
    category: "bottles",
    question: "Are the bottles recyclable?",
    answer:
      "Yes! Our bottles are made from 100% recyclable aluminum. Aluminum has an infinite recycling lifecycle and is more sustainable than plastic. Please recycle responsibly.",
  },

  // IMPACT
  {
    id: "impact-1",
    category: "impact",
    question: "How do I know my money actually goes to impact?",
    answer:
      "We publish quarterly Transparency Reports showing exact financial allocations, verified project outcomes, and NGO partner receipts. All reports are audited by an independent third party and available on our Impact Dashboard.",
  },
  {
    id: "impact-2",
    category: "impact",
    question: "What does '100% net profits' mean?",
    answer:
      "Net profit = Revenue minus operational costs (production, shipping, salaries, marketing). We don't take any profit for shareholders or investors. Every euro of net profit goes to our three impact areas, as voted by TRIBE members.",
  },
  {
    id: "impact-3",
    category: "impact",
    question: "Who are your NGO partners?",
    answer:
      "We partner with verified NGOs like charity: water (clean water), Musicmakers (arts), and Pencils of Promise (education). All partners undergo due diligence and provide quarterly impact reports. View the full list on our Partners page.",
  },
  {
    id: "impact-4",
    category: "impact",
    question: "Can I donate directly to a specific cause?",
    answer:
      "Yes! Visit our Donate page to make a one-time contribution to a specific impact area (water, arts, or education) or support our general fund. All donations are tax-deductible and you'll receive a receipt.",
  },
  {
    id: "impact-5",
    category: "impact",
    question: "How often do you publish impact reports?",
    answer:
      "We publish detailed Transparency Reports every quarter (January, April, July, October). Monthly updates are available on our Impact Dashboard. You can also see your personal impact metrics in your member Dashboard.",
  },

  // ACCOUNT
  {
    id: "account-1",
    category: "account",
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page, enter your email, and we'll send a reset link. For additional help, visit Dashboard → Settings → Security or contact support@gratis.ngo.",
  },
  {
    id: "account-2",
    category: "account",
    question: "Can I use social login?",
    answer:
      "Yes! You can sign up or log in with Google or Apple. Your account will be automatically created and you can upgrade to a TRIBE tier after logging in.",
  },
  {
    id: "account-3",
    category: "account",
    question: "How do I update my email preferences?",
    answer:
      "Go to Dashboard → Settings → Notifications to manage your email preferences. You can choose to receive bottle shipment updates, voting reminders, impact reports, and/or GRATIS news.",
  },
  {
    id: "account-4",
    category: "account",
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account from Dashboard → Settings → Security. This will permanently delete your data and cancel any active subscriptions. This action cannot be undone.",
  },
  {
    id: "account-5",
    category: "account",
    question: "How do I contact support?",
    answer:
      "Email us at support@gratis.ngo or use the contact form on our Contact page. We respond within 24 hours on business days. For urgent issues, check our Status page first.",
  },
  {
    id: "account-6",
    category: "account",
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption (SSL/TLS), secure authentication (Firebase), and comply with GDPR. We never sell your data. Read our full Privacy Policy for details.",
  },
];

export const categoryLabels: Record<FAQCategory, string> = {
  general: "General",
  tribe: "TRIBE",
  bottles: "Bottles",
  impact: "Impact",
  account: "Account",
};

export const categoryDescriptions: Record<FAQCategory, string> = {
  general: "About GRATIS and how it works",
  tribe: "Membership tiers and benefits",
  bottles: "Claiming and shipping bottles",
  impact: "Our social impact and transparency",
  account: "Managing your account and settings",
};
