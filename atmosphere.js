fetch("https://metoffice-proxy.joshjacksonheritage.workers.dev")
  .then(resp => {
    if (!resp.ok) throw new Error("Network response was not ok");
    return resp.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.error("Error fetching forecast:", err));
