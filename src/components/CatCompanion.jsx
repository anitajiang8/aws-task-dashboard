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

        <div className="cat-avatar" aria-label="Cute cat avatar">
          🐱
        </div>
      </div>

      <div className="cat-room">
        <div className="cat-sticker">🌷</div>
        <div className="cat-character">ฅ^•ﻌ•^ฅ</div>
        <div className="cat-sticker">🧶</div>
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
    </section>
  );
}

export default CatCompanion;