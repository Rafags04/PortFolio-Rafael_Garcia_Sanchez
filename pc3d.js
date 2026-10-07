/**
 * ==========================================================================
 * PC 3D ENGINE - DESPIECE INTERACTIVO POR SCROLL (THREE.JS)
 * Modelo 3D procedimental de PC Gaming / Workstation de alta fidelidad.
 * Desarrollado con Three.js para una experiencia fluida, inmersiva y única.
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
    this.isOrbiting = false;

    // Temas RGB
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
    this.initLights();
    this.createProceduralTextures();
    this.buildPCModel();
    this.createAtmosphereParticles();
    this.initEvents();
    this.animate();

    console.log('⚡ PC3DViewer inicializado exitosamente.');
  }

  // --------------------------------------------------------------------------
  // ESCENA, CÁMARA Y RENDERER
  // --------------------------------------------------------------------------
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0d14, 0.035);

    this.camera = new THREE.PerspectiveCamera(
      45,
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
    this.renderer.toneMappingExposure = 1.15;

    // Grupo raíz que contiene todo el ordenador
    this.pcRoot = new THREE.Group();
    this.scene.add(this.pcRoot);
  }

  // --------------------------------------------------------------------------
  // ILUMINACIÓN REALISTA & RGB DINÁMICO
  // --------------------------------------------------------------------------
  initLights() {
    // Luz ambiental suave
    this.ambientLight = new THREE.AmbientLight(0x0f1524, 1.2);
    this.scene.add(this.ambientLight);

    // Luz principal cenital / direccional con sombras suaves
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.dirLight.position.set(5, 8, 6);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 25;
    this.dirLight.shadow.camera.left = -5;
    this.dirLight.shadow.camera.right = 5;
    this.dirLight.shadow.camera.top = 5;
    this.dirLight.shadow.camera.bottom = -5;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Luz trasera de contorno (Rim light) azulada
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-6, 3, -6);
    this.scene.add(rimLight);

    // Luces internas RGB del PC (PointLights)
    const curTheme = this.themes[this.currentThemeKey];

    // Luz 1: Interior CPU / Cooler
    this.rgbLightCPU = new THREE.PointLight(curTheme.primary, 3.5, 4.0);
    this.rgbLightCPU.position.set(0.3, 0.8, -0.3);
    this.pcRoot.add(this.rgbLightCPU);
    this.rgbLights.push(this.rgbLightCPU);

    // Luz 2: Interior GPU
    this.rgbLightGPU = new THREE.PointLight(curTheme.secondary, 3.0, 4.5);
    this.rgbLightGPU.position.set(-0.2, -0.4, 0.4);
    this.pcRoot.add(this.rgbLightGPU);
    this.rgbLights.push(this.rgbLightGPU);

    // Luz 3: Frontal / Ventiladores
    this.rgbLightFront = new THREE.PointLight(curTheme.primary, 2.5, 4.0);
    this.rgbLightFront.position.set(0, 0, 2.2);
    this.pcRoot.add(this.rgbLightFront);
    this.rgbLights.push(this.rgbLightFront);
  }

  // --------------------------------------------------------------------------
  // GENERADORES DE TEXTURAS PROCEDIMENTALES 2D EN ALTA RESOLUCIÓN
  // (Sin descargas externas: rápido, nítido y siempre disponible)
  // --------------------------------------------------------------------------
  createProceduralTextures() {
    this.textures = {};

    // 1. Textura de placa base (PCB Circuit Board)
    const cvPCB = document.createElement('canvas');
    cvPCB.width = 1024;
    cvPCB.height = 1024;
    const ctxPCB = cvPCB.getContext('2d');

    // Fondo PCB negro mate / carbón
    ctxPCB.fillStyle = '#0a0d14';
    ctxPCB.fillRect(0, 0, 1024, 1024);

    // Cuadrícula sutil de circuito
    ctxPCB.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctxPCB.lineWidth = 1;
    for (let i = 0; i < 1024; i += 32) {
      ctxPCB.beginPath();
      ctxPCB.moveTo(i, 0);
      ctxPCB.lineTo(i, 1024);
      ctxPCB.stroke();
      ctxPCB.beginPath();
      ctxPCB.moveTo(0, i);
      ctxPCB.lineTo(1024, i);
      ctxPCB.stroke();
    }

    // Pistas de cobre / oro y buses de datos
    ctxPCB.strokeStyle = '#c59b27';
    ctxPCB.lineWidth = 2;
    ctxPCB.lineCap = 'round';

    const drawBus = (x1, y1, x2, y2, branches) => {
      ctxPCB.beginPath();
      ctxPCB.moveTo(x1, y1);
      ctxPCB.lineTo((x1 + x2) / 2, y1);
      ctxPCB.lineTo((x1 + x2) / 2, y2);
      ctxPCB.lineTo(x2, y2);
      ctxPCB.stroke();

      if (branches) {
        for (let b = 0; b < 4; b++) {
          ctxPCB.beginPath();
          ctxPCB.moveTo((x1 + x2) / 2, y1 + b * 20);
          ctxPCB.lineTo((x1 + x2) / 2 + 50, y1 + b * 20);
          ctxPCB.stroke();
          // Pad de soldadura
          ctxPCB.fillStyle = '#eab308';
          ctxPCB.fillRect((x1 + x2) / 2 + 50, y1 + b * 20 - 2, 4, 4);
        }
      }
    };

    drawBus(200, 200, 700, 500, true);
    drawBus(300, 800, 850, 300, true);
    drawBus(150, 600, 500, 900, false);
    drawBus(600, 100, 900, 400, false);

    // Silkscreen: Textos de ingeniería
    ctxPCB.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctxPCB.font = 'bold 24px monospace';
    ctxPCB.fillText('RAFA ARCHITECTURE // ULTRA 2026', 120, 120);
    ctxPCB.font = '16px monospace';
    ctxPCB.fillText('SOCKET LGA-1700 // PCI-E 5.0 HIGH SPEED BUS', 120, 150);
    ctxPCB.fillText('DUAL CHANNEL DDR5 // NVME GEN5 READY', 120, 175);

    // Chips SMD y resistencias en la placa
    ctxPCB.fillStyle = '#1e293b';
    for (let c = 0; c < 25; c++) {
      const rx = 150 + Math.random() * 700;
      const ry = 150 + Math.random() * 700;
      ctxPCB.fillRect(rx, ry, 28, 20);
      ctxPCB.fillStyle = '#94a3b8';
      ctxPCB.fillRect(rx - 2, ry + 4, 2, 12);
      ctxPCB.fillRect(rx + 28, ry + 4, 2, 12);
      ctxPCB.fillStyle = '#1e293b';
    }

    this.textures.pcb = new THREE.CanvasTexture(cvPCB);

    // 2. Textura para pantalla OLED de CPU Cooler ("RAFA.DEV" y telemetría)
    this.cvCPU = document.createElement('canvas');
    this.cvCPU.width = 512;
    this.cvCPU.height = 512;
    this.ctxCPU = this.cvCPU.getContext('2d');
    this.textures.cpuScreen = new THREE.CanvasTexture(this.cvCPU);
    this.updateCPUScreenTexture(0);

    // 3. Textura de rejilla metálica / Mesh para chasis frontal y superior
    const cvMesh = document.createElement('canvas');
    cvMesh.width = 128;
    cvMesh.height = 128;
    const ctxMesh = cvMesh.getContext('2d');
    ctxMesh.fillStyle = '#111622';
    ctxMesh.fillRect(0, 0, 128, 128);
    ctxMesh.fillStyle = '#06090e';
    for (let x = 8; x < 128; x += 16) {
      for (let y = 8; y < 128; y += 16) {
        ctxMesh.beginPath();
        ctxMesh.arc(x, y, 4, 0, Math.PI * 2);
        ctxMesh.fill();
      }
    }
    this.textures.mesh = new THREE.CanvasTexture(cvMesh);
    this.textures.mesh.wrapS = THREE.RepeatWrapping;
    this.textures.mesh.wrapT = THREE.RepeatWrapping;
    this.textures.mesh.repeat.set(6, 6);

    // 4. Textura para Backplate de Tarjeta Gráfica (GPU)
    const cvGPU = document.createElement('canvas');
    cvGPU.width = 1024;
    cvGPU.height = 512;
    const ctxGPU = cvGPU.getContext('2d');
    ctxGPU.fillStyle = '#131824';
    ctxGPU.fillRect(0, 0, 1024, 512);

    // Líneas geométricas angulares en el backplate
    ctxGPU.strokeStyle = '#2d3748';
    ctxGPU.lineWidth = 4;
    ctxGPU.beginPath();
    ctxGPU.moveTo(50, 50);
    ctxGPU.lineTo(350, 50);
    ctxGPU.lineTo(450, 200);
    ctxGPU.lineTo(950, 200);
    ctxGPU.stroke();

    ctxGPU.fillStyle = '#00f0ff';
    ctxGPU.font = 'bold 36px monospace';
    ctxGPU.fillText('RTX // FRONTEND ACCELERATOR', 80, 260);
    ctxGPU.fillStyle = 'rgba(255,255,255,0.6)';
    ctxGPU.font = '22px monospace';
    ctxGPU.fillText('24GB GDDR6X // 10496 CUDA CORES // 120 FPS', 80, 305);
    ctxGPU.fillText('HARDWARE ACCELERATED WEBGL & UI ENGINE', 80, 340);

    // Rejilla de disipación
    ctxGPU.fillStyle = '#0a0d14';
    for (let i = 650; i < 950; i += 20) {
      ctxGPU.fillRect(i, 80, 10, 350);
    }
    this.textures.gpu = new THREE.CanvasTexture(cvGPU);
  }

  // Actualiza la pantalla OLED del bloque de refrigeración en tiempo real
  updateCPUScreenTexture(time) {
    const ctx = this.ctxCPU;
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, 512, 512);

    // Anillo giratorio de estado RGB
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(time * 0.002);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(0, 0, 200, 0, Math.PI * 1.5);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 175, 0, Math.PI * 1.2);
    ctx.stroke();
    ctx.restore();

    // Texto central
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('RAFA.DEV', 256, 220);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 64px monospace';
    const temp = Math.floor(36 + Math.sin(time * 0.003) * 4);
    ctx.fillText(`${temp}°C`, 256, 290);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px monospace';
    ctx.fillText('CORE: 5.4 GHz // OPTIMAL', 256, 340);

    if (this.textures && this.textures.cpuScreen) {
      this.textures.cpuScreen.needsUpdate = true;
    }
  }

  // --------------------------------------------------------------------------
  // CONSTRUCCIÓN DEL MODELO 3D PROCEDIMENTAL DEL PC
  // --------------------------------------------------------------------------
  buildPCModel() {
    const curTheme = this.themes[this.currentThemeKey];

    // Materiales comunes
    const matChassisDark = new THREE.MeshStandardMaterial({
      color: 0x141824,
      metalness: 0.85,
      roughness: 0.25
    });

    const matMetalBrushed = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.3
    });

    const matBlackPlastic = new THREE.MeshStandardMaterial({
      color: 0x0f131d,
      roughness: 0.6,
      metalness: 0.1
    });

    const matSilver = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15
    });

    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.9,
      roughness: 0.25
    });

    // Material RGB Emisivo dinámico (conectado al tema)
    this.matRGB = new THREE.MeshStandardMaterial({
      color: curTheme.primary,
      emissive: curTheme.primary,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });
    this.rgbMaterials.push(this.matRGB);

    this.matRGBSecondary = new THREE.MeshStandardMaterial({
      color: curTheme.secondary,
      emissive: curTheme.secondary,
      emissiveIntensity: 1.5,
      roughness: 0.2
    });
    this.rgbMaterials.push(this.matRGBSecondary);

    // ========================================================================
    // 1. CHASIS Y PANELES EXTERIORES (parts.case)
    // ========================================================================
    const groupCase = new THREE.Group();

    // Estructura interior del chasis (bandeja, piso, techo, trasera)
    // Marco exterior (chasis metálico con aperturas)
    const frameGeo = new THREE.BoxGeometry(0.1, 4.4, 4.4);
    const rightPanel = new THREE.Mesh(frameGeo, matChassisDark);
    rightPanel.position.set(1.05, 0, 0);
    groupCase.add(rightPanel);

    // Bandeja de placa base
    const trayGeo = new THREE.BoxGeometry(0.04, 3.8, 3.8);
    const mbTray = new THREE.Mesh(trayGeo, matMetalBrushed);
    mbTray.position.set(0.7, 0.2, 0);
    groupCase.add(mbTray);

    // Patas del PC con goma y aro cromado
    for (let x of [-0.85, 0.85]) {
      for (let z of [-1.8, 1.8]) {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.15, 24),
          matMetalBrushed
        );
        foot.position.set(x, -2.25, z);
        groupCase.add(foot);
      }
    }

    // Botón de encendido en el panel frontal superior con aro LED
    const pwrButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16),
      matMetalBrushed
    );
    pwrButton.rotation.x = Math.PI / 2;
    pwrButton.position.set(-0.6, 2.1, 2.16);
    groupCase.add(pwrButton);

    const pwrRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.015, 12, 24),
      this.matRGB
    );
    pwrRing.position.set(-0.6, 2.1, 2.18);
    groupCase.add(pwrRing);

    // PANEL DE CRISTAL TEMPLADO (SEPARABLE EN DESPIECE)
    const glassGroup = new THREE.Group();
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.38,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.6,
      reflectivity: 0.85
    });

    const glassPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 4.25, 4.25),
      glassMat
    );
    glassPanel.castShadow = true;
    glassGroup.add(glassPanel);

    // 4 tornillos de sujeción cromados en las esquinas del cristal
    for (let y of [-1.95, 1.95]) {
      for (let z of [-1.95, 1.95]) {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16),
          matSilver
        );
        screw.rotation.z = Math.PI / 2;
        screw.position.set(0.02, y, z);
        glassGroup.add(screw);
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
        color: 0x111726,
        metalness: 0.8,
        roughness: 0.35,
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
    // 2. PLACA BASE (parts.motherboard)
    // ========================================================================
    const groupMB = new THREE.Group();

    // PCB con textura rica de pistas y chips
    const mbMat = new THREE.MeshStandardMaterial({
      color: 0x111624,
      map: this.textures.pcb,
      roughness: 0.45,
      metalness: 0.3
    });
    const mbMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 3.4, 2.9),
      mbMat
    );
    mbMesh.receiveShadow = true;
    groupMB.add(mbMesh);

    // Disipadores térmicos de las fases VRM (Aluminio cepillado con aletas)
    const vrm1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.45, 1.4),
      matMetalBrushed
    );
    vrm1.position.set(-0.1, 1.35, -0.4);
    groupMB.add(vrm1);

    const vrm2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 1.0, 0.45),
      matMetalBrushed
    );
    vrm2.position.set(-0.1, 0.75, -1.05);
    groupMB.add(vrm2);

    // I/O Shield trasero (Puertos USB, audio, red)
    const ioShield = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 1.6, 0.5),
      matSilver
    );
    ioShield.position.set(-0.1, 0.8, -1.35);
    groupMB.add(ioShield);

    // Disipador del Chipset con logo iluminado
    const chipsetHeatsink = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.8, 0.8),
      matMetalBrushed
    );
    chipsetHeatsink.position.set(-0.08, -1.1, 0.8);
    groupMB.add(chipsetHeatsink);

    const chipsetLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.1, 0.5),
      this.matRGB
    );
    chipsetLed.position.set(-0.08, -1.1, 0.8);
    groupMB.add(chipsetLed);

    // Ranuras PCIe (Ranura 1 reforzada metálica + Ranura 2 secundaria)
    for (let [idx, yPos] of [[0, -0.3], [1, -1.1]]) {
      const pcieSlot = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.08, 1.8),
        matBlackPlastic
      );
      pcieSlot.position.set(-0.08, yPos, 0.2);
      groupMB.add(pcieSlot);

      // Blindaje de acero PCIe Armor
      const pcieArmor = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.06, 1.7),
        matSilver
      );
      pcieArmor.position.set(-0.08, yPos, 0.2);
      groupMB.add(pcieArmor);
    }

    groupMB.position.set(0.65, 0.4, 0);
    this.parts.motherboard = groupMB;
    this.pcRoot.add(groupMB);

    // ========================================================================
    // 3. CPU Y REFRIGERACIÓN LÍQUIDA AIO (parts.cpu & parts.cooler)
    // ========================================================================
    // 3A. CPU Socket & IHS (Procesador central sobre la placa)
    const groupCPU = new THREE.Group();

    // Socket de retención metálico
    const socketBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.8, 0.8),
      matBlackPlastic
    );
    groupCPU.add(socketBase);

    // IHS (Integrated Heat Spreader - Núcleo de cobre niquelado)
    const cpuIHS = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.65, 0.65),
      matSilver
    );
    groupCPU.add(cpuIHS);

    // Núcleo de silicio / Luz interior pulsante
    this.cpuCoreLight = new THREE.PointLight(curTheme.primary, 2.0, 1.5);
    this.cpuCoreLight.position.set(-0.15, 0, 0);
    groupCPU.add(this.cpuCoreLight);
    this.rgbLights.push(this.cpuCoreLight);

    groupCPU.position.set(0.6, 1.15, -0.3);
    this.parts.cpu = groupCPU;
    this.pcRoot.add(groupCPU);

    // 3B. Bloque de Refrigeración Líquida AIO (Bomba con pantalla OLED y tubos)
    const groupCooler = new THREE.Group();

    // Bloque cilíndrico de la bomba
    const pumpBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.28, 32),
      matBlackPlastic
    );
    pumpBody.rotation.z = Math.PI / 2;
    groupCooler.add(pumpBody);

    // Base de contacto de cobre puro
    const copperBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.7, 0.7),
      matCopper
    );
    copperBase.position.set(0.14, 0, 0);
    groupCooler.add(copperBase);

    // Pantalla OLED de la bomba (muestra Rafa.dev y telemetría en tiempo real)
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.textures.cpuScreen
    });
    const oledScreen = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 32),
      screenMat
    );
    oledScreen.rotation.y = -Math.PI / 2;
    oledScreen.position.set(-0.145, 0, 0);
    groupCooler.add(oledScreen);

    // Aro exterior RGB del bloque de refrigeración
    const pumpRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.37, 0.02, 16, 32),
      this.matRGB
    );
    pumpRing.rotation.y = -Math.PI / 2;
    pumpRing.position.set(-0.14, 0, 0);
    groupCooler.add(pumpRing);

    // Racores de salida para los tubos
    const fitting1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16),
      matSilver
    );
    fitting1.position.set(0, 0.32, 0.2);
    groupCooler.add(fitting1);

    const fitting2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16),
      matSilver
    );
    fitting2.position.set(0, 0.32, -0.2);
    groupCooler.add(fitting2);

    groupCooler.position.set(0.4, 1.15, -0.3);
    this.parts.cooler = groupCooler;
    this.pcRoot.add(groupCooler);

    // 3C. Radiador Superior 360mm con 3 ventiladores
    const groupRadiator = new THREE.Group();
    const radMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.2, 3.8),
      matMetalBrushed
    );
    groupRadiator.add(radMesh);

    // 3 Ventiladores RGB montados en el radiador
    for (let zOffset of [-1.1, 0, 1.1]) {
      const fanGroup = this.createFanMesh(0.46, true);
      fanGroup.position.set(0, -0.15, zOffset);
      fanGroup.rotation.x = Math.PI / 2;
      groupRadiator.add(fanGroup);
    }

    groupRadiator.position.set(0, 1.95, 0);
    this.parts.radiator = groupRadiator;
    this.pcRoot.add(groupRadiator);

    // 3D. Mangueras flexibles de agua (Curvas dinámicas)
    this.createCoolerTubes();

    // ========================================================================
    // 4. TARJETA GRÁFICA / GPU (parts.gpu - PROTAGONISTA EN FRONTEND)
    // ========================================================================
    const groupGPU = new THREE.Group();

    // Cuerpo principal de la GPU (Heatsink + Shroud aerodinámico)
    const gpuBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.7, 3.1),
      new THREE.MeshStandardMaterial({
        color: 0x1a202c,
        metalness: 0.85,
        roughness: 0.3
      })
    );
    groupGPU.add(gpuBody);

    // Backplate superior con gráficos grabados y textura de alta gama
    const gpuBackplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.04, 3.08),
      new THREE.MeshStandardMaterial({
        map: this.textures.gpu,
        metalness: 0.9,
        roughness: 0.25
      })
    );
    gpuBackplate.position.set(0, 0.36, 0);
    groupGPU.add(gpuBackplate);

    // Bloque denso de aletas de disipación de aluminio (Fins)
    const finsMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.45, 2.9),
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.95,
        roughness: 0.2
      })
    );
    finsMesh.position.set(0, 0.05, 0);
    groupGPU.add(finsMesh);

    // 3 Tubos caloductos de cobre puro que cruzan el disipador
    for (let xOff of [-0.25, 0, 0.25]) {
      const heatpipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.95, 12),
        matCopper
      );
      heatpipe.rotation.x = Math.PI / 2;
      heatpipe.position.set(xOff, 0.05, 0);
      groupGPU.add(heatpipe);
    }

    // 3 Ventiladores potentes con aspas aerodinámicas en la cara inferior
    for (let zFan of [-0.95, 0, 0.95]) {
      const gpuFan = this.createFanMesh(0.38, true);
      gpuFan.position.set(0, -0.36, zFan);
      gpuFan.rotation.x = -Math.PI / 2;
      groupGPU.add(gpuFan);
    }

    // Placa lateral con logo iluminado RGB ("RTX // STUDIO EDITION")
    const sideLogo = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.18, 1.8),
      this.matRGB
    );
    sideLogo.position.set(-0.43, 0.15, 0);
    groupGPU.add(sideLogo);

    // Bracket metálico posterior con puertos DisplayPort y HDMI
    const gpuBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1.2, 0.06),
      matSilver
    );
    gpuBracket.position.set(0, -0.1, -1.56);
    groupGPU.add(gpuBracket);

    // Conector de alimentación 12VHPWR con cables enfundados
    const pwrBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.25),
      matBlackPlastic
    );
    pwrBlock.position.set(-0.25, 0.38, 0.5);
    groupGPU.add(pwrBlock);

    // Posición predeterminada de la GPU en la ranura PCIe
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
      const zPos = 0.35 + i * 0.14;

      // Disipador de aluminio negro facetado
      const ramBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.9, 0.09),
        matMetalBrushed
      );
      stickGroup.add(ramBody);

      // Difusor RGB superior acrílico
      const ramDiffuser = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.12, 0.09),
        this.matRGB
      );
      ramDiffuser.position.set(0, 0.46, 0);
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
      new THREE.BoxGeometry(0.04, 0.12, 0.7),
      matBlackPlastic
    );
    groupSSD.add(ssdPCB);

    // Disipador de aluminio con estrías de refrigeración y etiqueta Gen5
    const ssdHeatsink = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 0.65),
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
    // 7. FUENTE DE PODER (PSU) Y CABLEADO MODULAR (parts.psu)
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
      new THREE.CircleGeometry(0.35, 24),
      matSilver
    );
    psuGrill.rotation.x = Math.PI / 2;
    psuGrill.position.set(0, -1.34, -0.9);
    groupPSU.add(psuGrill);

    // Cables mallados en peine (24 pines a placa base)
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, -1.3, 1.0),
      new THREE.Vector3(0.4, -0.5, 1.3),
      new THREE.Vector3(0.55, 0.4, 1.2)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.08, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, matBlackPlastic);
    groupPSU.add(cableMesh);

    this.parts.psu = groupPSU;
    this.pcRoot.add(groupPSU);

    // ========================================================================
    // 8. VENTILADORES DEL CHASIS (Frontales y Trasero con Halo RGB)
    // ========================================================================
    const groupCaseFans = new THREE.Group();

    // 3 Ventiladores Frontales de 120mm
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

  // Crea un ventilador con aspas giratorias y aro exterior RGB
  createFanMesh(radius, hasRGBRing) {
    const group = new THREE.Group();

    // Marco cuadrado / soporte
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f1420,
      roughness: 0.6
    });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 2.1, radius * 2.1, 0.1),
      frameMat
    );
    group.add(frame);

    // Aro de luz RGB Halo
    if (hasRGBRing) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.95, 0.03, 16, 32),
        this.matRGB
      );
      ring.position.set(0, 0, 0.05);
      group.add(ring);
    }

    // Motor / Eje central
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.32, radius * 0.32, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 })
    );
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    // Aspas del ventilador (Giran con la animación)
    const bladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(radius * 0.65, 0.14, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2
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
      blade.rotation.y = 0.45; // Ángulo de ataque de flujo de aire
      bladesGroup.add(blade);
    }

    group.add(bladesGroup);
    this.rotatingFans.push(bladesGroup);

    return group;
  }

  // Genera los tubos de refrigeración líquida con curvatura spline
  createCoolerTubes() {
    // Si ya existen, eliminarlos para recrear en despiece
    if (this.coolerHoseMesh) this.pcRoot.remove(this.coolerHoseMesh);
    if (this.coolerHoseMesh2) this.pcRoot.remove(this.coolerHoseMesh2);

    const matHose = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.5,
      metalness: 0.2
    });

    // Manguera 1: Bomba -> Radiador
    const p1 = new THREE.Vector3(0.4, 1.4, -0.1);
    const pMid1 = new THREE.Vector3(0.0, 1.7, 0.2);
    const pEnd1 = new THREE.Vector3(0.1, 1.9, 0.8);
    const curve1 = new THREE.CatmullRomCurve3([p1, pMid1, pEnd1]);
    const geo1 = new THREE.TubeGeometry(curve1, 24, 0.065, 12, false);
    this.coolerHoseMesh = new THREE.Mesh(geo1, matHose);
    this.pcRoot.add(this.coolerHoseMesh);

    // Manguera 2: Retorno Radiador -> Bomba
    const p2 = new THREE.Vector3(0.4, 1.4, -0.5);
    const pMid2 = new THREE.Vector3(-0.1, 1.6, -0.1);
    const pEnd2 = new THREE.Vector3(0.1, 1.9, 0.6);
    const curve2 = new THREE.CatmullRomCurve3([p2, pMid2, pEnd2]);
    const geo2 = new THREE.TubeGeometry(curve2, 24, 0.065, 12, false);
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
    // p oscila de 0.0 (PC 100% ensamblado) a 1.0 (Despiece completo)

    // Curvas suaves por componente
    // 1. Panel de cristal: Se abre y flota primero (p: 0.05 -> 0.35)
    const glassProgress = this.smoothStep(p, 0.04, 0.35);
    if (this.parts.glassPanel) {
      this.parts.glassPanel.position.x = -1.05 - glassProgress * 3.2;
      this.parts.glassPanel.position.z = glassProgress * 0.8;
      this.parts.glassPanel.rotation.y = -glassProgress * 0.35;
      this.parts.glassPanel.rotation.z = glassProgress * 0.15;
    }

    // 2. Paneles frontal y superior: Se separan en el segundo tramo (p: 0.12 -> 0.40)
    const exteriorProgress = this.smoothStep(p, 0.1, 0.4);
    if (this.parts.frontPanel) {
      this.parts.frontPanel.position.z = 2.15 + exteriorProgress * 3.0;
    }
    if (this.parts.topPanel) {
      this.parts.topPanel.position.y = 2.22 + exteriorProgress * 2.6;
    }

    // 3. TARJETA GRÁFICA / GPU: Se desacopla de la ranura PCIe y flota hacia adelante (p: 0.28 -> 0.55)
    const gpuProgress = this.smoothStep(p, 0.26, 0.58);
    if (this.parts.gpu) {
      this.parts.gpu.position.x = 0.1 - gpuProgress * 2.8;
      this.parts.gpu.position.y = 0.1 - gpuProgress * 0.2;
      this.parts.gpu.position.z = 0.2 + gpuProgress * 2.2;
      this.parts.gpu.rotation.x = gpuProgress * 0.25;
      this.parts.gpu.rotation.y = -gpuProgress * 0.6;
      this.parts.gpu.rotation.z = gpuProgress * 0.1;
    }

    // 4. CPU & REFRIGERACIÓN: La bomba se eleva del socket destapando el silicio (p: 0.45 -> 0.75)
    const cpuCoolerProgress = this.smoothStep(p, 0.42, 0.72);
    if (this.parts.cooler) {
      this.parts.cooler.position.x = 0.4 - cpuCoolerProgress * 2.4;
      this.parts.cooler.position.y = 1.15 + cpuCoolerProgress * 1.8;
      this.parts.cooler.rotation.z = cpuCoolerProgress * 0.4;
      this.parts.cooler.rotation.y = -cpuCoolerProgress * 0.5;
    }
    if (this.parts.radiator) {
      this.parts.radiator.position.y = 1.95 + cpuCoolerProgress * 2.2;
    }
    if (this.parts.cpu) {
      // El chip de la CPU se eleva sutilmente con brillo
      this.parts.cpu.position.x = 0.6 - this.smoothStep(p, 0.48, 0.75) * 0.8;
      this.cpuCoreLight.intensity = 1.5 + this.smoothStep(p, 0.5, 0.75) * 5.0;
    }

    // 5. MEMORIAS RAM: Se extraen hacia arriba y se abren en abanico (p: 0.62 -> 0.88)
    const ramProgress = this.smoothStep(p, 0.6, 0.85);
    if (this.ramSticks) {
      this.ramSticks.forEach((stick, idx) => {
        const stagger = idx * 0.15;
        stick.position.x = 0.55 - ramProgress * (1.2 + idx * 0.2);
        stick.position.y = 1.15 + ramProgress * (1.2 + stagger);
        stick.rotation.z = ramProgress * (0.2 + idx * 0.08);
      });
    }

    // 6. NVMe SSD: Se eleva de la placa base (p: 0.68 -> 0.90)
    const ssdProgress = this.smoothStep(p, 0.65, 0.88);
    if (this.parts.ssd) {
      this.parts.ssd.position.x = 0.58 - ssdProgress * 2.2;
      this.parts.ssd.position.y = -0.15 + ssdProgress * 0.6;
      this.parts.ssd.position.z = -0.2 + ssdProgress * 1.2;
      this.parts.ssd.rotation.y = ssdProgress * 0.4;
    }

    // 7. FUENTE DE PODER & TÚNEL PSU: Se separa hacia abajo/atrás (p: 0.80 -> 1.0)
    const psuProgress = this.smoothStep(p, 0.78, 0.98);
    if (this.parts.psu) {
      this.parts.psu.position.y = -psuProgress * 1.5;
      this.parts.psu.position.z = -psuProgress * 1.2;
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
      // 2. CHASIS / SOBRE MÍ: Cámara gira hacia la izquierda para ver el panel abierto
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

    // Aplicar influencia del ratón (Paralaje 3D sutil) o drag
    const mouseInfluence = 0.65;
    const finalCamPos = targetPos.clone();
    finalCamPos.x += (this.mouse.x + this.orbitOffset.x) * mouseInfluence;
    finalCamPos.y += (-this.mouse.y + this.orbitOffset.y) * mouseInfluence;

    // Suavizado de cámara mediante interpolación lineal (Lerp)
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
    // 1. Scroll listener en ventana con cálculo de progreso [0, 1]
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        this.targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 2. Movimiento del ratón para efecto de profundidad / paralaje
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

    // 3. Arrastre interactivo para inspeccionar el modelo 3D
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStart.x = e.clientX;
      this.dragStart.y = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // 4. Redimensionamiento adaptativo de pantalla
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  // --------------------------------------------------------------------------
  // CAMBIO DINÁMICO DE TEMA DE ILUMINACIÓN RGB
  // --------------------------------------------------------------------------
  setTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    this.currentThemeKey = themeKey;
    const theme = this.themes[themeKey];

    // Actualizar colores de materiales emisivos
    this.matRGB.color.setHex(theme.primary);
    this.matRGB.emissive.setHex(theme.primary);

    this.matRGBSecondary.color.setHex(theme.secondary);
    this.matRGBSecondary.emissive.setHex(theme.secondary);

    // Actualizar luces puntuales RGB
    if (this.rgbLightCPU) this.rgbLightCPU.color.setHex(theme.primary);
    if (this.rgbLightGPU) this.rgbLightGPU.color.setHex(theme.secondary);
    if (this.rgbLightFront) this.rgbLightFront.color.setHex(theme.primary);
    if (this.cpuCoreLight) this.cpuCoreLight.color.setHex(theme.primary);

    // Actualizar variables CSS en el DOM
    document.documentElement.style.setProperty('--accent', theme.accentHex);
    document.documentElement.style.setProperty('--primary', theme.primaryHex);
    document.documentElement.style.setProperty('--accent-gradient', theme.cssGradient);

    console.log(`🎨 Tema RGB cambiado a: ${theme.name}`);
  }

  // --------------------------------------------------------------------------
  // BUCLE PRINCIPAL DE RENDERIZADO (60/120 FPS FLUIDO)
  // --------------------------------------------------------------------------
  animate(timestamp = 0) {
    requestAnimationFrame((t) => this.animate(t));

    // Suavizado del progreso de scroll (Lerp fluido)
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.085;

    // Suavizado del ratón
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotación suave continua de ventiladores
    for (let fan of this.rotatingFans) {
      fan.rotation.z += 0.08;
    }

    // Parpadeo sutil del LED del SSD NVMe
    if (this.ssdLed) {
      this.ssdLed.visible = Math.sin(timestamp * 0.02) > -0.2;
    }

    // Rotación lenta de partículas
    if (this.particles) {
      this.particles.rotation.y = timestamp * 0.0001;
    }

    // Actualización de pantalla OLED de la CPU cada frame
    this.updateCPUScreenTexture(timestamp);

    // Actualizar despiece 3D e interpolación de cámara
    this.updateExplodedAssembly(this.scrollProgress);

    // Actualizar telemetría del HUD en el DOM
    this.updateHUDTelemetry(this.scrollProgress);

    this.renderer.render(this.scene, this.camera);
  }

  // Actualiza los indicadores del HUD en pantalla
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

// Inicialización global cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.pcViewer = new PC3DViewer();
});
