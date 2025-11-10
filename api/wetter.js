// api/wetter.js

export default async function handler(request, response) {
  
  // Die Basis-URL von Open-Meteo
  const openMeteoBaseUrl = "https://api.open-meteo.com/v1/dwd-icon";
  
  // Diese Zeile nimmt alles, was nach dem Fragezeichen in deiner Anfrage kommt...
  const queryString = request.url.split('?')[1] || '';

  // ...und hängt es an die Open-Meteo URL an.
  const finalOpenMeteoUrl = `${openMeteoBaseUrl}?${queryString}`;

  try {
    const apiResponse = await fetch(finalOpenMeteoUrl);
    const data = await apiResponse.json();
    
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(data);

  } catch (error) {
    console.error("Fehler beim Abruf von:", finalOpenMeteoUrl, error);
    return response.status(500).json({ 
      error: "Proxy-Fehler", 
      message: error.message 
    });
  }
}
