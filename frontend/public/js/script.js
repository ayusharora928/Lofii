document.addEventListener("DOMContentLoaded", () => {

    // ====== Mini-player & track logic ======
    const miniPlayer = document.getElementById("mini-player");
    const miniTrackInfo = document.getElementById("mini-track-info");
    const miniPlay = document.getElementById("mini-play");

    let currentTrack = null;
    let isPlaying = false;
    const player = new Audio();

    // Click track to play
    const trackElements = document.querySelectorAll("li[data-url]");
    trackElements.forEach(li => {
        li.addEventListener("click", () => {
            const url = li.dataset.url || "http://localhost:8000/sample.mp3"; // fallback
            const title = li.querySelector("strong")?.innerText || "Unknown";
            const artist = li.querySelector("span")?.innerText || "Unknown";
            playTrack(url, title, artist);
        });
    });

    // Play selected track
    function playTrack(url, title, artist) {
        if (currentTrack !== url) {
            player.src = url;
            currentTrack = url;
        }
        player.play();
        isPlaying = true;
        miniPlay.textContent = "⏸";
        miniTrackInfo.textContent = `${title} - ${artist}`;
        miniPlayer.style.display = "flex";
    }

    // Play/Pause button
    miniPlay.addEventListener("click", () => {
        if (!currentTrack) return;
        if (isPlaying) {
            player.pause();
            miniPlay.textContent = "▶";
            isPlaying = false;
        } else {
            player.play();
            miniPlay.textContent = "⏸";
            isPlaying = true;
        }
    });

    // Auto-play next track on end
    player.addEventListener("ended", () => {
        const tracks = Array.from(document.querySelectorAll("li[data-url]"));
        if (tracks.length === 0) return;

        let index = tracks.findIndex(li => li.dataset.url === currentTrack);
        index = (index + 1) % tracks.length;
        tracks[index].click();
    });

});
