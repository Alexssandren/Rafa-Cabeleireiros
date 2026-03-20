document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile Responsivo
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Animações de Scroll com Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // Animação de Digitação no Título Hero
    const titleEl = document.getElementById('typing-title');
    if (titleEl) {
        const text = titleEl.innerText;
        titleEl.innerText = '';
        titleEl.classList.add('typing-active');
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                titleEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Aguarda a aba .fade-up subir (aprox 800ms) antes de começar
        setTimeout(typeWriter, 800);
    }

    // Inicializar Three.js Barber Chair 3D
    var chairContainer = document.getElementById('chair-container');
    if (chairContainer && typeof window.initChair === 'function') {
        window.initChair(chairContainer);

        // Sincronizar rotação e câmera com o scroll
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    var progress = Math.min(window.scrollY / (window.innerHeight * 1.5), 1);
                    if (typeof window.updateScroll === 'function') window.updateScroll(progress);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Instanciando Flatpickr para Data (Calendário) e Horário (Relógio)
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#data", {
            locale: "pt",
            dateFormat: "d/m/Y",
            minDate: "today",
            disableMobile: true 
        });
        // O horário agora usa o nosso modal customizado
    }

    // Modal Customizado do Horário (Spinner/Roleta)
    const timeInput = document.getElementById('horario');
    const timeModal = document.getElementById('time-picker-modal');
    const btnConfirmTime = document.getElementById('time-confirm-btn');
    const wheelHours = document.getElementById('wheel-hours');
    const wheelMinutes = document.getElementById('wheel-minutes');

    if (timeInput && timeModal) {
        timeInput.addEventListener('click', () => {
            timeModal.classList.remove('hidden');
        });

        // Atualizar cor do item centrado baseando-se no scroll
        function updateHighlight(wheel) {
            const itemHeight = 50;
            const centerIndex = Math.round(wheel.scrollTop / itemHeight) + 1; // +1 pelo padding (li vazia inicial)
            const items = wheel.querySelectorAll('li');
            items.forEach((item, index) => {
                if (index === centerIndex) {
                    item.style.color = "var(--gold)";
                    item.style.fontSize = "1.8rem";
                } else {
                    item.style.color = "var(--text-muted)";
                    item.style.fontSize = "1.5rem";
                }
            });
        }

        wheelHours.addEventListener('scroll', () => updateHighlight(wheelHours));
        wheelMinutes.addEventListener('scroll', () => updateHighlight(wheelMinutes));
        
        // Correção do "pulo duplo" da rodinha do mouse no desktop
        function handleWheel(e) {
            e.preventDefault();
            const wheel = e.currentTarget;
            wheel.scrollBy({ top: Math.sign(e.deltaY) * 50, behavior: 'smooth' });
        }
        wheelHours.addEventListener('wheel', handleWheel, { passive: false });
        wheelMinutes.addEventListener('wheel', handleWheel, { passive: false });
        
        // Setup inicial
        setTimeout(() => {
            updateHighlight(wheelHours);
            updateHighlight(wheelMinutes);
        }, 100);

        btnConfirmTime.addEventListener('click', () => {
            const itemHeight = 50;
            const hIndex = Math.round(wheelHours.scrollTop / itemHeight) + 1;
            const mIndex = Math.round(wheelMinutes.scrollTop / itemHeight) + 1;
            
            const hVal = wheelHours.querySelectorAll('li')[hIndex].innerText;
            const mVal = wheelMinutes.querySelectorAll('li')[mIndex].innerText;
            
            if (hVal && mVal) {
                timeInput.value = `${hVal}:${mVal}`;
            }
            timeModal.classList.add('hidden');
        });

        timeModal.addEventListener('click', (e) => {
            if (e.target === timeModal) timeModal.classList.add('hidden');
        });
    }

    // Formulário de Agendamento (WhatsApp Link Builder)
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            const servico = document.getElementById('servico').value;
            const data = document.getElementById('data').value;
            const horario = document.getElementById('horario').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // O Flatpickr já nos entrega a data em DD/MM/YYYY
            let textoWhatsApp = `Olá Rafa! Gostaria de agendar um horário.\n\n`;
            textoWhatsApp += `*Nome:* ${nome}\n`;
            textoWhatsApp += `*Telefone:* ${telefone}\n`;
            textoWhatsApp += `*Serviço:* ${servico}\n`;
            textoWhatsApp += `*Data:* ${data}\n`;
            textoWhatsApp += `*Horário:* ${horario}`;
            
            if (mensagem.trim() !== "") {
                textoWhatsApp += `\n\n*Mensagem adicionais:* ${mensagem}`;
            }
            
            const numeroWhatsApp = "554896113877"; 
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
            
            // Redirecionando e limpando o formulário em seguida
            window.open(url, '_blank');
            scheduleForm.reset();
        });
    }
});
