(function () {
  "use strict";

  var loginView = document.getElementById("loginView");
  var dashboardView = document.getElementById("dashboardView");
  var loginForm = document.getElementById("loginForm");
  var loginError = document.getElementById("loginError");
  var logoutBtn = document.getElementById("logoutBtn");
  var userEmail = document.getElementById("userEmail");

  if (!window.supabase) {
    loginError.textContent = "No se ha podido cargar el panel. Comprueba tu conexión y recarga la página.";
    return;
  }

  var SUPABASE_URL = "https://luiniwczeyzlytairmja.supabase.co";
  var SUPABASE_KEY = "sb_publishable_dECgZYL9Z4KZz4e-4Ueg4Q_NI19u1zv";

  var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function showDashboard(session) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    userEmail.textContent = session.user.email;
    loadStats();
  }

  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
  }

  client.auth.getSession().then(function (res) {
    if (res.data && res.data.session) {
      showDashboard(res.data.session);
    } else {
      showLogin();
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.textContent = "";
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value;

    client.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) {
        loginError.textContent = "Email o contraseña incorrectos.";
      } else {
        showDashboard(res.data.session);
      }
    });
  });

  logoutBtn.addEventListener("click", function () {
    client.auth.signOut().then(function () {
      showLogin();
    });
  });

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function toDateKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function setCount(elId, count) {
    document.getElementById(elId).textContent = count == null ? "—" : count;
  }

  function loadTableStats(table, prefix, todayStart, d7, d30, dailyKey) {
    client.from(table).select("*", { count: "exact", head: true })
      .then(function (res) { setCount(prefix + "Total", res.count); });

    client.from(table).select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString())
      .then(function (res) { setCount(prefix + "Today", res.count); });

    client.from(table).select("*", { count: "exact", head: true })
      .gte("created_at", d7.toISOString())
      .then(function (res) { setCount(prefix + "7", res.count); });

    client.from(table).select("created_at")
      .gte("created_at", d30.toISOString())
      .then(function (res) {
        var rows = res.data || [];
        setCount(prefix + "30", rows.length);
        dailyCounts[dailyKey] = countByDay(rows);
        renderDailyTable(todayStart);
      });
  }

  var dailyCounts = { views: null, messages: null };

  function countByDay(rows) {
    var counts = {};
    rows.forEach(function (row) {
      var key = row.created_at.slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  function loadStats() {
    var todayStart = startOfDay(new Date());

    var d7 = new Date(todayStart);
    d7.setDate(d7.getDate() - 6);

    var d30 = new Date(todayStart);
    d30.setDate(d30.getDate() - 29);

    loadTableStats("page_views", "stat", todayStart, d7, d30, "views");
    loadTableStats("contact_submissions", "msg", todayStart, d7, d30, "messages");
  }

  function renderDailyTable(todayStart) {
    if (!dailyCounts.views || !dailyCounts.messages) return;

    var tbody = document.getElementById("dailyTableBody");
    tbody.innerHTML = "";

    var cursor = new Date(todayStart);
    for (var i = 0; i < 30; i++) {
      var key = toDateKey(cursor);
      var tr = document.createElement("tr");

      var tdDate = document.createElement("td");
      tdDate.textContent = key;

      var tdViews = document.createElement("td");
      tdViews.textContent = dailyCounts.views[key] || 0;

      var tdMsgs = document.createElement("td");
      tdMsgs.textContent = dailyCounts.messages[key] || 0;

      tr.appendChild(tdDate);
      tr.appendChild(tdViews);
      tr.appendChild(tdMsgs);
      tbody.appendChild(tr);
      cursor.setDate(cursor.getDate() - 1);
    }
  }
})();
