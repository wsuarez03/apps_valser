document.addEventListener('click', function(e){
  const card = e.target.closest('.app-card');
  if (!card) return;
  const app = card.dataset.app;
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Cargando aplicación...</p>';
  // Load app's index.html if exists, otherwise try to show README or link
  fetch(`apps/${app}/index.html`)
  .then(async (r) => {
    if (r.ok) {
      const html = await r.text();

      // Crear wrapper y back button
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      const back = document.createElement('div');
      back.style.marginBottom = '12px';
      back.innerHTML = '<button class="btn btn-light" id="backBtn">← Volver al menú</button>';

      // Limpiar contenedor y agregar contenido
      container.innerHTML = '';
      container.appendChild(back);
      container.appendChild(wrapper);

      // Reejecutar scripts internos del HTML cargado
      wrapper.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          // Si es script externo (ej. app.js dentro de la app)
          newScript.src = `apps/${app}/` + oldScript.getAttribute("src");
        } else {
          // Si es inline script
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });

      // Botón volver al menú
      document.getElementById('backBtn').addEventListener('click', () => {
        document.getElementById('app-container').innerHTML = '';
        window.scrollTo(0, 0);
      });

    } else {
      container.innerHTML = `<p>No se encontró un index.html dentro de apps/${app}.</p>`;
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
  .catch(err => {
    container.innerHTML = '<p>Error cargando la app: ' + err.message + '</p>';
  });

});
