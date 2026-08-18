(function () {
  "use strict";

  if (!window.supabase) return;

  var SUPABASE_URL = "https://luiniwczeyzlytairmja.supabase.co";
  var SUPABASE_KEY = "sb_publishable_dECgZYL9Z4KZz4e-4Ueg4Q_NI19u1zv";

  var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  client.from("page_views").insert({
    path: window.location.pathname,
    lang: document.documentElement.getAttribute("lang") || "es",
    referrer: document.referrer || null
  }).then(function () {}, function () {});
})();
