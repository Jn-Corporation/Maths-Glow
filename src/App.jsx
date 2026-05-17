import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Box,
  ChartNoAxesColumn,
  ChevronDown,
  Circle,
  Copy,
  Dice5,
  Equal,
  Hash,
  Heart,
  Home,
  ListOrdered,
  Map,
  Moon,
  Mountain,
  PieChart,
  Radical,
  Ruler,
  Search,
  Shapes,
  Sigma,
  Sparkles,
  Sun,
  Triangle
} from 'lucide-react';
import katex from 'katex';

const STORAGE_KEYS = {
  theme: 'mathglow-theme',
  favorites: 'mathglow-favorites',
  recent: 'mathglow-recent',
  class: 'mathglow-class'
};

const iconMap = {
  Activity,
  BookOpen,
  Box,
  ChartNoAxesColumn,
  Circle,
  Dice5,
  Equal,
  Hash,
  ListOrdered,
  Map,
  Mountain,
  PieChart,
  Radical,
  Ruler,
  Shapes,
  Sigma,
  Triangle
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formulaId(classId, chapter, title) {
  return `${classId}-${chapter}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function FormulaMath({ value }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(value, { throwOnError: false, displayMode: true });
    } catch {
      return value;
    }
  }, [value]);

  return <div className="formula-math" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Splash() {
  return (
    <div className="splash">
      <div className="splash-orbit">
        <Sparkles size={34} />
      </div>
      <h1>MathGlow</h1>
      <p>Preparing your formula garden...</p>
    </div>
  );
}

function Header({ activeView, setActiveView, theme, toggleTheme, installPrompt, onInstall }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setActiveView('home')} aria-label="Go to home">
        <span className="brand-mark"><Sparkles size={20} /></span>
        <span>
          <strong>MathGlow</strong>
          <small>UP Board Maths</small>
        </span>
      </button>

      <nav className="desktop-nav" aria-label="Main navigation">
        {['home', 'explore', 'saved'].map((view) => (
          <button key={view} className={activeView === view ? 'active' : ''} onClick={() => setActiveView(view)}>
            {view === 'home' ? 'Home' : view === 'explore' ? 'Explorer' : 'Saved'}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        {installPrompt && (
          <button className="install-btn" onClick={onInstall}>
            Install
          </button>
        )}
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

function ClassSwitch({ selectedClass, setSelectedClass }) {
  return (
    <div className="class-switch" role="tablist" aria-label="Choose class">
      {['9', '10'].map((classId) => (
        <button
          key={classId}
          role="tab"
          aria-selected={selectedClass === classId}
          className={selectedClass === classId ? 'selected' : ''}
          onClick={() => setSelectedClass(classId)}
        >
          Class {classId}
        </button>
      ))}
    </div>
  );
}

function SearchBox({ search, setSearch }) {
  return (
    <label className="search-box">
      <Search size={20} />
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search formula, chapter, keyword..."
        autoComplete="off"
      />
    </label>
  );
}

function Hero({ selectedClass, setSelectedClass, search, setSearch, chapters, setActiveChapter, setActiveView }) {
  return (
    <section className="hero">
      <div className="blob blob-one" />
      <div className="blob blob-two" />
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={16} /> Premium formula handbook</span>
        <h1>Math formulas that feel calm, clear, and exam-ready.</h1>
        <p>
          A soft, offline UP Board Class 9 and 10 Mathematics companion with instant search,
          bookmarks, recent formulas, and beautiful chapter cards.
        </p>
        <div className="hero-controls">
          <ClassSwitch selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
          <SearchBox search={search} setSearch={setSearch} />
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-card-main">
          <span>Today’s focus</span>
          <strong>{chapters[0]?.chapter || 'Mathematics'}</strong>
          <small>{chapters[0]?.formulas.length || 0} quick formulas ready</small>
        </div>
        <div className="quick-grid">
          {chapters.slice(0, 4).map((chapter) => (
            <button
              key={chapter.chapter}
              onClick={() => {
                setActiveChapter(chapter.chapter);
                setActiveView('explore');
              }}
            >
              <ChapterIcon name={chapter.icon} size={18} />
              {chapter.chapter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterIcon({ name, size = 22 }) {
  const Icon = iconMap[name] || BookOpen;
  return <Icon size={size} />;
}

function ChapterCards({ chapters, setActiveChapter, setActiveView }) {
  return (
    <section className="section">
      <div className="section-heading">
        <span>Quick Access</span>
        <h2>Choose a chapter</h2>
      </div>
      <div className="chapter-grid">
        {chapters.map((chapter, index) => (
          <button
            className="chapter-card"
            key={chapter.chapter}
            style={{ '--delay': `${index * 35}ms` }}
            onClick={() => {
              setActiveChapter(chapter.chapter);
              setActiveView('explore');
            }}
          >
            <span className="chapter-icon"><ChapterIcon name={chapter.icon} /></span>
            <strong>{chapter.chapter}</strong>
            <small>{chapter.formulas.length} formulas</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function FormulaCard({ item, isFavorite, onToggleFavorite, onCopy, onOpen }) {
  return (
    <article className="formula-card" onMouseEnter={onOpen} onFocus={onOpen}>
      <div className="formula-head">
        <div>
          <span>{item.chapter}</span>
          <h3>{item.title}</h3>
        </div>
        <button
          className={`icon-btn bookmark ${isFavorite ? 'saved' : ''}`}
          onClick={() => onToggleFavorite(item.id)}
          aria-label={isFavorite ? 'Remove bookmark' : 'Save formula'}
        >
          {isFavorite ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
        </button>
      </div>
      <FormulaMath value={item.formula} />
      <p>{item.description}</p>
      <button className="copy-btn" onClick={() => onCopy(item.formula)}>
        <Copy size={16} /> Copy formula
      </button>
    </article>
  );
}

function Explorer({
  chapters,
  formulas,
  activeChapter,
  setActiveChapter,
  favorites,
  toggleFavorite,
  copyFormula,
  markRecent
}) {
  const shownChapters = activeChapter === 'All' ? chapters : chapters.filter((chapter) => chapter.chapter === activeChapter);

  return (
    <section className="explorer">
      <div className="explorer-sidebar">
        <button className={activeChapter === 'All' ? 'active' : ''} onClick={() => setActiveChapter('All')}>
          <BookOpen size={18} /> All chapters
        </button>
        {chapters.map((chapter) => (
          <button
            key={chapter.chapter}
            className={activeChapter === chapter.chapter ? 'active' : ''}
            onClick={() => setActiveChapter(chapter.chapter)}
          >
            <ChapterIcon name={chapter.icon} size={18} /> {chapter.chapter}
          </button>
        ))}
      </div>

      <div className="accordion-list">
        {shownChapters.map((chapter) => (
          <ChapterAccordion
            key={chapter.chapter}
            chapter={chapter}
            formulas={formulas.filter((item) => item.chapter === chapter.chapter)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            copyFormula={copyFormula}
            markRecent={markRecent}
          />
        ))}
      </div>
    </section>
  );
}

function ChapterAccordion({ chapter, formulas, favorites, toggleFavorite, copyFormula, markRecent }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="chapter-accordion">
      <button className="accordion-title" onClick={() => setOpen((value) => !value)}>
        <span><ChapterIcon name={chapter.icon} /> {chapter.chapter}</span>
        <small>{formulas.length} formulas</small>
        <ChevronDown className={open ? 'rotated' : ''} size={20} />
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        {formulas.map((item) => (
          <FormulaCard
            key={item.id}
            item={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onCopy={copyFormula}
            onOpen={() => markRecent(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SearchResults({ formulas, favorites, toggleFavorite, copyFormula, markRecent, search }) {
  if (!search.trim()) return null;

  return (
    <section className="section">
      <div className="section-heading">
        <span>Smart Search</span>
        <h2>{formulas.length ? `${formulas.length} matching formulas` : 'No formula found'}</h2>
      </div>
      <div className="formula-grid">
        {formulas.map((item) => (
          <FormulaCard
            key={item.id}
            item={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onCopy={copyFormula}
            onOpen={() => markRecent(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function SavedView({ savedFormulas, recentFormulas, favorites, toggleFavorite, copyFormula, markRecent }) {
  return (
    <section className="saved-view">
      <div className="section-heading">
        <span>Personal Space</span>
        <h2>Bookmarks and recent formulas</h2>
      </div>

      <div className="saved-columns">
        <div>
          <h3><Heart size={18} /> Bookmarked</h3>
          <div className="formula-grid compact">
            {savedFormulas.length ? savedFormulas.map((item) => (
              <FormulaCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onCopy={copyFormula}
                onOpen={() => markRecent(item.id)}
              />
            )) : <EmptyState text="Saved formulas will appear here." />}
          </div>
        </div>

        <div>
          <h3><Sparkles size={18} /> Recently viewed</h3>
          <div className="recent-list">
            {recentFormulas.length ? recentFormulas.map((item) => (
              <button key={item.id} onClick={() => markRecent(item.id)}>
                <strong>{item.title}</strong>
                <span>{item.chapter}</span>
              </button>
            )) : <EmptyState text="Open formula cards to build your recent list." />}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <Sparkles size={24} />
      <p>{text}</p>
    </div>
  );
}

function ProgressStrip({ favoritesCount, recentCount, totalCount }) {
  const progress = totalCount ? Math.min(100, Math.round(((favoritesCount + recentCount) / totalCount) * 100)) : 0;

  return (
    <section className="progress-strip">
      <div>
        <span>Study glow</span>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <small>{favoritesCount} saved · {recentCount} recent · {totalCount} total</small>
    </section>
  );
}

function BottomNav({ activeView, setActiveView }) {
  const items = [
    ['home', Home, 'Home'],
    ['explore', BookOpen, 'Explore'],
    ['saved', Bookmark, 'Saved']
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {items.map(([view, Icon, label]) => (
        <button key={view} className={activeView === view ? 'active' : ''} onClick={() => setActiveView(view)}>
          <Icon size={19} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ 9: [], 10: [] });
  const [selectedClass, setSelectedClass] = useState(() => readStorage(STORAGE_KEYS.class, '9'));
  const [activeView, setActiveView] = useState('home');
  const [activeChapter, setActiveChapter] = useState('All');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEYS.favorites, []));
  const [recent, setRecent] = useState(() => readStorage(STORAGE_KEYS.recent, []));
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, 'light'));
  const [toast, setToast] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.recent, recent);
  }, [recent]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.class, selectedClass);
    setActiveChapter('All');
  }, [selectedClass]);

  useEffect(() => {
    Promise.all([
      fetch('/data/class9.json').then((res) => res.json()),
      fetch('/data/class10.json').then((res) => res.json())
    ])
      .then(([class9, class10]) => setData({ 9: class9, 10: class10 }))
      .finally(() => setTimeout(() => setLoading(false), 550));
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    const onInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', onInstall);
    return () => window.removeEventListener('beforeinstallprompt', onInstall);
  }, []);

  const chapters = data[selectedClass] || [];

  const allFormulas = useMemo(() => chapters.flatMap((chapter) =>
    chapter.formulas.map((formula) => ({
      ...formula,
      chapter: chapter.chapter,
      classId: selectedClass,
      id: formulaId(selectedClass, chapter.chapter, formula.title)
    }))
  ), [chapters, selectedClass]);

  const filteredFormulas = useMemo(() => {
    const query = search.trim().toLowerCase();
    const chapterFiltered = activeChapter === 'All'
      ? allFormulas
      : allFormulas.filter((item) => item.chapter === activeChapter);

    if (!query) return chapterFiltered;
    return allFormulas.filter((item) =>
      [item.title, item.formula, item.description, item.chapter].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [allFormulas, activeChapter, search]);

  const savedFormulas = allFormulas.filter((item) => favorites.includes(item.id));
  const recentFormulas = recent.map((id) => allFormulas.find((item) => item.id === id)).filter(Boolean).slice(0, 6);

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]);
  };

  const markRecent = (id) => {
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 12));
  };

  const copyFormula = async (formula) => {
    await navigator.clipboard.writeText(formula);
    setToast('Formula copied');
    setTimeout(() => setToast(''), 1800);
  };

  const onInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (loading) return <Splash />;

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
        installPrompt={installPrompt}
        onInstall={onInstall}
      />

      <main>
        {activeView === 'home' && (
          <>
            <Hero
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              search={search}
              setSearch={setSearch}
              chapters={chapters}
              setActiveChapter={setActiveChapter}
              setActiveView={setActiveView}
            />
            <ProgressStrip favoritesCount={favorites.length} recentCount={recentFormulas.length} totalCount={allFormulas.length} />
            <SearchResults
              formulas={filteredFormulas}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              copyFormula={copyFormula}
              markRecent={markRecent}
              search={search}
            />
            {!search.trim() && <ChapterCards chapters={chapters} setActiveChapter={setActiveChapter} setActiveView={setActiveView} />}
          </>
        )}

        {activeView === 'explore' && (
          <>
            <div className="explore-head">
              <div>
                <span className="eyebrow"><BookOpen size={16} /> Formula Explorer</span>
                <h1>Class {selectedClass} Mathematics</h1>
              </div>
              <ClassSwitch selectedClass={selectedClass} setSelectedClass={setSelectedClass} />
            </div>
            <SearchBox search={search} setSearch={setSearch} />
            <Explorer
              chapters={chapters}
              formulas={filteredFormulas}
              activeChapter={activeChapter}
              setActiveChapter={setActiveChapter}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              copyFormula={copyFormula}
              markRecent={markRecent}
            />
          </>
        )}

        {activeView === 'saved' && (
          <SavedView
            savedFormulas={savedFormulas}
            recentFormulas={recentFormulas}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            copyFormula={copyFormula}
            markRecent={markRecent}
          />
        )}
      </main>

      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
