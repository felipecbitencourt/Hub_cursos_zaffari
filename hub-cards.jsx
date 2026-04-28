function normalizeForSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toHref(url) {
  return encodeURI(url);
}

const CHANGELOG_STEPS = [
  { key: "demanda", label: "Histórico de Demanda" },
  { key: "reunioes", label: "Reuniões" },
  { key: "atualizacoes", label: "Atualizações" },
  { key: "aprovacao", label: "Aprovação Final" },
];

function ChangelogModal({ course, onClose }) {
  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const changelog = course.changelog || {};
  return (
    <div className="changelog-overlay" role="dialog" aria-modal="true" aria-label={`Changelog ${course.title}`} onClick={onClose}>
      <div className="changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <p className="changelog-kicker">Histórico do Produto</p>
            <h3>{course.title}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar changelog">X</button>
        </div>

        <div className="changelog-grid">
          {CHANGELOG_STEPS.map((step) => {
            const items = Array.isArray(changelog[step.key]) ? changelog[step.key] : [];
            return (
              <section className="changelog-step" key={step.key}>
                <h4>{step.label}</h4>
                {items.length ? (
                  <ul>
                    {items.map((item, idx) => <li key={`${step.key}-${idx}`}>{item}</li>)}
                  </ul>
                ) : (
                  <p className="changelog-empty">Sem registros ainda.</p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, index, onOpenChangelog }) {
  const hasAccess = Boolean(course.accessUrl);
  const hasReport = Boolean(course.reportUrl);
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
          <button className="btn btn-ghost" type="button" title="Changelog" onClick={() => onOpenChangelog(course)}>
            <IconChangelog />
          </button>
        </div>
      </div>
    </article>
  );
}

function CatalogSection({ courses }) {
  const [query, setQuery] = React.useState("");
  const categories = React.useMemo(() => ["Todos", ...new Set(courses.map((c) => c.category))], [courses]);
  const statuses = React.useMemo(() => ["Todos os status", ...new Set(courses.map((c) => c.status).filter(Boolean))], [courses]);
  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const [activeStatus, setActiveStatus] = React.useState("Todos os status");
  const [activeChangelogCourse, setActiveChangelogCourse] = React.useState(null);

  const filtered = React.useMemo(() => {
    const q = normalizeForSearch(query.trim());
    return courses.filter((course) => {
      const matchesCategory = activeCategory === "Todos" || course.category === activeCategory;
      const matchesStatus = activeStatus === "Todos os status" || course.status === activeStatus;
      if (!q) return matchesCategory && matchesStatus;
      const hay = normalizeForSearch(`${course.title} ${course.description} ${course.category} ${course.status || ""}`);
      return matchesCategory && matchesStatus && hay.includes(q);
    });
  }, [courses, query, activeCategory, activeStatus]);

  return (
    <>
      <section className="filter-bar">
        <div className="container filter-inner">
          <label className="search">
            <IconSearch />
            <input
              type="search"
              value={query}
              placeholder="Buscar curso, tema, categoria ou status..."
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
          <div className="tags">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                className={`tag ${activeStatus === status ? "active" : ""}`}
                onClick={() => setActiveStatus(status)}
              >
                {status}
                <span className="count">
                  {status === "Todos os status" ? courses.length : courses.filter((c) => c.status === status).length}
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
            <h2>Cursos Disponíveis</h2>
            <p>Todos os cards seguem o mesmo padrão: capa ilustrativa, acesso, relatório e changelog.</p>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">
              <h3>Nenhum curso encontrado</h3>
              <p>Tente ajustar os termos da busca ou limpar os filtros.</p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} onOpenChangelog={setActiveChangelogCourse} />
              ))}
            </div>
          )}
        </div>
      </section>
      {activeChangelogCourse ? (
        <ChangelogModal course={activeChangelogCourse} onClose={() => setActiveChangelogCourse(null)} />
      ) : null}
    </>
  );
}
