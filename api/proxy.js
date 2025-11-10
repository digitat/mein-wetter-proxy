// api/proxy.js

export default async function handler(request, response) {
  
  // Die absolute Basis-URL von Open-Meteo, ohne Pfad.
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // Wir nehmen die komplette URL, mit der unser Proxy aufgerufen wurde...
  // z.B. "/v1/dwd-icon?latitude=..."
  const incomingUrl = request.url;

  // ...und hängen sie an die Basis-URL an.
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${incomingUrl}`;

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);
    const data = await apiResponse.json();
    
    // Der Rest bleibt gleich
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Wir cachen hier nicht mehr, da jede URL anders sein kann. Das Caching auf deiner PHP-Seite ist wichtiger.
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
