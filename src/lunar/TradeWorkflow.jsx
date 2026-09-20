import {
  ArrowRight,
  Check,
  LockKeyhole,
  Mail,
  MousePointer2,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import WorkflowPreview from "./WorkflowPreview";

const stages = [
  [0, "Start in the retail store", "Retail"],
  [400, "English to Danish", "Translate"],
  [2100, "Sign in as a retailer", "Trade"],
  [3900, "Trade pricing unlocked"],
  [5800, "Complete the wholesale order", "Checkout"],
  [7700, "Order and email confirmed"],
];

function Lamp() {
  return (
    <div className="trade-lamp-scene">
      <div className="trade-lamp-glow" />
      <span className="trade-lamp-cord" />
      <div className="trade-lamp-model">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--rib": i }} />
        ))}
      </div>
      <span className="trade-lamp-shadow" />
    </div>
  );
}

export default function TradeWorkflow(props) {
  return (
    <WorkflowPreview
      name="Tom Rossau / Trade & retail"
      theme="trade"
      stages={stages}
      {...props}
    >
      {(step) => (
        <>
          <div
            className={`trade-product-scene ${step === 5 ? "is-complete" : ""}`}
          >
            <Lamp />
          </div>
          <div
            className={`workflow-panel trade-catalog ${step <= 1 || step === 3 ? "is-visible" : ""}`}
          >
            <div className="trade-catalog-top">
              <span>{step === 3 ? "Trade store" : "Retail store"}</span>
              <div
                className={`trade-languages ${step === 1 ? "is-danish" : ""}`}
              >
                <i />
                <span>EN</span>
                <span>DA</span>
              </div>
            </div>
            <div className="trade-product-info">
              <span className="trade-product-kind">Tom Rossau</span>
              <strong>{step === 1 ? "Pendellampe" : "Pendant light"}</strong>
              <span>
                {step === 1 ? "Lys til dit hjem" : "Lighting for your space"}
              </span>
            </div>
            <div className="trade-price">
              <span>
                {step === 3 ? "Example trade price" : "Example retail price"}
              </span>
              <strong>
                {step === 3 ? "1,496" : "1,995"} <small>kr.</small>
              </strong>
            </div>
            <div className="trade-access-note">
              {step === 3 ? (
                <>
                  <Check size={12} /> Approved retailer pricing
                </>
              ) : (
                <>
                  <ShoppingBag size={12} />{" "}
                  {step === 1 ? "Klar til bestilling" : "Ready to order"}
                </>
              )}
            </div>
            <div className="demo-action">
              {step === 1
                ? "Læg i kurv"
                : step === 3
                  ? "Add 4 to order"
                  : "Add to cart"}
              <ArrowRight size={13} />
            </div>
          </div>
          <div
            className={`workflow-panel trade-login ${step === 2 ? "is-visible" : ""}`}
          >
            <div className="trade-login-heading">
              <UserRound size={24} />
              <strong>Retailer access</strong>
              <span>Your account. Your trade prices.</span>
            </div>
            <div className="trade-login-field">
              <Mail size={12} />
              <span>retailer@example.com</span>
            </div>
            <div className="trade-login-field">
              <LockKeyhole size={12} />
              <span>••••••••••••</span>
            </div>
            <div className="demo-action">
              Sign in <ArrowRight size={13} />
            </div>
            <MousePointer2
              className="quote-pointer"
              size={23}
              fill="currentColor"
            />
          </div>
          <div
            className={`workflow-panel trade-checkout ${step === 4 ? "is-visible" : ""}`}
          >
            <div className="trade-checkout-heading">
              <LockKeyhole size={14} /> Wholesale checkout
            </div>
            <div className="trade-checkout-item">
              <span>Pendant light</span>
              <strong>4 × 1,496 kr.</strong>
            </div>
            <div className="trade-payment-note">
              <Check size={13} />
              <span>Retailer payment methods</span>
            </div>
            <div className="trade-checkout-total">
              <span>Example order total</span>
              <strong>
                5,984 <small>kr.</small>
              </strong>
            </div>
            <div className="demo-action">
              Place order <ArrowRight size={13} />
            </div>
          </div>
          <div
            className={`workflow-panel demo-complete ${step === 5 ? "is-visible" : ""}`}
          >
            <div className="completion-icon">
              <Check size={30} />
            </div>
            <strong>Retail and trade, together.</strong>
            <span>Two languages. A working checkout.</span>
            <div className="complete-detail">
              <Mail size={15} /> Order confirmation delivered{" "}
              <Check size={13} />
            </div>
          </div>
        </>
      )}
    </WorkflowPreview>
  );
}
