// This file contains the vertex and fragment shaders for the parallax star effect

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
            float brightness = mix(0.3, 1.0, depth); // brighter stars in foreground
            
            // Apply parallax effect based on layer depth
            vec2 offsetWithParallax = offset;
            offsetWithParallax.x += mouseEffect.x * depth * 0.1; // mouse x parallax
            offsetWithParallax.y += mouseEffect.y * depth * 0.1; // mouse y parallax
            offsetWithParallax.y -= scroll * depth * 0.2; // scroll parallax
            
            // Scale based on depth
            vec2 scaledUV = offsetWithParallax * scale + center;
            
            // Generate stars in this layer
            for (int s = 0; s < 5; s++) { // 5 stars per layer
                // Pseudo-random position for this star
                float seedX = hash(vec2(float(s) * 0.45 + depth * 2.0, float(i) * 0.16));
                float seedY = hash(vec2(float(s) * 0.33 + depth, float(i) * 0.71));
                vec2 starPos = vec2(seedX, seedY) * 2.0 - 1.0; // -1 to 1
                
                // Calculate star position with parallax
                vec2 starOffset = scaledUV - starPos;
                
                // Calculate star brightness with depth falloff
                float starVal = star(starOffset, seedX + seedY) * brightness;
                
                // Star color (more blue for distant stars, more white for close stars)
                vec3 starColor = mix(
                    vec3(0.6, 0.8, 1.0), // Distant stars (blue)
                    vec3(1.0, 1.0, 1.0), // Close stars (white)
                    depth
                );
                
                finalColor.rgb += starVal * starColor;
            }
        }
        
        // Output the final color with premultiplied alpha
        gl_FragColor = vec4(finalColor.rgb, 1.0);
    }
    `
};
