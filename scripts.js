// Form handling (con diagnóstico)
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = this;
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  try {
    // Tomamos datos y los mandamos como JSON
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' // clave para JSON
      },
      body: JSON.stringify(payload)
    });

    // Intentamos leer el cuerpo (texto) para log y/o parseo
    const text = await response.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) {}

    console.log('Status:', response.status);
    console.log('Raw response:', text);

    if (response.ok) {
      alert('¡Gracias por contactarnos! Te responderemos pronto.');
      form.reset();
    } else {
      // Formspree suele devolver { errors: [{ message: '...' }]}
      const msg = data?.errors?.map(e => e.message).join(' | ')
                || data?.message
                || 'Ocurrió un error al enviar el mensaje.';
      alert(`${msg}\n(Status: ${response.status})`);
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión. Por favor, verifica tu conexión a Internet.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
\

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