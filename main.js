const mySong = document.getElementById('mySong');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const cover = document.getElementById('cover');
const playlistItems = document.getElementById('playlistItems');
const trackCount = document.getElementById('trackCount');

const tracks = [
    {
        title: 'Taqabbalni',
        artist: 'Adham Nabulsi',
        src: 'song/Adham-T2abbalni.mp3',
        cover: 'img/cover-1.jpg'
    },
    {
        title: 'Naskha Mennek',
        artist: 'Adham Nabulsi',
        src: 'song/Adham-Naskha Mennek.mp3',
        cover: 'img/cover-2.jpg'
    },
    {
        title: 'Shedni Ghmorni',
        artist: 'Adham Nabulsi',
        src: 'song/Adham-Shedni Ghmorni.mp3',
        cover: 'img/cover-3.jpg'
    }
];

let currentIndex = 0;
let shuffle = false;
let repeat = false;

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderPlaylist() {
    trackCount.textContent = `${tracks.length} tracks`;
    playlistItems.innerHTML = '';

    tracks.forEach((track, index) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'playlist-item';
        button.dataset.index = index;
        button.setAttribute('aria-label', `Play ${track.title}`);

        button.innerHTML = `
            <img class="playlist-cover" src="${track.cover}" alt="">
            <span class="playlist-copy">
                <strong>${track.title}</strong>
                <small>${track.artist}</small>
            </span>
        `;

        button.addEventListener('click', () => loadTrack(index, true));

        playlistItems.appendChild(button);
    });

    updatePlaylistState();
}

function updatePlaylistState() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
}

function loadTrack(index, autoplay = false) {
    currentIndex = (index + tracks.length) % tracks.length;

    const track = tracks[currentIndex];

    mySong.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    cover.src = track.cover;
    cover.alt = `${track.title} album art`;

    currentTimeEl.textContent = '00:00';
    durationEl.textContent = '00:00';
    progressBar.value = 0;

    updatePlaylistState();

    if (autoplay) {
        mySong.play().catch(() => {});
    }
}

function togglePlay() {
    if (mySong.paused) {
        mySong.play().catch(() => {});
    } else {
        mySong.pause();
    }
}

function updatePlayButton() {
    playPauseBtn.textContent = mySong.paused ? '▶' : '❚❚';
    playPauseBtn.setAttribute('aria-label', mySong.paused ? 'Play' : 'Pause');
}

function goNext() {
    if (shuffle && tracks.length > 1) {
        let nextIndex;

        do {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } while (nextIndex === currentIndex);

        loadTrack(nextIndex, true);
        return;
    }

    loadTrack(currentIndex + 1, true);
}

function goPrevious() {
    if (mySong.currentTime > 3) {
        mySong.currentTime = 0;
        return;
    }

    loadTrack(currentIndex - 1, true);
}

playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrevious);

/* ==================================================
   SHUFFLE / REPEAT
================================================== */

shuffleBtn.addEventListener('click', () => {
    shuffle = !shuffle;

    if (shuffle) {
        repeat = false;
    }

    shuffleBtn.classList.toggle('active', shuffle);
    repeatBtn.classList.toggle('active', repeat);
});

repeatBtn.addEventListener('click', () => {
    repeat = !repeat;

    if (repeat) {
        shuffle = false;
    }

    repeatBtn.classList.toggle('active', repeat);
    shuffleBtn.classList.toggle('active', shuffle);
});

mySong.addEventListener('play', updatePlayButton);
mySong.addEventListener('pause', updatePlayButton);

mySong.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(mySong.duration);
});

mySong.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(mySong.currentTime);

    if (mySong.duration) {
        progressBar.value = (mySong.currentTime / mySong.duration) * 100;
    }
});

progressBar.addEventListener('input', () => {
    if (!mySong.duration) return;

    mySong.currentTime = (Number(progressBar.value) / 100) * mySong.duration;
});

volumeBar.addEventListener('input', () => {
    mySong.volume = Number(volumeBar.value);
});

mySong.addEventListener('ended', () => {
    if (repeat) {
        mySong.currentTime = 0;
        mySong.play().catch(() => {});
        return;
    }

    goNext();
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
        event.preventDefault();
        togglePlay();
    }
});

/* ==================================================
   DISABLE RIGHT CLICK
================================================== */

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

/* ==================================================
   DISABLE COMMON DEVTOOLS SHORTCUTS
================================================== */

document.addEventListener('keydown', (event) => {
    if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase())) ||
        (event.ctrlKey && event.key.toUpperCase() === 'U')
    ) {
        event.preventDefault();
    }
});

renderPlaylist();
loadTrack(0, false);
mySong.volume = 1;