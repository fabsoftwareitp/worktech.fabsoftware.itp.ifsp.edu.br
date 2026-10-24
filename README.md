# 🎯 XIII Worktech 2026

Site oficial do evento Worktech - IFSP Câmpus Itapetininga (26 a 30 de outubro de 2026)

## 📁 Estrutura do Projeto

```
worktech/
├── css/                      # Arquivos CSS compilados
│   ├── material.icons.css    # Ícones do Material Design
│   ├── all.min.css           # Font Awesome (biblioteca de ícones)
│   ├── style.css             # CSS principal (gerado do SCSS)
│   └── style.css.map         # Source map do SCSS
│
├── scss/                     # Arquivos SCSS fonte (modularizados)
│   ├── _variables.scss       # Variáveis (cores da logo, fontes, breakpoints)
│   ├── _mixins.scss          # Mixins reutilizáveis
│   ├── _base.scss            # Estilos base do body
│   ├── _layout.scss          # Layout (header, seções, footer)
│   ├── _components.scss      # Componentes (timeline, carrossel, cards, botões)
│   ├── _utilities.scss       # Classes utilitárias (margins, paddings)
│   ├── _animations.scss      # Animações CSS (circuitos, pulsos, transições)
│   ├── _themes.scss          # Tokens de cor por tema (claro/escuro)
│   └── style.scss            # Arquivo principal que importa tudo
│
├── js/                       # JavaScript
│   ├── modules/              # Módulos organizados
│   │   ├── html-include.js       # Sistema de includes HTML
│   │   ├── theme-toggle.js       # Toggle dark/light mode
│   │   ├── timeline.js           # Monta a programação a partir do JSON
│   │   ├── day-carousel.js       # Carrossel acessível dos dias
│   │   ├── smooth-scroll.js      # Scroll suave
│   │   ├── poly-mesh.js          # Malha poligonal (montanhas e faixa do rodapé)
│   │   ├── circuit-board.js      # Trilhas de circuito no estilo da logo
│   │   ├── data-background.js    # Fundo de bytes e rede de nós (Programação e Local)
│   │   └── gsap-animations.js    # Animações GSAP (header, troca de dias, local)
│   ├── jquery.js             # jQuery
│   ├── materialize.min.js    # Materialize CSS framework
│   └── main.js               # Inicializador principal
│
├── jsons/                    # Dados JSON
│   └── workshops.json        # Programação das palestras e oficinas
│
├── view/                     # Componentes HTML
│   └── components/
│       ├── navbar.html          # Barra de navegação
│       ├── header.html          # Hero/Banner principal
│       ├── programacao.html     # Seção de programação
│       ├── inscricoes.html      # Seção de inscrições
│       ├── local.html           # Seção do local (mapa com moldura HUD)
│       ├── local-svg.html       # SVG da seção do local
│       ├── footer.html          # Rodapé
│       ├── lamp-button.html     # Botão de toggle dark/light
│       └── svg-animations.html  # Componente de animações SVG
│
├── img/                      # Imagens do site (logos clara/escura, IFSP)
├── fonts/                    # Fontes de ícones
├── index.html                # Página principal
└── README.md                 # Este arquivo
```

## 🚀 Como Usar

### Desenvolvimento Local

O site carrega os componentes e o JSON via requisições, então precisa ser servido por HTTP (abrir o `index.html` direto do disco não funciona).

1. **Opção 1: Live Server (VS Code)**

   - Instale a extensão "Live Server"
   - Clique com botão direito em `index.html`
   - Selecione "Open with Live Server"

2. **Opção 2: Python HTTP Server**
   ```bash
   python3 -m http.server 8000
   ```
   Acesse: http://localhost:8000

### Compilando SCSS

Para modificar os estilos:

1. Edite os arquivos em `scss/`
2. Compile para CSS com o [Dart Sass](https://sass-lang.com/install/):
   ```bash
   sass scss/style.scss css/style.css --style expanded
   ```

A pasta `.sass-cache/` (gerada pelo antigo Ruby Sass) não é usada e está no `.gitignore`.

## 🎨 Tecnologias Utilizadas

### Core

- **HTML5** - Estrutura componentizada e semântica
- **SCSS/CSS3** - Estilos modularizados com variáveis, mixins e tokens de tema
- **JavaScript ES6+** - Código modular e organizado
- **jQuery** - Manipulação DOM e AJAX

### Frameworks & Libraries

- **Materialize CSS** - Framework UI base
- **Material Icons** - Ícones do Material Design
- **Font Awesome** - Biblioteca de ícones complementar
- **Google Fonts** - Tektur (títulos), Rubik (texto) e Share Tech Mono (detalhes de terminal)

### Animações & Gráficos

- **GSAP 3** + **ScrollTrigger** - Animações de entrada, parallax e troca suave entre os dias
- **Canvas** - Malha poligonal em wireframe e fundo de dados (bytes em hexadecimal e pacotes saltando entre nós)
- **SVG dinâmico** - Trilhas de circuito com pulsos de luz, geradas por JavaScript

## 📝 Funcionalidades

- ✅ **Identidade da logo** - Paleta verde da logo do XIII Worktech
- ✅ **Modo Escuro/Claro** - Toggle com botão de lâmpada e logo própria para cada tema
- ✅ **Programação real** - Palestras e oficinas carregadas de `workshops.json`, com marcadores de turno
- ✅ **Carrossel de dias** - Setas, teclado, toque e scroll-snap
- ✅ **Navegação Suave** - Smooth scroll entre seções
- ✅ **100% Responsivo** - Otimizado para desktop, tablet e mobile (circuitos também se adaptam ao celular)
- ✅ **Sistema Componentizado** - Arquitetura modular com includes HTML

### ✨ Efeitos Visuais

- **Header**
  - Fundo em mesh gradient verde com brilho em meio círculo
  - Camada sutil de 0s e 1s
  - Trilhas de circuito animadas no estilo da logo
- **Programação**
  - Rede de dados e colunas de bytes ao fundo
  - Pontos da timeline acesos como sinais
  - Troca suave entre os dias
- **Montanhas e rodapé**
  - Malha de triângulos ligados, como um modelo 3D em wireframe, com pulsos nas arestas
  - Revelação a partir da borda quando entra na tela
- **Local**
  - Mapa com moldura estilo HUD e botão estilo terminal
- **Acessibilidade**
  - Animações pausadas fora da tela e reduzidas para quem pede menos movimento (`prefers-reduced-motion`)

## 🔧 Manutenção

### Adicionar nova atividade

Edite `jsons/workshops.json`. As atividades são agrupadas por dia → turno (`Dia todo`, `Manhã`, `Noite`) → horário (use `""` para atividades sem horário fixo):

```json
{
  "26-de-outubro": {
    "Manhã": {
      "09:00": [
        {
          "titulo": "Nome da Palestra",
          "palestrante": "Nome do Palestrante",
          "local": "Saguão Biblioteca",
          "duracao": "1h",
          "descricao": "Descrição opcional...",
          "inscricao": "URL de inscrição"
        }
      ]
    }
  }
}
```

### Modificar estilos

1. Edite os arquivos apropriados em `scss/`:
   - **Cores/variáveis** → `_variables.scss` (cores exatas da logo: neon `#06fb7e`, menta `#affed2`, verde `#01943c` e tons derivados)
   - **Tokens de cor por tema** → `_themes.scss` (`--accent`, `--fill`... trocam com `body.dark`; o JS não pinta cores)
   - **Componentes** → `_components.scss` (timeline, cards, botões)
   - **Layout** → `_layout.scss` (header, footer, seções)
   - **Animações CSS** → `_animations.scss`
2. Recompile o CSS:
   ```bash
   sass scss/style.scss css/style.css --style expanded
   ```

### Modificar animações

Edite os módulos correspondentes em `js/modules/`:

- **gsap-animations.js** - Animações gerais (header, troca de dias, local)
- **poly-mesh.js** - Malha poligonal das montanhas (`<canvas data-mesh="right|left|bottom">`)
- **circuit-board.js** - Trilhas de circuito do header e de Inscrições (cores e animações em `.circuit-*` no CSS)
- **data-background.js** - Fundo de dados (`<div class="data-bg">`, com `data-content` e `data-avoid`)
- **day-carousel.js** - Carrossel acessível dos dias da programação

### Trocar imagens

As logos são referenciadas com `?v=` para furar o cache do navegador. Ao substituir uma imagem, aumente a versão (por exemplo, `ASSET_VERSION` em `theme-toggle.js` e os `?v=` nos componentes).

### Ajustar responsividade

O breakpoint principal é `$breakpoint-tablet: 768px` em `scss/_variables.scss` (abaixo dele a timeline vira coluna única). Os componentes do Materialize seguem os breakpoints dele (`600px`, `992px`).

## 👥 Créditos

### Desenvolvedores Originais

Designed and built by [@danilocbueno](https://github.com/danilocbueno) and [@paulhenrique](https://paulhenrique.github.io/ph)

### Refatoração 2026

Identidade visual do XIII Worktech e refatoração do código por estudantes de TSI:

- [@GustavoCardilho](https://github.com/GustavoCardilho)
- [@m4halic3](https://github.com/m4halic3)

Principais mudanças:

- 🟢 Paleta verde da logo e logos clara/escura com o mesmo desenho
- 🔌 Trilhas de circuito e fundo de dados animados
- 🔺 Montanhas de triângulos refeitas como malha poligonal em canvas
- 📅 Programação real com marcadores de turno e carrossel de dias
- 🔤 Nova tipografia (Tektur, Rubik e Share Tech Mono)
- 📱 Ajustes de responsividade e menu mobile

### Redesign 2025

Redesigned by TSI students:

- [@GustavoCardilho](https://github.com/GustavoCardilho)
- [@HelberCruz](https://github.com/HelberCruz)
- [@m4halic3](https://github.com/m4halic3)

---

**IFSP - Campus Itapetininga** | © 2026
