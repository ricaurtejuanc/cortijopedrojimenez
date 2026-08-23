(function () {
  "use strict";

  /* ---------- Idioma ---------- */

  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-es]").forEach(function (el) {
      var value = el.getAttribute(lang === "en" ? "data-en" : "data-es");
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll("[data-es-alt]").forEach(function (el) {
      var value = el.getAttribute(lang === "en" ? "data-en-alt" : "data-es-alt");
      if (value !== null) el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-es-placeholder]").forEach(function (el) {
      var value = el.getAttribute(lang === "en" ? "data-en-placeholder" : "data-es-placeholder");
      if (value !== null) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem("cpj-lang", lang); } catch (e) {}
  }

  var savedLang = null;
  try { savedLang = localStorage.getItem("cpj-lang"); } catch (e) {}
  var browserLang = (navigator.language || "es").slice(0, 2);
  var initialLang = savedLang || (browserLang === "en" ? "en" : "es");
  applyLanguage(initialLang);

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  /* ---------- Cabecera al hacer scroll ---------- */

  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */

  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  navToggle.addEventListener("click", function () {
    siteNav.classList.toggle("is-open");
  });
  siteNav.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      siteNav.classList.remove("is-open");
    });
  });

  /* ---------- Galería / lightbox ---------- */

  var galleryImages = Array.prototype.map.call(
    document.querySelectorAll("#galleryGrid img"),
    function (img) { return img; }
  );

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    var img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function showNext(delta) {
    currentIndex = (currentIndex + delta + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  galleryImages.forEach(function (img, index) {
    img.parentElement.addEventListener("click", function () { openLightbox(index); });
  });

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", function () { showNext(-1); });
  document.getElementById("lightboxNext").addEventListener("click", function () { showNext(1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext(1);
    if (e.key === "ArrowLeft") showNext(-1);
  });

  /* ---------- Formulario de contacto ---------- */

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var currentLang = function () { return document.documentElement.getAttribute("lang") || "es"; };

  var messages = {
    sending: { es: "Enviando…", en: "Sending…" },
    success: { es: "¡Gracias! Hemos recibido tu consulta y te responderemos lo antes posible.", en: "Thank you! We've received your inquiry and will get back to you soon." },
    error: { es: "No hemos podido enviar el formulario. Escríbenos directamente a cortijopedrojimenez@gmail.com.", en: "We couldn't send the form. Please write to us directly at cortijopedrojimenez@gmail.com." },
    missingKey: { es: "El formulario aún no está configurado. Escríbenos directamente a cortijopedrojimenez@gmail.com.", en: "The form isn't configured yet. Please write to us directly at cortijopedrojimenez@gmail.com." }
  };

  function logSubmission(lang) {
    // Petición directa a la API REST de Supabase con keepalive: true, para
    // que el registro se complete aunque el visitante cierre la pestaña o
    // navegue a otra página justo después de ver el mensaje de "Gracias".
    try {
      fetch("https://mrejqzsmuqxncupwfezq.supabase.co/rest/v1/contact_submissions", {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          "apikey": "sb_publishable_BQklVUJLRr0_eMf1vfv1CQ_63UH_UNB",
          "Authorization": "Bearer sb_publishable_BQklVUJLRr0_eMf1vfv1CQ_63UH_UNB",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: form.querySelector('[name="name"]').value || null,
          email: form.querySelector('[name="email"]').value || null,
          lang: lang
        })
      }).catch(function () {});
    } catch (e) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var lang = currentLang();
    var accessKey = form.querySelector('[name="access_key"]').value;

    if (!accessKey || accessKey.indexOf("REEMPLAZA_CON_TU_ACCESS_KEY") === 0) {
      status.textContent = messages.missingKey[lang];
      status.className = "form-status is-error";
      return;
    }

    status.textContent = messages.sending[lang];
    status.className = "form-status";
    status.style.display = "block";

    var formData = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          status.textContent = messages.success[lang];
          status.className = "form-status is-success";
          logSubmission(lang);
          form.reset();
        } else {
          status.textContent = messages.error[lang];
          status.className = "form-status is-error";
        }
      })
      .catch(function () {
        status.textContent = messages.error[lang];
        status.className = "form-status is-error";
      });
  });
})();
