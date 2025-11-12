// netlify/functions/proxy.js
import { URLSearchParams } from 'url'; // Wichtig für den URL-Aufbau

// Dies ist die korrekte Signatur für eine Standard-Netlify-Funktion
export const handler = async (event, context) => {
  
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // 1. 'event.path' ist der Pfad, den Netlify empfängt (z.B. "/v1/forecast")
  const path = event.path;
  
  // 2. 'event.queryStringParameters' ist ein Objekt (z.B. { latitude: "...", longitude: "..." })
  const params = new URLSearchParams(event.queryStringParameters || {});
  const queryString = params.toString();
  
  // 3. Baue die finale URL korrekt zusammen
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);
    const data = await apiResponse.json();

    // Fehler von Open-Meteo abfangen
    if (!apiResponse.ok) {
      console.error("Fehler von Open-Meteo:", apiResponse.status, data);
      return {
        statusCode: apiResponse.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data)
      };
    }

    // Erfolg!
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    // Hier schlägt dein "fetch failed" zu
    console.error("Schwerer Proxy-Fehler (Lambda-Runtime):", finalOpenMeteoUrl, error);
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Proxy-Fehler (Netzwerk, Lambda)",
        message: error.message // Hier sollte "fetch failed" stehen
      })
    };
  }
};
