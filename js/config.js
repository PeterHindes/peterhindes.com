/**
 * Global configuration settings
 */
const CONFIG = {
    // Camera settings
    camera: {
        fieldOfView: 75,
        nearPlane: 0.1,
        farPlane: 1000,
        backgroundDistance: 6,  // Z-position for background camera
        astronautDistance: 3    // Z-position for astronaut camera
    },
    
    // Lights
    lights: {
        ambient: {
            color: 0x404080,
            intensity: 1.5
        },
        directional: {
            color: 0x8090ff,
            intensity: 1.0,
            position: { x: 1, y: 1, z: 1 }
        },
        point: {
            color: 0x3498db,
            intensity: 1.5,
            distance: 100,
            position: { x: 5, y: 3, z: 5 }
        },
        sun: {
            color: 0xfff4d6,
            intensity: 2.0,
            position: { x: 0, y: 0, z: 10 }
        }
    },
    
    // Astronaut settings
    astronaut: {
        modelPath: '/lil guy.glb',
        scale: 0.3,
        position: { x: 0, y: 0, z: -4 },
        followSpeed: 0.05,
        rotationSpeed: 0.1,
        bobSpeed: 0.3,
        bobAmount: 0.05,
        movementRange: {
            x: 4.0,
            y: 2.5
        }
    },
    
    // Star background settings
    stars: {
        count: 200,
        size: 0.05,
        spread: 100,
        distance: 50,
        updateSpeed: 0.01
    },
    
    // Touch detection
    hasPointer: window.matchMedia('(pointer:fine)').matches
};
