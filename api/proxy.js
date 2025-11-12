// api/proxy.js

export default async function handler(request, response) {
  
  // Die absolute Basis-URL von Open-Meteo, ohne Pfad.
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // Wir nehmen die komplette URL, mit der unser Proxy aufgerufen wurde...
  // z.B. "/api/proxy/v1/dwd-icon?latitude=..."  <-- HINWEIS: /api/proxy ist hier dabei
  const incomingUrl = request.url;

  // ---------- ÄNDERUNG START ----------
  // Wir entfernen den Pfad unseres eigenen Proxys ("/api/proxy")
  const path = incomingUrl.replace('/api/proxy', ''); 
  // Das Ergebnis ist jetzt z.B. "/v1/dwd-icon?latitude=..."
  // ---------- ÄNDERUNG ENDE ----------

  // ...und hängen den BEREINIGTEN Pfad an die Basis-URL an.
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${path}`; // <--- HIER path statt incomingUrl

  // Diese Zeile ist gut für die Fehlersuche (kann später weg)
  console.log("Versuche Abruf von:", finalOpenMeteoUrl);

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);
    const data = await apiResponse.json();
    
    // Der Rest bleibt gleich
    response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); 
    return response.status(200).json(data);

  } catch (error) {
    console.error("Fehler beim Abruf von:", finalOpenMeteoUrl, error);
    return response.status(500).json({ 
      error: "Proxy-Fehler", 
      message: error.message 
    });
  }
}
