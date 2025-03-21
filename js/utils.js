/**
 * Utility functions for the portfolio site
 */
const Utils = {
    mouse: {
        x: 0,
        y: 0,
        update: function(event) {
            this.x = event.clientX;
            this.y = event.clientY;
        }
    },
    
    getDocumentHeight: function() {
        // Get the scroll height of the entire document
        return Math.max(
            document.body.scrollHeight, 
            document.documentElement.scrollHeight,
            document.body.offsetHeight, 
            document.documentElement.offsetHeight,
            document.body.clientHeight, 
            document.documentElement.clientHeight
        );
    },
    
    getWorldPosition: function(x, y) {
        // Convert screen coordinates to world coordinates
        const vector = new THREE.Vector3();
        vector.set(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1,
            0.5
        );
        return vector;
    }
};
