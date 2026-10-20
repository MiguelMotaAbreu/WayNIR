# Design QA — WayNIR

## Alvo da comparação

- Fonte visual principal: `ui-ref/plataform-ref.JPG`
- Requisitos analíticos: seção 20 de `../plan.md`
- Implementação principal: `http://localhost:3000/analises`
- Viewport pretendido: 1366 × 768 CSS px, densidade 1
- Dimensões da referência: 736 × 1104 px
- Estado: metodologia exata, últimos 7 dias, todos os setores, especialidades e destinos

## Evidências disponíveis

- A referência visual foi aberta e inspecionada em resolução original.
- A implementação preserva a linguagem visual da referência: sidebar azul-marinho, cabeçalho compacto, superfícies claras, cartões analíticos e gráficos em azul, verde, âmbar e violeta.
- A nova rota `/analises` responde com HTTP 200 e contém o título esperado no HTML renderizado.
- `npm run lint` foi concluído sem erros ou avisos.
- `npm run build` foi concluído com sucesso e a rota foi pré-renderizada estaticamente.
- Foram implementados filtros globais, metodologia exata/legado, alternância gráfico/tabela e exportações simuladas.

## Bloqueio de comparação visual

- [P0] Não há superfície de navegador integrada disponível nesta sessão.
  - Local: `/analises` e demais rotas autenticadas.
  - Evidência: o inventário de Computer Use retornou `apps: []` e `browsers: []`.
  - Impacto: não existe screenshot da implementação para compor uma comparação lado a lado com a referência. Também não foi possível testar interações no navegador, responsividade real ou erros do console.
  - Correção necessária: disponibilizar um navegador integrado ou autorizar uma captura local por Playwright em uma rodada futura.

## Superfícies de fidelidade

- Fontes e tipografia: definidas com a mesma família e hierarquia do restante do produto; verificação visual pendente.
- Espaçamento e ritmo: grade responsiva de três, duas e uma coluna implementada; verificação visual pendente.
- Cores e tokens: reutilização dos tokens clínicos existentes; comparação visual pendente.
- Imagens e ativos: a área analítica usa apenas UI e gráficos Recharts; não há novos ativos raster necessários.
- Copy e conteúdo: indicadores correspondem ao `plan.md`, com dados explicitamente fictícios.

## Checklist pendente no navegador

- Capturar `/analises` em 1366 × 768 e uma captura longa da página.
- Comparar referência e implementação na mesma entrada visual.
- Testar filtros, metodologia, alternância gráfico/tabela, cópia e exportação simulada.
- Validar layouts de 820 px e 390 px.
- Inspecionar console e acessibilidade após interação.
- Corrigir diferenças P0/P1/P2 encontradas na comparação visual.

## Histórico

- Passo 1: expansão analítica implementada e validada por lint, build e resposta HTTP.
- Passo 2: captura visual bloqueada pela ausência de navegador integrado.

final result: blocked
