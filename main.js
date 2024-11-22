const init = () => {
    setupTabSwitching();
    setupThemeToggle();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);