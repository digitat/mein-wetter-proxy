// netlify/functions/proxy.js

export default async function handler(request, context) {
  
  const openMeteoBaseUrl = "https://api.open-meteo.com";
  
  // 1. KORREKTUR: Die 'request.url' ist die volle URL (inkl. https://...).
  // Wir brauchen nur den Pfad (z.B. "/v1/forecast") und die Query (z.B. "?latitude=...")
  const url = new URL(request.url);
  const pathAndQuery = `${url.pathname}${url.search}`;

  // Wir bauen die finale URL für Open-Meteo
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}${pathAndQuery}`;

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);

    // Wir lesen die Daten von Open-Meteo
    const data = await apiResponse.json();

    // 2. KORREKTUR: Wir erstellen eine standardisierte 'Response'
    // Dies ist der "moderne" Netlify-Weg.
    return new Response(JSON.stringify(data), {
      status: apiResponse.status, // Wir leiten den Status von Open-Meteo weiter (z.B. 200 oder 400)
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Wichtig für CORS
      }
    });

  } catch (error) {
    // Netzwerkfehler ("fetch failed")
    console.error("Schwerer Proxy-Fehler:", finalOpenMeteoUrl, error);
    
    // 2. KORREKTUR: Auch Fehler als standardisierte 'Response' zurückgeben
    return new Response(JSON.stringify({
      error: "Proxy-Fehler (Netzwerk)",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
