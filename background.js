chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getModelData") {
    const urls = [
      "https://es.stripchat.com/api/front/models?rcmGrp=N&limit=99&primaryTag=trans",
      "https://es.stripchat.com/api/front/models?rcmGrp=N&limit=99&primaryTag=girls",
      "https://es.stripchat.com/api/front/models?rcmGrp=N&limit=99&primaryTag=couples",
      "https://es.stripchat.com/api/front/models?rcmGrp=N&limit=99&primaryTag=men",
    ];

    Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
      .then((responses) => {
        // Unificar todos los modelos
        const allModels = responses.flatMap((res) => res.models || []);
        sendResponse({ success: true, data: { models: allModels } });
      })
      .catch((error) => {
        console.error("Error al obtener modelos:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});
