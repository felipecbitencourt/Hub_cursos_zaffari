# Guia de Orientação do Projeto - Catálogo de Cursos

## 1) Objetivo
Criar um catálogo visual e funcional para acesso rápido aos cursos, com navegação simples e identidade moderna.

Cada item do catálogo (produto/curso) deve apresentar:
- 1 imagem de capa ilustrativa;
- 3 botões de ação:
  - Acesso ao curso
  - Relatório
  - Changelog

## 2) Estrutura do Catálogo

### 2.1 Imagem principal da página
- O catálogo deve ter **uma imagem principal** (hero/banner) no topo.
- Essa imagem deve representar treinamento, evolução e tecnologia.
- Recomenda-se manter proporção horizontal (ex.: 16:9) para melhor adaptação em desktop e mobile.

### 2.2 Card de cada curso
Cada curso deve seguir o mesmo padrão de card:

1. Imagem de capa do curso (ilustrativa)
2. Nome do curso
3. Botão `Acesso` (link do curso)
4. Botão `Relatório` (dashboard, documento ou página de resultados)
5. Botão `Changelog` (histórico de atualizações)

## 3) Diretrizes de Design (Pop + Corporativo)

### 3.1 Identidade visual
- Estilo: pop corporativo (vibrante, mas profissional).
- Combinar cores fortes com base neutra para manter legibilidade.
- Evitar excesso de efeitos que prejudiquem leitura e navegação.

### 3.2 Paleta sugerida
- Base: branco, grafite e cinza claro.
- Destaques pop: azul vivo, laranja, roxo ou verde-lima (usar com equilíbrio).
- Usar uma cor principal para ações e uma cor secundária para destaque.

### 3.3 Tipografia e componentes
- Fonte sem serifa, clara e moderna.
- Títulos com peso maior; textos de apoio curtos.
- Botões com cantos levemente arredondados, contraste alto e estados visuais de hover.

### 3.4 Experiência de uso
- Hierarquia clara: banner -> cursos -> ações.
- Cards organizados em grade responsiva.
- Botões sempre no mesmo local dentro do card para padronização.

## 4) Estrutura de Dados Recomendada
Para cada curso, registrar:

- `titulo`
- `imagem_capa`
- `link_acesso`
- `link_relatorio`
- `link_changelog`

Exemplo:

```json
{
  "titulo": "Nome do Curso",
  "imagem_capa": "imagens/curso-x.png",
  "link_acesso": "https://...",
  "link_relatorio": "https://...",
  "link_changelog": "https://..."
}
```

## 5) Conteúdo Inicial (links já mapeados)
Links identificados para uso no catálogo:

- https://felipecbitencourt.github.io/translate-hub/
- https://felipecbitencourt.github.io/Promotoress/
- https://felipecbitencourt.github.io/zaffari/
- https://felipecbitencourt.github.io/fato_fake/
- https://felipecbitencourt.github.io/NR17/
- https://felipecbitencourt.github.io/aprender-pt/

## 6) Checklist de Implementação
- Definir imagem principal do catálogo;
- Padronizar imagens de capa dos cursos;
- Montar grade de cards;
- Inserir os 3 botões por card (`Acesso`, `Relatório`, `Changelog`);
- Validar legibilidade, contraste e responsividade;
- Publicar e revisar links.

## 7) Critérios de Pronto
O catálogo estará pronto quando:
- Todos os cursos tiverem imagem de capa;
- Todos os cards tiverem os 3 botões funcionando;
- O visual estiver alinhado ao estilo pop corporativo;
- A navegação estiver clara em desktop e mobile.
