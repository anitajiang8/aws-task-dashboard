const XP_PER_LEVEL = 50;

function getCatLevel(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

function getXpProgress(totalXp) {
  return totalXp % XP_PER_LEVEL;
}

function CatCompanion({
  catProfile,
  accessories = [],
  completedTaskCount,
  onEquipAccessory,
  showCloset = true,
}) {
  const level = getCatLevel(catProfile.totalXp);
  const xpProgress = getXpProgress(catProfile.totalXp);
  const xpPercentage = (xpProgress / XP_PER_LEVEL) * 100;

  const equippedAccessory =
    accessories.find(
      (accessory) => accessory.id === catProfile.equippedAccessory
    ) || accessories[0];

  const equippedId = equippedAccessory?.id || "none";

  const showBow = equippedId === "bow";
  const showCollar = equippedId === "star-collar";
  const showCushion = equippedId === "cloud-cushion";
  const showSparkles = equippedId === "sparkles";

  function handleAccessoryClick(accessory) {
    const isUnlocked = level >= accessory.unlockLevel;

    if (!isUnlocked || !onEquipAccessory) {
      return;
    }

    onEquipAccessory(accessory.id);
  }

  const catMainContent = (
    <>
      <div className="cat-card-top">
        <div>
          <p className="card-kicker">Mochi&apos;s corner</p>
          <h2>{catProfile.catName}</h2>
        </div>

        <div className="cat-avatar">🐱</div>
      </div>

      <div className="cat-room">
        {showSparkles && (
          <>
            <span className="floating-sparkle sparkle-one">✦</span>
            <span className="floating-sparkle sparkle-two">♡</span>
            <span className="floating-sparkle sparkle-three">✧</span>
          </>
        )}

        <div className="animated-cat" aria-label={`${catProfile.catName} the cat`}>
          {equippedAccessory?.image && (
            <img
              className={`cat-equipped-accessory cat-equipped-${equippedAccessory.id}`}
              src={equippedAccessory.image}
              alt=""
              aria-hidden="true"
            />
          )}

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
              <div className="collar-charm">✦</div>
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
          <p>Choose an accessory for Mochi to wear.</p>
        </div>

        <span>{accessories.length} items</span>
      </div>

      <div className="accessory-grid">
        {accessories.map((accessory) => {
          const isUnlocked = level >= accessory.unlockLevel;
          const isEquipped = catProfile.equippedAccessory === accessory.id;

          return (
            <button
              key={accessory.id}
              type="button"
              className={`accessory-chip accessory-chip-button ${
                isUnlocked ? "unlocked-accessory" : "locked-accessory"
              } ${isEquipped ? "equipped-accessory" : ""}`}
              onClick={() => handleAccessoryClick(accessory)}
              disabled={!isUnlocked}
            >
              <span className="accessory-icon">
                {accessory.image ? (
                  <img src={accessory.image} alt="" aria-hidden="true" />
                ) : (
                  accessory.emoji
                )}
              </span>

              <span>
                <strong>{accessory.name}</strong>
                <span>
                  {isEquipped
                    ? "Equipped"
                    : isUnlocked
                      ? "Click to equip"
                      : `Unlocks at Level ${accessory.unlockLevel}`}
                </span>
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