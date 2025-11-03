# 🎯 Worktech 2018

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
│   │   ├── html-include.js  # Sistema de includes HTML
│   │   ├── theme-toggle.js  # Toggle dark/light mode
│   │   ├── timeline.js      # Funcionalidade da timeline
│   │   └── smooth-scroll.js # Scroll suave
│   ├── jquery.js            # jQuery
│   ├── materialize.min.js   # Materialize CSS framework
│   └── main.js              # Inicializador principal
│
├── jsons/                    # Dados JSON
│   └── workshops.json       # Dados dos workshops/palestras
│
├── view/                     # Componentes HTML
│   └── components/
│       ├── navbar.html      # Barra de navegação
│       ├── header.html      # Hero/Banner principal
│       ├── programacao.html # Seção de programação
│       ├── inscricoes.html  # Seção de inscrições
│       ├── local.html       # Seção do local
│       ├── footer.html      # Rodapé
│       └── lamp-button.html # Botão de toggle dark/light
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
   cd /home/gustavocardilho/tsi/site/worktech
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

- **HTML5** - Estrutura componentizada
- **SCSS/CSS3** - Estilos modularizados
- **JavaScript/jQuery** - Interatividade modularizada
- **Materialize CSS** - Framework UI
- **Material Icons** - Ícones
- **GSAP (GreenSock)** - Animações avançadas
- **SVG** - Gráficos vetoriais animados

## 📝 Funcionalidades

- ✅ Modo escuro/claro (toggle com botão de lâmpada)
- ✅ Timeline responsiva de programação
- ✅ Carregamento dinâmico de workshops via JSON
- ✅ Navegação suave (smooth scroll)
- ✅ Design responsivo
- ✅ Sistema de includes HTML para componentes
- ✨ Animações avançadas com GSAP
  - Animações de entrada em scroll
  - Transições suaves entre dias
  - Efeitos 3D e parallax
  - Animações SVG contínuas
  - Hover effects interativos
  - Rotações e transformações fluidas

## 🔧 Manutenção

### Adicionar novo workshop
Edite o arquivo `jsons/workshops.json` seguindo a estrutura existente.

### Modificar estilos
1. Edite os arquivos apropriados em `scss/`:
   - Cores/variáveis → `_variables.scss`
   - Componentes → `_components.scss`
   - Layout → `_layout.scss`
2. Recompile o CSS

### Modificar funcionalidades
Edite os módulos correspondentes em `js/modules/`

## 👥 Créditos

Designed and built by [@danilocbueno](https://github.com/danilocbueno) and [@paulhenrique](https://paulhenrique.github.io/ph)

---
**IFSP - Campus Itapetininga** | © 2024
