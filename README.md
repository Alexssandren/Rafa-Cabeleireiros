# Rafa Cabeleireiros - Landing Page Premium

Uma landing page "Mobile First" focada em conversão, construída com HTML, CSS e JavaScript puros (Vanilla). O projeto foi desenhado sob medida para transmitir elegância e alto padrão visual, utilizando um tema *Dark Mode* com detalhes em *Gold* contemporâneos, juntamente a elementos interativos super fluídos para engajar usuários.

## 🌟 Principais Funcionalidades e Destaques

- **Design Premium (Dark & Gold):** Cores profundas (`#121212`, `#1e1e1e`) contrastando com tons dourados (`#d4af37`), trazendo um tom sofisticado e com alto contraste, utilizando clássicas fontes elegantes do Google Fonts.
- **Animações de Scroll 3D (Scroll-Jacking / Paralaxe):** A seção _Hero_ estendida engloba a página sem invadir o espaço do conteúdo. Ao descer a página, a cadeira fixa ao fundo recebe um movimento de aproximação (_zoom imersivo_) combinada com uma rotação de visão 3D calculada proporcionalmente ao `window.scrollY`. Essa animação é inteiramente renderizada e otimizada por `requestAnimationFrame` + *Aceleração de GPU*.
- **Ícones Animados Personalizados (SVG puro):** 
  - ✂️ **Corte de Cabelo (`tesoura.svg`):** Uma tesoura em looping compassado de corte afiado.
  - 👔 **Barba Completa (`boneco.svg`):** Mãos invisíveis finalizam o traje ajustando o nó de uma gravata repetidas vezes.
  - 😉 **Sobrancelha (`sobrancelha.svg`):** Olho que pisca sutilmente junto ao levantamento confiante da sobrancelha.
- **Mobile First e Responsivo:** O layout flui e esconde os itens menos vitais em celulares na forma de um Menu Hamburguer intuitivo. Tudo vai reagindo harmoniosamente conforme a tela se expande aos monitores Desktop (Grids).
- **Agendamento WhatsApp Integrado (CTA):** Botões e redirecionamentos pensados para a maior facilidade do cliente, apontando com a API direta do WhatsApp para rápida confirmação de conversão.

## 🛠️ Tecnologias Utilizadas

Este projeto opta pela ausência de Frameworks Pesados para dar ao código final total independência, rapidez de carregamento e manutenção enxuta:

- **HTML5:** Com semânticas enxutas.
- **CSS3:** Flexbox expansivos, CSS Grid, Pseudo-Animations de fade em scroll. Efeitos em blocos combinados (`Glassmorphism`).
- **JavaScript ES11+:** Intersecção em APIs nativas como `IntersectionObserver` (para fazer subtítulos surgirem do nada sem pesar a página), injeção `fetch API` do desenho SVG do fundo para evitar injeção pesada no HTML principal.

## 🚀 Como Executar o Projeto

Considerando a leveza Vanilla dos arquivos, a execução é indolor:
1. Feche o diretório. 
2. **Nenhuma instalação ou Compilação** via `npm`, vite ou webpack é exigida.
3. Clique duplo no arquivo `index.html` com o Google Chrome/Firefox, e navegue com imersão total instantaneamente, ou use um *Live Server* de editores locais.

---

### Mapeamento do Diretório de Desenvolvimento

```text
C:\Programacao\Sites\Rafa Cabeleireiros\
│
├─ index.html               # Render semântico visual da Landing Page raiz
├─ cadeira.html             # Marcação crua (In-Line SVG) do container dinâmico da cadeira inicial
│
├─ css/
│  └─ style.css             # Coração estético da aplicação. Regras de paleta e mídia query
│
├─ img/                     # SVGs In-Line para o bloco de Nossos Serviços.
│  ├─ boneco.svg            
│  ├─ sobrancelha.svg       
│  └─ tesoura.svg           
│
└─ js/
   └─ main.js               # Event Listeners (Menu e CTAs) e Lógica do Scroll Progressivo da Hero
```

## 🎨 Setup Prático / O que mudar a seguir (Para o Dev Responsável)

- Localize e substitua todas as referências do link do **WhatsApp** no `index.html` (Aparece como `5511999999999`) pelo número de telefone de contato autêntico.
- Ajuste e defina o valor correto das cifras inseridas nos cards da tabela da *Sessão de Serviços*.
- Quando fotos reais do salão/barbearia existirem, troque o placeholder em branco referenciado na div **"Sobre"**(`about-image`) pela imagem de autoria em sua galeria!
