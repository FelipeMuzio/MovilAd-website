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

document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]')) closeThankyouModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeThankyouModal();
});

document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn ? submitBtn.textContent : null;

    if (submitBtn) {
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });

        if (response.ok) {
            let data = null;
            try { data = await response.json(); } catch { }
            console.info('Form enviado OK:', response.status, data);
            form.reset();
            openThankyouModal();
            return;
        }

        const text = await response.text().catch(() => '(sin cuerpo)');
        console.warn('Respuesta no OK del servidor:', response.status, text);

        if ([301, 302, 303, 307, 308].includes(response.status)) {
            form.reset();
            openThankyouModal();
            return;
        }

        alert('Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } catch (err) {
        console.error('Fallo de red o bloqueo del navegador:', err?.name, err?.message);

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

document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});