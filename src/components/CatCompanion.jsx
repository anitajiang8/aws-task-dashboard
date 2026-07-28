const XP_PER_LEVEL = 50;

export function getCatLevel(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

function getXpProgress(totalXp) {
  return totalXp % XP_PER_LEVEL;
}

function CatCompanion({
  catProfile,
  accessories = [],
  completedTaskCount,
  onPurchaseAccessory,
  showCloset = true,
}) {
  const level = getCatLevel(catProfile.totalXp);
  const xpProgress = getXpProgress(catProfile.totalXp);
  const xpPercentage = (xpProgress / XP_PER_LEVEL) * 100;

  const equippedAccessoryIds = Array.isArray(catProfile.equippedAccessories)
    ? catProfile.equippedAccessories
    : [];

  const unlockedAccessoryIds = Array.isArray(catProfile.unlockedAccessoryIds)
    ? catProfile.unlockedAccessoryIds
    : [];

  const equippedAccessories = accessories.filter((accessory) =>
    equippedAccessoryIds.includes(accessory.id)
  );

  const showBow = equippedAccessoryIds.includes("bow");
  const showCollar = equippedAccessoryIds.includes("star-collar");
  const showCushion = equippedAccessoryIds.includes("cloud-cushion");
  const showSparkles = equippedAccessoryIds.includes("sparkles");

  function isAccessoryUnlocked(accessory) {
    return accessory.id === "none" || unlockedAccessoryIds.includes(accessory.id);
  }

  function handleAccessoryClick(accessory) {
    if (!onPurchaseAccessory) {
      return;
    }

    onPurchaseAccessory(accessory.id);
  }

  const catMainContent = (
    <>
      <div className="cat-card-top">
        <div>
          <p className="card-kicker">Mochi&apos;s corner</p>
          <h2>{catProfile.catName}</h2>
        </div>

        <div className="cat-avatar" aria-hidden="true">
          <span className="cat-avatar-mark"></span>
        </div>
      </div>

      <div className="cat-room">
        {showSparkles && (
          <>
            <span className="floating-sparkle sparkle-one"></span>
            <span className="floating-sparkle sparkle-two"></span>
            <span className="floating-sparkle sparkle-three"></span>
          </>
        )}

        <div className="animated-cat" aria-label={`${catProfile.catName} the cat`}>
          {equippedAccessories
            .filter((accessory) => accessory.image)
            .map((accessory) => (
              <img
                key={accessory.id}
                className={`cat-equipped-accessory cat-equipped-${accessory.id}`}
                src={accessory.image}
                alt=""
                aria-hidden="true"
              />
            ))}

          <div className="cat-shadow"></div>

          {showCushion && <div className="cat-cushion"></div>}

          <div className="cat-tail">
            <div className="tail-tip"></div>
          </div>

          <div className="cat-body">
            <div className="cat-belly"></div>
            <div className="cat-paw cat-paw-left"></div>
            <div className="cat-paw cat-paw-right"></div>
          </div>

          <div className="cat-head">
            <div className="cat-ear cat-ear-left">
              <div className="cat-ear-inner"></div>
            </div>

            <div className="cat-ear cat-ear-right">
              <div className="cat-ear-inner"></div>
            </div>

            {showBow && (
              <div className="cat-bow">
                <div className="bow-left"></div>
                <div className="bow-center"></div>
                <div className="bow-right"></div>
              </div>
            )}

            <div className="cat-face">
              <div className="cat-eye cat-eye-left">
                <span className="eye-sparkle eye-sparkle-large"></span>
                <span className="eye-sparkle eye-sparkle-small"></span>
              </div>

              <div className="cat-eye cat-eye-right">
                <span className="eye-sparkle eye-sparkle-large"></span>
                <span className="eye-sparkle eye-sparkle-small"></span>
              </div>

              <div className="cat-cheek cat-cheek-left"></div>
              <div className="cat-cheek cat-cheek-right"></div>
              <div className="cat-nose"></div>
              <div className="cat-mouth"></div>

              <div className="cat-whisker cat-whisker-left-one"></div>
              <div className="cat-whisker cat-whisker-left-two"></div>
              <div className="cat-whisker cat-whisker-right-one"></div>
              <div className="cat-whisker cat-whisker-right-two"></div>
            </div>
          </div>

          {showCollar && (
            <div className="cat-collar">
              <div className="collar-charm">M</div>
            </div>
          )}
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-label-row">
          <span>Level {level}</span>
          <span>
            {xpProgress}/{XP_PER_LEVEL} XP
          </span>
        </div>

        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpPercentage}%` }}></div>
        </div>

        <p>{XP_PER_LEVEL - xpProgress} XP until Mochi&apos;s next level.</p>
      </div>

      <div className="cat-stats">
        <div>
          <strong>{catProfile.totalXp}</strong>
          <span>Total XP</span>
        </div>

        <div>
          <strong>{catProfile.treats}</strong>
          <span>Treats</span>
        </div>

        <div>
          <strong>{completedTaskCount}</strong>
          <span>Quests</span>
        </div>
      </div>
    </>
  );

  const closetContent = (
    <section className="closet-section side-closet-section">
      <div className="closet-header">
        <div>
          <h3>Mochi&apos;s Closet</h3>
          <p>Choose accessories for Mochi to wear.</p>
        </div>

        <span>{accessories.length} items</span>
      </div>

      <div className="accessory-grid">
        {accessories.map((accessory) => {
          const isUnlocked = isAccessoryUnlocked(accessory);
          const isEquipped =
            accessory.id === "none"
              ? equippedAccessoryIds.length === 0
              : equippedAccessoryIds.includes(accessory.id);
          const meetsLevel = level >= (accessory.unlockLevel || 1);
          const canAfford = catProfile.treats >= (accessory.treatCost || 0);
          const canPurchase = !isUnlocked && meetsLevel && canAfford;

          let statusText;

          if (isEquipped) {
            statusText = accessory.id === "none" ? "Default" : "Equipped";
          } else if (isUnlocked) {
            statusText = "Click to equip";
          } else if (!meetsLevel) {
            statusText = `Unlocks at Level ${accessory.unlockLevel}`;
          } else if (!canAfford) {
            statusText = `Costs ${accessory.treatCost} treats`;
          } else {
            statusText = `Buy for ${accessory.treatCost} treats`;
          }

          return (
            <button
              key={accessory.id}
              type="button"
              className={`accessory-chip accessory-chip-button ${
                isUnlocked ? "unlocked-accessory" : "locked-accessory"
              } ${isEquipped ? "equipped-accessory" : ""}`}
              onClick={() => handleAccessoryClick(accessory)}
              disabled={!isUnlocked && !canPurchase}
            >
              <span className="accessory-icon">
                {accessory.image ? (
                  <img src={accessory.image} alt="" aria-hidden="true" />
                ) : (
                  <span
                    className={`closet-icon-mark ${accessory.iconClass}`}
                    aria-hidden="true"
                  ></span>
                )}
              </span>

              <span>
                <strong>{accessory.name}</strong>
                <span>{statusText}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  if (!showCloset) {
    return <section className="cat-card">{catMainContent}</section>;
  }

  return (
    <section className="cat-card cat-card-with-closet">
      <div className="cat-card-side-layout">
        <div className="cat-main-panel">{catMainContent}</div>
        {closetContent}
      </div>
    </section>
  );
}

export default CatCompanion;
