/**
 * Gerador Automático de Ícones e Splash Screens para Android (Capacitor)
 * Algodoal Connect — https://algodoal.3facil.com
 *
 * Como usar:
 * 1. Coloque seu logo em alta resolução (ex: 1024x1024 PNG) em: resources/icon.png
 * 2. Execute: npm run generate-icons
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RES_DIR = path.resolve('android/app/src/main/res');
const SOURCE_ICON = path.resolve('resources/icon.png');
const FALLBACK_ICON = path.resolve('public/pwa-512x512.png');
const BRAND_BG = { r: 6, g: 10, b: 18, alpha: 1 }; // #060a12 (Azul Mar Profundo Noturno)

const ICON_SIZES = [
  { folder: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', size: 192, fgSize: 432 }
];

const SPLASH_SIZES = [
  { folder: 'drawable', width: 480, height: 800 },
  { folder: 'drawable-port-mdpi', width: 320, height: 480 },
  { folder: 'drawable-port-hdpi', width: 480, height: 800 },
  { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  { folder: 'drawable-land-mdpi', width: 480, height: 320 },
  { folder: 'drawable-land-hdpi', width: 800, height: 480 },
  { folder: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { folder: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280 }
];

async function generate() {
  let inputPath = SOURCE_ICON;
  if (!fs.existsSync(inputPath)) {
    console.log(`[INFO] resources/icon.png não encontrado. Usando ${FALLBACK_ICON} como base.`);
    inputPath = FALLBACK_ICON;
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`[ERRO] Nenhuma imagem de ícone encontrada em ${inputPath}`);
    process.exit(1);
  }

  console.log(`[INÍCIO] Gerando assets nativos a partir de: ${inputPath}`);

  // 1. Gera ícones mipmap
  for (const { folder, size, fgSize } of ICON_SIZES) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Ícone quadrado padrão
    await sharp(inputPath)
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Ícone circular
    const circleSvg = Buffer.from(
      `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`
    );
    await sharp(inputPath)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Ícone adaptativo foreground (com padding seguro para não cortar)
    const logoSize = Math.round(fgSize * 0.65);
    const logoBuffer = await sharp(inputPath).resize(logoSize, logoSize).toBuffer();

    await sharp({
      create: {
        width: fgSize,
        height: fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`  ✓ ${folder} (${size}x${size}, fg ${fgSize}x${fgSize})`);
  }

  // 2. Gera ícone para a Google Play Store (512x512)
  const resourcesDir = path.resolve('resources');
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
  await sharp(inputPath)
    .resize(512, 512)
    .toFile(path.join(resourcesDir, 'playstore-icon.png'));
  console.log(`  ✓ resources/playstore-icon.png (512x512)`);

  // 3. Gera Splash Screens
  for (const { folder, width, height } of SPLASH_SIZES) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Logo centralizado ocupando cerca de 35% da menor dimensão da tela
    const minDim = Math.min(width, height);
    const splashLogoSize = Math.round(minDim * 0.38);

    const logoResized = await sharp(inputPath)
      .resize(splashLogoSize, splashLogoSize, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: BRAND_BG
      }
    })
      .composite([{ input: logoResized, gravity: 'center' }])
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`  ✓ ${folder}/splash.png (${width}x${height})`);
  }

  console.log('[SUCESSO] Todos os ícones e telas de splash foram gerados com sucesso!');
}

generate().catch(err => {
  console.error('[FALHA]', err);
  process.exit(1);
});
