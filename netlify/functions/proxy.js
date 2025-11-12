// netlify/functions/proxy.js

export default async function handler(request, response) {
  
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // request.url ist jetzt "/v1/forecast?latitude=..."
  const incomingUrl = request.url;

  // ...und hängen sie an die Basis-URL an.
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${incomingUrl}`;

  console.log("Netlify-Funktion ruft auf:", finalOpenMeteoUrl); // Fürs Debugging

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);

    // Fehler von Open-Meteo abfangen (z.B. 400 Bad Request)
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Fehler von Open-Meteo:", apiResponse.status, errorData);
      return response.status(apiResponse.status).json(errorData);
    }
    
    const data = await apiResponse.json();
    
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json(data);

  } catch (error) {
    // Netzwerkfehler ("fetch failed")
    console.error("Netzwerkfehler beim Abruf von:", finalOpenMeteoUrl, error);
    return response.status(500).json({ 
      error: "Proxy-Fehler (Netzwerk)", 
      message: error.message 
    });
  }
}
