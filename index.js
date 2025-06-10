let accesstoken
document.addEventListener("DOMContentLoaded", function(){
    initialApp();
})

async function initialApp(){
    accesstoken = await getSpotifyToken();
    if(accesstoken){
        const respone = await getPopularTrack();
        displayTrack(respone.tracks.items);
    }
}

function displayTrack(data){
  console.log(data);
  data.forEach((item) => {
    // console.log(item);
    const imageUrl = item.album.images[0].url;
    const name = item.name;
    const artistName = item.artists.map((item) => item.name).join(", ");
    // map: đi qua từng thằng và lấy đúng phần cần lấy (vd: name)

    // tạo thẻ div
    const element = document.createElement("div");
    // gắn CLASS cho thẻ div đó
    element.className = "track-card";
    // gắn NỘI DUNG cho thẻ div
    element.innerHTML = `<div class="track-card-container">
                            <img src="${imageUrl}" alt="">
                            <h3>${name}</h3>
                            <p>${truncateText(artistName, 25)}</p>
                         </div>`;


                         
    // Them eventlistener de phat nhac
    element.addEventListener("click", () =>{
      playtrack(item.id, name, artistName);
    });

    function truncateText(text, number){ 
      return text.length > number ? text.slice(0 ,number) + " ..." : text;
    };
    
    
    // gắn thẻ div vào TRACK-SECTION
    const trackSection = document.getElementById("track-section");
    trackSection.appendChild(element);
  })
}

function playtrack (id, name, artistName){
  const iframe = document.getElementById("iframe");
  iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const modal_name = document.getElementById("modal_name");
  modal_name.innerHTML =name;
}

function handelClose(){
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}



async function getPopularTrack() {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      params: {
        q: "Robin",
        type: "track",
        limit: "10",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getSpotifyToken() {
  try {
    const credentials = btoa(
      `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
    );
    const response = await axios.post(
    "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}