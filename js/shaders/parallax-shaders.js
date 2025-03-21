/**
 * Shader definitions for the parallax star effect
 */
const ParallaxShaders = {
    // Vertex shader - positions the geometry
    vertexShader: `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    
    // Fragment shader - creates the star field with parallax
    fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float scroll;
    
    varying vec2 vUv;
    
    // Hash function for pseudo-random numbers
    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }
    
    // Star function with twinkle effect
    float star(vec2 position, float seed) {
        float t = time * 0.5 + seed * 6.2831;
        float twinkle = 0.5 + 0.5 * sin(t);
        
        float brightness = 0.0015 / length(position);
        return brightness * (0.5 + 0.5 * twinkle);
    }
    
    void main() {
        vec2 uv = vUv;
        vec2 center = vec2(0.5);
        
        // Offset from center (0 to 1)
        vec2 offset = uv - center;
        
        // Apply mouse effect (normalized to -1 to 1)
        vec2 mouseEffect = (mouse - 0.5) * 2.0;
        
        vec4 finalColor = vec4(0.0);
        
        // Create multiple layers with different parallax strengths
        for (int i = 1; i <= 10; i++) {
            float depth = float(i) / 10.0;
            float scale = mix(10.0, 0.5, depth); // larger stars in background
            
            // Apply parallax effect based on layer depth
            vec2 layerOffset = offset;
            
            // Mouse parallax
            layerOffset += mouseEffect * (depth * 0.05);
            
            // Scroll parallax
            layerOffset.y += scroll * depth * 0.5;
            
            // Calculate star coordinates
            vec2 starCoord = layerOffset * scale;
            
            // Apply time-based rotation to each layer
            float rotSpeed = 0.01 * (1.0 - depth);
            float rotation = time * rotSpeed;
            float s = sin(rotation);
            float c = cos(rotation);
            vec2 rotatedCoord = vec2(
                starCoord.x * c - starCoord.y * s,
                starCoord.x * s + starCoord.y * c
            );
            
            // Create grid of stars
            vec2 grid = fract(rotatedCoord * 10.0) - 0.5;
            vec2 id = floor(rotatedCoord * 10.0);
            float seed = hash(id);
            
            // Only render some of the grid points as stars
            if (seed > 0.65) {
                float brightness = star(grid, seed) * (1.0 - depth * 0.8);
                
                // Color stars based on seed
                vec3 starColor = mix(
                    vec3(0.8, 0.8, 1.0), // Blue-white
                    vec3(1.0, 0.8, 0.6), // Yellow-white
                    hash(id + 4.321)
                );
                
                finalColor += vec4(starColor * brightness, brightness);
            }
        }
        
        gl_FragColor = finalColor;
    }
    `
};
