// 3D Barber Chair Implementation using Three.js
(function() {
    let scene, camera, renderer, chairGroup;

    window.initChair = function(container) {
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
        
        // Materiais
        const blackLeatherMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            roughness: 0.6,
            metalness: 0.1
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
        // Achata a altura do disco para ter 1.5 em vez de 1.6 (o Y local é a grossura (0.2), Z local (1.6 de diâmetro) vira o Y vertical após rotação)
        backMesh.scale.set(1.0, 1.0, 1.5 / 1.6); 
        backGroup.add(backMesh);
        chairGroup.add(backGroup);

        // Detalhes do encosto: botões (Capitonê)
        const btnGeo = new THREE.SphereGeometry(0.04, 16, 16);
        for(let j = -0.4; j <= 0.4; j += 0.4) {
            const steps = (Math.abs(j) < 0.1) ? [-0.4, 0, 0.4] : [-0.2, 0.2];
            steps.forEach(i => {
                const btn = new THREE.Mesh(btnGeo, chromeMat);
                // i = X local, 0.1 = superfície em Y (grossura), -j = compensa rotação X
                btn.position.set(i, 0.1, -j / (1.5 / 1.6)); 
                btn.scale.set(1.0, 2.0, 1.0 / (1.5 / 1.6)); // Restaurar forma esférica visual
                backMesh.add(btn);
            });
        }

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
        
        const armL = new THREE.Mesh(armGeo, blackLeatherMat);
        armL.rotation.x = Math.PI / 2; // Alinha com o eixo Z
        armL.position.set(-0.9, 0.2, -0.1);
        armL.scale.set(1.0, 1.0, 0.5); // Achatado na altura
        const armLCap1 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armLCap1.position.y = 0.5;
        armL.add(armLCap1);
        const armLCap2 = new THREE.Mesh(armCapGeo, blackLeatherMat);
        armLCap2.position.y = -0.5;
        armL.add(armLCap2);
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
        chairGroup.add(armR);

        // Suportes dos Braços
        const armSupportGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
        
        const supportL1 = new THREE.Mesh(armSupportGeo, goldMat);
        supportL1.position.set(-0.9, -0.1, 0.2);
        chairGroup.add(supportL1);
        
        const supportL2 = new THREE.Mesh(armSupportGeo, goldMat);
        supportL2.position.set(-0.9, -0.1, -0.4);
        chairGroup.add(supportL2);

        const supportR1 = new THREE.Mesh(armSupportGeo, goldMat);
        supportR1.position.set(0.9, -0.1, 0.2);
        chairGroup.add(supportR1);
        
        const supportR2 = new THREE.Mesh(armSupportGeo, goldMat);
        supportR2.position.set(0.9, -0.1, -0.4);
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
        for(let i = -0.05; i <= 0.05; i += 0.05) {
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
        const animate = function() {
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

    window.updateScroll = function(progress) {
        if (!chairGroup) return;
        
        // Progresso vai de 0 a 1 conforme o usuário dá scroll
        // Rotaciona a cadeira em torno do eixo Y
        chairGroup.rotation.y = -Math.PI / 4 + (progress * Math.PI * 1.5);
        
        // Efeito de Parallax: Mover a cadeira levemente para baixo
        chairGroup.position.y = -(progress * 2);
        
        // Zoom-in (Aproximação) conforme scroll
        if (camera) {
            camera.position.z = 8 - (progress * 4.5); // Aproxima a câmera da cadeira
        }
    };

})();
