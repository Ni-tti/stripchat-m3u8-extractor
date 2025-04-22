chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      func: extractM3U8,
    },
    async (results) => {
      const linkDiv = document.getElementById("link");

      if (
        !results ||
        !results[0] ||
        !results[0].result ||
        !results[0].result.id
      ) {
        linkDiv.innerHTML =
          '<div class="text-danger fw-semibold">No se encontró ningún ID válido.</div>';
        return;
      }

      const result = results[0].result;
      const modelId = result.id;

      linkDiv.innerHTML = "";

      const autoUrl = {
        label: "Auto",
        resolution: "auto",
        url: `https://ni-tti.github.io/?src=https://edge-hls.doppiocdn.com/hls/${modelId}/master/${modelId}.m3u8`,
      };

      const autoBtn = document.createElement("button");
      autoBtn.type = "button";
      autoBtn.className =
        "btn btn-outline-light btn-sm flex-grow-1 rounded-pill d-flex justify-content-between align-items-center";
      autoBtn.innerHTML = `<span>${autoUrl.label}</span><i class="bi bi-box-arrow-up-right"></i>`;
      autoBtn.onclick = () => {
        chrome.tabs.create({ url: autoUrl.url });
      };
      linkDiv.appendChild(autoBtn);

      const autoCopyBtn = document.createElement("button");
      autoCopyBtn.type = "button";
      autoCopyBtn.className = "btn btn-outline-secondary btn-sm rounded-pill";
      autoCopyBtn.title = "Copiar URL";
      autoCopyBtn.innerHTML = `<i class="bi bi-clipboard"></i>`;

      autoCopyBtn.onclick = () => {
        navigator.clipboard.writeText(autoUrl.url).then(() => {
          const original = autoCopyBtn.innerHTML;
          autoCopyBtn.innerHTML = `<i class="bi bi-check-lg text-success"></i>`;
          setTimeout(() => {
            autoCopyBtn.innerHTML = original;
          }, 1000);
        });
      };

      const autoContainer = document.createElement("div");
      autoContainer.className = "d-flex gap-2 mb-2";
      autoContainer.appendChild(autoBtn);
      autoContainer.appendChild(autoCopyBtn);

      linkDiv.appendChild(autoContainer);

      const spinner = document.createElement("div");
      spinner.className = "text-center text-secondary small mb-2";
      spinner.innerHTML = `<div class="spinner-border spinner-border-sm text-info me-2" role="status"></div> Cargando resoluciones...`;
      linkDiv.appendChild(spinner);

      try {
        const data = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage({ type: "getModelData" }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
              return;
            }
            if (response?.success) {
              resolve(response.data);
            } else {
              reject(response?.error || "Error desconocido");
            }
          });
        });

        const model = data.models.find((m) => m.id.toString() === modelId);
        const availablePresets = model?.presets || [];

        const resolutionUrls = [
          { label: "1080p", resolution: "1080p" },
          { label: "960p", resolution: "960p" },
          { label: "720p60", resolution: "720p60" },
          { label: "720p", resolution: "720p" },
          { label: "480p", resolution: "480p" },
          { label: "240p", resolution: "240p" },
          { label: "160p", resolution: "160p" },
        ].map((res) => ({
          ...res,
          url: `https://ni-tti.github.io/?src=https://edge-hls.doppiocdn.com/hls/${modelId}/master/${modelId}_${res.resolution}.m3u8`,
        }));

        let anyFound = false;

        resolutionUrls.forEach((u) => {
          if (availablePresets.includes(u.resolution)) {
            const container = document.createElement("div");
            container.className = "d-flex gap-2 mb-2";

            const openBtn = document.createElement("button");
            openBtn.type = "button";
            openBtn.className =
              "btn btn-outline-info btn-sm flex-grow-1 rounded-pill d-flex justify-content-between align-items-center";
            openBtn.innerHTML = `<span>${u.label}</span><i class="bi bi-box-arrow-up-right"></i>`;
            openBtn.onclick = () => chrome.tabs.create({ url: u.url });

            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "btn btn-outline-secondary btn-sm rounded-pill";
            copyBtn.title = "Copiar URL";
            copyBtn.innerHTML = `<i class="bi bi-clipboard"></i>`;

            copyBtn.onclick = () => {
              navigator.clipboard.writeText(u.url).then(() => {
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = `<i class="bi bi-check-lg text-success"></i>`;
                setTimeout(() => {
                  copyBtn.innerHTML = original;
                }, 1000);
              });
            };

            container.appendChild(openBtn);
            container.appendChild(copyBtn);
            linkDiv.appendChild(container);
            anyFound = true;
          }
        });

        spinner.remove();

        if (!anyFound) {
          const msg = document.createElement("div");
          msg.className = "text-warning fw-semibold text-center small";
          msg.innerText = "No hay resoluciones adicionales disponibles.";
          linkDiv.appendChild(msg);
        }
      } catch (error) {
        console.error("Error al obtener datos de Stripchat:", error);
        spinner.remove();

        const msg = document.createElement("div");
        msg.className = "text-warning fw-semibold text-center small";
        msg.innerText = "No se pudo cargar resoluciones adicionales.";
        linkDiv.appendChild(msg);
      }
    }
  );
});

function extractM3U8() {
  const meta = document.querySelector('meta[property="og:image"]');
  if (!meta) return null;

  const content = meta.getAttribute("content");
  const match = content.match(/\/(\d+)_webp/);
  if (!match) return null;

  return { id: match[1] };
}
