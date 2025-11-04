# 🎯 Worktech 2025

Site oficial do evento Worktech - IFSP Câmpus Itapetininga

## 📁 Estrutura do Projeto

```
worktech/
├── css/                      # Arquivos CSS compilados
│   ├── material.icons.css    # Ícones do Material Design
│   ├── all.min.css          # Font Awesome (biblioteca de ícones)
│   └── style.css            # CSS principal (gerado do SCSS)
│
├── scss/                     # Arquivos SCSS fonte (modularizados)
│   ├── _variables.scss      # Variáveis (cores, tamanhos, etc)
│   ├── _mixins.scss         # Mixins reutilizáveis
│   ├── _base.scss           # Estilos base do body
│   ├── _layout.scss         # Layout (header, footer)
│   ├── _components.scss     # Componentes (timeline, schedule)
│   ├── _utilities.scss      # Classes utilitárias (margins, paddings)
│   ├── _themes.scss         # Temas (dark mode)
│   └── style.scss           # Arquivo principal que importa tudo
│
├── js/                       # JavaScript
│   ├── modules/             # Módulos organizados
│   │   ├── html-include.js       # Sistema de includes HTML
│   │   ├── theme-toggle.js       # Toggle dark/light mode
│   │   ├── timeline.js           # Funcionalidade da timeline
│   │   ├── smooth-scroll.js      # Scroll suave
│   │   ├── gsap-animations.js    # Animações GSAP avançadas
│   │   └── animated-triangles.js # Geração de SVG triangulos animados
│   ├── jquery.js            # jQuery
│   ├── materialize.min.js   # Materialize CSS framework
│   └── main.js              # Inicializador principal
│
├── jsons/                    # Dados JSON
│   └── workshops.json       # Dados dos workshops/palestras
│
├── view/                     # Componentes HTML
│   └── components/
│       ├── navbar.html          # Barra de navegação
│       ├── header.html          # Hero/Banner principal
│       ├── programacao.html     # Seção de programação (com SVGs animados)
│       ├── inscricoes.html      # Seção de inscrições (com SVGs animados)
│       ├── local.html           # Seção do local
│       ├── footer.html          # Rodapé
│       ├── lamp-button.html     # Botão de toggle dark/light
│       └── svg-animations.html  # Componente de animações SVG
│
├── img/                      # Imagens do site
├── fonts/                    # Fontes customizadas
├── index.html               # Página principal
└── README.md                # Este arquivo
```

## 🚀 Como Usar

### Desenvolvimento Local

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
2. Compile para CSS:
   ```bash
   sass scss/style.scss css/style.css --style expanded
   ```

## 🎨 Tecnologias Utilizadas

### Core

- **HTML5** - Estrutura componentizada e semântica
- **SCSS/CSS3** - Estilos modularizados com variáveis e mixins
- **JavaScript ES6+** - Código modular e organizado
- **jQuery** - Manipulação DOM e AJAX

### Frameworks & Libraries

- **Materialize CSS** - Framework UI base
- **Material Icons** - Ícones do Material Design
- **Font Awesome** - Biblioteca de ícones complementar

### Animações & Gráficos

- **GSAP 3** (GreenSock Animation Platform)
  - `gsap.to()`, `gsap.from()`, `gsap.fromTo()` - Animações core
  - `ScrollTrigger` - Animações em scroll
  - `Timeline` - Sequências de animações
  - `Stagger` - Animações escalonadas
  - `Ease` - Curvas de aceleração customizadas
- **SVG Dinâmico** - Geração e animação via JavaScript
  - Criação procedural de formas geométricas
  - Adaptação automática ao tema
  - Animações contínuas e orgânicas

## 📝 Funcionalidades

- ✅ **Design Minimalista** - Interface preto e branco elegante
- ✅ **Modo Escuro/Claro** - Toggle suave com botão de lâmpada
- ✅ **Timeline Responsiva** - Programação com cards interativos
- ✅ **Carregamento Dinâmico** - Workshops carregados via JSON
- ✅ **Navegação Suave** - Smooth scroll entre seções
- ✅ **100% Responsivo** - Otimizado para desktop, tablet e mobile
- ✅ **Sistema Componentizado** - Arquitetura modular com includes HTML

### ✨ Animações Avançadas com GSAP

- **Efeitos de Entrada**
  - Fade in com scroll trigger
  - Animações escalonadas (stagger)
  - Transições suaves entre dias da programação
- **SVG Animados Dinâmicos**
  - Centenas de triângulos gerando "montanhas" nas laterais
  - Triângulos flutuantes no fundo com movimento orgânico
  - Rotações e movimentos contínuos
  - Adaptação automática ao tema (preto/branco)
- **Efeitos Parallax**
  - Zoom sutil na imagem de fundo do header
  - Movimento de parallax na seção local
  - Transform scale em scroll
- **Hover Effects**
  - Cards com elevação suave
  - Botões com transições elegantes
  - Opacidade adaptativa por tema

## ⚡ Performance

- **Otimizações CSS**
  - `will-change` para animações GPU-accelerated
  - `overflow-x: hidden` para prevenir scroll horizontal
  - `transform: scale()` em vez de `background-size` para melhor performance
- **Otimizações JavaScript**
  - Código modular com carregamento assíncrono
  - Event delegation para melhor performance
  - Debouncing em eventos de scroll
- **Otimizações de Imagem**

  - Imagens otimizadas e comprimidas
  - Filtros CSS (grayscale, invert) para adaptação de tema
  - Background images com lazy loading

- **Responsividade**
  - Mobile-first approach
  - Breakpoints bem definidos
  - Componentes adaptáveis por dispositivo

## 🔧 Manutenção

### Adicionar novo workshop

Edite o arquivo `jsons/workshops.json` seguindo a estrutura existente:

```json
{
  "dia": "29/10",
  "horario": "10:00",
  "titulo": "Nome da Palestra",
  "palestrante": "Nome do Palestrante",
  "descricao": "Descrição...",
  "Curriculo": "URL do currículo",
  "inscricao": "URL de inscrição"
}
```

### Modificar estilos

1. Edite os arquivos apropriados em `scss/`:
   - **Cores/variáveis** → `_variables.scss` (paleta preto/branco/cinza)
   - **Componentes** → `_components.scss` (timeline, cards, botões)
   - **Layout** → `_layout.scss` (header, footer, seções)
   - **Temas** → `_themes.scss` (dark mode)
   - **Animações CSS** → `_animations.scss`
2. Recompile o CSS:
   ```bash
   sass scss/style.scss css/style.css --style expanded
   ```

### Modificar animações GSAP

Edite os módulos correspondentes em `js/modules/`:

- **gsap-animations.js** - Animações gerais (header, local, timeline)
- **animated-triangles.js** - Geração e animação dos SVGs de triângulos

### Ajustar responsividade

Os breakpoints estão definidos em `scss/_variables.scss`:

- Mobile: `< 768px`
- Tablet: `768px - 992px`
- Desktop: `> 992px`

## 👥 Créditos

### Desenvolvedores Originais

Designed and built by [@danilocbueno](https://github.com/danilocbueno) and [@paulhenrique](https://paulhenrique.github.io/ph)

### Redesign e Modernização

Redesigned by TSI students:

- [@GustavoCardilho](https://github.com/GustavoCardilho)
- [@andrwza](https://github.com/andrwza)
- [@m4halic3](https://github.com/m4halic3)

### Principais Melhorias do Redesign

- 🎨 Design minimalista preto e branco
- ✨ Animações GSAP avançadas com SVGs dinâmicos
- 🧩 Arquitetura componentizada
- 📱 Otimização mobile completa
- 🎭 Sistema de temas aprimorado
- 🚀 Performance e UX melhorados

---

**IFSP - Campus Itapetininga** | © 2025
