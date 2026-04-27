function normalizeForSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toHref(url) {
  return encodeURI(url);
}

function CourseCard({ course, index }) {
  const hasAccess = Boolean(course.accessUrl);
  const hasReport = Boolean(course.reportUrl);
  const hasChangelog = Boolean(course.changelogUrl);
  return (
    <article className="course-card" style={{ "--card-pop": course.accent, animationDelay: `${index * 70}ms` }}>
      <div className="course-cover">
        {course.cover ? (
          <img src={course.cover} alt={`Capa ${course.title}`} />
        ) : (
          <div className="course-cover-fallback">
            <span>Placeholder</span>
          </div>
        )}
        <span className="course-badge">{course.category}</span>
        <span className="course-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="course-body">
        <h3 className="course-title">{course.title}</h3>
        {course.status ? <span className={`course-status status-${normalizeForSearch(course.status)}`}>{course.status}</span> : null}
        <p className="course-desc">{course.description}</p>
        <div className="course-actions">
          {hasAccess ? (
            <a className="btn btn-primary" href={course.accessUrl} target="_blank" rel="noreferrer">
              Acesso <IconExternal />
            </a>
          ) : (
            <button className="btn btn-disabled btn-disabled-full" type="button" data-tooltip="Acesso em breve" aria-label="Acesso em breve">
              Acesso
            </button>
          )}
          {hasReport ? (
            <a className="btn btn-ghost" href={toHref(course.reportUrl)} target="_blank" rel="noreferrer" title="Relatorio">
              <IconReport />
            </a>
          ) : (
            <button className="btn btn-disabled" type="button" data-tooltip="Relatorio em breve" aria-label="Relatorio em breve">
              <IconReport />
            </button>
          )}
          {hasChangelog ? (
            <a className="btn btn-ghost" href={course.changelogUrl} target="_blank" rel="noreferrer" title="Changelog">
              <IconChangelog />
            </a>
          ) : (
            <button className="btn btn-disabled" type="button" data-tooltip="Changelog em breve" aria-label="Changelog em breve">
              <IconChangelog />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CatalogSection({ courses }) {
  const [query, setQuery] = React.useState("");
  const categories = React.useMemo(() => ["Todos", ...new Set(courses.map((c) => c.category))], [courses]);
  const [activeCategory, setActiveCategory] = React.useState("Todos");

  const filtered = React.useMemo(() => {
    const q = normalizeForSearch(query.trim());
    return courses.filter((course) => {
      const matchesCategory = activeCategory === "Todos" || course.category === activeCategory;
      if (!q) return matchesCategory;
      const hay = normalizeForSearch(`${course.title} ${course.description} ${course.category} ${course.status || ""}`);
      return matchesCategory && hay.includes(q);
    });
  }, [courses, query, activeCategory]);

  return (
    <>
      <section className="filter-bar">
        <div className="container filter-inner">
          <label className="search">
            <IconSearch />
            <input
              type="search"
              value={query}
              placeholder="Buscar curso, tema ou categoria..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>Ctrl + K</kbd>
          </label>
          <div className="tags">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`tag ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                <span className="count">
                  {category === "Todos" ? courses.length : courses.filter((c) => c.category === category).length}
                </span>
              </button>
            ))}
          </div>
          <div className="results-meta">{filtered.length} resultado(s)</div>
        </div>
      </section>

      <section className="catalog">
        <div className="container">
          <div className="section-head">
            <h2>Cursos Disponiveis</h2>
            <p>Todos os cards seguem o mesmo padrao: capa ilustrativa, acesso, relatorio e changelog.</p>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">
              <h3>Nenhum curso encontrado</h3>
              <p>Tente ajustar os termos da busca ou limpar os filtros.</p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
