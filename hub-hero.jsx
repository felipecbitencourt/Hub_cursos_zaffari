function Hero({ courses }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="hero-eyebrow">
            <span className="dot">Z</span>
            Catalogo de Treinamentos
          </div>
          <h1>
            Hub de <em>conteudos Zaffari</em>
          </h1>
          <p className="lede">
            Um hub unico para acesso rapido aos cursos, relatorios e historico de atualizacoes.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{courses.length}<small>+</small></div>
              <span className="lbl">Treinamentos</span>
            </div>
            <div className="hero-stat">
              <div className="num">3</div>
              <span className="lbl">Acoes por curso</span>
            </div>
          </div>
        </div>

        <div className="hero-motion" aria-label="Animacao visual do catalogo">
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />

          <div className="orbit orbit-lg" />
          <div className="orbit orbit-md" />
          <div className="orbit orbit-sm" />

          <div className="pulse-dot pd-a" />
          <div className="pulse-dot pd-b" />
          <div className="pulse-dot pd-c" />

          <div className="signal-card sc-a">
            <span className="k">Tag</span>
            <strong>Idiomas</strong>
          </div>
          <div className="signal-card sc-b">
            <span className="k">Tag</span>
            <strong>SAC</strong>
          </div>
          <div className="signal-card sc-c">
            <span className="k">Tag</span>
            <strong>Prateleira</strong>
          </div>
          <div className="signal-card sc-d">
            <span className="k">Tag</span>
            <strong>Operacional</strong>
          </div>

          <div className="hero-core">
            <span>Hub</span>
          </div>
        </div>
      </div>
    </section>
  );
}
