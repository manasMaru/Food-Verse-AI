const { useState } = React;

function App() {
  const [active, setActive] = useState("overview");
  const [food, setFood] = useState("banana");
  const [servings, setServings] = useState("1");
  const [nutrition, setNutrition] = useState(null);
  const [ingredients, setIngredients] = useState("rice, dal, onion");
  const [recipes, setRecipes] = useState(null);
  const [preference, setPreference] = useState("balanced");
  const [mealPlan, setMealPlan] = useState(null);
  const [media, setMedia] = useState(null);
  const [mediaResult, setMediaResult] = useState(null);
  const [checks, setChecks] = useState({
    "Handwashing observed": true,
    "Raw and cooked food separated": true,
    "Food stored at safe temperatures": false,
    "Preparation surfaces appear clean": true,
    "Food covered when not in use": false
  });
  const [hygieneResult, setHygieneResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  async function api(path, body) {
    const response = await fetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
    return response.json();
  }
  async function runNutrition(e) {
    e.preventDefault(); setLoading(true); setNutrition(null);
    try { setNutrition(await api("/api/nutrition", {food, servings})); }
    catch { setToast("Could not reach the local server. Is server.py running?"); }
    finally { setLoading(false); }
  }
  async function runCooking(e) {
    e.preventDefault(); setLoading(true); setRecipes(null);
    try { setRecipes(await api("/api/cooking", {ingredients})); }
    catch { setToast("Could not reach the local server."); }
    finally { setLoading(false); }
  }
  async function runMealPlan(e) {
    e.preventDefault(); setLoading(true);
    try { setMealPlan(await api("/api/meal-plan", {preference})); }
    catch { setToast("Could not reach the local server."); }
    finally { setLoading(false); }
  }
  async function runMedia() {
    if (!media) { setToast("Choose an image, video or audio file first."); return; }
    setLoading(true); setMediaResult(null);
    try { setMediaResult(await api("/api/analyze-media", {filename: media.name, mediaType: media.type || "unknown"})); }
    catch { setToast("Could not reach the local server."); }
    finally { setLoading(false); }
  }
  async function runHygiene() {
    setLoading(true);
    try { setHygieneResult(await api("/api/hygiene", {checks})); }
    catch { setToast("Could not reach the local server."); }
    finally { setLoading(false); }
  }
  const nav = [
    ["overview", "◈", "Overview"],
    ["food", "◉", "Food analysis"],
    ["nutrition", "✳", "Nutrition"],
    ["cooking", "♨", "Cooking assistant"],
    ["hygiene", "⌕", "Hygiene review"],
    ["planner", "▦", "Meal planner"]
  ];
  const titles = {
    overview: ["Your food, understood.", "A simple workspace for smarter food decisions."],
    food: ["Multimodal food desk", "Choose an image, video or audio file to explore the workflow."],
    nutrition: ["Nutrition snapshot", "Look up approximate nutrition for familiar foods."],
    cooking: ["Cook with what you have", "Turn everyday ingredients into practical meal ideas."],
    hygiene: ["Hygiene checklist", "Review observed practices with a structured checklist."],
    planner: ["Your meal planner", "Get a simple one-day meal outline based on your preference."]
  };
  function go(page) { setActive(page); setToast(""); }
  function fileSelected(e) {
    const f = e.target.files && e.target.files[0];
    if (f) { setMedia(f); setMediaResult(null); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">fv<span>✳</span></div><div><strong>food verse</strong><small>AI FOOD INTELLIGENCE</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(([id, icon, label]) => <button key={id} onClick={() => go(id)} className={active === id ? "nav-item active" : "nav-item"}><span className="nav-icon">{icon}</span>{label}{id === "overview" && <span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-line"><span className="green-dot"/> Prototype running</div><div className="profile"><div className="avatar">FV</div><div><strong>Food Verse AI</strong><small>Personal workspace</small></div><span className="more">···</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>{nav.find(n => n[0] === active)[2]}</b></div><div className="top-actions"><span className="top-badge"><span className="green-dot"/> Demo mode</span><div className="top-avatar">FV</div></div></header>
      <section className="page-heading"><div><div className="eyebrow">FOOD INTELLIGENCE PLATFORM <span className="spark">✳</span></div><h1>{titles[active][0]}</h1><p>{titles[active][1]}</p></div><div className="date-pill">✦ &nbsp; A little smarter, every meal</div></section>

      {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")}>×</button></div>}

      {active === "overview" && <div className="content-grid">
        <section className="hero-card"><div className="hero-copy"><div className="hero-tag"><span/> YOUR FOOD COMPANION</div><h2>Good food choices<br/>start with <em>good insight.</em></h2><p>Explore food, understand nutrition, plan meals and build safer kitchen habits—all in one place.</p><button className="button light" onClick={() => go("food")}>Explore food desk <span>↗</span></button></div><div className="hero-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="fruit fruit-apple">🍎</div><div className="fruit fruit-avocado">🥑</div><div className="fruit fruit-orange">🍊</div><div className="art-spark s1">✳</div><div className="art-spark s2">✦</div><div className="art-caption">FRESH THINKING<br/><b>BETTER EATING</b></div></div></section>
        <div className="metric-grid"><div className="metric-card"><div className="metric-icon mint">◉</div><span>FOOD DESK</span><strong>4 <small>media types</small></strong><p>Image · video · audio · text</p></div><div className="metric-card"><div className="metric-icon peach">✳</div><span>NUTRITION</span><strong>15 <small>foods</small></strong><p>Quick approximate lookup</p></div><div className="metric-card"><div className="metric-icon lilac">♨</div><span>COOKING</span><strong>3 <small>helpers</small></strong><p>Recipes from ingredients</p></div></div>
        <div className="section-title"><div><h3>Make something useful</h3><p>Jump into a tool and try it out.</p></div><span className="muted-label">YOUR TOOLKIT ↘</span></div>
        <div className="tool-grid">
          <button className="tool-card" onClick={() => go("food")}><span className="tool-emoji">📷</span><span className="tool-arrow">↗</span><strong>Food analysis desk</strong><p>Select image, video or audio files and explore the analysis workflow.</p><span className="tool-link">Open workspace →</span></button>
          <button className="tool-card" onClick={() => go("nutrition")}><span className="tool-emoji">🥗</span><span className="tool-arrow">↗</span><strong>Nutrition snapshot</strong><p>Get estimated calories, protein, carbs, fat and fibre.</p><span className="tool-link">Check nutrition →</span></button>
          <button className="tool-card" onClick={() => go("cooking")}><span className="tool-emoji">🍳</span><span className="tool-arrow">↗</span><strong>Smart cooking</strong><p>Find practical ideas from ingredients already in your kitchen.</p><span className="tool-link">Find a recipe →</span></button>
          <button className="tool-card" onClick={() => go("hygiene")}><span className="tool-emoji">🧼</span><span className="tool-arrow">↗</span><strong>Hygiene review</strong><p>Use a checklist to reflect on visible kitchen practices.</p><span className="tool-link">Review checklist →</span></button>
        </div>
        <div className="note-banner"><span className="note-icon">ⓘ</span><div><strong>A transparent prototype</strong><p>This version uses rule-based demo logic. It does not claim to identify food, detect spoilage or certify hygiene from media. Those capabilities require validated AI models and testing.</p></div></div>
      </div>}

      {active === "food" && <div className="two-col">
        <section className="panel"><div className="panel-heading"><div className="panel-icon mint">◉</div><div><h3>Multimodal upload</h3><p>Image, video or audio</p></div></div>
          <label className="upload-zone"><input type="file" accept="image/*,video/*,audio/*" onChange={fileSelected}/><span className="upload-symbol">↑</span><strong>{media ? media.name : "Drop a file here or browse"}</strong><small>{media ? `${(media.size/1024/1024).toFixed(2)} MB · ${media.type || "Unknown type"}` : "JPG, PNG, MP4, MOV, MP3, WAV"}</small><span className="browse-button">Choose file</span></label>
          {media && media.type.startsWith("image/") && <img className="image-preview" src={URL.createObjectURL(media)} alt="Selected food preview"/>}
          {media && media.type.startsWith("video/") && <video className="image-preview" src={URL.createObjectURL(media)} controls/>}
          <button className="button primary full" onClick={runMedia} disabled={loading}>{loading ? "Working…" : "Run demo analysis ↗"}</button>
          {mediaResult && <div className="result-box"><div className="result-title"><span className="green-dot"/>{mediaResult.title}</div><p className="small-muted">{mediaResult.filename}</p><ul>{mediaResult.findings.map((x,i)=><li key={i}>{x}</li>)}</ul><span className="status-pill">{mediaResult.status}</span></div>}
        </section>
        <section className="panel"><div className="panel-heading"><div className="panel-icon peach">✦</div><div><h3>What this prototype supports</h3><p>Current demo capabilities</p></div></div>
          <div className="capability"><span className="cap-icon">📸</span><div><strong>Image workflow</strong><p>Select an image and preview it in the browser.</p></div><span className="tag-demo">DEMO</span></div>
          <div className="capability"><span className="cap-icon">🎬</span><div><strong>Video workflow</strong><p>Select a clip for the future hygiene-analysis pipeline.</p></div><span className="tag-demo">DEMO</span></div>
          <div className="capability"><span className="cap-icon">🎙️</span><div><strong>Audio workflow</strong><p>Select an audio file; speech transcription is not enabled yet.</p></div><span className="tag-demo">DEMO</span></div>
          <div className="capability"><span className="cap-icon">⌨️</span><div><strong>Text intelligence</strong><p>Nutrition lookup and cooking ideas work from typed input.</p></div><span className="tag-live">WORKING</span></div>
          <div className="note-banner compact"><span className="note-icon">ⓘ</span><div><strong>Honest by design</strong><p>Media is not sent to a trained AI model in this version. The analysis response explains this limitation.</p></div></div>
        </section>
      </div>}

      {active === "nutrition" && <div className="two-col">
        <section className="panel"><div className="panel-heading"><div className="panel-icon mint">✳</div><div><h3>Food nutrition lookup</h3><p>Choose a known food and serving count.</p></div></div>
          <form onSubmit={runNutrition}><label className="field-label">FOOD NAME</label><input className="text-input" value={food} onChange={e=>setFood(e.target.value)} placeholder="e.g. banana, dal, rice"/><label className="field-label">SERVINGS</label><div className="serving-row"><input className="text-input" type="number" min="0.25" max="10" step="0.25" value={servings} onChange={e=>setServings(e.target.value)}/><span>serving(s)</span></div><p className="helper">Try: apple, banana, rice, roti, dal, egg, chicken, paneer, pizza, salad, milk, oats, poha, idli or samosa.</p><button className="button primary full" disabled={loading}>{loading ? "Calculating…" : "Calculate nutrition ↗"}</button></form>
        </section>
        <section className="panel result-panel"><div className="panel-heading"><div className="panel-icon peach">◌</div><div><h3>Nutrition overview</h3><p>Estimated values for your selection</p></div></div>
          {!nutrition && <div className="empty-state"><div>🥑</div><strong>Your nutrition snapshot will appear here</strong><p>Enter a food name and serving amount to get started.</p></div>}
          {nutrition && nutrition.ok && <><div className="calorie-block"><span>ESTIMATED ENERGY</span><strong>{nutrition.nutrition.calories}<small> kcal</small></strong><p>{nutrition.food} · {nutrition.servings} serving(s)</p></div><div className="nutrient-grid">{[["Protein",nutrition.nutrition.protein,"g","protein"],["Carbs",nutrition.nutrition.carbs,"g","carbs"],["Fat",nutrition.nutrition.fat,"g","fat"],["Fibre",nutrition.nutrition.fiber,"g","fiber"]].map(([label,val,unit,key])=><div className="nutrient" key={key}><span>{label}</span><strong>{val}<small> {unit}</small></strong><div className="bar"><i style={{width:Math.min(100,Number(val)*2)+"%"}}/></div></div>)}</div><p className="helper">{nutrition.note}</p></>}
          {nutrition && !nutrition.ok && <div className="inline-error">{nutrition.message}</div>}
        </section>
      </div>}

      {active === "cooking" && <div className="two-col">
        <section className="panel"><div className="panel-heading"><div className="panel-icon peach">♨</div><div><h3>Your ingredients</h3><p>What do you have available?</p></div></div><form onSubmit={runCooking}><label className="field-label">INGREDIENTS, SEPARATED BY COMMAS</label><textarea className="text-input textarea" value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="e.g. rice, dal, onion, tomato"/><p className="helper">Add ingredients you already have. We'll suggest a simple way to use them.</p><button className="button primary full" disabled={loading}>{loading ? "Finding ideas…" : "Suggest cooking ideas ↗"}</button></form></section>
        <section className="panel"><div className="panel-heading"><div className="panel-icon mint">✦</div><div><h3>Ideas for your kitchen</h3><p>Simple, practical suggestions</p></div></div>{!recipes && <div className="empty-state"><div>🍲</div><strong>Ready when you are</strong><p>Your recipe ideas will appear here.</p></div>}{recipes && recipes.ok && recipes.ideas.map((idea,i)=><div className="recipe-card" key={i}><span className="recipe-number">0{i+1}</span><div><h4>{idea.name}</h4><ol>{idea.steps.map((step,j)=><li key={j}>{step}</li>)}</ol></div></div>)}{recipes && <p className="helper">{recipes.disclaimer}</p>}{recipes && !recipes.ok && <div className="inline-error">{recipes.message}</div>}</section>
      </div>}

      {active === "hygiene" && <div className="two-col">
        <section className="panel"><div className="panel-heading"><div className="panel-icon mint">⌕</div><div><h3>Observed hygiene checklist</h3><p>Tick what you have actually observed.</p></div></div><div className="checklist">{Object.entries(checks).map(([label,value])=><label className="check-row" key={label}><input type="checkbox" checked={value} onChange={e=>setChecks({...checks,[label]:e.target.checked})}/><span className="custom-check">✓</span><span>{label}</span></label>)}</div><button className="button primary full" onClick={runHygiene} disabled={loading}>{loading ? "Reviewing…" : "Generate checklist summary ↗"}</button></section>
        <section className="panel"><div className="panel-heading"><div className="panel-icon peach">✳</div><div><h3>Hygiene summary</h3><p>Checklist completion, not certification</p></div></div>{!hygieneResult && <div className="empty-state"><div>🧼</div><strong>Your summary will appear here</strong><p>Complete the checklist based on your observations.</p></div>}{hygieneResult && <><div className="score-circle"><strong>{hygieneResult.score}%</strong><span>CHECKLIST COMPLETED</span></div><p className="score-note">{hygieneResult.summary}</p><h4 className="subheading">Good practices to check</h4><ul className="recommendations">{hygieneResult.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul></>}</section>
      </div>}

      {active === "planner" && <div className="two-col">
        <section className="panel"><div className="panel-heading"><div className="panel-icon lilac">▦</div><div><h3>Plan your day</h3><p>Pick a simple meal preference.</p></div></div><form onSubmit={runMealPlan}><label className="field-label">PREFERENCE</label><select className="text-input select-input" value={preference} onChange={e=>setPreference(e.target.value)}><option value="balanced">Balanced</option><option value="vegetarian">Vegetarian</option><option value="high-protein">Higher protein</option></select><p className="helper">This is a general outline. Adjust it for your appetite, budget, allergies and dietary needs.</p><button className="button primary full" disabled={loading}>{loading ? "Planning…" : "Build my meal plan ↗"}</button></form></section>
        <section className="panel"><div className="panel-heading"><div className="panel-icon mint">✦</div><div><h3>Today's meal outline</h3><p>A flexible starting point</p></div></div>{!mealPlan && <div className="empty-state"><div>🥗</div><strong>Your day, on a plate</strong><p>Choose a preference to generate a sample meal plan.</p></div>}{mealPlan && <div className="meal-list">{mealPlan.meals.map(([time,meal],i)=><div className="meal-item" key={time}><div className="meal-time">{String(i+1).padStart(2,"0")}</div><div><span>{time}</span><strong>{meal}</strong></div><span className="meal-check">✳</span></div>)}<p className="helper">{mealPlan.note}</p></div>}</section>
      </div>}
      <footer><span>✳ Food Verse AI</span><span>Built with React · JavaScript · Python · HTML · CSS</span><span>Prototype v1.0</span></footer>
    </main>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
