import {
  Check,
  CheckCircle2,
  CreditCard,
  FileCode2,
  LockKeyhole,
  MousePointer2,
  UploadCloud,
} from "lucide-react";
import WorkflowPreview from "./WorkflowPreview";

const stages = [
  [0, "Ready for a CAD file", "Upload"],
  [180, "Drag, drop, done"],
  [1800, "Reading the part"],
  [3600, "Instant quote ready", "Quote"],
  [5700, "Straight to checkout", "Checkout"],
  [7600, "Order confirmed"],
];

function Part() {
  return (
    <svg className="workflow-part" viewBox="0 0 220 180" fill="none">
      <path d="m25 87 86-47 85 42-85 50Z" fill="#747e8a" stroke="#c5cdd4" />
      <path
        d="m25 87 0 15 85 43 1-13 85-50v15l-86 48"
        fill="#39434f"
        stroke="#9ca8b4"
      />
      <path d="M25 87V48l86-47v39" fill="#525f6d" stroke="#c5cdd4" />
      <ellipse cx="80" cy="87" rx="9" ry="5" fill="#141b23" stroke="#c5cdd4" />
      <ellipse cx="138" cy="87" rx="9" ry="5" fill="#141b23" stroke="#c5cdd4" />
      <circle cx="49" cy="50" r="4" fill="#141b23" stroke="#c5cdd4" />
      <circle cx="89" cy="28" r="4" fill="#141b23" stroke="#c5cdd4" />
      <path
        d="M16 113v18l87 44m14-1 87-55v-17"
        stroke="#65788a"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

export default function CadWorkflow(props) {
  return (
    <WorkflowPreview
      name="Laserbend / Instant quote"
      theme="cad"
      stages={stages}
      {...props}
    >
      {(step) => (
        <>
          <div
            className={`workflow-panel cad-upload ${step <= 1 ? "is-visible" : ""}`}
          >
            <div className="cad-dropzone">
              <UploadCloud size={28} />
              <strong>Drop your CAD file</strong>
              <span>STEP · DXF · ready for a quote</span>
              <div className="cad-drop-corners" />
            </div>
            <div className="cad-upload-file">
              <FileCode2 size={25} />
              <div>
                <strong>bracket.step</strong>
                <span>3D part · 248 KB</span>
              </div>
              <MousePointer2
                className="demo-pointer"
                size={25}
                fill="currentColor"
              />
            </div>
          </div>
          <div
            className={`workflow-panel cad-config ${step === 2 ? "is-visible" : ""}`}
          >
            <div className="demo-window-title">
              <span>bracket.step</span>
              <Check size={14} />
            </div>
            <div className="cad-config-body">
              <Part />
              <div className="demo-fields">
                <div>
                  <span>Material</span>
                  <strong>Stainless steel</strong>
                </div>
                <div>
                  <span>Thickness</span>
                  <strong>3 mm</strong>
                </div>
                <div>
                  <span>Quantity</span>
                  <strong>10 parts</strong>
                </div>
              </div>
            </div>
            <div className="cad-scan">
              <span>Checking geometry</span>
              <div>
                <i />
              </div>
            </div>
          </div>
          <div
            className={`workflow-panel cad-quote ${step === 3 ? "is-visible" : ""}`}
          >
            <div className="demo-window-title">
              <span>
                <CheckCircle2 size={14} /> Your quote is ready
              </span>
              <span>01</span>
            </div>
            <div className="cad-quote-body">
              <div className="cad-quote-part">
                <Part />
                <span>bracket.step · 10 parts</span>
              </div>
              <div className="cad-quote-total">
                <span>Example quote</span>
                <strong>€86.40</strong>
                <span>Material + cutting + bending</span>
                <div className="demo-action">
                  Continue to checkout <span>↗</span>
                </div>
                <MousePointer2
                  className="quote-pointer"
                  size={23}
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
          <div
            className={`workflow-panel cad-checkout ${step === 4 ? "is-visible" : ""}`}
          >
            <div className="demo-window-title">
              <span>Secure checkout</span>
              <LockKeyhole size={13} />
            </div>
            <div className="checkout-order">
              <FileCode2 size={25} />
              <div>
                <strong>bracket.step</strong>
                <span>10 parts · Stainless steel</span>
              </div>
              <strong>€86.40</strong>
            </div>
            <div className="checkout-payment">
              <CreditCard size={16} />
              <span>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4242</span>
              <Check size={14} />
            </div>
            <div className="demo-action">
              Place order <LockKeyhole size={12} />
            </div>
          </div>
          <div
            className={`workflow-panel demo-complete ${step === 5 ? "is-visible" : ""}`}
          >
            <div className="completion-icon">
              <Check size={30} />
            </div>
            <strong>From file to fabrication.</strong>
            <span>Quote accepted. Order confirmed.</span>
            <div className="complete-detail">
              <FileCode2 size={15} /> bracket.step <span>10 parts</span>
            </div>
          </div>
        </>
      )}
    </WorkflowPreview>
  );
}
