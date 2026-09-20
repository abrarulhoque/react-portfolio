import CadWorkflow from "./CadWorkflow";
import ShippingWorkflow from "./ShippingWorkflow";
import DealerWorkflow from "./DealerWorkflow";
import TradeWorkflow from "./TradeWorkflow";

const workflows = {
  laserbend: CadWorkflow,
  ruckaway: ShippingWorkflow,
  dealer: DealerWorkflow,
  rossau: TradeWorkflow,
};

export default function ProjectVisual({
  type,
  paused = false,
  controls = false,
}) {
  const Workflow = workflows[type];
  return Workflow ? <Workflow paused={paused} controls={controls} /> : null;
}
