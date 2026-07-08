const ACCESSORY_UNLOCKS = [
  {
    level: 1,
    name: "Ribbon Bow",
    icon: "🎀",
  },
  {
    level: 2,
    name: "Star Collar",
    icon: "⭐",
  },
  {
    level: 3,
    name: "Heart Cushion",
    icon: "💗",
  },
  {
    level: 4,
    name: "Sparkle Crown",
    icon: "✨",
  },
];

function CatCompanion({ catProfile, completedTaskCount }) {
  const totalXp = catProfile.totalXp || 0;
  const level = Math.floor(totalXp / 100) + 1;
  const xpInCurrentLevel = totalXp % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  return (
    <section className="cat-card">
      <div className="cat-card-top">
        <div>
          <p className="card-kicker">Cat companion</p>
          <h2>{catProfile.catName}</h2>
        </div>

        <div className="cat-avatar" aria-label="Cute cat icon">
          🐾
        </div>
      </div>

      <div className="cat-room">
        <span className="floating-sparkle sparkle-one">✦</span>
        <span className="floating-sparkle sparkle-two">♡</span>
        <span className="floating-sparkle sparkle-three">✧</span>

        <div
          className={`animated-cat level-${Math.min(level, 4)}`}
          role="img"
          aria-label="Animated pastel cat companion"
        >
          <div className="cat-shadow"></div>

          {level >= 3 && <div className="cat-cushion"></div>}

          <div className="cat-tail">
            <div className="tail-tip"></div>
          </div>

          <div className="cat-body">
            <div className="cat-belly"></div>
            <div className="cat-paw cat-paw-left"></div>
            <div className="cat-paw cat-paw-right"></div>
          </div>

          {level >= 2 && (
            <div className="cat-collar">
              <span className="collar-charm">★</span>
            </div>
          )}

          <div className="cat-head">
            <div className="cat-ear cat-ear-left">
              <div className="cat-ear-inner"></div>
            </div>

            <div className="cat-ear cat-ear-right">
              <div className="cat-ear-inner"></div>
            </div>

            <div className="cat-bow">
              <span className="bow-left"></span>
              <span className="bow-center"></span>
              <span className="bow-right"></span>
            </div>

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

          {level >= 4 && (
            <div className="cat-crown">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-label-row">
          <span>Level {level}</span>
          <span>{xpInCurrentLevel}/100 XP</span>
        </div>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${xpInCurrentLevel}%` }}
          ></div>
        </div>

        <p>
          {xpToNextLevel} XP until {catProfile.catName} reaches level{" "}
          {level + 1}.
        </p>
      </div>

      <div className="cat-stats">
        <div>
          <strong>{catProfile.treats}</strong>
          <span>Treats</span>
        </div>

        <div>
          <strong>{completedTaskCount}</strong>
          <span>Completed</span>
        </div>

        <div>
          <strong>{totalXp}</strong>
          <span>Total XP</span>
        </div>
      </div>

      <div className="closet-section">
        <div className="closet-header">
          <div>
            <p className="card-kicker">Mochi&apos;s closet</p>
            <h3>Level rewards</h3>
          </div>

          <span>Unlock with XP</span>
        </div>

        <div className="accessory-grid">
          {ACCESSORY_UNLOCKS.map((accessory) => {
            const isUnlocked = level >= accessory.level;

            return (
              <div
                className={`accessory-chip ${
                  isUnlocked ? "unlocked-accessory" : "locked-accessory"
                }`}
                key={accessory.name}
              >
                <span className="accessory-icon">{accessory.icon}</span>

                <div>
                  <strong>{accessory.name}</strong>
                  <span>
                    {isUnlocked
                      ? "Unlocked"
                      : `Unlocks at level ${accessory.level}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CatCompanion;