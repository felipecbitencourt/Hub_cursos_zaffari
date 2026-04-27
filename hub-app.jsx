const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "cozy",
  "cardStyle": "elevated",
  "accentColor": "#FF5C2A"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.dataset.cardstyle = tweaks.cardStyle;
    document.documentElement.style.setProperty("--accent", tweaks.accentColor);
  }, [tweaks]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <div className="brand-mark"><span>Z</span></div>
            <div className="brand-meta">
              Catalogo de Cursos
              <small>Zaffari Treinamentos</small>
            </div>
          </div>
          <div className="topbar-actions">
            <a className="feedback-link" href="contato.html">
              Enviar feedback
            </a>
            <button
              className="icon-btn"
              type="button"
              onClick={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}
              aria-label="Alternar tema"
              title="Alternar tema"
            >
              {tweaks.theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero courses={COURSES} />
        <CatalogSection courses={COURSES} />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-credits">
            <p>Catalogo institucional para acesso rapido aos treinamentos digitais.</p>
            <p><strong>Desenvolvido por Estudio Integra.</strong></p>
            <p>
              Contato: Felipe Correa Bitencourt (<a href="mailto:felipe.cb2511@gmail.com">felipe.cb2511@gmail.com</a>) e
              {" "}Eduarda Tessari Pereira (<a href="mailto:dudatessari@gmail.com">dudatessari@gmail.com</a>)
            </p>
            <p><a className="footer-feedback-link" href="contato.html">Formulario de feedback do contratante</a></p>
          </div>
          <div className="footer-meta">Atualizado em Abril 2026</div>
        </div>
      </footer>

      <TweaksPanel title="Design Pop Corporativo">
        <TweakSection label="Tema" />
        <TweakRadio
          label="Modo"
          value={tweaks.theme}
          options={[
            { value: "light", label: "Claro" },
            { value: "dark", label: "Escuro" },
          ]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakColor label="Cor destaque" value={tweaks.accentColor} onChange={(v) => setTweak("accentColor", v)} />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Densidade"
          value={tweaks.density}
          options={[
            { value: "compact", label: "Compacto" },
            { value: "cozy", label: "Conforto" },
            { value: "spacious", label: "Amplo" },
          ]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakRadio
          label="Cards"
          value={tweaks.cardStyle}
          options={[
            { value: "elevated", label: "Elevado" },
            { value: "bordered", label: "Contorno" },
            { value: "flat", label: "Plano" },
          ]}
          onChange={(v) => setTweak("cardStyle", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
