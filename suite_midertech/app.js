document.addEventListener('click', function (e) {
  const card = e.target.closest('.app-card');
  if (!card) return;

  const app = card.dataset.app;
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Cargando aplicación...</p>';

  // Detecta el nombre del repositorio para rutas correctas en GitHub Pages
  const repoName = window.location.pathname.split('/')[1];
  const basePath = repoName ? `/${repoName}` : '';
  const appPath = `${basePath}/apps/${app}/index.html`;

  fetch(appPath)
    .then(async (r) => {
      if (r.ok) {
        const html = await r.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        const back = document.createElement('div');
        back.style.marginBottom = '12px';
        back.innerHTML =
          '<button class="btn btn-light" id="backBtn">← Volver al menú</button>';

        container.innerHTML = '';
        container.appendChild(back);
        container.appendChild(wrapper);

        document.getElementById('backBtn').addEventListener('click', () => {
          document.getElementById('app-container').innerHTML = '';
          window.scrollTo(0, 0);
        });
      } else {
        container.innerHTML = `<p>No se encontró un index.html dentro de <b>apps/${app}</b>.<br>Si la aplicación es un servidor Python, se abrirá en un iframe.</p>`;
        if (app === 'instrumentos') {
          const iframe = document.createElement('iframe');
          iframe.src = 'http://localhost:5000';
          iframe.style.width = '100%';
          iframe.style.height = '800px';
          iframe.style.border = '1px solid rgba(0,0,0,0.08)';
          container.appendChild(iframe);
        }
      }
    })
    .catch((err) => {
      container.innerHTML = `<p>Error cargando la app: ${err.message}</p>`;
    });
});
