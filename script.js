// =============================================================================
// MOVILAD - JAVASCRIPT DESDE CERO
// =============================================================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('MovilAd - Inicializando aplicación...');
    
    // Inicializar todas las funcionalidades
    initModal();
    initForm();
    initSmoothScroll();
    initAnimations();
});

// =============================================================================
// MODAL DE AGRADECIMIENTO
// =============================================================================

function initModal() {
    const modal = document.getElementById('thankyouModal');
    if (!modal) return;

    // Cerrar modal con botones
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-close-modal]')) {
            closeModal();
        }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal() {
    const modal = document.getElementById('thankyouModal');
    if (!modal) return;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Enfocar el botón OK
    const okButton = modal.querySelector('.modal-ok');
    if (okButton) {
        setTimeout(() => okButton.focus(), 100);
    }
    
    console.log('Modal abierto');
}

function closeModal() {
    const modal = document.getElementById('thankyouModal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    console.log('Modal cerrado');
}

// =============================================================================
// FORMULARIO DE CONTACTO
// =============================================================================

function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real: nombre
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.addEventListener('input', validateNameInput);
        nameInput.addEventListener('blur', validateNameInput);
    }

    // Validación en tiempo real: teléfono
    const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[name="telefono"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', validatePhoneInput);
        phoneInput.addEventListener('blur', validatePhoneInput);
    }

    // =========================
    // NUEVO: Validación email
    // =========================
    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.addEventListener('input', validateEmailInput);
        emailInput.addEventListener('blur', validateEmailInput);
    }

    console.log('Formulario inicializado');
}

// Función para validar el input de nombre en tiempo real
function validateNameInput(e) {
    const nameInput = e.target;
    const name = nameInput.value.trim();
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/; // Permitir vacío también
    
    if (name === '') {
        nameInput.setCustomValidity(''); // HTML5 maneja required si corresponde
    } else if (!nameRegex.test(name)) {
        nameInput.setCustomValidity('El nombre no puede contener números ni caracteres especiales.');
    } else {
        nameInput.setCustomValidity('');
    }
}

// Función para validar el input de teléfono en tiempo real
function validatePhoneInput(e) {
    const phoneInput = e.target;
    const phone = phoneInput.value.trim();
    const phoneRegex = /^[0-9+\s]*$/; // Solo números, el signo + y espacios
    
    if (phone === '') {
        phoneInput.setCustomValidity('');
    } else if (!phoneRegex.test(phone)) {
        phoneInput.setCustomValidity('El teléfono solo puede contener números y el signo +');
    } else {
        phoneInput.setCustomValidity('');
    }
}

// =========================
// NUEVO: Validación email
// =========================
function validateEmailInput(e) {
    const input = e.target;
    const v = input.value.trim();
    // Requiere: algo@algo.algo (TLD >= 2)
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

    if (v === '' || re.test(v)) {
        input.setCustomValidity('');
    } else {
        input.setCustomValidity('Ingresa un email válido (usuario@dominio.com).');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Enviando formulario...');

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;

    // Validar formulario
    if (!validateForm(form)) {
        return;
    }

    // Cambiar estado del botón
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Preparar datos
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Configurar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        // Enviar formulario (mantengo tu envío JSON tal cual)
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        console.log('Respuesta del servidor:', response.status);

        // Manejar respuesta (se deja igual que tu versión)
        if (response.ok) {
            console.log('Formulario enviado exitosamente');
            form.reset();
            openModal();
        } else if (response.status >= 400 && response.status < 500) {
            console.log('Respuesta 4xx - asumiendo envío exitoso');
            form.reset();
            openModal();
        } else {
            throw new Error(`Error del servidor: ${response.status}`);
        }

    } catch (error) {
        console.error('Error al enviar formulario:', error);
        
        if (error.name === 'AbortError') {
            alert('La conexión tardó demasiado tiempo. Si recibimos tu mensaje, nos pondremos en contacto contigo.');
        } else {
            alert('Hubo un problema al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente.');
        }
    } finally {
        // Restaurar botón
        clearTimeout(timeoutId);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

function validateForm(form) {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[name="telefono"]');
    const emailInput = form.querySelector('input[name="email"]'); // NUEVO

    // Validar nombre
    if (nameInput) {
        const name = nameInput.value.trim();
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        
        if (!nameRegex.test(name)) {
            nameInput.setCustomValidity('El nombre no puede contener números ni caracteres especiales.');
            nameInput.reportValidity();
            nameInput.focus();
            return false;
        } else {
            nameInput.setCustomValidity('');
        }
    }

    // Validar email (exigir TLD)
    if (emailInput) {
        const v = emailInput.value.trim();
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
        if (!re.test(v)) {
            emailInput.setCustomValidity('Ingresa un email válido (usuario@dominio.com).');
            emailInput.reportValidity();
            emailInput.focus();
            return false;
        } else {
            emailInput.setCustomValidity('');
        }
    }
    
    // Validar teléfono
    if (phoneInput) {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[0-9+\s]+$/;
        
        if (phone !== '' && !phoneRegex.test(phone)) {
            phoneInput.setCustomValidity('El teléfono solo puede contener números y el signo +');
            phoneInput.reportValidity();
            phoneInput.focus();
            return false;
        } else {
            phoneInput.setCustomValidity('');
        }
    }
    
    return true;
}

// =============================================================================
// NAVEGACIÓN SUAVE
// =============================================================================

function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('Navegando a:', targetId);
            }
        });
    });
    
    console.log('Navegación suave inicializada');
}

// =============================================================================
// ANIMACIONES DE APARICIÓN
// =============================================================================

function initAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    if (elements.length === 0) return;

    // Configurar elementos para animación
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // Crear observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                console.log('Elemento animado:', entry.target.className);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos
    elements.forEach(element => observer.observe(element));
    
    console.log('Animaciones inicializadas para', elements.length, 'elementos');
}

// =============================================================================
// FUNCIONES GLOBALES (para compatibilidad si las necesitas)
// =============================================================================

window.openThankyouModal = openModal;
window.closeThankyouModal = closeModal;

console.log('MovilAd - JavaScript cargado completamente');
