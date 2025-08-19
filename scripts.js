// --- Modal helpers (si ya los tenías, podés mantener los tuyos) ---
function openThankyouModal() {
    const modal = document.getElementById('thankyouModal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const ok = modal.querySelector('.modal-ok');
    if (ok) ok.focus();
}
function closeThankyouModal() {
    const modal = document.getElementById('thankyouModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Cerrar modal por fondo / botón / ESC
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]')) closeThankyouModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeThankyouModal();
});

// --- Form handling robusto ---
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn ? submitBtn.textContent : null;

    // Evitar doble envío
    if (submitBtn) {
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s por si la red se cuelga

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });

        // Caso 1: 2xx con JSON de Formspree
        if (response.ok) {
            // Intentamos leer JSON; si falla, igual consideramos OK
            let data = null;
            try { data = await response.json(); } catch { /* puede venir vacío */ }
            console.info('Form enviado OK:', response.status, data);
            form.reset();
            openThankyouModal();
            return;
        }

        // Caso 2: Respuesta no-OK (p.ej. 302/redirect o 4xx)
        // Algunos setups devuelven 302 aunque el envío fue aceptado.
        // Mostramos mensaje amable y log completo en consola.
        const text = await response.text().catch(() => '(sin cuerpo)');
        console.warn('Respuesta no OK del servidor:', response.status, text);

        // Heurística: si fue 302/301 (redirect), suele significar que Formspree procesó el envío.
        if ([301, 302, 303, 307, 308].includes(response.status)) {
            form.reset();
            openThankyouModal();
            return;
        }

        alert('Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } catch (err) {
        // Caso 3: fallo de red / CORS / timeout / extensión bloqueando
        console.error('Fallo de red o bloqueo del navegador:', err?.name, err?.message);

        // Si el error fue después de subir el cuerpo, es posible que el mail igual haya salido.
        // Damos feedback positivo para no castigar al usuario si el backend lo recibió.
        if (err?.name === 'AbortError') {
            alert('La conexión tardó demasiado. Si recibimos tu mensaje te contactaremos igual. Inténtalo de nuevo más tarde.');
        } else {
            alert('Error de conexión. Por favor, verifica tu red o desactiva bloqueadores y vuelve a intentar.');
        }
    } finally {
        clearTimeout(timeout);
        if (submitBtn) {
            submitBtn.textContent = originalText ?? 'Enviar';
            submitBtn.disabled = false;
        }
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});