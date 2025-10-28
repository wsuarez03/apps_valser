document.addEventListener('click', function(e) {
  const card = e.target.closest('.app-card');
  if (!card) return;

  const app = card.dataset.app;
  const menu = document.getElementById('menu-section'); // tu menú principal
  const container = document.getElementById('app-container');

  // Animación: ocultar menú
  menu.style.opacity = '0';
  setTimeout(() => {
    menu.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = '<p>Cargando aplicación...</p>';

    fetch(`apps/${app}/index.html`)
      .then(async (r) => {
        if (r.ok) {
          const html = await r.text();

          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;

          // barra superior con botón volver
          const topBar = document.createElement('div');
          topBar.style.display = 'flex';
          topBar.style.justifyContent = 'space-between';
          topBar.style.alignItems = 'center';
          topBar.style.padding = '10px 15px';
          topBar.style.background = '#f8f9fa';
          topBar.style.borderBottom = '1px solid #ddd';
          topBar.innerHTML = `
            <button class="btn btn-light" id="backBtn">← Volver al menú</button>
            <h5 style="margin:0; font-weight:600;">${card.querySelector('h3').textContent}</h5>
          `;

          container.innerHTML = '';
          container.appendChild(topBar);
          container.appendChild(wrapper);

          // Reejecutar scripts de la app
          wrapper.querySelectorAll("script").forEach((oldScript) => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
              newScript.src = `apps/${app}/` + oldScript.getAttribute("src");
            } else {
              newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
          });

          // Volver al menú
          document.getElementById('backBtn').addEventListener('click', () => {
            container.style.display = 'none';
            menu.style.display = 'block';
            setTimeout(() => (menu.style.opacity = '1'), 50);
            window.scrollTo(0, 0);
          });

        } else {
          container.innerHTML = `<p>No se encontró un index.html dentro de apps/${app}.</p>`;
        }
      })
      .catch(err => {
        container.innerHTML = `<p>Error cargando la app: ${err.message}</p>`;
      });

  }, 300); // tiempo de fade-out
});
