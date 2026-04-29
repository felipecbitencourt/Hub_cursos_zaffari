function normalizeForSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toHref(url) {
  return encodeURI(url);
}

const CATEGORY_COLOR_CLASS = {
  Idiomas: "category-idiomas",
  SAC: "category-sac",
  Prateleira: "category-prateleira",
  Operacional: "category-operacional",
  Financeiro: "category-financeiro",
  Acessibilidade: "category-acessibilidade",
};

function parseDateTimeBr(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!match) return null;
  const [, dd, mm, yyyy, hh = "00", mi = "00"] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi));
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthLabelFromDate(date) {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function sortEntriesByDateDesc(entries) {
  return [...entries].sort((a, b) => {
    const aDate = parseDateTimeBr(a.date);
    const bDate = parseDateTimeBr(b.date);
    const aTime = aDate ? aDate.getTime() : Number.NEGATIVE_INFINITY;
    const bTime = bDate ? bDate.getTime() : Number.NEGATIVE_INFINITY;
    return bTime - aTime;
  });
}

const CHANGELOG_TYPE_MAP = {
  demanda: { label: "Demanda", colorClass: "type-demanda" },
  reunioes: { label: "Reunião", colorClass: "type-reuniao" },
  atualizacoes: { label: "Atualização", colorClass: "type-atualizacao" },
  aprovacao: { label: "Demanda", colorClass: "type-demanda" },
  entregue: { label: "Entregue", colorClass: "type-entregue" },
};

const CHANGELOG_LEGEND = [
  { key: "reuniao", label: "Reunião", colorClass: "type-reuniao" },
  { key: "atualizacao", label: "Atualização", colorClass: "type-atualizacao" },
  { key: "entregue", label: "Entregue", colorClass: "type-entregue" },
  { key: "demanda", label: "Demanda", colorClass: "type-demanda" },
];

function getTimelineEntries(course) {
  const timeline = Array.isArray(course?.changelog?.timeline) ? course.changelog.timeline : null;
  if (timeline && timeline.length) {
    const normalized = [...timeline];
    if (course?.status === "Entregue") {
      let latestIdx = -1;
      let latestTime = Number.NEGATIVE_INFINITY;
      normalized.forEach((entry, idx) => {
        const parsed = parseDateTimeBr(entry?.date);
        if (parsed && parsed.getTime() > latestTime) {
          latestTime = parsed.getTime();
          latestIdx = idx;
        }
      });
      if (latestIdx >= 0) {
        normalized[latestIdx] = { ...normalized[latestIdx], type: "Entregue", colorClass: "type-entregue" };
      }
    }
    return normalized;
  }

  const changelog = course?.changelog || {};
  const orderedKeys = ["demanda", "reunioes", "atualizacoes", "aprovacao"];
  const entries = [];

  orderedKeys.forEach((key) => {
    const items = Array.isArray(changelog[key]) ? changelog[key] : [];
    items.forEach((text) => {
      entries.push({
        type: CHANGELOG_TYPE_MAP[key]?.label || "Atualização",
        colorClass: CHANGELOG_TYPE_MAP[key]?.colorClass || "type-atualizacao",
        title: text,
      });
    });
  });

  if (course?.status === "Entregue" && entries.length) {
    return entries.map((entry, idx) => (
      idx === entries.length - 1 ? { ...entry, type: "Entregue", colorClass: "type-entregue" } : entry
    ));
  }
  return entries;
}

function ChangelogModal({ course, onClose }) {
  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const entries = sortEntriesByDateDesc(getTimelineEntries(course));
  return (
    <div className="changelog-overlay" role="dialog" aria-modal="true" aria-label={`Changelog ${course.title}`} onClick={onClose}>
      <div className="changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <p className="changelog-kicker">Histórico do Produto</p>
            <h3>{course.title}</h3>
            <p className="changelog-order">Lista de acontecimentos em ordem cronológica (mais recente para o mais antigo).</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar changelog">X</button>
        </div>

        <div className="changelog-legend">
          {CHANGELOG_LEGEND.map((item) => (
            <span className="legend-item" key={item.key}>
              <span className={`legend-dot ${item.colorClass}`} />
              {item.label}
            </span>
          ))}
        </div>

        {entries.length ? (
          <ol className="changelog-list">
            {entries.map((entry, idx) => (
              <li className="changelog-item" key={`${entry.type}-${idx}`}>
                <span className={`event-dot ${entry.colorClass}`} aria-hidden="true" />
                <div className="event-body">
                  <span className={`event-type ${entry.colorClass}`}>{entry.type}</span>
                  {entry.date ? <span className="event-date">{entry.date}</span> : null}
                  <p>{entry.title}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="changelog-empty">Sem registros ainda.</p>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, index, onOpenChangelog }) {
  const hasAccess = Boolean(course.accessUrl);
  const hasReport = Boolean(course.reportUrl);
  const categoryClass = CATEGORY_COLOR_CLASS[course.category] || "";
  return (
    <article className={`course-card ${categoryClass}`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className="course-cover">
        {course.cover ? (
          <img src={course.cover} alt={`Capa ${course.title}`} />
        ) : (
          <div className="course-cover-fallback">
            <span>Placeholder</span>
          </div>
        )}
        <span className={`course-badge ${categoryClass}`}>{course.category}</span>
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

function CalendarSection({ courses }) {
  const [activeMonth, setActiveMonth] = React.useState("todos");
  const [activeAction, setActiveAction] = React.useState("todas");

  const entries = React.useMemo(() => {
    const allEntries = courses.flatMap((course) =>
      getTimelineEntries(course).map((entry, idx) => {
        const parsedDate = parseDateTimeBr(entry.date);
        return {
          ...entry,
          id: `${course.id}-${idx}-${entry.title}`,
          courseTitle: course.title,
          category: course.category,
          sortTime: parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY,
          monthKey: parsedDate ? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}` : "sem-data",
          monthLabel: parsedDate ? monthLabelFromDate(parsedDate) : "Sem data definida",
        };
      })
    );
    return allEntries.sort((a, b) => b.sortTime - a.sortTime);
  }, [courses]);

  const grouped = React.useMemo(() => {
    const filteredEntries = entries.filter((entry) => {
      const monthOk = activeMonth === "todos" || entry.monthKey === activeMonth;
      const actionOk = activeAction === "todas" || normalizeForSearch(entry.type) === activeAction;
      return monthOk && actionOk;
    });

    const map = new Map();
    filteredEntries.forEach((entry) => {
      if (!map.has(entry.monthKey)) map.set(entry.monthKey, { key: entry.monthKey, label: entry.monthLabel, items: [] });
      map.get(entry.monthKey).items.push(entry);
    });
    return Array.from(map.values()).sort((a, b) => {
      if (a.key === "sem-data") return 1;
      if (b.key === "sem-data") return -1;
      return b.key.localeCompare(a.key);
    });
  }, [entries, activeMonth, activeAction]);

  const monthOptions = React.useMemo(() => {
    const map = new Map();
    entries.forEach((entry) => {
      if (!map.has(entry.monthKey)) map.set(entry.monthKey, entry.monthLabel);
    });
    return Array.from(map.entries())
      .sort((a, b) => {
        if (a[0] === "sem-data") return 1;
        if (b[0] === "sem-data") return -1;
        return b[0].localeCompare(a[0]);
      });
  }, [entries]);

  const actionOptions = React.useMemo(() => {
    const set = new Set(entries.map((entry) => normalizeForSearch(entry.type)));
    return CHANGELOG_LEGEND.filter((item) => set.has(normalizeForSearch(item.label)));
  }, [entries]);

  return (
    <section className="calendar">
      <div className="container">
        <div className="section-head">
          <h2>Calendário de Ações</h2>
          <p>Todas as ações registradas no changelog, do mais recente para o mais antigo.</p>
        </div>
        <div className="calendar-filters">
          <label>
            Mês
            <select value={activeMonth} onChange={(e) => setActiveMonth(e.target.value)}>
              <option value="todos">Todos</option>
              {monthOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Ação
            <select value={activeAction} onChange={(e) => setActiveAction(e.target.value)}>
              <option value="todas">Todas</option>
              {actionOptions.map((option) => (
                <option key={option.key} value={normalizeForSearch(option.label)}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        {entries.length === 0 ? (
          <div className="empty">
            <h3>Nenhuma ação registrada</h3>
            <p>Adicione eventos nos changelogs para preencher o calendário.</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="empty">
            <h3>Nenhum resultado com filtros</h3>
            <p>Altere o mês ou tipo de ação para visualizar eventos.</p>
          </div>
        ) : (
          <div className="calendar-groups">
            {grouped.map((group) => (
              <article className="calendar-group" key={group.label}>
                <h3>{group.label}</h3>
                <ol className="calendar-list">
                  {group.items.map((entry) => (
                    <li className="calendar-item" key={entry.id}>
                      <div className="calendar-item-meta">
                        <span className={`event-type ${entry.colorClass}`}>{entry.type}</span>
                        <span className="event-date">{entry.date || "Sem data"}</span>
                      </div>
                      <p>{entry.title}</p>
                      <small>{entry.courseTitle} · {entry.category}</small>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CatalogSection({ courses }) {
  const [query, setQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState("catalogo");
  const [isSwitching, setIsSwitching] = React.useState(false);
  const categories = React.useMemo(() => ["Todos", ...new Set(courses.map((c) => c.category))], [courses]);
  const statuses = React.useMemo(() => ["Todos os status", ...new Set(courses.map((c) => c.status).filter(Boolean))], [courses]);
  const [activeCategory, setActiveCategory] = React.useState("Todos");
  const [activeStatus, setActiveStatus] = React.useState("Todos os status");
  const [activeChangelogCourse, setActiveChangelogCourse] = React.useState(null);

  React.useEffect(() => {
    setIsSwitching(true);
    const timer = window.setTimeout(() => setIsSwitching(false), 520);
    return () => window.clearTimeout(timer);
  }, [viewMode]);

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
      <section className="view-switcher">
        <div className="container view-switcher-inner">
          <div className={`view-switch-track mode-${viewMode}`} aria-hidden="true" />
          <button type="button" className={`view-btn ${viewMode === "catalogo" ? "active" : ""}`} onClick={() => setViewMode("catalogo")}>
            Catálogo
          </button>
          <button type="button" className={`view-btn ${viewMode === "calendario" ? "active" : ""}`} onClick={() => setViewMode("calendario")}>
            Calendários
          </button>
        </div>
      </section>

      <div className={`view-content ${isSwitching ? "is-switching" : ""}`}>
        {viewMode === "catalogo" ? (
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
                      className={`tag ${CATEGORY_COLOR_CLASS[category] || ""} ${activeCategory === category ? "active" : ""}`}
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
          </>
        ) : (
          <CalendarSection courses={courses} />
        )}
      </div>
      {activeChangelogCourse ? (
        <ChangelogModal course={activeChangelogCourse} onClose={() => setActiveChangelogCourse(null)} />
      ) : null}
    </>
  );
}
