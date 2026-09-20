import {
  ArrowRight,
  Check,
  Download,
  Factory,
  FileCode2,
  FileText,
  MousePointer2,
} from "lucide-react";
import WorkflowPreview from "./WorkflowPreview";

const stages = [
  [0, "Start with the door", "Configure"],
  [300, "Made-to-measure dimensions"],
  [1900, "Choose the finish"],
  [3400, "Apply the dealer price", "Price"],
  [5400, "Generate the PDF quote", "PDF"],
  [7400, "Ready for the manufacturer", "Production"],
];

function Door({ finished = false }) {
  return (
    <svg
      className={`dealer-door ${finished ? "has-finish" : ""}`}
      viewBox="0 0 200 180"
      fill="none"
    >
      <path d="M22 156V35h156v121" stroke="#c3c7d3" strokeWidth="3" />
      <path
        className="dealer-door-fill"
        d="M31 44h138v112H31z"
        fill="#b4b8c3"
        stroke="#d3d7df"
      />
      <path d="M31 72h138M31 100h138M31 128h138" stroke="#59616f" />
      <path
        d="M47 51h28v13H47zm39 0h28v13H86zm39 0h28v13h-28z"
        fill="#282f3c"
        stroke="#7b8698"
      />
      <path d="M93 144h14" stroke="#d9dce2" strokeWidth="3" />
      <path
        d="M22 22h156M22 17v10m156-10v10M10 35v121m-4-121h8m-8 121h8"
        stroke="#8490a4"
        strokeWidth=".8"
      />
      <path d="M17 159h166" stroke="#c3c7d3" strokeWidth="2" />
    </svg>
  );
}

export default function DealerWorkflow(props) {
  return (
    <WorkflowPreview
      name="Dealer portal / Quote builder"
      theme="dealer"
      stages={stages}
      {...props}
    >
      {(step) => (
        <>
          <div
            className={`workflow-panel dealer-config ${step <= 3 ? "is-visible" : ""}`}
          >
            <div className="demo-window-title">
              <span>New door quote</span>
              <span className="dealer-saved">
                {step > 0 ? (
                  <>
                    <Check size={12} /> Draft saved
                  </>
                ) : (
                  "Dealer workspace"
                )}
              </span>
            </div>
            <div className="dealer-config-body">
              <div className={`dealer-drawing ${step >= 1 ? "is-wide" : ""}`}>
                <span>
                  {step >= 1 ? "3000" : "2500"} × {step >= 1 ? "2400" : "2100"}{" "}
                  mm
                </span>
                <Door finished={step >= 2} />
                <span>
                  {step >= 2 ? "Anthracite / RAL 7016" : "Standard finish"}
                </span>
              </div>
              <div className="dealer-config-options">
                <div
                  className={`dealer-field ${step === 1 ? "is-editing" : ""}`}
                >
                  <span>Width × height</span>
                  <strong>
                    {step >= 1 ? "3000 × 2400" : "2500 × 2100"}
                    <small>mm</small>
                  </strong>
                </div>
                <div
                  className={`dealer-field ${step === 2 ? "is-editing" : ""}`}
                >
                  <span>Finish</span>
                  <div className="dealer-swatches">
                    <i className={step < 2 ? "selected" : ""} />
                    <i className={step >= 2 ? "selected" : ""} />
                    <span>{step >= 2 ? "Anthracite" : "White"}</span>
                  </div>
                </div>
                <div className={`dealer-price ${step >= 3 ? "is-priced" : ""}`}>
                  <span>
                    {step >= 3 ? "Example dealer quote" : "Your dealer price"}
                  </span>
                  <strong>
                    {step >= 3 ? "NOK 18,450" : "Calculated for you"}
                  </strong>
                </div>
                <div className="demo-action">
                  Generate PDF <Download size={12} />
                </div>
                <MousePointer2
                  className="quote-pointer"
                  size={22}
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
          <div
            className={`workflow-panel dealer-pdf ${step === 4 ? "is-visible" : ""}`}
          >
            <div className="dealer-document">
              <div className="dealer-document-title">
                <FileText size={17} />
                <strong>Your door quote</strong>
                <span>PDF</span>
              </div>
              <div className="dealer-document-body">
                <Door finished />
                <div>
                  <strong>Custom garage door</strong>
                  <span>3000 × 2400 mm</span>
                  <span>Anthracite / RAL 7016</span>
                  <div className="dealer-document-total">
                    <span>Example dealer price</span>
                    <strong>NOK 18,450</strong>
                  </div>
                </div>
              </div>
              <div className="dealer-document-footer">
                <Check size={12} /> Prepared for your customer.
              </div>
            </div>
            <div className="dealer-download">
              <Download size={14} />
              <span>door-quote.pdf</span>
              <Check size={13} />
            </div>
          </div>
          <div
            className={`workflow-panel dealer-production ${step === 5 ? "is-visible" : ""}`}
          >
            <div className="dealer-handoff">
              <div>
                <FileText size={31} />
                <strong>Customer quote</strong>
                <span>PDF document</span>
              </div>
              <ArrowRight className="dealer-handoff-arrow" size={22} />
              <div>
                <Factory size={34} />
                <strong>Production order</strong>
                <span>Manufacturer XML</span>
              </div>
            </div>
            <div className="dealer-export">
              <FileCode2 size={20} />
              <div>
                <strong>production-order.xml</strong>
                <span>Dimensions, finish, and order details</span>
              </div>
              <Check size={16} />
            </div>
            <div className="dealer-production-note">
              One configuration. Ready for both.
            </div>
          </div>
        </>
      )}
    </WorkflowPreview>
  );
}
