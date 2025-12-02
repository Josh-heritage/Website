fetch("https://metoffice-proxy.joshjacksonheritage.workers.dev//functions/metoffice")
  .then(r => r.json())
  .then(data => {
    console.log(data);
  });
