import { CommitteeFlow } from "openinvest-site";

// Flat-diagram of the 4-role committee, framed on a glass panel.
export function Diagram() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.5)", padding: 24 }}>
      <CommitteeFlow />
    </div>
  );
}
