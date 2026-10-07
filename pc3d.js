/**
 * ==========================================================================
 * PC 3D ENGINE - RENDER DE ALTA FIDELIDAD & DESPIECE INTERACTIVO
 * Studio-Grade PBR Lighting (IBL / PMREM), Cinematic Bloom (Post-Processing)
 * & Modelado Procedimental de Grado Ingeniería.
 * ==========================================================================
 */

class PC3DViewer {
  constructor() {
    this.container = document.getElementById('pc3d-canvas-container');
    this.canvas = document.getElementById('pc3d-canvas');
    if (!this.container || !this.canvas) {
      console.warn('Contenedor 3D no encontrado.');
      return;
    }

    // Configuración base
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.orbitOffset = { x: 0, y: 0 };

    // Temas RGB con valores PBR calibrados
    this.themes = {
      cyber: {
        name: 'Cyber Cyan',
        primary: 0x00f0ff,
        secondary: 0x3b82f6,
        ambient: 0x051525,
        cssGradient: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)',
        accentHex: '#00f0ff',
        primaryHex: '#3b82f6'
      },
      neon: {
        name: 'Neon Cyberpunk',
        primary: 0xff007f,
        secondary: 0x8b5cf6,
        ambient: 0x1f0525,
        cssGradient: 'linear-gradient(135deg, #ff007f 0%, #8b5cf6 100%)',
        accentHex: '#ff007f',
        primaryHex: '#8b5cf6'
      },
      matrix: {
        name: 'Matrix Emerald',
        primary: 0x10b981,
        secondary: 0x059669,
        ambient: 0x032015,
        cssGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        accentHex: '#10b981',
        primaryHex: '#059669'
      },
      solar: {
        name: 'Solar Amber',
        primary: 0xf59e0b,
        secondary: 0xef4444,
        ambient: 0x221203,
        cssGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        accentHex: '#f59e0b',
        primaryHex: '#ef4444'
      },
      stealth: {
        name: 'Titanium White',
        primary: 0xffffff,
        secondary: 0x94a3b8,
        ambient: 0x111622,
        cssGradient: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
        accentHex: '#ffffff',
        primaryHex: '#94a3b8'
      }
    };
    this.currentThemeKey = 'cyber';

    // Listas de animación
    this.rotatingFans = [];
    this.rgbMaterials = [];
    this.rgbLights = [];
    this.coolerHoseMesh = null;
    this.coolerHoseMesh2 = null;

    // Componentes del modelo para despiece
    this.parts = {};

    this.initScene();
    this.initStudioEnvironment();
    this.initLights();
    this.initPostProcessing();
    this.createProceduralTextures();
    this.buildPCModel();
    this.createAtmosphereParticles();
    this.createContactShadow();
    this.initEvents();
    this.animate();

    console.log('⚡ PC3DViewer (High-Fidelity PBR & Bloom Engine) inicializado.');
  }

  // --------------------------------------------------------------------------
  // ESCENA, CÁMARA Y RENDERER CON CONFIGURACIÓN PBR
  // --------------------------------------------------------------------------
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0d14, 0.028);

    this.camera = new THREE.PerspectiveCamera(
      42,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(4.5, 2.0, 6.0);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Grupo raíz que contiene todo el ordenador
    this.pcRoot = new THREE.Group();
    this.scene.add(this.pcRoot);
  }

  // --------------------------------------------------------------------------
  // ILUMINACIÓN DE ESTUDIO PBR (MAPA DE ENTORNO HDR DINÁMICO / IBL)
  // Genera reflejos de luces softbox y estudio sobre metales, cristal y cobre
  // --------------------------------------------------------------------------
  initStudioEnvironment() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    // Canvas panorámico equirectangular para simular un estudio fotográfico tech
    const cvEnv = document.createElement('canvas');
    cvEnv.width = 1024;
    cvEnv.height = 512;
    const ctx = cvEnv.getContext('2d');

    // Fondo oscuro con degradado atmosférico
    const gradBg = ctx.createLinearGradient(0, 0, 0, 512);
    gradBg.addColorStop(0, '#0a0f1d');
    gradBg.addColorStop(0.5, '#05070d');
    gradBg.addColorStop(1, '#020305');
    ctx.fillStyle = gradBg;
    ctx.fillRect(0, 0, 1024, 512);

    // Softbox 1: Luz cenital rectangular potente blanca/azulada
    const gradSoft1 = ctx.createRadialGradient(512, 120, 10, 512, 120, 220);
    gradSoft1.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradSoft1.addColorStop(0.4, 'rgba(200, 230, 255, 0.7)');
    gradSoft1.addColorStop(1, 'rgba(10, 25, 45, 0)');
    ctx.fillStyle = gradSoft1;
    ctx.fillRect(200, 0, 624, 250);

    // Strip Light Lateral 1: Franja vertical cian brillante
    const gradStrip1 = ctx.createLinearGradient(120, 0, 180, 0);
    gradStrip1.addColorStop(0, 'rgba(0, 240, 255, 0)');
    gradStrip1.addColorStop(0.5, 'rgba(0, 240, 255, 0.95)');
    gradStrip1.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = gradStrip1;
    ctx.fillRect(120, 50, 60, 400);

    // Strip Light Lateral 2: Franja vertical azul cobalto
    const gradStrip2 = ctx.createLinearGradient(840, 0, 900, 0);
    gradStrip2.addColorStop(0, 'rgba(59, 130, 246, 0)');
    gradStrip2.addColorStop(0.5, 'rgba(96, 165, 250, 0.9)');
    gradStrip2.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = gradStrip2;
    ctx.fillRect(840, 50, 60, 400);

    // Luz cálida sutil en el suelo (Ground Bounce)
    const gradGround = ctx.createLinearGradient(0, 380, 0, 512);
    gradGround.addColorStop(0, 'rgba(15, 23, 42, 0)');
    gradGround.addColorStop(1, 'rgba(30, 41, 59, 0.5)');
    ctx.fillStyle = gradGround;
    ctx.fillRect(0, 380, 1024, 132);

    const envTexture = new THREE.CanvasTexture(cvEnv);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    this.scene.environment = envMap;
    pmremGenerator.dispose();
  }

  // --------------------------------------------------------------------------
  // LUCES DIRECCIONALES Y PUNTUALES INTERNAS
  // --------------------------------------------------------------------------
  initLights() {
    this.ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    this.scene.add(this.ambientLight);

    // Luz principal de estudio (Key Light)
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.6);
    this.dirLight.position.set(6, 9, 7);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 25;
    this.dirLight.shadow.camera.left = -5;
    this.dirLight.shadow.camera.right = 5;
    this.dirLight.shadow.camera.top = 5;
    this.dirLight.shadow.camera.bottom = -5;
    this.dirLight.shadow.bias = -0.0003;
    this.scene.add(this.dirLight);

    // Luz de contorno trasera (Rim light) cian
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.6);
    rimLight.position.set(-7, 4, -6);
    this.scene.add(rimLight);

    // Luces internas RGB del PC
    const curTheme = this.themes[this.currentThemeKey];

    this.rgbLightCPU = new THREE.PointLight(curTheme.primary, 3.8, 4.5);
    this.rgbLightCPU.position.set(0.3, 0.9, -0.3);
    this.pcRoot.add(this.rgbLightCPU);
    this.rgbLights.push(this.rgbLightCPU);

    this.rgbLightGPU = new THREE.PointLight(curTheme.secondary, 3.4, 4.8);
    this.rgbLightGPU.position.set(-0.2, -0.3, 0.4);
    this.pcRoot.add(this.rgbLightGPU);
    this.rgbLights.push(this.rgbLightGPU);

    this.rgbLightFront = new THREE.PointLight(curTheme.primary, 3.0, 4.2);
    this.rgbLightFront.position.set(0, 0, 2.2);
    this.pcRoot.add(this.rgbLightFront);
    this.rgbLights.push(this.rgbLightFront);
  }

  // --------------------------------------------------------------------------
  // PIPELINE DE POST-PROCESAMIENTO: BLOOM ÓPTICO CINEMÁTICO (UNREAL BLOOM)
  // --------------------------------------------------------------------------
  initPostProcessing() {
    this.useComposer = false;

    if (window.THREE && window.THREE.EffectComposer && window.THREE.RenderPass && window.THREE.UnrealBloomPass) {
      try {
        this.composer = new THREE.EffectComposer(this.renderer);
        
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom con brillo óptico calibrado para iluminar elementos RGB y OLED
        this.bloomPass = new THREE.UnrealBloomPass(
          new THREE.Vector2(this.width, this.height),
          0.72,  // Intensidad (strength)
          0.55,  // Radio (radius)
          0.82   // Umbral de luminancia (threshold)
        );
        this.composer.addPass(this.bloomPass);

        this.useComposer = true;
        console.log('✨ Post-processing UnrealBloomPass activado.');
      } catch (err) {
        console.warn('Postprocessing no soportado, utilizando renderizado directo:', err);
        this.useComposer = false;
      }
    }
  }

  // --------------------------------------------------------------------------
  // TEXTURAS PROCEDIMENTALES EN ALTA DEFINICIÓN (CIRCUITOS, MESH, OLED, PBR)
  // --------------------------------------------------------------------------
  createProceduralTextures() {
    this.textures = {};

    // 1. Textura PCB de Placa Base en 2K
    const cvPCB = document.createElement('canvas');
    cvPCB.width = 1024;
    cvPCB.height = 1024;
    const ctxPCB = cvPCB.getContext('2d');

    // Fondo negro mate con grano de fibra de vidrio
    ctxPCB.fillStyle = '#080b12';
    ctxPCB.fillRect(0, 0, 1024, 1024);

    // Malla micrométrica de circuito
    ctxPCB.strokeStyle = 'rgba(25, 35, 52, 0.45)';
    ctxPCB.lineWidth = 1;
    for (let i = 0; i < 1024; i += 24) {
      ctxPCB.beginPath();
      ctxPCB.moveTo(i, 0); ctxPCB.lineTo(i, 1024); ctxPCB.stroke();
      ctxPCB.beginPath();
      ctxPCB.moveTo(0, i); ctxPCB.lineTo(1024, i); ctxPCB.stroke();
    }

    // Pistas de cobre dorado electrolítico
    ctxPCB.strokeStyle = '#d4af37';
    ctxPCB.lineWidth = 2.5;
    ctxPCB.lineCap = 'round';

    const drawTraceBus = (x1, y1, x2, y2, lanes = 6) => {
      for (let l = 0; l < lanes; l++) {
        const off = l * 10;
        ctxPCB.beginPath();
        ctxPCB.moveTo(x1, y1 + off);
        ctxPCB.lineTo((x1 + x2) / 2 + off, y1 + off);
        ctxPCB.lineTo((x1 + x2) / 2 + off, y2 + off);
        ctxPCB.lineTo(x2, y2 + off);
        ctxPCB.stroke();

        // Puntos de soldadura dorados
        ctxPCB.fillStyle = '#f59e0b';
        ctxPCB.fillRect(x2 - 3, y2 + off - 3, 6, 6);
      }
    };

    drawTraceBus(140, 180, 520, 480, 8);
    drawTraceBus(260, 680, 800, 320, 6);
    drawTraceBus(600, 80, 920, 380, 5);

    // Serigrafía de especificaciones de hardware
    ctxPCB.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctxPCB.font = 'bold 22px monospace';
    ctxPCB.fillText('RAFA.ARCH // CHIPSET Z790 ULTRA', 80, 90);
    ctxPCB.font = '15px monospace';
    ctxPCB.fillText('PCIE 5.0 x16 REINFORCED // DUAL CHANNEL DDR5 6000MT/s', 80, 120);
    ctxPCB.fillText('DIRECT 24+1+2 DIGITAL POWER STAGES // 105A SPS', 80, 145);

    // Microchips SMD y componentes pasivos
    for (let c = 0; c < 45; c++) {
      const rx = 100 + Math.random() * 800;
      const ry = 100 + Math.random() * 800;
      ctxPCB.fillStyle = '#1e293b';
      ctxPCB.fillRect(rx, ry, 24, 16);
      ctxPCB.fillStyle = '#cbd5e1';
      ctxPCB.fillRect(rx - 2, ry + 3, 2, 10);
      ctxPCB.fillRect(rx + 24, ry + 3, 2, 10);
    }
    this.textures.pcb = new THREE.CanvasTexture(cvPCB);

    // 2. Pantalla OLED Dinámica de la Bomba AIO
    this.cvCPU = document.createElement('canvas');
    this.cvCPU.width = 512;
    this.cvCPU.height = 512;
    this.ctxCPU = this.cvCPU.getContext('2d');
    this.textures.cpuScreen = new THREE.CanvasTexture(this.cvCPU);
    this.updateCPUScreenTexture(0);

    // 3. Rejilla Hexagonal / Honeycomb para ventilación y chasis
    const cvMesh = document.createElement('canvas');
    cvMesh.width = 128;
    cvMesh.height = 128;
    const ctxMesh = cvMesh.getContext('2d');
    ctxMesh.fillStyle = '#0f1422';
    ctxMesh.fillRect(0, 0, 128, 128);
    ctxMesh.fillStyle = '#05070c';
    for (let x = 8; x < 128; x += 16) {
      for (let y = 8; y < 128; y += 16) {
        ctxMesh.beginPath();
        ctxMesh.arc(x, y, 4.5, 0, Math.PI * 2);
        ctxMesh.fill();
      }
    }
    this.textures.mesh = new THREE.CanvasTexture(cvMesh);
    this.textures.mesh.wrapS = THREE.RepeatWrapping;
    this.textures.mesh.wrapT = THREE.RepeatWrapping;
    this.textures.mesh.repeat.set(6, 6);

    // 4. Backplate de Tarjeta Gráfica en Alta Resolución
    const cvGPU = document.createElement('canvas');
    cvGPU.width = 1024;
    cvGPU.height = 512;
    const ctxGPU = cvGPU.getContext('2d');
    ctxGPU.fillStyle = '#10141f';
    ctxGPU.fillRect(0, 0, 1024, 512);

    ctxGPU.strokeStyle = '#334155';
    ctxGPU.lineWidth = 4;
    ctxGPU.beginPath();
    ctxGPU.moveTo(40, 40); ctxGPU.lineTo(340, 40);
    ctxGPU.lineTo(440, 180); ctxGPU.lineTo(960, 180);
    ctxGPU.stroke();

    ctxGPU.fillStyle = '#00f0ff';
    ctxGPU.font = 'bold 36px monospace';
    ctxGPU.fillText('GEFORCE RTX // 24GB GDDR6X', 70, 240);
    ctxGPU.fillStyle = 'rgba(255,255,255,0.7)';
    ctxGPU.font = '20px monospace';
    ctxGPU.fillText('16384 CUDA CORES // 384-BIT BUS // DLSS 3.5 & RAY TRACING', 70, 285);
    ctxGPU.fillText('ENGINEERED FOR REAL-TIME GRAPHICS & WEBGL ACCELERATION', 70, 320);

    // Rejilla de flujo de aire térmico cortada con CNC
    ctxGPU.fillStyle = '#070a10';
    for (let i = 640; i < 960; i += 18) {
      ctxGPU.fillRect(i, 60, 9, 380);
    }
    this.textures.gpu = new THREE.CanvasTexture(cvGPU);
  }

  // Actualiza la pantalla OLED del bloque de refrigeración líquida
  updateCPUScreenTexture(time) {
    const ctx = this.ctxCPU;
    ctx.fillStyle = '#03050a';
    ctx.fillRect(0, 0, 512, 512);

    // Retícula circular giratoria de objetivo HUD
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(time * 0.0018);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 195, 0, Math.PI * 1.4);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 168, 0, Math.PI * 1.1);
    ctx.stroke();

    // Pequeños marcadores de dial
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 210, Math.sin(a) * 210);
      ctx.lineTo(Math.cos(a) * 224, Math.sin(a) * 224);
      ctx.stroke();
    }
    ctx.restore();

    // Barras de ecualizador de datos animadas
    for (let b = 0; b < 16; b++) {
      const bh = 15 + Math.sin(time * 0.008 + b) * 14;
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(130 + b * 16, 370 - bh, 10, bh);
    }

    // Texto central
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('RAFA.DEV', 256, 215);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 64px monospace';
    const temp = Math.floor(37 + Math.sin(time * 0.0025) * 3);
    ctx.fillText(`${temp}°C`, 256, 285);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px monospace';
    ctx.fillText('CORE: 5.4 GHz // FLUID TEMP: 29°C', 256, 335);

    if (this.textures && this.textures.cpuScreen) {
      this.textures.cpuScreen.needsUpdate = true;
    }
  }

  // Sombra de contacto suave en el suelo bajo el chasis
  createContactShadow() {
    const cvShadow = document.createElement('canvas');
    cvShadow.width = 256;
    cvShadow.height = 256;
    const ctx = cvShadow.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(cvShadow);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 6.5),
      shadowMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.33;
    this.scene.add(shadowPlane);
  }

  // --------------------------------------------------------------------------
  // MODELADO PROCEDIMENTAL DETALLADO DE GRADO INGENIERÍA
  // --------------------------------------------------------------------------
  buildPCModel() {
    const curTheme = this.themes[this.currentThemeKey];

    // Materiales PBR calibrados
    const matChassisDark = new THREE.MeshStandardMaterial({
      color: 0x111624,
      metalness: 0.85,
      roughness: 0.28
    });

    const matMetalBrushed = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      metalness: 0.92,
      roughness: 0.24
    });

    const matBlackPlastic = new THREE.MeshStandardMaterial({
      color: 0x0c0f17,
      roughness: 0.55,
      metalness: 0.15
    });

    const matSilver = new THREE.MeshStandardMaterial({
      color: 0xd8dee9,
      metalness: 0.98,
      roughness: 0.12
    });

    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xc86428,
      metalness: 0.95,
      roughness: 0.18
    });

    const matGold = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2
    });

    // Materiales emisivos para iluminación RGB y Bloom
    this.matRGB = new THREE.MeshStandardMaterial({
      color: curTheme.primary,
      emissive: curTheme.primary,
      emissiveIntensity: 2.4,
      roughness: 0.15
    });
    this.rgbMaterials.push(this.matRGB);

    this.matRGBSecondary = new THREE.MeshStandardMaterial({
      color: curTheme.secondary,
      emissive: curTheme.secondary,
      emissiveIntensity: 2.0,
      roughness: 0.15
    });
    this.rgbMaterials.push(this.matRGBSecondary);

    // ========================================================================
    // 1. CHASIS Y PANELES EXTERIORES (parts.case)
    // ========================================================================
    const groupCase = new THREE.Group();

    // Marco exterior principal con aperturas CNC
    const rightPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 4.4, 4.4),
      matChassisDark
    );
    rightPanel.position.set(1.05, 0, 0);
    groupCase.add(rightPanel);

    // Bandeja de placa base con pasacables engomados
    const mbTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 3.8, 3.8),
      matMetalBrushed
    );
    mbTray.position.set(0.7, 0.2, 0);
    groupCase.add(mbTray);

    // Pasacables de goma negros
    for (let yG of [-0.6, 0.4, 1.4]) {
      const grommet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16),
        matBlackPlastic
      );
      grommet.rotation.z = Math.PI / 2;
      grommet.position.set(0.7, yG, 1.4);
      groupCase.add(grommet);
    }

    // 4 Patas de aluminio macizo con anillo de goma y acabado cromado
    for (let x of [-0.85, 0.85]) {
      for (let z of [-1.8, 1.8]) {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.16, 32),
          matSilver
        );
        foot.position.set(x, -2.25, z);
        groupCase.add(foot);

        const rubberRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.14, 0.02, 12, 24),
          matBlackPlastic
        );
        rubberRing.rotation.x = Math.PI / 2;
        rubberRing.position.set(x, -2.32, z);
        groupCase.add(rubberRing);
      }
    }

    // Botón de encendido mecanizado en el panel frontal superior con LED Halo
    const pwrButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24),
      matSilver
    );
    pwrButton.rotation.x = Math.PI / 2;
    pwrButton.position.set(-0.6, 2.1, 2.16);
    groupCase.add(pwrButton);

    const pwrRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.018, 16, 32),
      this.matRGB
    );
    pwrRing.position.set(-0.6, 2.1, 2.18);
    groupCase.add(pwrRing);

    // PANEL DE CRISTAL TEMPLADO (SEPARABLE EN DESPIECE)
    // Con material MeshPhysicalMaterial, refracción, transmisión y borde cerámico ahumado
    const glassGroup = new THREE.Group();
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111927,
      transparent: true,
      opacity: 0.42,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.52,
      reflectivity: 0.95
    });

    const glassPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 4.25, 4.25),
      glassMat
    );
    glassPanel.castShadow = true;
    glassGroup.add(glassPanel);

    // Borde cerámico serigrafiado negro (Ceramic Frit Border) en el cristal
    const fritBorder = new THREE.Mesh(
      new THREE.BoxGeometry(0.032, 4.28, 0.18),
      matChassisDark
    );
    fritBorder.position.set(0, 0, 2.05);
    glassGroup.add(fritBorder);

    // 4 Tornillos moleteados de sujeción manual en acero inoxidable
    for (let y of [-1.95, 1.95]) {
      for (let z of [-1.95, 1.95]) {
        const thumbScrew = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, 0.08, 24),
          matSilver
        );
        thumbScrew.rotation.z = Math.PI / 2;
        thumbScrew.position.set(0.03, y, z);
        glassGroup.add(thumbScrew);
      }
    }
    glassGroup.position.set(-1.05, 0, 0);
    this.parts.glassPanel = glassGroup;
    this.pcRoot.add(glassGroup);

    // PANEL FRONTAL (MALLA REFRIGERACIÓN - SEPARABLE EN DESPIECE)
    const frontGroup = new THREE.Group();
    const frontBezel = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 4.3, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x111624,
        metalness: 0.85,
        roughness: 0.3,
        map: this.textures.mesh
      })
    );
    frontGroup.add(frontBezel);
    frontGroup.position.set(0, 0, 2.15);
    this.parts.frontPanel = frontGroup;
    this.pcRoot.add(frontGroup);

    // PANEL SUPERIOR (FILTRO ANTIPOLVO & REJILLA - SEPARABLE)
    const topGroup = new THREE.Group();
    const topGrill = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.08, 4.2),
      new THREE.MeshStandardMaterial({
        color: 0x141a29,
        metalness: 0.85,
        roughness: 0.3,
        map: this.textures.mesh
      })
    );
    topGroup.add(topGrill);
    topGroup.position.set(0, 2.22, 0);
    this.parts.topPanel = topGroup;
    this.pcRoot.add(topGroup);

    this.parts.chassis = groupCase;
    this.pcRoot.add(groupCase);

    // ========================================================================
    // 2. PLACA BASE DE ALTA FIDELIDAD (parts.motherboard)
    // Con 16 fases VRM, condensadores electrolíticos, chokes, puertos y armadura PCIe
    // ========================================================================
    const groupMB = new THREE.Group();

    // PCB ATX con serigrafía y pistas
    const mbMat = new THREE.MeshStandardMaterial({
      color: 0x101524,
      map: this.textures.pcb,
      roughness: 0.38,
      metalness: 0.45
    });
    const mbMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 3.4, 2.9),
      mbMat
    );
    mbMesh.receiveShadow = true;
    groupMB.add(mbMesh);

    // Disipadores térmicos de las fases VRM con aletas escalonadas y cortes CNC
    const vrm1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.5, 1.4),
      matMetalBrushed
    );
    vrm1.position.set(-0.12, 1.35, -0.4);
    groupMB.add(vrm1);

    const vrm2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 1.05, 0.5),
      matMetalBrushed
    );
    vrm2.position.set(-0.12, 0.75, -1.05);
    groupMB.add(vrm2);

    // Caloducto de cobre niquelado que une los dos bloques disipadores VRM
    const vrmHeatpipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16),
      matCopper
    );
    vrmHeatpipe.rotation.z = Math.PI / 4;
    vrmHeatpipe.position.set(-0.18, 1.15, -0.85);
    groupMB.add(vrmHeatpipe);

    // Hilera de 12 Condensadores Sólidos de Aluminio (Solid Capacitors)
    for (let c = 0; c < 10; c++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16),
        matSilver
      );
      cap.rotation.z = Math.PI / 2;
      cap.position.set(-0.08, 1.05 - c * 0.08, -0.75);
      groupMB.add(cap);
    }

    // Hilera de 10 Chokes de Ferrita (Bobinas blindadas negras con marcado)
    for (let ch = 0; ch < 10; ch++) {
      const choke = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.07, 0.07),
        matBlackPlastic
      );
      choke.position.set(-0.06, 1.05 - ch * 0.08, -0.63);
      groupMB.add(choke);
    }

    // I/O Shield trasero detallado con puertos reales (USB, Type-C, RJ45, Audio, WiFi)
    const ioShield = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 1.6, 0.5),
      matSilver
    );
    ioShield.position.set(-0.11, 0.8, -1.35);
    groupMB.add(ioShield);

    // Puertos USB 3.0 Azul y Type-C
    for (let u = 0; u < 4; u++) {
      const usbPort = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.08, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 })
      );
      usbPort.position.set(-0.24, 1.2 - u * 0.2, -1.35);
      groupMB.add(usbPort);
    }

    // Conectores de antena WiFi 6E chapados en oro
    for (let wf of [-1.2, -1.5]) {
      const wifiPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.14, 16),
        matGold
      );
      wifiPost.rotation.z = Math.PI / 2;
      wifiPost.position.set(-0.25, 0.35, wf);
      groupMB.add(wifiPost);
    }

    // Disipador del Chipset con logo cyber iluminado y aletas CNC
    const chipsetHeatsink = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.85, 0.85),
      matMetalBrushed
    );
    chipsetHeatsink.position.set(-0.08, -1.1, 0.8);
    groupMB.add(chipsetHeatsink);

    const chipsetLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.12, 0.55),
      this.matRGB
    );
    chipsetLed.position.set(-0.08, -1.1, 0.8);
    groupMB.add(chipsetLed);

    // Ranuras PCIe 5.0 con Armadura de Acero Inoxidable (PCIe Armor) y clip de bloqueo
    for (let [idx, yPos] of [[0, -0.3], [1, -1.1]]) {
      const pcieSlot = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.08, 1.8),
        matBlackPlastic
      );
      pcieSlot.position.set(-0.08, yPos, 0.2);
      groupMB.add(pcieSlot);

      // Armadura metálica de refuerzo
      const pcieArmor = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.065, 1.7),
        matSilver
      );
      pcieArmor.position.set(-0.08, yPos, 0.2);
      groupMB.add(pcieArmor);

      // Pestaña de retención / pestillo PCIe
      const latch = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.09, 0.1),
        matSilver
      );
      latch.position.set(-0.08, yPos, 1.1);
      groupMB.add(latch);
    }

    groupMB.position.set(0.65, 0.4, 0);
    this.parts.motherboard = groupMB;
    this.pcRoot.add(groupMB);

    // ========================================================================
    // 3. CPU Y REFRIGERACIÓN LÍQUIDA AIO (parts.cpu & parts.cooler)
    // ========================================================================
    // 3A. CPU Socket & IHS (Procesador central sobre la placa)
    const groupCPU = new THREE.Group();

    // Socket de retención metálico LGA con palanca de presión cromada
    const socketBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.85, 0.85),
      matBlackPlastic
    );
    groupCPU.add(socketBase);

    // Marco de bloqueo de acero
    const socketLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.9, 12),
      matSilver
    );
    socketLever.position.set(-0.05, 0, 0.45);
    groupCPU.add(socketLever);

    // IHS (Integrated Heat Spreader - Núcleo de cobre niquelado)
    const cpuIHS = new THREE.Mesh(
      new THREE.BoxGeometry(0.095, 0.68, 0.68),
      matSilver
    );
    groupCPU.add(cpuIHS);

    // Luz interior pulsante del silicio
    this.cpuCoreLight = new THREE.PointLight(curTheme.primary, 2.5, 1.6);
    this.cpuCoreLight.position.set(-0.16, 0, 0);
    groupCPU.add(this.cpuCoreLight);
    this.rgbLights.push(this.cpuCoreLight);

    groupCPU.position.set(0.6, 1.15, -0.3);
    this.parts.cpu = groupCPU;
    this.pcRoot.add(groupCPU);

    // 3B. Bloque de Refrigeración Líquida AIO (Bomba con pantalla OLED, racores rotativos)
    const groupCooler = new THREE.Group();

    // Cuerpo principal cilíndrico de la bomba con bisel biselado CNC
    const pumpBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.3, 36),
      matBlackPlastic
    );
    pumpBody.rotation.z = Math.PI / 2;
    groupCooler.add(pumpBody);

    // Base de contacto de cobre puro microaleteada
    const copperBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.72, 0.72),
      matCopper
    );
    copperBase.position.set(0.15, 0, 0);
    groupCooler.add(copperBase);

    // Pantalla OLED de la bomba con animación interactiva
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.textures.cpuScreen
    });
    const oledScreen = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 36),
      screenMat
    );
    oledScreen.rotation.y = -Math.PI / 2;
    oledScreen.position.set(-0.155, 0, 0);
    groupCooler.add(oledScreen);

    // Aro exterior RGB del bloque de refrigeración
    const pumpRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.39, 0.022, 16, 36),
      this.matRGB
    );
    pumpRing.rotation.y = -Math.PI / 2;
    pumpRing.position.set(-0.15, 0, 0);
    groupCooler.add(pumpRing);

    // Racores de 90° con anillos de compresión mecanizados
    for (let zFit of [0.22, -0.22]) {
      const fitting = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.14, 20),
        matSilver
      );
      fitting.position.set(0, 0.34, zFit);
      groupCooler.add(fitting);

      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.015, 12, 20),
        matBlackPlastic
      );
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 0.38, zFit);
      groupCooler.add(collar);
    }

    groupCooler.position.set(0.38, 1.15, -0.3);
    this.parts.cooler = groupCooler;
    this.pcRoot.add(groupCooler);

    // 3C. Radiador Superior 360mm con 3 ventiladores RGB
    const groupRadiator = new THREE.Group();
    const radMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.22, 3.85),
      matMetalBrushed
    );
    groupRadiator.add(radMesh);

    for (let zOffset of [-1.15, 0, 1.15]) {
      const fanGroup = this.createFanMesh(0.48, true);
      fanGroup.position.set(0, -0.16, zOffset);
      fanGroup.rotation.x = Math.PI / 2;
      groupRadiator.add(fanGroup);
    }

    groupRadiator.position.set(0, 1.95, 0);
    this.parts.radiator = groupRadiator;
    this.pcRoot.add(groupRadiator);

    // 3D. Mangueras flexibles de agua
    this.createCoolerTubes();

    // ========================================================================
    // 4. TARJETA GRÁFICA / GPU (parts.gpu)
    // Con bloque denso de 40 aletas de disipación, 4 caloductos de cobre y triple ventilador
    // ========================================================================
    const groupGPU = new THREE.Group();

    // Chasis / Carenado angular de la GPU
    const gpuBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.72, 3.15),
      new THREE.MeshStandardMaterial({
        color: 0x161b26,
        metalness: 0.9,
        roughness: 0.26
      })
    );
    groupGPU.add(gpuBody);

    // Backplate superior con gráficos grabados y textura de alta gama
    const gpuBackplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.04, 3.12),
      new THREE.MeshStandardMaterial({
        map: this.textures.gpu,
        metalness: 0.92,
        roughness: 0.22
      })
    );
    gpuBackplate.position.set(0, 0.37, 0);
    groupGPU.add(gpuBackplate);

    // Matriz de 35 aletas de disipación de aluminio (Heatsink Fins)
    const finMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.96,
      roughness: 0.15
    });
    for (let f = 0; f < 35; f++) {
      const zFin = -1.35 + f * 0.08;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 0.44, 0.02),
        finMat
      );
      fin.position.set(0, 0.05, zFin);
      groupGPU.add(fin);
    }

    // 4 Caloductos de cobre sinterizado (Heatpipes) que atraviesan las aletas
    for (let xOff of [-0.28, -0.09, 0.09, 0.28]) {
      const heatpipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 3.0, 16),
        matCopper
      );
      heatpipe.rotation.x = Math.PI / 2;
      heatpipe.position.set(xOff, 0.05, 0);
      groupGPU.add(heatpipe);
    }

    // 3 Ventiladores Axiales con aspas aerodinámicas y anillo perimetral
    for (let zFan of [-0.98, 0, 0.98]) {
      const gpuFan = this.createFanMesh(0.39, true);
      gpuFan.position.set(0, -0.37, zFan);
      gpuFan.rotation.x = -Math.PI / 2;
      groupGPU.add(gpuFan);
    }

    // Insignia RGB lateral iluminada ("GEFORCE RTX // HIGH-END")
    const sideLogo = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.2, 1.9),
      this.matRGB
    );
    sideLogo.position.set(-0.45, 0.16, 0);
    groupGPU.add(sideLogo);

    // Soporte metálico I/O trasero con 3x DisplayPort y 1x HDMI
    const gpuBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 1.25, 0.06),
      matSilver
    );
    gpuBracket.position.set(0, -0.1, -1.6);
    groupGPU.add(gpuBracket);

    for (let dp = 0; dp < 3; dp++) {
      const dpPort = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.06, 0.08),
        matBlackPlastic
      );
      dpPort.position.set(0.08, -0.2 - dp * 0.22, -1.6);
      groupGPU.add(dpPort);
    }

    // Conector de potencia 12VHPWR con cables enfundados en peine
    const pwrBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.12, 0.26),
      matBlackPlastic
    );
    pwrBlock.position.set(-0.25, 0.39, 0.5);
    groupGPU.add(pwrBlock);

    groupGPU.position.set(0.1, 0.1, 0.2);
    this.parts.gpu = groupGPU;
    this.pcRoot.add(groupGPU);

    // ========================================================================
    // 5. MEMORIA RAM DDR5 (parts.ram - 4 Módulos de alto rendimiento)
    // ========================================================================
    const groupRAM = new THREE.Group();
    this.ramSticks = [];

    for (let i = 0; i < 4; i++) {
      const stickGroup = new THREE.Group();
      const zPos = 0.35 + i * 0.15;

      // Disipador de aluminio anodizado facetado
      const ramBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.92, 0.1),
        matMetalBrushed
      );
      stickGroup.add(ramBody);

      // Difusor RGB superior acrílico con dispersión de luz
      const ramDiffuser = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.14, 0.1),
        this.matRGB
      );
      ramDiffuser.position.set(0, 0.48, 0);
      stickGroup.add(ramDiffuser);

      stickGroup.position.set(0.55, 1.15, zPos);
      this.ramSticks.push(stickGroup);
      groupRAM.add(stickGroup);
    }

    this.parts.ram = groupRAM;
    this.pcRoot.add(groupRAM);

    // ========================================================================
    // 6. ALMACENAMIENTO NVMe M.2 SSD (parts.ssd)
    // ========================================================================
    const groupSSD = new THREE.Group();

    // M.2 2280 PCB Stick
    const ssdPCB = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.14, 0.72),
      matBlackPlastic
    );
    groupSSD.add(ssdPCB);

    // Disipador de aluminio con aletas térmicas
    const ssdHeatsink = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.15, 0.68),
      matMetalBrushed
    );
    ssdHeatsink.position.set(-0.02, 0, 0);
    groupSSD.add(ssdHeatsink);

    // LED de actividad de lectura/escritura (parpadea sutilmente)
    this.ssdLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.04, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    this.ssdLed.position.set(-0.04, 0.04, -0.28);
    groupSSD.add(this.ssdLed);

    groupSSD.position.set(0.58, -0.15, -0.2);
    this.parts.ssd = groupSSD;
    this.pcRoot.add(groupSSD);

    // ========================================================================
    // 7. FUENTE DE PODER (PSU) Y CABLEADO MODULAR MALLADO (parts.psu)
    // ========================================================================
    const groupPSU = new THREE.Group();

    // Cubierta inferior del túnel de la fuente (PSU Shroud)
    const psuShroud = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.95, 4.2),
      matChassisDark
    );
    psuShroud.position.set(0, -1.75, 0);
    groupPSU.add(psuShroud);

    // Bloque de la fuente de poder (1000W 80-Plus Titanium)
    const psuBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.8, 1.8),
      matBlackPlastic
    );
    psuBlock.position.set(0, -1.75, -0.9);
    groupPSU.add(psuBlock);

    // Rejilla de ventilador de la PSU
    const psuGrill = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 32),
      matSilver
    );
    psuGrill.rotation.x = Math.PI / 2;
    psuGrill.position.set(0, -1.34, -0.9);
    groupPSU.add(psuGrill);

    // Mazo de cables mallados en peine de 24 pines (Black & Cyan)
    for (let w = 0; w < 4; w++) {
      const zOffset = 0.9 + w * 0.09;
      const wireCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.52, -1.3, zOffset),
        new THREE.Vector3(0.38, -0.5, zOffset + 0.15),
        new THREE.Vector3(0.56, 0.4, zOffset)
      ]);
      const wireGeo = new THREE.TubeGeometry(wireCurve, 20, 0.035, 8, false);
      const wireMesh = new THREE.Mesh(
        wireGeo,
        w % 2 === 0 ? matBlackPlastic : this.matRGB
      );
      groupPSU.add(wireMesh);
    }

    this.parts.psu = groupPSU;
    this.pcRoot.add(groupPSU);

    // ========================================================================
    // 8. VENTILADORES DEL CHASIS (Frontales y Trasero con Halo RGB)
    // ========================================================================
    const groupCaseFans = new THREE.Group();

    // 3 Ventiladores Frontales de 120mm con aro exterior RGB
    for (let yPos of [-0.8, 0.3, 1.4]) {
      const frontFan = this.createFanMesh(0.48, true);
      frontFan.position.set(0, yPos, 1.95);
      groupCaseFans.add(frontFan);
    }

    // 1 Ventilador Trasero de 120mm
    const rearFan = this.createFanMesh(0.45, true);
    rearFan.position.set(0, 1.1, -1.95);
    rearFan.rotation.y = Math.PI;
    groupCaseFans.add(rearFan);

    this.parts.caseFans = groupCaseFans;
    this.pcRoot.add(groupCaseFans);
  }

  // Crea un ventilador de alta fidelidad con anillo perimetral y aspas esculpidas
  createFanMesh(radius, hasRGBRing) {
    const group = new THREE.Group();

    // Marco cuadrado con biseles
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0d121c,
      roughness: 0.5
    });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 2.1, radius * 2.1, 0.1),
      frameMat
    );
    group.add(frame);

    // Anillo RGB Halo de difusión
    if (hasRGBRing) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.95, 0.032, 16, 36),
        this.matRGB
      );
      ring.position.set(0, 0, 0.05);
      group.add(ring);
    }

    // Núcleo central / Motor con emblema cromado
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.32, radius * 0.32, 0.12, 28),
      new THREE.MeshStandardMaterial({ color: 0x1f293d, metalness: 0.9, roughness: 0.2 })
    );
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    // Aspas del ventilador (Giran con la animación)
    const bladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(radius * 0.65, 0.14, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.88,
      roughness: 0.18,
      metalness: 0.2
    });

    const bladeCount = 9;
    for (let b = 0; b < bladeCount; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      const angle = (b / bladeCount) * Math.PI * 2;
      blade.position.set(
        Math.cos(angle) * radius * 0.55,
        Math.sin(angle) * radius * 0.55,
        0
      );
      blade.rotation.z = angle;
      blade.rotation.y = 0.45;
      bladesGroup.add(blade);
    }

    group.add(bladesGroup);
    this.rotatingFans.push(bladesGroup);

    return group;
  }

  // Genera los tubos de refrigeración líquida con curvatura spline y conectores
  createCoolerTubes() {
    if (this.coolerHoseMesh) this.pcRoot.remove(this.coolerHoseMesh);
    if (this.coolerHoseMesh2) this.pcRoot.remove(this.coolerHoseMesh2);

    const matHose = new THREE.MeshStandardMaterial({
      color: 0x080b12,
      roughness: 0.45,
      metalness: 0.25
    });

    // Manguera 1: Bomba -> Radiador
    const p1 = new THREE.Vector3(0.4, 1.4, -0.1);
    const pMid1 = new THREE.Vector3(0.0, 1.72, 0.25);
    const pEnd1 = new THREE.Vector3(0.1, 1.9, 0.8);
    const curve1 = new THREE.CatmullRomCurve3([p1, pMid1, pEnd1]);
    const geo1 = new THREE.TubeGeometry(curve1, 28, 0.068, 16, false);
    this.coolerHoseMesh = new THREE.Mesh(geo1, matHose);
    this.pcRoot.add(this.coolerHoseMesh);

    // Manguera 2: Retorno Radiador -> Bomba
    const p2 = new THREE.Vector3(0.4, 1.4, -0.5);
    const pMid2 = new THREE.Vector3(-0.1, 1.62, -0.1);
    const pEnd2 = new THREE.Vector3(0.1, 1.9, 0.6);
    const curve2 = new THREE.CatmullRomCurve3([p2, pMid2, pEnd2]);
    const geo2 = new THREE.TubeGeometry(curve2, 28, 0.068, 16, false);
    this.coolerHoseMesh2 = new THREE.Mesh(geo2, matHose);
    this.pcRoot.add(this.coolerHoseMesh2);
  }

  // --------------------------------------------------------------------------
  // PARTÍCULAS AMBIENTALES & POLVO HOLOGRÁFICO
  // --------------------------------------------------------------------------
  createAtmosphereParticles() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const theme = this.themes[this.currentThemeKey];
    const c1 = new THREE.Color(theme.primary);
    const c2 = new THREE.Color(theme.secondary);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const mixedColor = c1.clone().lerp(c2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // --------------------------------------------------------------------------
  // MATRIZ DE DESPIECE 3D POR SCROLL (SCROLL STORYTELLING INTERPOLATION)
  // --------------------------------------------------------------------------
  updateExplodedAssembly(p) {
    // 1. Panel de cristal: Se abre y flota primero (p: 0.04 -> 0.35)
    const glassProgress = this.smoothStep(p, 0.04, 0.35);
    if (this.parts.glassPanel) {
      this.parts.glassPanel.position.x = -1.05 - glassProgress * 3.4;
      this.parts.glassPanel.position.z = glassProgress * 0.9;
      this.parts.glassPanel.rotation.y = -glassProgress * 0.38;
      this.parts.glassPanel.rotation.z = glassProgress * 0.16;
    }

    // 2. Paneles frontal y superior: Se separan en el segundo tramo (p: 0.10 -> 0.40)
    const exteriorProgress = this.smoothStep(p, 0.1, 0.4);
    if (this.parts.frontPanel) {
      this.parts.frontPanel.position.z = 2.15 + exteriorProgress * 3.2;
    }
    if (this.parts.topPanel) {
      this.parts.topPanel.position.y = 2.22 + exteriorProgress * 2.8;
    }

    // 3. TARJETA GRÁFICA / GPU: Se desacopla de la ranura PCIe y flota hacia adelante (p: 0.26 -> 0.58)
    const gpuProgress = this.smoothStep(p, 0.26, 0.58);
    if (this.parts.gpu) {
      this.parts.gpu.position.x = 0.1 - gpuProgress * 3.0;
      this.parts.gpu.position.y = 0.1 - gpuProgress * 0.2;
      this.parts.gpu.position.z = 0.2 + gpuProgress * 2.4;
      this.parts.gpu.rotation.x = gpuProgress * 0.28;
      this.parts.gpu.rotation.y = -gpuProgress * 0.65;
      this.parts.gpu.rotation.z = gpuProgress * 0.12;
    }

    // 4. CPU & REFRIGERACIÓN: La bomba se eleva del socket destapando el silicio (p: 0.42 -> 0.72)
    const cpuCoolerProgress = this.smoothStep(p, 0.42, 0.72);
    if (this.parts.cooler) {
      this.parts.cooler.position.x = 0.38 - cpuCoolerProgress * 2.6;
      this.parts.cooler.position.y = 1.15 + cpuCoolerProgress * 1.9;
      this.parts.cooler.rotation.z = cpuCoolerProgress * 0.42;
      this.parts.cooler.rotation.y = -cpuCoolerProgress * 0.52;
    }
    if (this.parts.radiator) {
      this.parts.radiator.position.y = 1.95 + cpuCoolerProgress * 2.3;
    }
    if (this.parts.cpu) {
      this.parts.cpu.position.x = 0.6 - this.smoothStep(p, 0.48, 0.75) * 0.85;
      this.cpuCoreLight.intensity = 2.0 + this.smoothStep(p, 0.5, 0.75) * 5.5;
    }

    // 5. MEMORIAS RAM: Se extraen hacia arriba y se abren en abanico (p: 0.60 -> 0.85)
    const ramProgress = this.smoothStep(p, 0.6, 0.85);
    if (this.ramSticks) {
      this.ramSticks.forEach((stick, idx) => {
        const stagger = idx * 0.16;
        stick.position.x = 0.55 - ramProgress * (1.3 + idx * 0.22);
        stick.position.y = 1.15 + ramProgress * (1.25 + stagger);
        stick.rotation.z = ramProgress * (0.22 + idx * 0.08);
      });
    }

    // 6. NVMe SSD: Se eleva de la placa base (p: 0.65 -> 0.88)
    const ssdProgress = this.smoothStep(p, 0.65, 0.88);
    if (this.parts.ssd) {
      this.parts.ssd.position.x = 0.58 - ssdProgress * 2.3;
      this.parts.ssd.position.y = -0.15 + ssdProgress * 0.65;
      this.parts.ssd.position.z = -0.2 + ssdProgress * 1.3;
      this.parts.ssd.rotation.y = ssdProgress * 0.45;
    }

    // 7. FUENTE DE PODER & TÚNEL PSU: Se separa hacia abajo/atrás (p: 0.78 -> 0.98)
    const psuProgress = this.smoothStep(p, 0.78, 0.98);
    if (this.parts.psu) {
      this.parts.psu.position.y = -psuProgress * 1.6;
      this.parts.psu.position.z = -psuProgress * 1.3;
    }

    // 8. CHOREOGRAFÍA DE CÁMARA DINÁMICA POR SECCIÓN
    this.updateCameraPath(p);
  }

  // Trayectoria cinematográfica de la cámara según el componente en foco
  updateCameraPath(p) {
    let targetPos = new THREE.Vector3(4.5, 1.8, 5.5);
    let lookTarget = new THREE.Vector3(0, 0, 0);

    if (p < 0.18) {
      // 1. HERO: Vista general 3/4 isométrica del PC ensamblado
      const subP = p / 0.18;
      targetPos.set(
        4.8 + Math.sin(subP * Math.PI) * 0.4,
        2.0,
        5.8 + subP * 0.5
      );
      lookTarget.set(0, 0, 0);
    } else if (p < 0.38) {
      // 2. CHASIS / SOBRE MÍ: Cámara gira hacia la izquierda para ver el interior
      const subP = (p - 0.18) / 0.2;
      targetPos.set(
        -3.8 - subP * 0.6,
        1.6 + subP * 0.3,
        4.2 - subP * 0.8
      );
      lookTarget.set(-0.2, 0.2, 0);
    } else if (p < 0.58) {
      // 3. GPU / FRONTEND: Primer plano espectacular en la tarjeta gráfica
      const subP = (p - 0.38) / 0.2;
      targetPos.set(
        -3.2 + subP * 0.8,
        0.2 + subP * 0.4,
        3.5 + subP * 0.5
      );
      lookTarget.set(-0.8, 0.0, 1.0);
    } else if (p < 0.78) {
      // 4. CPU & BACKEND: Acercamiento cenital al procesador y bloque de refrigeración
      const subP = (p - 0.58) / 0.2;
      targetPos.set(
        -2.2 + subP * 0.5,
        2.5 + subP * 0.5,
        2.8 - subP * 0.4
      );
      lookTarget.set(-0.3, 1.2, -0.2);
    } else if (p < 0.92) {
      // 5. RAM & ALMACENAMIENTO / BBDD & CLOUD
      const subP = (p - 0.78) / 0.14;
      targetPos.set(
        -2.8 - subP * 0.4,
        1.8,
        3.8 + subP * 0.6
      );
      lookTarget.set(-0.5, 0.8, 0.4);
    } else {
      // 6. DESPIECE TOTAL & CONTACTO: Gran angular majestuoso mostrando todo el despiece
      const subP = (p - 0.92) / 0.08;
      targetPos.set(
        -5.5 - subP * 0.8,
        3.2 + subP * 0.5,
        6.5 + subP * 0.8
      );
      lookTarget.set(0, 0.5, 0);
    }

    // Influencia del ratón (Paralaje 3D sutil) o drag
    const mouseInfluence = 0.65;
    const finalCamPos = targetPos.clone();
    finalCamPos.x += (this.mouse.x + this.orbitOffset.x) * mouseInfluence;
    finalCamPos.y += (-this.mouse.y + this.orbitOffset.y) * mouseInfluence;

    this.camera.position.lerp(finalCamPos, 0.07);
    this.cameraTarget.lerp(lookTarget, 0.07);
    this.camera.lookAt(this.cameraTarget);
  }

  smoothStep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    const t = (x - min) / (max - min);
    return t * t * (3 - 2 * t);
  }

  // --------------------------------------------------------------------------
  // EVENTOS DEL SISTEMA: SCROLL, RATÓN, REDIMENSIÓN, TOUCH
  // --------------------------------------------------------------------------
  initEvents() {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        this.targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;

      if (this.isDragging) {
        const deltaX = (e.clientX - this.dragStart.x) * 0.005;
        const deltaY = (e.clientY - this.dragStart.y) * 0.005;
        this.orbitOffset.x += deltaX;
        this.orbitOffset.y += deltaY;
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart.x = e.clientX;
      this.dragStart.y = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      if (this.composer) {
        this.composer.setSize(this.width, this.height);
      }
    });
  }

  // --------------------------------------------------------------------------
  // CAMBIO DINÁMICO DE TEMA DE ILUMINACIÓN RGB
  // --------------------------------------------------------------------------
  setTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    this.currentThemeKey = themeKey;
    const theme = this.themes[themeKey];

    this.matRGB.color.setHex(theme.primary);
    this.matRGB.emissive.setHex(theme.primary);

    this.matRGBSecondary.color.setHex(theme.secondary);
    this.matRGBSecondary.emissive.setHex(theme.secondary);

    if (this.rgbLightCPU) this.rgbLightCPU.color.setHex(theme.primary);
    if (this.rgbLightGPU) this.rgbLightGPU.color.setHex(theme.secondary);
    if (this.rgbLightFront) this.rgbLightFront.color.setHex(theme.primary);
    if (this.cpuCoreLight) this.cpuCoreLight.color.setHex(theme.primary);

    document.documentElement.style.setProperty('--accent', theme.accentHex);
    document.documentElement.style.setProperty('--primary', theme.primaryHex);
    document.documentElement.style.setProperty('--accent-gradient', theme.cssGradient);

    console.log(`🎨 Tema RGB cambiado a: ${theme.name}`);
  }

  // --------------------------------------------------------------------------
  // BUCLE PRINCIPAL DE RENDERIZADO CON POST-PROCESSING
  // --------------------------------------------------------------------------
  animate(timestamp = 0) {
    requestAnimationFrame((t) => this.animate(t));

    // Suavizado del progreso de scroll
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.085;

    // Suavizado del ratón
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotación suave continua de aspas de ventiladores
    for (let fan of this.rotatingFans) {
      fan.rotation.z += 0.08;
    }

    // Parpadeo de telemetría LED SSD
    if (this.ssdLed) {
      this.ssdLed.visible = Math.sin(timestamp * 0.02) > -0.2;
    }

    // Rotación lenta de partículas atmosféricas
    if (this.particles) {
      this.particles.rotation.y = timestamp * 0.0001;
    }

    // Actualización de pantalla OLED de la CPU
    this.updateCPUScreenTexture(timestamp);

    // Actualizar despiece 3D e interpolación de cámara
    this.updateExplodedAssembly(this.scrollProgress);

    // Actualizar telemetría del HUD
    this.updateHUDTelemetry(this.scrollProgress);

    // Renderizar a través de EffectComposer (UnrealBloomPass) o Renderer directo
    if (this.useComposer && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  updateHUDTelemetry(p) {
    const elPercent = document.getElementById('hud-disassembly-percent');
    if (elPercent) {
      elPercent.textContent = `${Math.round(p * 100)}%`;
    }

    const elStage = document.getElementById('hud-active-stage');
    if (elStage) {
      if (p < 0.18) elStage.textContent = 'SISTEMA ENSAMBLADO';
      else if (p < 0.38) elStage.textContent = '01 // CHASIS & PANEL CRISTAL';
      else if (p < 0.58) elStage.textContent = '02 // GPU MOTOR FRONTEND';
      else if (p < 0.78) elStage.textContent = '03 // CPU NÚCLEO BACKEND';
      else if (p < 0.92) elStage.textContent = '04 // MEMORIA & ALMACENAMIENTO';
      else elStage.textContent = '05 // DESPIECE COMPLETO & CONTACTO';
    }

    const elBar = document.getElementById('hud-progress-fill');
    if (elBar) {
      elBar.style.width = `${Math.round(p * 100)}%`;
    }
  }
}

// Inicialización global
window.addEventListener('DOMContentLoaded', () => {
  window.pcViewer = new PC3DViewer();
});
