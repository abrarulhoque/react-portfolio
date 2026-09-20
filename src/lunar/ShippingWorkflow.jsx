import {
  ArrowRight,
  Check,
  CircleCheck,
  MapPin,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import WorkflowPreview from "./WorkflowPreview";

const stages = [
  [0, "An order comes in", "Cart"],
  [250, "Split at the weight limit", "Split"],
  [2000, "Compare both carriers", "Compare"],
  [3900, "Choose the lower rate"],
  [5600, "Apply it at checkout", "Checkout"],
  [7500, "The right rate. Automatically."],
];

export default function ShippingWorkflow(props) {
  return (
    <WorkflowPreview
      name="Ruckaway / Shipping logic"
      theme="shipping"
      stages={stages}
      {...props}
    >
      {(step) => (
        <>
          <div
            className={`workflow-panel shipping-parcels ${step <= 1 ? "is-visible" : ""}`}
          >
            <div className="shipping-order-label">
              <ShoppingBag size={14} /> 2 items <span>30 kg total</span>
              <span>
                <MapPin size={12} /> Sydney, NSW
              </span>
            </div>
            <div className="parcel-original">
              <Package size={47} />
              <strong>30 kg</strong>
              <span>One heavy parcel</span>
            </div>
            <div className="parcel-split parcel-split-left">
              <Package size={36} />
              <strong>15 kg</strong>
              <span>Parcel 1</span>
            </div>
            <div className="parcel-split parcel-split-right">
              <Package size={36} />
              <strong>15 kg</strong>
              <span>Parcel 2</span>
            </div>
            <div className="parcel-rule">
              <span className="parcel-rule-idle">
                Let the checkout work out shipping.
              </span>
              <span className="parcel-rule-split">
                <Check size={13} /> Both parcels under the 22 kg limit.
              </span>
            </div>
          </div>
          <div
            className={`workflow-panel shipping-compare ${step === 2 || step === 3 ? "is-visible" : ""}`}
          >
            <div className="shipping-compare-title">
              <span>Two parcels. Two carriers.</span>
              <span>Example rates · AUD</span>
            </div>
            <div className="shipping-network">
              <div className="shipping-origin">
                <PackageCheck size={27} />
                <strong>2 × 15 kg</strong>
                <span>Compare rates</span>
              </div>
              <div className="shipping-branches">
                <span />
                <span />
              </div>
              <div className="shipping-carriers">
                <div className="shipping-carrier carrier-australia">
                  <span className="shipping-carrier-letter">A</span>
                  <div>
                    Australia Post<small>Standard delivery</small>
                  </div>
                  <strong>$24.80</strong>
                </div>
                <div className="shipping-carrier carrier-direct">
                  <span className="shipping-carrier-letter">D</span>
                  <div>
                    Direct Freight
                    <small>
                      {step === 3 ? "Lower rate selected" : "Standard delivery"}
                    </small>
                  </div>
                  <strong>$19.60</strong>
                  <Check className="shipping-selected-check" size={14} />
                </div>
              </div>
            </div>
            <div className="shipping-selection-note">
              <CircleCheck size={14} />{" "}
              {step === 3
                ? "Direct Freight wins this order."
                : "Weight, destination, and carrier rules checked."}
            </div>
          </div>
          <div
            className={`workflow-panel shipping-checkout ${step === 4 ? "is-visible" : ""}`}
          >
            <div className="demo-window-title">
              <span>Checkout / Shipping</span>
              <span>AUD</span>
            </div>
            <div className="shipping-destination">
              <MapPin size={14} /> Deliver to Sydney, NSW
            </div>
            <div className="shipping-chosen">
              <span className="shipping-radio">
                <i />
              </span>
              <Truck size={24} />
              <div>
                <strong>Direct Freight</strong>
                <span>2 parcels · 15 kg each</span>
              </div>
              <strong>$19.60</strong>
            </div>
            <div className="shipping-checkout-total">
              <span>Shipping total</span>
              <strong>$19.60</strong>
            </div>
            <div className="demo-action">
              Continue to payment <ArrowRight size={14} />
            </div>
          </div>
          <div
            className={`workflow-panel demo-complete ${step === 5 ? "is-visible" : ""}`}
          >
            <div className="completion-icon">
              <Check size={30} />
            </div>
            <strong>The right rate, at checkout.</strong>
            <span>Carrier rules, handled automatically.</span>
            <div className="complete-detail">
              <PackageCheck size={15} /> 191 shipping scenarios checked
            </div>
          </div>
        </>
      )}
    </WorkflowPreview>
  );
}
