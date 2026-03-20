// 3D Barber Chair Implementation using Three.js
(function () {
    let scene, camera, renderer, chairGroup;

    window.initChair = function (container) {
        // Obter dimensões do container
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Cena
        scene = new THREE.Scene();

        // Câmera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 2, 8);
        camera.lookAt(0, 0, 0);

        // Renderizador
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Luzes
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1.2);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffd700, 0.8); // Luz dourada
        pointLight2.position.set(-5, 5, -5);
        scene.add(pointLight2);

        // Criar Cadeira
        chairGroup = new THREE.Group();

        // Textura processual para simular couro (Bump Map)
        const leatherCanvas = document.createElement('canvas');
        leatherCanvas.width = 512;
        leatherCanvas.height = 512;
        const ctx = leatherCanvas.getContext('2d');
        ctx.fillStyle = '#808080'; // cinza neutro base
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 60000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#999999' : '#666666';
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
        const leatherTex = new THREE.CanvasTexture(leatherCanvas);
        leatherTex.wrapS = THREE.RepeatWrapping;
        leatherTex.wrapT = THREE.RepeatWrapping;
        leatherTex.repeat.set(4, 4);

        // Materiais
        const blackLeatherMat = new THREE.MeshStandardMaterial({
            color: 0xf8f8f8, // off white
            roughness: 0.8,
            metalness: 0.1,
            bumpMap: leatherTex,
            bumpScale: 0.005
        });

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.3,
            metalness: 0.8
        });

        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.2,
            metalness: 0.9
        });

        // Detalhes comuns de estofado (costuras e botões)
        const creaseMat = new THREE.MeshStandardMaterial({
            color: 0x080808,
            roughness: 0.9,
            metalness: 0.0
        });
        const btnGeo = new THREE.SphereGeometry(0.03, 16, 16);

        // Base (Cilindro com detalhe de borda)
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 64);
        const baseMesh = new THREE.Mesh(baseGeo, goldMat);
        baseMesh.position.y = -1.5;

        const baseRim = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
        const baseRimMesh = new THREE.Mesh(baseRim, goldMat);
        baseRimMesh.rotation.x = Math.PI / 2;
        baseRimMesh.position.y = 0.05;
        baseMesh.add(baseRimMesh);

        const baseInner = new THREE.CylinderGeometry(1.0, 1.1, 0.15, 64);
        const baseInnerMesh = new THREE.Mesh(baseInner, chromeMat);
        baseInnerMesh.position.y = 0.1;
        baseMesh.add(baseInnerMesh);

        chairGroup.add(baseMesh);

        // Eixo Hidráulico
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 32);
        const poleMesh = new THREE.Mesh(poleGeo, chromeMat);
        poleMesh.position.y = -0.9;
        chairGroup.add(poleMesh);

        // Assento (Cilindro com borda arredondada)
        const seatGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 64);
        const seatMesh = new THREE.Mesh(seatGeo, blackLeatherMat);
        seatMesh.position.y = -0.25;

        const seatRimGeo = new THREE.TorusGeometry(1.0, 0.05, 16, 64);
        const seatRimTop = new THREE.Mesh(seatRimGeo, blackLeatherMat);
        seatRimTop.rotation.x = Math.PI / 2;
        seatRimTop.position.y = 0.1;
        seatMesh.add(seatRimTop);

        const seatRimBottom = new THREE.Mesh(seatRimGeo, blackLeatherMat);
        seatRimBottom.rotation.x = Math.PI / 2;
        seatRimBottom.position.y = -0.1;
        seatMesh.add(seatRimBottom);

        // Cúpula superior para simular estofado volumoso no assento
        const seatCushionGeo = new THREE.SphereGeometry(1.0, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const seatCushionTop = new THREE.Mesh(seatCushionGeo, blackLeatherMat);
        seatCushionTop.position.y = 0.1; // Senta na face superior do cilindro (Y local)
        seatCushionTop.scale.set(1.0, 0.15, 1.0); // Dá um volume inflado (0.15 de altura no topo)
        seatMesh.add(seatCushionTop);

        // -- Capitonê do Assento --
        function getSeatCushionElevation(x, z) {
            const radSq = 1.0 - (x * x) - (z * z); // Raio 1.0
            return radSq > 0 ? 0.15 * Math.sqrt(radSq) : 0;
        }

        const seatButtons = [];
        for (let i = -4; i <= 4; i++) {
            for (let k = -4; k <= 4; k++) {
                if (Math.abs(i % 2) === Math.abs(k % 2)) {
                    const x = i * 0.2;
                    const z = k * 0.2;
                    if (Math.sqrt(x * x + z * z) < 0.85) { // Evita a borda curva onde afunda muito
                        seatButtons.push({ x: x, z: z });
                    }
                }
            }
        }

        for (let i = 0; i < seatButtons.length; i++) {
            for (let k = i + 1; k < seatButtons.length; k++) {
                const b1 = seatButtons[i];
                const b2 = seatButtons[k];
                const dx = b2.x - b1.x;
                const dz = b2.z - b1.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist > 0.1 && dist < 0.32) {
                    const midX = (b1.x + b2.x) / 2;
                    const midZ = (b1.z + b2.z) / 2;
                    const surfaceY = 0.1 + getSeatCushionElevation(midX, midZ);

                    const seamLine = new THREE.BoxGeometry(dist, 0.005, 0.005);
                    const seamMesh = new THREE.Mesh(seamLine, creaseMat);
                    seamMesh.position.set(midX, surfaceY - 0.003, midZ);
                    seamMesh.rotation.y = -Math.atan2(dz, dx);
                    seatMesh.add(seamMesh);
                }
            }
        }

        seatButtons.forEach(btnInfo => {
            const surfaceY = 0.1 + getSeatCushionElevation(btnInfo.x, btnInfo.z);
            const btn = new THREE.Mesh(btnGeo, chromeMat);
            btn.position.set(btnInfo.x, surfaceY + 0.002, btnInfo.z);
            btn.scale.set(1.0, 0.2, 1.0); // O assento não é achatado no scale do grupo, então apenas Y é 0.2
            seatMesh.add(btn);
        });
        // -- Fim do Capitonê no Assento --

        chairGroup.add(seatMesh);

        // Encosto (Disco com bordas arredondadas tipo almofada)
        const backGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 64);
        const backMesh = new THREE.Mesh(backGeo, blackLeatherMat);

        const backRimGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 64);
        const backRimTop = new THREE.Mesh(backRimGeo, blackLeatherMat);
        backRimTop.position.y = 0.1;
        backRimTop.rotation.x = Math.PI / 2;
        backMesh.add(backRimTop);

        const backRimBottom = new THREE.Mesh(backRimGeo, blackLeatherMat);
        backRimBottom.position.y = -0.1;
        backRimBottom.rotation.x = Math.PI / 2;
        backMesh.add(backRimBottom);

        const backGroup = new THREE.Group();
        backGroup.position.set(0, 0.6, -0.85);
        backGroup.rotation.x = -0.1;

        // Aponta a face circular para frente/trás (rotacionando X em 90 graus)
        backMesh.rotation.x = Math.PI / 2;
        // Achata a altura do disco para ter 1.5 em vez de 1.6
        backMesh.scale.set(1.0, 1.0, 1.5 / 1.6);

        // Adiciona almofadas em cúpula na frente e atrás para simular profundidade e enchimento
        const backCushionGeo = new THREE.SphereGeometry(0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);

        const frontCushion = new THREE.Mesh(backCushionGeo, blackLeatherMat);
        frontCushion.position.y = 0.1; // Fica na face frontal (+Y no espaço do disco)
        frontCushion.scale.set(1.0, 0.15, 1.0); // Achata para formar uma almofada redonda
        backMesh.add(frontCushion);

        const backCushion = new THREE.Mesh(backCushionGeo, blackLeatherMat);
        backCushion.rotation.x = Math.PI; // Inverte para apontar para a face traseira
        backCushion.position.y = -0.1;
        backCushion.scale.set(1.0, 0.15, 1.0);
        backMesh.add(backCushion);

        backGroup.add(backMesh);
        chairGroup.add(backGroup);

        // Detalhes do encosto: botões (Capitonê) e costuras
        const buttons = [];
        const rowData = [
            { j: -0.6, xs: [-0.2, 0.2] },
            { j: -0.4, xs: [-0.4, 0, 0.4] },
            { j: -0.2, xs: [-0.6, -0.2, 0.2, 0.6] },
            { j: 0.0, xs: [-0.4, 0, 0.4] },
            { j: 0.2, xs: [-0.6, -0.2, 0.2, 0.6] },
            { j: 0.4, xs: [-0.4, 0, 0.4] },
            { j: 0.6, xs: [-0.2, 0.2] }
        ];

        rowData.forEach(row => {
            row.xs.forEach(x => {
                buttons.push({ x: x, z: -row.j / (1.5 / 1.6) });
            });
        });

        // Função auxiliar para calcular a altura da curva estofada num dado ponto (X, Z) local da placa
        function getCushionElevation(x, z) {
            const radSq = 0.64 - (x * x) - (z * z); // Raio 0.8
            return radSq > 0 ? 0.15 * Math.sqrt(radSq) : 0;
        }

        // Adicionar costuras e botões (Aplicado tanto na frente: side=1, quanto atrás: side=-1)
        [1, -1].forEach(side => {
            // Adicionar costuras (seguindo o volume curvo)
            for (let i = 0; i < buttons.length; i++) {
                for (let k = i + 1; k < buttons.length; k++) {
                    const b1 = buttons[i];
                    const b2 = buttons[k];
                    const dx = b2.x - b1.x;
                    const dz = b2.z - b1.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);

                    if (dist > 0.1 && dist < 0.32) { // Distância da malha ligando losangos
                        const midX = (b1.x + b2.x) / 2;
                        const midZ = (b1.z + b2.z) / 2;
                        // Traz para a superfície da almofada curva, levemente afundada para dentro (-0.003)
                        const surfaceY = (0.1 + getCushionElevation(midX, midZ)) * side;

                        const seamLine = new THREE.BoxGeometry(dist, 0.005, 0.005);
                        const seamMesh = new THREE.Mesh(seamLine, creaseMat);
                        seamMesh.position.set(midX, surfaceY - (0.003 * side), midZ);
                        seamMesh.rotation.y = -Math.atan2(dz, dx);

                        backMesh.add(seamMesh);
                    }
                }
            }

            // Adicionar os botões achatados ao volume
            buttons.forEach(btnInfo => {
                const surfaceY = (0.1 + getCushionElevation(btnInfo.x, btnInfo.z)) * side;
                const btn = new THREE.Mesh(btnGeo, chromeMat);
                btn.position.set(btnInfo.x, surfaceY + (0.002 * side), btnInfo.z);
                // Achatando no eixo Y
                btn.scale.set(1.0, 0.2, 1.0 / (1.5 / 1.6));
                backMesh.add(btn);
            });
        });

        // Apoio de Cabeça (Cilindro com esferas nas pontas)
        const headrestGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        const headrestMesh = new THREE.Mesh(headrestGeo, blackLeatherMat);
        headrestMesh.rotation.z = Math.PI / 2;
        headrestMesh.position.set(0, 1.5, -0.95);
        headrestMesh.scale.set(1.0, 1.0, 0.6); // Para achatar levemente

        const headrestCapGeo = new THREE.SphereGeometry(0.25, 32, 16);
        const hrCap1 = new THREE.Mesh(headrestCapGeo, blackLeatherMat);
        hrCap1.position.y = 0.15;
        headrestMesh.add(hrCap1);
        const hrCap2 = new THREE.Mesh(headrestCapGeo, blackLeatherMat);
        hrCap2.position.y = -0.15;
        headrestMesh.add(hrCap2);

        // Detalhe de costura
        const seamGeo = new THREE.TorusGeometry(0.25, 0.015, 16, 64);
        const seamMesh1 = new THREE.Mesh(seamGeo, chromeMat);
        seamMesh1.position.y = 0.15;
        seamMesh1.rotation.x = Math.PI / 2;
        headrestMesh.add(seamMesh1);

        const seamMesh2 = new THREE.Mesh(seamGeo, chromeMat);
        seamMesh2.position.y = -0.15;
        seamMesh2.rotation.x = Math.PI / 2;
        headrestMesh.add(seamMesh2);

        chairGroup.add(headrestMesh);

        // Hastes do apoio de cabeça
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
        const rod1 = new THREE.Mesh(rodGeo, chromeMat);
        rod1.position.set(-0.2, 1.25, -0.9);
        chairGroup.add(rod1);

        const rod2 = new THREE.Mesh(rodGeo, chromeMat);
        rod2.position.set(0.2, 1.25, -0.9);
        chairGroup.add(rod2);

        // Braços (Cilindros achatados com esferas nas pontas)
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 32);
        const armCapGeo = new THREE.SphereGeometry(0.1, 32, 16);

        // Função para desenhar a costura de matelassê/capitonê no topo do braço
        function addArmrestSeams(armMesh) {
            const lineGeo = new THREE.BoxGeometry(0.25, 0.005, 0.005); // Menor para caber na largura
            // Adicional de costuras retas laterais (bordas)
            const edgeSeamGeo = new THREE.BoxGeometry(0.005, 1.0, 0.005);
            const edgeSeamL = new THREE.Mesh(edgeSeamGeo, creaseMat);
            edgeSeamL.position.set(-0.06, 0, 0.098);
            armMesh.add(edgeSeamL);
            const edgeSeamR = new THREE.Mesh(edgeSeamGeo, creaseMat);
            edgeSeamR.position.set(0.06, 0, 0.098);
            armMesh.add(edgeSeamR);

            // Costuras cruzadas no centro imitando couro costurado em losangos
            for (let y = -0.4; y <= 0.41; y += 0.2) {
                const seam1 = new THREE.Mesh(lineGeo, creaseMat);
                seam1.position.set(0, y, 0.098); // Local Z vira topo Y na tela (Z=0.1)
                seam1.rotation.z = Math.PI / 4;
                armMesh.add(seam1);

                const seam2 = new THREE.Mesh(lineGeo, creaseMat);
                seam2.position.set(0, y, 0.098);
                seam2.rotation.z = -Math.PI / 4;
                armMesh.add(seam2);
            }
        }

        const armL = new THREE.Mesh(armGeo, blackLeatherMat);
        armL.rotation.x = Math.PI / 2; // Alinha com o eixo Z
        armL.position.set(-0.9, 0.2, -0.1);
        armL.scale.set(1.0, 1.0, 0.5); // Achatado na altura e em formato de pad
        const armLCap1 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armLCap1.position.y = 0.5;
        armL.add(armLCap1);
        const armLCap2 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armLCap2.position.y = -0.5;
        armL.add(armLCap2);
        addArmrestSeams(armL);
        chairGroup.add(armL);

        const armR = new THREE.Mesh(armGeo, blackLeatherMat);
        armR.rotation.x = Math.PI / 2;
        armR.position.set(0.9, 0.2, -0.1);
        armR.scale.set(1.0, 1.0, 0.5);
        const armRCap1 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armRCap1.position.y = 0.5;
        armR.add(armRCap1);
        const armRCap2 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armRCap2.position.y = -0.5;
        armR.add(armRCap2);
        addArmrestSeams(armR);
        chairGroup.add(armR);

        // Suportes dos Braços (Estrutura Usinada Dinâmica que respeita a superfície do banco)
        const supportRingGeo = new THREE.TorusGeometry(0.04, 0.015, 16, 32);
        const baseFlangeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 32);

        function createMachinedSupport(x, z) {
            const group = new THREE.Group();

            // Calculando a altura perfeita baseada na curvatura do assento
            const topY = 0.15; // Altura onde encaixa no braço
            const radSq = 1.0 - (x * x) - (z * z); // O assento tem raio 1.0
            const elevation = radSq > 0 ? 0.15 * Math.sqrt(radSq) : 0;
            // O assento de base fica em Y global -0.25, e o topo do cilindro é local +0.1, então a base do estofamento é -0.15 global
            const bottomY = -0.15 + elevation - 0.01; // O -0.01 é para que a flange afunde levemente no couro, em vez de pairar

            const height = topY - bottomY;
            const centerY = (topY + bottomY) / 2;

            group.position.set(x, centerY, z);

            const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, height, 16);
            const pole = new THREE.Mesh(poleGeo, goldMat);
            group.add(pole);

            // Anel superior cromado
            const ringTop = new THREE.Mesh(supportRingGeo, chromeMat);
            ringTop.rotation.x = Math.PI / 2;
            ringTop.position.y = height / 2 - 0.03;
            group.add(ringTop);

            // Flange robusta limitadora (finaliza no banco)
            const baseFlange = new THREE.Mesh(baseFlangeGeo, goldMat);
            baseFlange.position.y = -height / 2 + 0.01;
            group.add(baseFlange);

            return group;
        }

        const supportL1 = createMachinedSupport(-0.9, 0.2);
        chairGroup.add(supportL1);

        const supportL2 = createMachinedSupport(-0.9, -0.4);
        chairGroup.add(supportL2);

        const supportR1 = createMachinedSupport(0.9, 0.2);
        chairGroup.add(supportR1);

        const supportR2 = createMachinedSupport(0.9, -0.4);
        chairGroup.add(supportR2);

        // Apoio de Pés (mantendo o posicionamento, com hastes e bordas arredondadas)
        const footrestGroup = new THREE.Group();
        footrestGroup.position.set(0, -1.0, 0.8);
        footrestGroup.rotation.x = 0.2;

        // Borda principal tipo almofada
        const footPadCylGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.04, 16);
        const footPadCapGeo = new THREE.SphereGeometry(0.08, 16, 16);

        const pad1 = new THREE.Mesh(footPadCylGeo, blackLeatherMat);
        pad1.rotation.z = Math.PI / 2; // Alinha com X
        pad1.position.set(0, 0, 0.15); // Frente
        pad1.scale.set(0.7, 1.0, 1.0); // Achata no Y local (Y global devido à rotação)
        const pad1Cap1 = new THREE.Mesh(footPadCapGeo, blackLeatherMat);
        pad1Cap1.position.y = 0.52;
        pad1.add(pad1Cap1);
        const pad1Cap2 = new THREE.Mesh(footPadCapGeo, blackLeatherMat);
        pad1Cap2.position.y = -0.52;
        pad1.add(pad1Cap2);
        footrestGroup.add(pad1);

        const pad2 = new THREE.Mesh(footPadCylGeo, blackLeatherMat);
        pad2.rotation.z = Math.PI / 2;
        pad2.position.set(0, 0, -0.15); // Trás
        pad2.scale.set(0.7, 1.0, 1.0);
        const pad2Cap1 = new THREE.Mesh(footPadCapGeo, blackLeatherMat);
        pad2Cap1.position.y = 0.52;
        pad2.add(pad2Cap1);
        const pad2Cap2 = new THREE.Mesh(footPadCapGeo, blackLeatherMat);
        pad2Cap2.position.y = -0.52;
        pad2.add(pad2Cap2);
        footrestGroup.add(pad2);

        // Tubos visíveis (estilo grade)
        const gridBarGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.1, 16);
        for (let i = -0.05; i <= 0.05; i += 0.05) {
            const grade = new THREE.Mesh(gridBarGeo, chromeMat);
            grade.rotation.z = Math.PI / 2;
            grade.position.set(0, 0, i);
            footrestGroup.add(grade);
        }

        chairGroup.add(footrestGroup);

        // Hastes do apoio de pés
        const footRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);

        const footRodL = new THREE.Mesh(footRodGeo, goldMat);
        footRodL.position.set(-0.5, -0.6, 0.4);
        footRodL.rotation.x = -0.5;
        chairGroup.add(footRodL);

        const footRodR = new THREE.Mesh(footRodGeo, goldMat);
        footRodR.position.set(0.5, -0.6, 0.4);
        footRodR.rotation.x = -0.5;
        chairGroup.add(footRodR);

        // Ajuste inicial de rotação da cadeira inteira para visualização em 3/4
        chairGroup.rotation.y = -Math.PI / 4;

        scene.add(chairGroup);

        // Animação Loop
        const animate = function () {
            requestAnimationFrame(animate);
            // Auto-rotação sutil
            chairGroup.rotation.y += 0.002;
            renderer.render(scene, camera);
        };

        animate();

        // Lidando com Resize
        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        });
    };

    let lastProgress = 0;

    window.updateScroll = function (progress) {
        if (!chairGroup) return;

        const deltaProgress = progress - lastProgress;
        lastProgress = progress;

        // Soma a aceleração do scroll na rotação atual da cadeira independentemente de on/de ela está
        chairGroup.rotation.y += (deltaProgress * Math.PI * 1.5);

        // A cadeira ficará na mesma altura para que o zoom aproxime melhor
        chairGroup.position.y = 0;

        // Zoom-in (Aproximação) infinito conforme scroll, para "atravessar" a cadeira
        if (camera) {
            camera.position.z = 8 - (progress * 12); // Posição de Z termina em -4 (atrás e além da cadeira)
        }
    };

})();
