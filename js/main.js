/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mouse tracking if device has pointer
    if (CONFIG.hasPointer) {
        document.addEventListener('mousemove', (event) => {
            Utils.mouse.update(event);
        });
    }
    
    // Initialize background stars (shader-based)
    const starBackground = new StarBackground();
    starBackground.init();
    
    // Initialize background scene (Three.js)
    const background = new Background();
    background.init();
    
    // Initialize astronaut
    const astronaut = new Astronaut();
    astronaut.init();
    
    console.log('Interactive portfolio initialized');
});

// Log configuration on load for debugging
console.log('Configuration loaded:', CONFIG);
