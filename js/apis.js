export default async function getApiData(lang) {
  const baseUrl = "https://mp3quran.net/api/v3";
  try {
    const [langsRes,
      recitersRes,
      suwarRes,
      radiosRes] = await Promise.all([
        fetch(`${baseUrl}/languages`),
        fetch(`${baseUrl}/reciters?language=${lang}`),
        fetch(`${baseUrl}/suwar?language=${lang}`),
        fetch(`${baseUrl}/radios?language=${lang}`),
      ]);
    const langsData = await langsRes.json();
    const recitersData = await recitersRes.json();
    const suwarData = await suwarRes.json();
    const radiosData = await radiosRes.json();
    return {
      langsData,
      recitersData,
      suwarData,
      radiosData,
    }
  } catch (err) {
    console.log("error Apis", err)
  }
}