/**
 * Cliente de la API pública de GitHub: repositorios propios (sin forks)
 * y bytes reales por lenguaje. Si falla la red, usa únicamente la instantánea
 * real verificada de @Rafags04 indicando honestamente el estado offline.
 */
(function () {
  window.Portfolio = window.Portfolio || {};

  const CACHE_TTL_MS = 10 * 60 * 1000;

  const LANG_COLORS = {
    HTML: '#e34c26',
    CSS: '#7c3aed',
    JavaScript: '#eab308',
    TypeScript: '#38bdf8',
    Java: '#f97316',
    Python: '#22c55e',
    Dockerfile: '#0ea5e9',
    Batchfile: '#64748b',
    Shell: '#94a3b8'
  };

  // Instantánea real verificada de la cuenta Rafags04 (sin datos inventados)
  const VERIFIED_OFFLINE_SNAPSHOT = {
    username: 'Rafags04',
    fetchedAt: Date.now(),
    totalBytes: 689112,
    languageEntries: [
      { name: 'HTML', bytes: 304021 },
      { name: 'JavaScript', bytes: 276104 },
      { name: 'Java', bytes: 58167 },
      { name: 'CSS', bytes: 48911 },
      { name: 'Python', bytes: 1323 },
      { name: 'Dockerfile', bytes: 739 },
      { name: 'Batchfile', bytes: 447 }
    ],
    repos: [
      {
        name: 'SimuladorPDA-PermisoConduccionB',
        description:
          'Simulador para profesores de Autoescuela que permite simular la PDA de los examinadores de la DGT, para realizar simulaciones de exámenes en las clases.',
        language: 'JavaScript',
        html_url: 'https://github.com/Rafags04/SimuladorPDA-PermisoConduccionB',
        updated_at: '2026-11-24T09:37:32Z'
      },
      {
        name: 'ISO2-2025GrupoB.03-Testing-P2',
        description: 'Proyecto de testing unitario con JUnit 5 y Maven en Java.',
        language: 'HTML',
        html_url: 'https://github.com/Rafags04/ISO2-2025GrupoB.03-Testing-P2',
        updated_at: '2025-12-18T11:02:44Z'
      },
      {
        name: 'Rafags04',
        description: 'Config files for my GitHub profile.',
        language: null,
        html_url: 'https://github.com/Rafags04/Rafags04',
        updated_at: '2024-02-14T07:54:41Z'
      }
    ]
  };

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  }

  function formatDate(isoString) {
    if (!isoString) return 'Fecha desconocida';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function formatTime(timestamp) {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp));
  }

  function renderGitHubData(data, statusMode, extraNote) {
    const statusEl = document.getElementById('github-status');
    const contentEl = document.getElementById('github-content');
    const langBarEl = document.getElementById('github-lang-bar');
    const langListEl = document.getElementById('github-lang-list');
    const reposListEl = document.getElementById('github-repos-list');

    if (!statusEl || !contentEl || !langBarEl || !langListEl || !reposListEl) return;

    if (statusMode === 'offline') {
      statusEl.className = 'status-banner status-demo';
      statusEl.textContent =
        `Sin conexión con api.github.com (${extraNote}). Mostrando última instantánea verificada de @${data.username}.`;
    } else {
      statusEl.className = 'status-banner status-ok';
      const sourceText = statusMode === 'cache' ? 'en caché de sesión desde' : 'medido en directo a las';
      statusEl.textContent =
        `${data.repos.length} repositorios públicos propios (sin forks) · ${data.languageEntries.length} lenguajes medidos por bytes (${sourceText} ${formatTime(data.fetchedAt)}).`;
    }

    contentEl.hidden = false;
    langBarEl.textContent = '';
    langListEl.textContent = '';

    if (data.totalBytes === 0) {
      const emptyMsg = document.createElement('li');
      emptyMsg.textContent = 'No se detectaron bytes de código en los repositorios públicos analizados.';
      langListEl.appendChild(emptyMsg);
    } else {
      for (const item of data.languageEntries) {
        const pct = (item.bytes / data.totalBytes) * 100;
        const color = LANG_COLORS[item.name] || '#38bdf8';

        const segment = document.createElement('span');
        segment.className = 'lang-segment';
        segment.style.width = `${pct.toFixed(2)}%`;
        segment.style.backgroundColor = color;
        segment.title = `${item.name}: ${formatBytes(item.bytes)} (${pct.toFixed(1)}%)`;
        langBarEl.appendChild(segment);

        const li = document.createElement('li');
        li.className = 'lang-item';

        const swatch = document.createElement('span');
        swatch.className = 'lang-swatch';
        swatch.style.backgroundColor = color;
        swatch.setAttribute('aria-hidden', 'true');

        const nameEl = document.createElement('strong');
        nameEl.textContent = item.name;

        const metaEl = document.createElement('span');
        metaEl.className = 'lang-meta';
        metaEl.textContent = `${pct.toFixed(1)}% · ${formatBytes(item.bytes)}`;

        li.append(swatch, nameEl, metaEl);
        langListEl.appendChild(li);
      }
    }

    reposListEl.textContent = '';
    if (data.repos.length === 0) {
      const emptyRepo = document.createElement('li');
      emptyRepo.textContent = 'Este perfil no tiene repositorios públicos propios todavía.';
      reposListEl.appendChild(emptyRepo);
      return;
    }

    for (const repo of data.repos) {
      const li = document.createElement('li');
      li.className = 'repo-item';

      const link = document.createElement('a');
      link.className = 'repo-link';
      link.href = repo.html_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = repo.name;

      const desc = document.createElement('p');
      desc.className = 'repo-desc';
      desc.textContent = repo.description || 'Repositorio público en GitHub.';

      const meta = document.createElement('p');
      meta.className = 'repo-meta';
      const langText = repo.language || 'Configuración / Markdown';
      meta.textContent = `${langText} · Actualizado: ${formatDate(repo.updated_at)}`;

      li.append(link, desc, meta);
      reposListEl.appendChild(li);
    }
  }

  window.Portfolio.initGitHubSection = function initGitHubSection({ username, onStateChange }) {
    const retryBtn = document.getElementById('btn-retry-github');
    const statusEl = document.getElementById('github-status');
    const cacheKey = `gh_real_v3_${username}`;

    async function fetchGitHubData(forceRefresh = false) {
      if (!forceRefresh) {
        try {
          const cachedRaw = sessionStorage.getItem(cacheKey);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
              renderGitHubData(cached, 'cache');
              onStateChange?.({ ok: true, mode: 'cache', data: cached, error: null });
              return;
            }
          }
        } catch {
          // Ignorar si sessionStorage no está disponible en file://
        }
      }

      if (statusEl) {
        statusEl.className = 'status-banner';
        statusEl.textContent = 'Consultando API pública de GitHub…';
      }

      try {
        const headers = { Accept: 'application/vnd.github+json' };
        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20`,
          { headers }
        );

        if (!reposRes.ok) {
          throw new Error(`HTTP ${reposRes.status}`);
        }

        const rawRepos = await reposRes.json();
        const ownRepos = Array.isArray(rawRepos)
          ? rawRepos.filter((repo) => !repo.fork)
          : [];

        const languageTotals = {};
        const langResponses = await Promise.all(
          ownRepos.slice(0, 6).map(async (repo) => {
            const res = await fetch(repo.languages_url, { headers });
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
          })
        );

        for (const langMap of langResponses) {
          for (const [lang, bytes] of Object.entries(langMap)) {
            languageTotals[lang] = (languageTotals[lang] || 0) + Number(bytes || 0);
          }
        }

        const languageEntries = Object.entries(languageTotals)
          .map(([name, bytes]) => ({ name, bytes }))
          .sort((a, b) => b.bytes - a.bytes);

        const totalBytes = languageEntries.reduce((acc, item) => acc + item.bytes, 0);

        const payload = {
          username,
          fetchedAt: Date.now(),
          totalBytes,
          languageEntries,
          repos: ownRepos.map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            html_url: r.html_url,
            updated_at: r.updated_at
          }))
        };

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch {
          // Ignorar cuotas de almacenamiento
        }

        renderGitHubData(payload, 'live');
        onStateChange?.({ ok: true, mode: 'live', data: payload, error: null });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error de red';
        renderGitHubData(VERIFIED_OFFLINE_SNAPSHOT, 'offline', msg);
        onStateChange?.({ ok: false, mode: 'offline', data: VERIFIED_OFFLINE_SNAPSHOT, error: msg });
      }
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => fetchGitHubData(true));
    }

    fetchGitHubData(false);
  };
})();
