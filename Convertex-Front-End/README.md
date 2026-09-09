# 📄 Convertex — Front-End

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.2-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green?style=for-the-badge)

<p align="center">
  <b>Aplicação web moderna para extração de texto a partir de imagens via Reconhecimento Óptico de Caracteres (OCR).</b>
</p>

</div>

---

## Sobre o Projeto

O **Convertex** é uma aplicação web SPA (*Single Page Application*) desenvolvida para facilitar a conversão de imagens (PNG/JPG) em texto legível e manipulável. A interface permite selecionar ou arrastar imagens, escolher o formato de saída desejado e gerenciar o histórico recente de conversões diretamente no navegador.

### Principais Funcionalidades

- 📤 **Upload Intuitivo & Drag and Drop:** Selecione ou arraste imagens diretamente para a área de envio com feedback visual imediato.
- ⚙️ **Formatos de Saída Flexíveis:** Escolha a exportação do resultado nos formatos `.txt`, `.docx` ou `.pdf`.
- 📝 **Edição em Tempo Real:** Edite e corrija o texto extraído pelo OCR dentro da aplicação antes de realizar o download.
- 📊 **Métricas do Texto:** Contador dinâmico de palavras e caracteres atualizado em tempo real.
- 📜 **Histórico de Conversões:** Armazenamento das últimas conversões em `sessionStorage`, permitindo reabrir e baixar documentos processados anteriormente.
- 🔔 **Notificações Fluidas:** Sistema de feedback de erros, avisos e sucessos utilizando notificações dinâmicas (Toasts).
- 📱 **Interface Responsiva & Dark Theme:** Layout adaptável para dispositivos móveis e desktops.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Roteamento & Requisições:** [React Router DOM v7](https://reactrouter.com/), [Axios](https://axios-http.com/)
- **UX & Notificações:** [React Hot Toast](https://react-hot-toast.com/)
- **Qualidade & Linting:** [ESLint](https://eslint.org/)

---

## 📐 Arquitetura do Projeto

O projeto segue princípios de **Clean Code** e separação de responsabilidades em camadas:

```text
src/
├── components/          # Componentes reutilizáveis de interface
│   ├── layout/          # Componentes estruturais (Header, Footer)
│   ├── sections/        # Blocos e seções das páginas (OcrSection, OcrHistorySection)
│   └── ui/              # Componentes de UI puros (Avatar, ImageSelectorButton, OcrResultModal)
├── hooks/               # Custom Hooks para regra de negócio e estado (useOcr)
├── pages/               # Páginas da aplicação (Home)
├── routes/              # Configuração de rotas da aplicação
├── service/             # Infraestrutura, integração com API REST e storage (api, imageService, ocrHistoryService)
├── App.tsx              # Componente raiz com provedores e Toaster
└── main.tsx             # Ponto de entrada da aplicação React

---

## Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter o **Node.js** (versão 18 ou superior) e o **npm** instalados em sua máquina.

### Passo a Passo

1. **Clone o repositório:**

git clone [https://github.com/Thiago0018/Convertex-Front-End.git](https://github.com/Thiago0018/Convertex-Front-End.git)
cd Convertex-Front-End

1. Instale as dependências:
npm install

2. Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com o endereço da API REST (Back-end .NET):

VITE_API_URL=[https://convertex-api.onrender.com/api](https://convertex-api.onrender.com/api)

3. Execute o serviço de desenvolvimento:
npm run dev

4. Acesse no navegador:
Acesse o endereço local exibido no terminal (geralmente http://localhost:5173).

📄 Scripts Disponíveis
npm run dev: Inicia o servidor de desenvolvimento com Vite.

npm run build: Compila a aplicação para produção.

npm run preview: Executa a build de produção localmente para inspeção.

npm run lint: Executa a verificação do ESLint para análise estática do código.

👤 Autor
Desenvolvido por Thiago de Souza

Entre em contato ou acesse minhas redes:

LinkedIn: Thiago Souza

GitHub: @Thiago0018

E-mail: thiago.dev.0018@gmail.com