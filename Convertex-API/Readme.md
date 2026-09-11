# Convertex API (.NET 10)

Uma API RESTful de alta performance construída em **.NET 10** e **C#** para extração de texto a partir de imagens via **Google Cloud Vision API** (OCR - *Optical Character Recognition*). A aplicação permite exportação direta para múltiplos formatos (`.txt`, `.json`, `.csv`, `.docx`, `.pdf`), conta com controle refinado de taxa/rate-limiting integrado via **Redis** ou memória interna, suporte nativo a **Docker**, **CORS** pré-configurado e tratamento global de exceções via *Problem Details*.

---

## Tabela de Conteúdos

- [ Funcionalidades](#-funcionalidades)
- [ Arquitetura e Tecnologias](#️-arquitetura-e-tecnologias)
- [ Estrutura do Projeto](#-estrutura-do-projeto)
- [ Pré-requisitos](#-pré-requisitos)
- [ Configuração do Ambiente](#️-configuração-do-ambiente)
  - [1. Credenciais do Google Cloud Vision](#1-credenciais-do-google-cloud-vision)
  - [2. Configuração do Redis (Opcional)](#2-configuração-do-redis-opcional)
  - [3. Limite Diário de Requisições](#3-limite-diário-de-requisições)
- [Como Executar](#-como-executar)
  - [Execução Local (.NET SDK 10)](#execução-local-net-sdk-10)
  - [Execução via Docker](#execução-via-docker)
- [API Endpoints](#-api-endpoints)
  - [1. Extrair Texto e Exportar Documento](#1-extrair-texto-e-exportar-documento)
- [Rate Limiting e Gestão de Cota](#️-rate-limiting-e-gestão-de-cota)
- [CORS e Segurança](#-cors-e-segurança)
- [Licença](#-licença)

---

## Funcionalidades

-**OCR de Alta Precisão:** Reconhecimento de caracteres impresso e manuscrito com a tecnologia Cloud Vision.
- **Exportação Multi-Formato:** Converte automaticamente o texto reconhecido nos formatos:
  - Text Plain (`.txt`)
  - JSON Estruturado (`.json`)
  - Tabela CSV (`.csv`)
  - Documento Microsoft Word (`.docx`)
  - Documento PDF (`.pdf`)
- **Controle de Cota Diária (Rate Limiting):**
  - Implementação concorrente em memória (`DailyRequestCounter`).
  - Implementação distribuída via scripts Lua no **Redis** (`RedisDailyRequestCounter`).
  - Margem de reserva para controle de consumo diário.
- **Containerização Nativa:** Configurado para builds multi-stage otimizados com Docker (`mcr.microsoft.com/dotnet/aspnet:10.0`).
-**Segurança e Sanitização:** Sanitização automática de caracteres inválidos no XML para evitar corrupção em documentos Word/OpenXML.

---

## Arquitetura e Tecnologias

- **Framework Principal:** [.NET 10.0 Web API](https://dotnet.microsoft.com/)
- **Linguagem:** C# 13 / .NET 10
- **Visão Computacional:** `Google.Cloud.Vision.V1` (v3.8.0)
- **Geração de PDF:** `QuestPDF` (v2025.7.4 - Licença Community)
- **Manipulação OpenXML (DOCX):** `DocumentFormat.OpenXml` (v3.3.0)
- **Cache & Rate Limit Distribuído:** `StackExchange.Redis` (v2.8.31)
- **Containerização:** Docker (Alpine/Debian com ASP.NET Runtime 10)

---

## Estrutura do Projeto

```text
Convertex-API/
├── Controllers/
│   └── OcrController.cs           # Endpoint REST para extração de OCR
├── Extensions/
│   └── RedisExtensions.cs        # Extensão para parsing avançado de conexões Redis (redis/rediss)
├── Integrations/
│   └── GoogleVisionClient.cs     # Integração e autenticação com Google Cloud Vision API
├── Services/
│   ├── DailyRequestCounter.cs    # Lógica de controle de limites diários (Memória e Redis)
│   └── OcrService.cs             # Processamento e geração dos arquivos (TXT, JSON, CSV, DOCX, PDF)
├── Properties/
│   └── launchSettings.json       # Configurações de execução de desenvolvimento
├── appsettings.json              # Configurações gerais da aplicação
├── Convertex-API.csproj          # Configurações de pacotes NuGet e Target Framework (.NET 10)
├── Dockerfile                    # Pipeline Multi-stage de Build Docker
└── Program.cs                    # Injeção de dependências e Middlewares da API
```
## Pré-requisitos
Para rodar a aplicação localmente ou em produção, você precisará de:

.NET 10 SDK

Docker (opcional, para execução containerizada)

Conta no Google Cloud Platform (GCP) com a API Cloud Vision ativada.

Instância do Redis (opcional, necessário apenas se quiser controle de cota distribuído).

## Configuração do Ambiente
1. Credenciais do Google Cloud Vision
A aplicação exige credenciais de uma Service Account do Google Cloud com permissões para uso do Vision API.

Acesse o Google Cloud Console.

Crie uma Service Account e baixe a chave em formato JSON.

Você pode fornecer esta chave de duas maneiras:

Forma 1 (Recomendada): Salve o arquivo com o nome google.credentials.json na raiz do projeto (onde a API é executada).

Forma 2: Defina a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para o caminho do arquivo JSON:

export GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/suas-credenciais.json"

2. Configuração do Redis (Opcional)
Se a variável de ambiente REDIS_URL estiver preenchida, o sistema ativará automaticamente o RedisDailyRequestCounter para persistência distribuída das requisições.

A string de conexão suporta os esquemas redis:// e rediss:// (com SSL):


REDIS_URL=redis://:senha@localhost:6379
# Ou para conexões seguras/cloud (ex: Upstash, Redis Labs):
REDIS_URL=rediss://default:senha@seu-redis.upstash.io:6379

obs: Caso a variável REDIS_URL não seja informada, o sistema usará automaticamente o contador em memória local (DailyRequestCounter).

3. Limite Diário de Requisições
Defina as variáveis no appsettings.json ou via Variáveis de Ambiente:

JSON
{
  "Ocr": {
    "DailyRequestLimit": 1000,
    "ReservedRequests": 100
  }
}

DailyRequestLimit: Total de requisições permitidas por dia.

ReservedRequests: Margem reservada/bloqueada. A cota efetiva disponível para os usuários será DailyRequestLimit - ReservedRequests (Ex: 1000 - 100 = 900 requisições/dia).

## Como Executar

-Execução Local (.NET SDK 10)
1. Clone o repositório:

git clone [https://github.com/seu-usuario/Convertex-API.git](https://github.com/seu-usuario/Convertex-API.git)
cd Convertex-API

2. Restaure as dependências:

dotnet restore

3. Adicione o arquivo google.credentials.json na pasta raiz do projeto.

4. Execute a aplicação:

dotnet run --project Convertex-API.csproj
A API estará acessível em http://localhost:5187 ou https://localhost:7128.

Execução via Docker

1. Construa a imagem Docker:

docker build -t convertex-api .

2. Execute o container repassando as variáveis de ambiente:

docker run -d \\
  -p 8080:8080 \\
  -e GOOGLE_APPLICATION_CREDENTIALS="/app/google.credentials.json" \\
  -v /caminho/local/google.credentials.json:/app/google.credentials.json \\
  --name convertex-api-container \\
  convertex-api

  API Endpoints
  1. Extrair Texto e Exportar Documento
  Realiza o processamento de OCR em uma imagem e retorna o arquivo no formato solicitado.

URL: /api/Ocr/extract

Método: POST

Content-Type: multipart/form-data

Limites:

Tamanho máximo do arquivo: 10 MB

Formatos de imagem suportados: .jpg, .jpeg, .png

### Query Parameters:

| Parametro | tipo | Obrigatório | Valores Permitidos |padrão|Descrição |
| --- | --- | --- | --- | ---| -- |
| format | string | Não |txt, json, csv, word / docx, pdf|txt|Define o formato do arquivo de retorno.|

### Form Data Parameters:

| Parâmetro | tipo | Obrigatório |Descrição |
| --- | --- | --- | --- |
| file | File | Sim | Arquivo de imagem (JPG ou PNG).|

### Rate Limiting e Gestão de Cota
A API implementa um controle rígido de chamadas para evitar o consumo excessivo da API do Google Cloud Vision:

1. Uso com Redis: O script Lua atômico incrementa a chave do dia (convertex:ocr:requests:YYYY-MM-DD). Ao criar a chave, define um TTL de 48 horas (172.800 segundos). Caso o número de chamadas ultrapasse o limite permitido, a contagem é decrementada e a API retorna HTTP 429.

2. Uso em Memória Local: Mantém uma thread-safe lock (object _lock) validando a data em UTC e controlando o limite de requisições.

### CORS e Segurança

A política de CORS está pré-configurada em Program.cs para permitir conexões dos seguintes origens:

http://localhost* (Ambiente de desenvolvimento)

Domínios hospedados no Vercel (*.vercel.app)

O cabeçalho Content-Disposition é exposto explicitamente para permitir que aplicações frontend (React, Vue, Next.js) realizem o download com o nome de arquivo correto retornado pela API.