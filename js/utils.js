/**
 * Utility functions
 */
const Utils = {
    // Calculate document height for scroll effects
    getDocumentHeight: function() {
        return Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
        );
    },
    
    // Mouse position tracking with history for smooth movement
    mouse: { 
        x: 0, 
        y: 0,
        worldX: 0,
        worldY: 0,
        normalizedX: 0,
        normalizedY: 0,
        history: [],
        historyMaxLength: 10,
        lastDirection: { x: 0, y: 0 },
        isMoving: false,
        movementTimer: null,
        
        // Update mouse position from event
        update: function(event) {
            // Store previous position to calculate direction
            const prevX = this.worldX;
            const prevY = this.worldY;
            
            // Update current position
            this.worldX = event.clientX;
            this.worldY = event.clientY;
            
            // Update normalized coordinates (-1 to 1)
            this.normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
            this.normalizedY = -((event.clientY / window.innerHeight) * 2 - 1);
            
            // Calculate direction of movement
            const dirX = this.worldX - prevX;
            const dirY = this.worldY - prevY;
            
            // Only register significant movement for rotation calculations
            if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
                // Add to history for averaging
                this.history.push({ x: dirX, y: dirY });
                
                // Trim history to keep only recent movements
                if (this.history.length > this.historyMaxLength) {
                    this.history.shift();
                }
                
                this.isMoving = true;
                
                // Reset movement timer
                clearTimeout(this.movementTimer);
                this.movementTimer = setTimeout(() => {
                    this.isMoving = false;
                }, 500);
            }
            
            // Get normalized coordinates for the viewport
            this.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.y = -(event.clientY / window.innerHeight) * 2 + 1;
        },
        
        // Calculate average movement direction
        getAverageDirection: function() {
            if (this.history.length === 0) return this.lastDirection;
            
            let avgX = 0;
            let avgY = 0;
            
            this.history.forEach(dir => {
                avgX += dir.x;
                avgY += dir.y;
            });
            
            avgX /= this.history.length;
            avgY /= this.history.length;
            
            // Normalize and scale for reasonable rotation
            const magnitude = Math.sqrt(avgX * avgX + avgY * avgY);
            if (magnitude > 0) {
                avgX = (avgX / magnitude) * 0.3;
                avgY = (avgY / magnitude) * 0.3;
            }
            
            this.lastDirection = { x: avgX, y: avgY };
            return this.lastDirection;
        }
    },
    
    // World position conversion for 3D coordinates
    getWorldPosition: function(clientX, clientY) {
        const normalizedX = (clientX / window.innerWidth) * 2 - 1;
        const normalizedY = -(clientY / window.innerHeight) * 2 + 1;
        
        return { 
            x: normalizedX * 1.5, 
            y: normalizedY * 0.8 
        };
    }
};
