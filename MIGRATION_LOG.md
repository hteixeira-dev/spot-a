Atualização de imagens: substituição de AVIF por PNG

Resumo
- Diretórios afetados:
  - public/AnimationHero/seq-loop-avif
  - public/AnimationHero/seq-scroll-avif
- Ações executadas:
  1. Remoção dos arquivos .avif obsoletos.
  2. Criação de arquivos .png com os mesmos nomes (apenas trocando a extensão):
     - Loop: conversão de WEBP para PNG (HERO_LOOP###.webp -> HERO_LOOP###.png).
     - Scroll: cópia das fontes PNG locais (spot_hero copy###.png -> HERO_QUEDA###.png).
  3. Verificação básica de integridade com sharp (metadata).
  4. Preservação de timestamps e permissões (modo) sempre que possível.
  5. Geração de relatório em scripts/logs/migration-avif-to-png.json.

Como reproduzir
- Executar o script de migração:
  - node scripts/migrate-avif-to-png.cjs

Notas
- Em Windows, a preservação de permissões pode não refletir diferenças de modo como em ambientes Unix.
- Para CDN, o app suporta duas convenções de env:
  - NEXT_PUBLIC_CDN_BASE
  - CDN_PUBLIC_URL + CDN_BASE_PATH
  Ao definir qualquer uma delas, as referências da hero usarão automaticamente os PNGs.

Data da execução: ver scripts/logs/migration-avif-to-png.json

Atualização extra: sequência de scroll (queda)
- Removido o diretório public/AnimationHero/seq-scroll-avif (arquivos .avif obsoletos).
- Ajustadas as referências no código para a sequência de scroll:
  - src/components/hero/components/HeroScrollComposite.tsx agora usa HERO_QUEDA###.png e count=545.
  - Mantido extCandidates: ["png"].
- Removidos logs de depuração em src/components/hero/ImagenSequenceLite.tsx.

Publicação no R2 / CDN
- Adicionado script de sincronização: scripts/sync-to-r2.cjs (Node.js, S3 SDK).
  - Env necessários: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET.
  - Caminhos de upload:
    - Loop PNGs: public/AnimationHero/seq-loop-avif/*.png → ${CDN_BASE_PATH || 'spot/hero/v1/seq-loop'}
    - Scroll PNGs: public/AnimationHero/seq-scroll/*.png → ${CDN_BASE_PATH_SCROLL || 'spot/hero/v1/seq-scroll'}
  - Define Content-Type e Cache-Control apropriados.
  - Relatório em scripts/logs/sync-to-r2.json.

Observação
- Para servir via CDN, defina NEXT_PUBLIC_CDN_BASE para apontar ao caminho público desejado (ex.: https://pub-...r2.dev/spot/hero/v1/seq-scroll) ou mantenha o fallback local (/AnimationHero/seq-scroll).

Verificação pós-migração
- Dev server aberto em http://localhost:3002/ sem erros aparentes no navegador.
- Hero Scroll renderizando PNGs sem 404.