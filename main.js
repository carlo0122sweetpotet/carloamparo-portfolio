const init = () => {
    setupTabSwitching();
    setupThemeToggle();
    setupCertPopup();
    setupMusicPlayer();
    setupProjectPopup();
    setupProfilePhotoPopup();
    setupProjectsNavigation();
    setupExperienceNavigation();
    
    // Initialize the minigames hub when Minigames tab is clicked
    const minigamesTab = document.querySelector('.tab[data-tab="minigames"]');
    if (minigamesTab) {
        minigamesTab.addEventListener('click', () => {
            setTimeout(() => {
                if (window.MinigamesHub) {
                    window.MinigamesHub.init();
                }
            }, 100);
        }, { once: true });
    }
};

const setupExperienceNavigation = () => {
    const experienceStat = document.querySelectorAll('.profile-stats .stat')[1];

    experienceStat.addEventListener('click', () => {
        // Switch to experience tab
        const experienceTab = document.querySelector('.tab[data-tab="experience"]');
        const allTabs = document.querySelectorAll('.tab');
        const allTabContents = document.querySelectorAll('.tab-content');

        // Remove active class from all
        allTabs.forEach(t => t.classList.remove('active'));
        allTabContents.forEach(c => c.classList.remove('active'));

        // Activate experience tab
        experienceTab.classList.add('active');
        document.getElementById('experience').classList.add('active');

        // Scroll to experience section smoothly
        document.getElementById('experience').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};

const setupProjectsNavigation = () => {
    const projectsStat = document.querySelector('.profile-stats .stat:first-child');

    projectsStat.addEventListener('click', () => {
        // Switch to projects tab
        const projectsTab = document.querySelector('.tab[data-tab="projects"]');
        const allTabs = document.querySelectorAll('.tab');
        const allTabContents = document.querySelectorAll('.tab-content');

        // Remove active class from all
        allTabs.forEach(t => t.classList.remove('active'));
        allTabContents.forEach(c => c.classList.remove('active'));

        // Activate projects tab
        projectsTab.classList.add('active');
        document.getElementById('projects').classList.add('active');

        // Scroll to projects section smoothly
        document.getElementById('projects').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
};

const setupMusicPlayer = () => {
    const musicSection = document.getElementById('musicSection');
    const albumImage = document.getElementById('albumImage');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');

    let isPlaying = false;
    let audio = null;

    const audioSrc = 'assets/Ado風と私の物語.mp3';

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

    window.updateSongInfo = function (title, artist) {
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
    const coeSelectionPopup = document.getElementById('coe-selection-popup');
    const imagePopup = document.getElementById('cert-image-popup');
    const closePopup = document.querySelector('.close-popup');
    const closeCoePopup = document.querySelector('.close-coe-popup');
    const closeImagePopup = document.querySelector('.close-image-popup');
    const certItems = document.querySelectorAll('.cert-item');
    const coeOptions = document.querySelectorAll('.coe-option');
    const certImage = document.getElementById('cert-image');

    // Open certification list popup
    certCount.addEventListener('click', () => {
        certPopup.classList.add('active');
    });

    // Close certification list popup
    closePopup.addEventListener('click', () => {
        certPopup.classList.remove('active');
    });

    // Close COE selection popup
    closeCoePopup.addEventListener('click', () => {
        coeSelectionPopup.classList.remove('active');
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
        if (e.target === coeSelectionPopup) {
            coeSelectionPopup.classList.remove('active');
        }
        if (e.target === imagePopup) {
            imagePopup.classList.remove('active');
        }
    });

    // Handle certificate item clicks
    certItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.type === 'coe') {
                // Open COE selection popup instead of image
                certPopup.classList.remove('active');
                coeSelectionPopup.classList.add('active');
            } else {
                // Open image directly for other certificates
                const imageUrl = item.dataset.image;
                certImage.src = imageUrl;
                certPopup.classList.remove('active');
                imagePopup.classList.add('active');
            }
        });
    });

    // Handle COE option clicks
    coeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const imageUrl = option.dataset.image;
            certImage.src = imageUrl;
            coeSelectionPopup.classList.remove('active');
            imagePopup.classList.add('active');
        });
    });
};

const setupProfilePhotoPopup = () => {
    const profilePhoto = document.getElementById('profilePhoto');
    const imagePopup = document.getElementById('cert-image-popup');
    const certImage = document.getElementById('cert-image');
    const closeImagePopup = document.querySelector('.close-image-popup');

    profilePhoto.addEventListener('click', () => {
        certImage.src = profilePhoto.src;
        imagePopup.classList.add('active');
    });
};

const setupProjectPopup = () => {
    const projectItems = document.querySelectorAll('.grid-item');

    projectItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate navigation

            const projectTitle = item.querySelector('.project-overlay h3').textContent;
            const projectTech = item.querySelector('.project-overlay p').textContent;
            const projectImage = item.querySelector('img').src;
            const projectUrl = item.href;

            openProjectModal(projectTitle, projectTech, projectImage, projectUrl);
        });
    });
};

function openProjectModal(title, tech, image, url) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('project-modal');
    if (!modal) {
        modal = createProjectModal();
        document.body.appendChild(modal);
    }

    // Update modal content
    const modalImage = modal.querySelector('.modal-project-image');
    const modalTitle = modal.querySelector('.modal-project-title');
    const modalTech = modal.querySelector('.modal-project-tech');
    const modalViewBtn = modal.querySelector('.modal-view-project');

    modalImage.src = image;
    modalTitle.textContent = title;
    modalTech.textContent = tech;
    modalViewBtn.href = url;

    // Show modal
    modal.classList.add('active');
}

function createProjectModal() {
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'project-modal';

    modal.innerHTML = `
        <div class="project-modal-content">
            <button class="close-project-modal">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-project-container">
                <img class="modal-project-image" src="" alt="Project Image">
            </div>
            <div class="modal-project-info">
                <h3 class="modal-project-title"></h3>
                <p class="modal-project-tech"></p>
                <a class="modal-view-project" href="" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> View Project
                </a>
            </div>
        </div>
    `;

    // Add event listeners for closing modal
    const closeBtn = modal.querySelector('.close-project-modal');
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
