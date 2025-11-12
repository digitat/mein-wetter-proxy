// netlify/functions/proxy.js

export default async function handler(request, context) {
  
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // request.url ist "/v1/forecast?latitude=..." (dank netlify.toml)
  const incomingUrl = request.url;

  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${incomingUrl}`;

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);
    
    // Wir holen uns die Daten, egal ob Fehler oder nicht
    const data = await apiResponse.json();

    // WICHTIG: Prüfen, ob Open-Meteo einen Fehler gemeldet hat
    if (!apiResponse.ok) {
      console.error("Fehler von Open-Meteo:", apiResponse.status, data);
      
      // Fehler an das Frontend weitergeben
      return {
        statusCode: apiResponse.status, // z.B. 400
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data)
      };
    }

    // Alles gut, Daten zurückgeben
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    // Netzwerkfehler ("fetch failed") oder .json() Fehler
    console.error("Schwerer Proxy-Fehler:", finalOpenMeteoUrl, error);
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Proxy-Fehler (Netzwerk)",
        message: error.message
      })
    };
  }
}
