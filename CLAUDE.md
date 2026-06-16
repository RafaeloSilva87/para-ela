# Grécia — Site Romântico

## Visão geral
Site estático (HTML/CSS/JS puro, sem frameworks ou build tools) criado como declaração de amor para a namorada do usuário, com navegação por abas, mensagens carinhosas, galeria de fotos do casal e mensagens-surpresa.

## Estrutura de arquivos
- `index.html` — markup principal, 5 seções/abas
- `styles.css` — visual completo (fundo gradiente roxo `#667eea → #764ba2`, navbar fixa translúcida, cards brancos, variáveis CSS `--primary #e74c3c`, `--accent #f39c12`)
- `script.js` — navegação entre abas, lógica das surpresas, lightbox, música de fundo
- `imagens/` — fotos do casal processadas com Python/Pillow (corte, correção de rotação EXIF, redimensionamento, JPEG qualidade 85): `foto1.jpg` a `foto8.jpg`
- `musica/lisboa.mp3` — música de fundo (ANAVITÓRIA, Lenine e Orquestra Ouro Preto - "Lisboa", ao vivo)

## Seções (index.html)
1. **Início** — hero com título "Te Amo" e texto de abertura
2. **Mensagens** — 4 cards com mensagens carinhosas
3. **Galeria** — 8 fotos em grid responsivo (`repeat(auto-fit, minmax(280px,1fr))`); clique em uma foto abre lightbox em tela cheia (fecha com Esc, X ou clique fora)
4. **Razões** — 8 motivos numerados (01–08): sorriso, gentileza, humor, inteligência, coração, "você é você", comida deliciosa (07), dedicação como mãe das filhas (08)
5. **Surpresa** — 6 corações clicáveis; cada um revela uma mensagem surpresa única (lista embaralhada uma única vez no load, índice sequencial — sem repetição)

## Comportamentos importantes (script.js)
- **Navegação entre abas**: alterna classes `.active` em `.nav-btn` / `.section`, sem reload de página (SPA simples)
- **Música de fundo**: o `<audio>` fica fora das `.section`, por isso não é afetado pela troca de abas — toca automaticamente ao carregar (com fallback no primeiro clique, por causa do bloqueio de autoplay dos navegadores) e tem botão flutuante de play/pause (🎵, gira enquanto toca)
- **Lightbox**: overlay fixo (`z-index: 2000`) que mostra a imagem da galeria em tela cheia com legenda

## Como visualizar
Abrir `index.html` direto no navegador, ou rodar um servidor local (evita problemas de `file://`):
```
python -m http.server 8888 -b 127.0.0.1
```
e acessar `http://localhost:8888`

## Histórico / decisões já tomadas
- Primeira versão teve layout malfeito ("ficou ruim"/"uma bosta") — refeito do zero com visual mais moderno (navbar + grids)
- Fotos reais do casal foram selecionadas e processadas (correção de rotação, corte de elementos de UI de câmera/photobooth, redimensionamento para no máximo 1100px no lado maior)
- Bug de mensagens de surpresa repetidas foi corrigido com embaralhamento único + índice sequencial (1 mensagem por coração, sem repetir)
- Fotos pendentes ou novas devem ser salvas na pasta `imagens/`, depois processadas (corte/resize) e referenciadas no HTML/CSS conforme o padrão acima
