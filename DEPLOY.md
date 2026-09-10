# Guia de Build e Publicação Android — Algodoal Connect 🏝️📱

Este guia documenta o processo completo para compilar, testar e publicar o aplicativo **Algodoal Connect** (`com.algodoalconnect.app`) para **Android** utilizando **Capacitor**.

---

## 📌 Respostas Rápidas às Dúvidas Frequentes

### 1. Precisamos utilizar o Android Studio para criar o app?
- **Para compilar o APK de teste (Debug):** **NÃO** é obrigatório! Você pode compilar diretamente pelo terminal usando o wrapper do Gradle incluído no projeto (`./gradlew assembleDebug`).
- **Para publicar na Google Play Store (.aab de produção):** O **Android Studio** é a ferramenta oficial recomendada pela Google, pois facilita a criação/seleção da chave criptográfica de assinatura (**Keystore**), inspeção do pacote e geração do **Android App Bundle (.aab)**. No entanto, desenvolvedores avançados também podem assinar via linha de comando (`./gradlew bundleRelease`).

### 2. Podemos usar o diretório `dist`?
- **SIM!** O diretório `dist` é o coração do build web do Vite e o destino padrão do Capacitor (`webDir: 'dist'`).
- Quando você executa `npm run build`, o Vite compila todo o código React, TypeScript e Tailwind dentro de `dist/`.
- Ao rodar `npx cap sync android`, o Capacitor copia todo o conteúdo de `dist/` para a pasta nativa `android/app/src/main/assets/public/`.
- **Estratégias de funcionamento:**
  - **Modo Servidor Remoto (Ativo por padrão):** Com `server.url: 'https://algodoal.3facil.com'` no `capacitor.config.ts`, o aplicativo nativo abre o seu domínio de produção. **Vantagem:** qualquer alteração visual ou de dados feita no servidor é refletida instantaneamente nos celulares dos usuários, **sem necessidade de aprovação de novo APK na Google Play**.
  - **Modo Empacotado Local (`dist` 100% offline):** Se você comentar a linha `url` no `capacitor.config.ts` e rodar `npx cap sync android`, o app carrega os arquivos do `dist` empacotados dentro do APK e faz as chamadas de dados para o backend via internet.

---

## ⚙️ Configurações Aplicadas no Projeto

- **App ID (Package Name):** `com.algodoalconnect.app`
- **Nome do App:** `Algodoal Connect`
- **Web Dir:** `dist`
- **Servidor Remoto:** `https://algodoal.3facil.com`
- **Esquema Android:** `https`
- **Permissões Nativas (`AndroidManifest.xml`):**
  - `INTERNET` e `ACCESS_NETWORK_STATE` (comunicação online com a API)
  - `ACCESS_FINE_LOCATION` e `ACCESS_COARSE_LOCATION` (rotas de maré, praias e pontos turísticos)
  - `CAMERA` e `READ_MEDIA_IMAGES` (envio de fotos para pousadas, passeios e stories da ilha)
  - `POST_NOTIFICATIONS` (avisos de maré alta e eventos culturais)

---

## 🚀 Passo a Passo: Do Código ao APK/AAB

### Passo 1: Instalar dependências locais
```bash
npm install
```

### Passo 2: Gerar ícones e Splash Screen
1. Coloque o logo do Algodoal Connect em alta resolução (1024x1024 PNG) em:
   ```
   resources/icon.png
   ```
2. Execute o script gerador automático:
   ```bash
   npm run generate-icons
   ```
   *Este script gera automaticamente todas as resoluções de `ic_launcher` (mdpi até xxxhdpi), o ícone circular, o ícone adaptativo e as telas de Splash Screen com o fundo `#060a12`.*

### Passo 3: Compilar o frontend React/Vite
```bash
npm run build
```
*(Isso cria ou atualiza a pasta `dist/` com o bundle de produção otimizado).*

### Passo 4: Sincronizar com o projeto Android nativo
```bash
npx cap sync android
```
*(Copia os assets de `dist/`, atualiza a configuração `capacitor.config.json` e sincroniza os plugins).*

---

## 🛠️ Opção A: Gerar APK diretamente pelo Terminal (Sem abrir o Android Studio)

Se você já tiver o Android SDK e o JDK 17+ instalados na sua máquina:

### No Windows (PowerShell / CMD):
```bash
cd android
gradlew assembleDebug
cd ..
```
O APK gerado estará em:
`android/app/build/outputs/apk/debug/app-debug.apk`

### No Linux ou macOS:
```bash
cd android
./gradlew assembleDebug
cd ..
```

Você também pode rodar o comando rápido do `package.json`:
```bash
npm run build:apk:unix
```

---

## 📱 Opção B: Gerar pelo Android Studio (Recomendado para Google Play Store)

### 1. Abrir o projeto no Android Studio:
```bash
npx cap open android
```
*(Ou abra o Android Studio manualmente e selecione a pasta `android/` deste projeto).*

### 2. Aguardar o Gradle Sync
Ao abrir, o Android Studio fará o download das dependências Gradle automaticamente. Aguarde a barra de progresso inferior finalizar.

### 3. Testar no Emulador ou Celular via USB
1. Conecte seu celular Android via cabo USB com a **Depuração USB** ativada (ou inicie um emulador).
2. Clique no botão verde **▶ Run 'app'** no topo do Android Studio.

### 4. Gerar o pacote de produção para a Google Play (.aab)
1. No menu superior do Android Studio, clique em:
   **Build** > **Generate Signed Bundle / APK...**
2. Selecione **Android App Bundle (.aab)** e clique em **Next**.
3. Em **Key store path**, selecione sua chave existente ou clique em **Create new...** para criar sua chave de assinatura segura (guarde o arquivo `.jks` e a senha com segurança).
4. Selecione a variante **release** e marque **export encrypted key for each key**.
5. Clique em **Finish**. O Android Studio compilará o arquivo `.aab` pronto para upload no console da **Google Play Store**!

---

## 🔄 Como Atualizar o App Após Fazer Alterações no Código

- **Com `server.url` ativado:** Basta fazer o deploy da nova versão no backend em `https://algodoal.3facil.com`. Os usuários do app receberão as atualizações imediatamente sem precisar atualizar pelo Google Play!
- **Para atualizar alterações nativas (ícones, permissões ou versão offline):**
  ```bash
  npm run build
  npm run generate-icons # se alterou o logo
  npx cap sync android
  ```
