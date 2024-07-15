
(async () => {
    try {
      const response = await fetch('https://api.scraperapi.com/structured/twitter/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: '21b0e69effefec765746122401e76a2d',
          urls: ["https://x.com/xqc"],
          apiParams: {"country_code":"eu","device_type":"desktop","session_number":"123","autoparse":"true"}
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  })();