const init = () => {
    setupTabSwitching();
    setupThemeToggle();
    setupCertPopup();
    setupMusicPlayer();
};

const setupMusicPlayer = () => {
    const musicSection = document.getElementById('musicSection');
    const albumImage = document.getElementById('albumImage');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');

    let isPlaying = false;
    let audio = null;

    const audioSrc = 'assets/Eien-No-Akuruhi.mp3';

    // Function to update the icon
    function updateIcon(isPlaying) {
        playPauseBtn.innerHTML = isPlaying ?
            '<i class="fas fa-pause"></i>' :
            '<i class="fas fa-play"></i>';
        console.log('Icon updated to:', isPlaying ? 'pause' : 'play');
    }

    // Only the play/pause button controls music
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayPause();
    });

    // Clicking on song title/artist opens the modal
    songTitle.addEventListener('click', (e) => {
        e.stopPropagation();
        openSongModal();
    });

    songArtist.addEventListener('click', (e) => {
        e.stopPropagation();
        openSongModal();
    });

    function togglePlayPause() {
        if (!audio) {
            audio = new Audio(audioSrc);

            audio.addEventListener('ended', () => {
                console.log('Audio ended');
                resetPlayer();
            });

            audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
                resetPlayer();
            });
        }

        if (isPlaying) {
            console.log('Pausing audio');
            audio.pause();
            resetPlayer();
        } else {
            console.log('Attempting to play audio');

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio play successful');
                    showPlayingState();
                }).catch(error => {
                    console.log('Audio play failed:', error);
                    if (error.name === 'NotAllowedError') {
                        console.log('Autoplay prevented - user interaction required');
                    }
                    resetPlayer();
                });
            }
        }
    }

    function showPlayingState() {
        isPlaying = true;
        albumImage.classList.add('playing');
        updateIcon(true);
        console.log('Showing playing state');
    }

    function resetPlayer() {
        isPlaying = false;
        albumImage.classList.remove('playing');
        updateIcon(false);
        console.log('Reset to paused state');
    }

    function openSongModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('song-modal');
        if (!modal) {
            modal = createSongModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        const modalAlbumImage = modal.querySelector('.modal-album-image');
        const modalSongTitle = modal.querySelector('.modal-song-title');
        const modalSongArtist = modal.querySelector('.modal-song-artist');

        modalAlbumImage.src = albumImage.src;
        modalSongTitle.textContent = songTitle.textContent;
        modalSongArtist.textContent = songArtist.textContent;

        // Show modal
        modal.classList.add('active');
    }

    function createSongModal() {
        const modal = document.createElement('div');
        modal.id = 'song-modal';
        modal.className = 'song-modal';

        modal.innerHTML = `
            <div class="song-modal-content">
                <button class="close-song-modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-album-container">
                    <img class="modal-album-image" src="" alt="Album Cover">
                </div>
                <div class="modal-song-info">
                    <h3 class="modal-song-title"></h3>
                    <p class="modal-song-artist"></p>
                </div>
            </div>
        `;

        // Add event listeners for closing modal
        const closeBtn = modal.querySelector('.close-song-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        return modal;
    }

    window.updateSongInfo = function(title, artist) {
        document.getElementById('songTitle').textContent = title;
        document.getElementById('songArtist').textContent = artist;
    };

    // Initialize with play icon
    updateIcon(false);
};

const setupTabSwitching = () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
};

const setupThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on user's system preference
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';
    });
};

const setupCertPopup = () => {
    const certCount = document.querySelector('.cert-count');
    const certPopup = document.getElementById('cert-popup');
    const imagePopup = document.getElementById('cert-image-popup');
    const closePopup = document.querySelector('.close-popup');
    const closeImagePopup = document.querySelector('.close-image-popup');
    const certItems = document.querySelectorAll('.cert-item');
    const certImage = document.getElementById('cert-image');

    // Open certification list popup
    certCount.addEventListener('click', () => {
        certPopup.classList.add('active');
    });

    // Close certification list popup
    closePopup.addEventListener('click', () => {
        certPopup.classList.remove('active');
    });

    // Close image popup
    closeImagePopup.addEventListener('click', () => {
        imagePopup.classList.remove('active');
    });

    // Handle clicking outside popups to close them
    window.addEventListener('click', (e) => {
        if (e.target === certPopup) {
            certPopup.classList.remove('active');
        }
        if (e.target === imagePopup) {
            imagePopup.classList.remove('active');
        }
    });

    // Handle certificate item clicks
    certItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageUrl = item.dataset.image;
            certImage.src = imageUrl;
            certPopup.classList.remove('active');
            imagePopup.classList.add('active');
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
