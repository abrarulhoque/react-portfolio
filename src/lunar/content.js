export const projects = [
  {
    id: "laserbend",
    client: "Laserbend",
    platform: "WooCommerce / React",
    title: "From a CAD file to a quote.",
    summary:
      "A custom quoting tool for a laser-cutting shop. Upload a part, choose the options, get a price.",
    problem:
      "A laser-cutting shop quoted customer CAD files by hand. Every quote took staff time, and ambiguous geometry needed a human check.",
    solution:
      "A WordPress and WooCommerce plugin with a React front end, file upload, 3D part preview, pricing rules, volume discounts, shipping tiers, and payment integration. Ambiguous files have a custom-quote handoff.",
    result:
      "Customers can get a price during upload, with a manual review path for parts that need closer inspection. Development has continued in phases since November 2025.",
    stack: ["WordPress", "WooCommerce", "React", "PHP"],
  },
  {
    id: "ruckaway",
    client: "Ruckaway",
    platform: "Shopify / shipping logic",
    title: "Two carriers. One right rate.",
    summary:
      "Complex carrier contracts turned into checkout rules, checked against 191 shipping scenarios.",
    problem:
      "Two carrier contracts included weight limits, remote-area exclusions, parcel splitting, and free-shipping thresholds that a standard rate table could not express.",
    solution:
      "I translated the contracts into 191 scenarios, built a Python calculator to validate the rates, and configured the logic in ShipX. I checked each scenario against live checkout and documented product-weight setup.",
    result:
      "Checkout selects the cheaper carrier automatically and splits parcels over 22 kg to avoid the carrier surcharge.",
    stack: ["Shopify", "ShipX", "Python"],
  },
  {
    id: "dealer",
    client: "A Norwegian garage-door dealer",
    platform: "Next.js / Supabase",
    title: "The spreadsheet grew up.",
    summary:
      "A dealer quoting portal with custom pricing, visual quotes, and a direct path to production.",
    problem:
      "Dealer quotes depended on a fragile Excel workbook with conditional pricing only the owner could operate.",
    solution:
      "A web portal with server-side pricing checked against the workbook, dealer discounts, saved drafts, PDF quotes with door drawings, and XML export to the manufacturer. Role-based administration gives the team control over pricing.",
    result:
      "Delivered in three paid phases, with 60 dealer accounts live as of September 2026.",
    stack: ["Next.js", "Supabase", "PDF generation", "XML"],
  },
  {
    id: "rossau",
    client: "Tom Rossau",
    platform: "WordPress / wholesale",
    title: "Back in business. In two languages.",
    summary:
      "A broken checkout repaired, a migration cleaned up, and a wholesale store ready for retailers.",
    problem:
      "After a hosting migration, checkout failed, translated pages returned 404s, order emails stopped, and old-domain URLs remained in the database. The brand also needed a wholesale buying flow.",
    solution:
      "I traced the checkout and email failures, replaced 51,967 old-domain references, completed the translation jobs, and added a small plugin to fix the B2BKing/WPML sync. Approved retailers can log in for trade pricing and group-specific payment methods.",
    result:
      "Zero old-domain references, checkout errors resolved, 111 of 111 translation jobs complete, and wholesale purchasing live.",
    stack: ["WooCommerce", "WPML", "B2BKing", "WP-CLI"],
  },
];
export const services = [
  {
    title: "Shipping, pricing & tax rules",
    description:
      "Carrier rates by weight and zone, parcel splitting, free-shipping exclusions, wholesale pricing, handling fees, and multi-country rules.",
    deliverable: "Checked against a written set of checkout scenarios.",
  },
  {
    title: "Quote & configurator tools",
    description:
      "File uploads, conditional pricing, dealer accounts, discounts, saved drafts, and PDF quotes. A quoting workflow your customers can use themselves.",
    deliverable: "Pricing validated against your existing numbers.",
  },
  {
    title: "Integrations & automation",
    description:
      "Connect your store to carriers, inventory systems, distributors, and payment providers. Webhooks, order sync, and small tools that remove manual re-entry.",
    deliverable: "Logging and duplicate protection built into the flow.",
  },
  {
    title: "Store fixes & maintenance",
    description:
      "Broken checkouts, bad migrations, plugin conflicts, missing emails, multilingual issues, and ongoing WordPress maintenance.",
    deliverable: "The problem reproduced, fixed, and checked in the browser.",
  },
  {
    title: "Custom themes & web apps",
    description:
      "Shopify Liquid sections, WordPress builds, and custom apps when a plugin or spreadsheet is no longer enough.",
    deliverable: "Editable pages, source code, and written handover notes.",
  },
];
export const faqs = [
  [
    "How do you price the work?",
    "Fixed price per scoped piece of work. Larger builds run in paid phases, each ending with something you can use. I confirm the scope and price before starting.",
  ],
  [
    "Will my team be able to manage it?",
    "That is part of the build: theme-editor settings, editable pages, and written notes. I explain any part that needs ongoing technical help before we start.",
  ],
  [
    "Can we work across time zones?",
    "Yes. I work from Bangladesh, GMT+6, with clients across the US, UK, Europe, Australia, and the Gulf. Async communication works well; we can arrange a scoping call when useful.",
  ],
];
