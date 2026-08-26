import { NavLink } from "react-router";

import CatCompanion from "../components/CatCompanion";
import PageHeader from "../components/PageHeader";
import { useTaskStore } from "../store/taskStoreContext";

function MochiPage() {
  const { catProfile, accessories, completedTaskCount, purchaseAccessory } =
    useTaskStore();

  return (
    <section className="dashboard mochi-page mochi-only-page">
      <PageHeader
        eyebrow="Companion"
        title="Mochi&apos;s room"
        subtitle="Spend treats on accessories. Items appear once Mochi reaches the right level, and stay unlocked once bought."
      />

      <div className="mochi-only-layout">
        <CatCompanion
          catProfile={catProfile}
          accessories={accessories}
          completedTaskCount={completedTaskCount}
          onPurchaseAccessory={purchaseAccessory}
          showCloset={true}
        />
      </div>

      <div className="mochi-back-row">
        <NavLink to="/" className="cute-page-link">
          Back to home
        </NavLink>
      </div>
    </section>
  );
}

export default MochiPage;
