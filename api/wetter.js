// api/wetter.js
export default async function handler(request, response) {
  
  const openMeteoUrl = "https://api.open-meteo.com/v1/forecast?latitude=48.8147&longitude=11.7525&hourly=temperature_2m,weathercode&daily=precipitation_sum&timezone=Europe%2FBerlin";
  
  try {
    const apiResponse = await fetch(openMeteoUrl);
    const data = await apiResponse.json();
    
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return response.status(200).json(data);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ 
      error: "Proxy-Fehler", 
      message: error.message 
    });
  }
}
