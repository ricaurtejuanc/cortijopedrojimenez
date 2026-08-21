(function () {
  "use strict";

  var SUPABASE_URL = "https://luiniwczeyzlytairmja.supabase.co";
  var SUPABASE_KEY = "sb_publishable_dECgZYL9Z4KZz4e-4Ueg4Q_NI19u1zv";

  // Petición directa a la API REST de Supabase (no al cliente supabase-js) con
  // keepalive: true, para que el registro se complete aunque el visitante
  // cierre la pestaña o navegue a otra página justo después de cargar esta.
  fetch(SUPABASE_URL + "/rest/v1/page_views", {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      path: window.location.pathname,
      lang: document.documentElement.getAttribute("lang") || "es",
      referrer: document.referrer || null
    })
  }).catch(function () {});
})();
