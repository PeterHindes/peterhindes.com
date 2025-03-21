// Animation script for scribble effects
(function() {
  // Run at exactly 8 FPS
  const FPS = 8;
  const FRAME_DELAY = 1000 / FPS;
  
  // Maximum offset for point movement
  const MAX_OFFSET = 3;
  
  function getRandomOffset() {
    return (Math.random() * MAX_OFFSET * 2) - MAX_OFFSET;
  }
  
  // Add a filter for the scribbly effect to the document
  function addScribbleFilter() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'scribble-filter');
    
    const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turbulence.setAttribute('type', 'fractalNoise');
    turbulence.setAttribute('baseFrequency', '0.05');
    turbulence.setAttribute('numOctaves', '2');
    turbulence.setAttribute('result', 'noise');
    
    const displacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    displacementMap.setAttribute('in', 'SourceGraphic');
    displacementMap.setAttribute('in2', 'noise');
    displacementMap.setAttribute('scale', '3');
    displacementMap.setAttribute('xChannelSelector', 'R');
    displacementMap.setAttribute('yChannelSelector', 'G');
    
    filter.appendChild(turbulence);
    filter.appendChild(displacementMap);
    defs.appendChild(filter);
    svg.appendChild(defs);
    
    document.body.appendChild(svg);
  }
  
  function animateSvgPaths() {
    // Find all section headings that have the scribble SVG
    const sectionHeadings = document.querySelectorAll('.section-heading');
    
    // For each section heading, create or update inline SVG with randomized points
    sectionHeadings.forEach(heading => {
      // Check if we already replaced the background with inline SVG
      let svg = heading.querySelector('svg.scribble-underline');
      const svgWidth = heading.offsetWidth;
      const svgHeight = 15; // Match the background-size height
      
      if (!svg) {
        // Create new SVG if it doesn't exist
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'scribble-underline');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        // Create the path with the base curve
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        
        svg.appendChild(path);
        
        // Position the SVG at the bottom of the heading
        svg.style.position = 'absolute';
        svg.style.bottom = '0';
        svg.style.left = '0';
        svg.style.width = '100%'; // Ensure 100% width for responsiveness
        svg.style.height = `${svgHeight}px`;
        
        // Add the SVG to the heading
        heading.style.position = 'relative';
        heading.style.backgroundImage = 'none'; // Remove the background image
        heading.appendChild(svg);
      }
      
      // Update SVG dimensions when window size changes
      svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', svgHeight);
      
      // Get the path element inside SVG
      const path = svg.querySelector('path');
      
      // Rebuild the base path with current width
      const basePath = `M0,${svgHeight/2} C${svgWidth*0.05},${svgHeight*0.25} ${svgWidth*0.1},${svgHeight*0.75} ${svgWidth*0.15},${svgHeight/2} C${svgWidth*0.2},${svgHeight*0.25} ${svgWidth*0.25},${svgHeight*0.75} ${svgWidth*0.3},${svgHeight/2} C${svgWidth*0.35},${svgHeight*0.25} ${svgWidth*0.4},${svgHeight*0.75} ${svgWidth*0.45},${svgHeight/2} C${svgWidth*0.5},${svgHeight*0.25} ${svgWidth*0.55},${svgHeight*0.75} ${svgWidth*0.6},${svgHeight/2} C${svgWidth*0.65},${svgHeight*0.25} ${svgWidth*0.7},${svgHeight*0.75} ${svgWidth*0.75},${svgHeight/2} C${svgWidth*0.8},${svgHeight*0.25} ${svgWidth*0.85},${svgHeight*0.75} ${svgWidth*0.9},${svgHeight/2} C${svgWidth*0.95},${svgHeight*0.25} ${svgWidth},${svgHeight*0.75} ${svgWidth},${svgHeight/2}`;
      path.dataset.basePath = basePath;
      
      // Generate randomized path
      const numbers = basePath.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (!numbers) return;
      
      let newPath = basePath;
      
      // Replace each Y coordinate (odd indices) with a slightly randomized version
      for (let i = 1; i < numbers.length; i += 2) {
        const oldY = parseFloat(numbers[i]);
        const newY = oldY + getRandomOffset();
        newPath = newPath.replace(
          new RegExp(`(^|[^.0-9])${numbers[i]}([^.0-9]|$)`), 
          `$1${newY.toFixed(1)}$2`
        );
      }
      
      path.setAttribute('d', newPath);
    });
    
    // Schedule the next frame
    setTimeout(animateSvgPaths, FRAME_DELAY);
  }
  
  // Start the animations
  function init() {
    addScribbleFilter();
    animateSvgPaths();
    
    // Improved profile image circle animation
    animateProfileCircle();
    
    // Animate scribbly borders by slightly changing their positioning
    setInterval(() => {
      document.querySelectorAll('.scribbly-image-border').forEach(border => {
        const offsetX = getRandomOffset() / 2;
        const offsetY = getRandomOffset() / 2;
        border.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    }, FRAME_DELAY);
  }

  // Separated function to animate the profile circle
  function animateProfileCircle() {
    const profilePath = document.getElementById('profile-circle-path');
    
    if (!profilePath) {
      // If path not found, try again in a moment (might not be loaded yet)
      setTimeout(animateProfileCircle, 100);
      return;
    }
    
    // Store the original path data if not already stored
    if (!profilePath.dataset.originalPath) {
      profilePath.dataset.originalPath = profilePath.getAttribute('d');
    }
    
    // Animation function for the profile circle
    function animateCircle() {
      const originalPath = profilePath.dataset.originalPath;
      
      // Extract control points from the path data
      const parts = originalPath.split(/[CM]/g).filter(p => p.trim());
      let newPath = 'M';
      
      // Process each part of the path
      parts.forEach((part, i) => {
        const coords = part.split(' ').filter(c => c.trim());
        let newCoords = [];
        
        // Add slight randomness to each coordinate
        coords.forEach(coord => {
          if (coord.includes(',')) {
            const [x, y] = coord.split(',').map(Number);
            newCoords.push(`${(x + getRandomOffset() * 0.8).toFixed(1)},${(y + getRandomOffset() * 0.8).toFixed(1)}`);
          } else {
            newCoords.push(coord);
          }
        });
        
        // Add the part back to the path with proper command
        if (i === 0) {
          // First part after 'M'
          newPath += newCoords.join(' ');
        } else {
          // Subsequent parts need 'C' prefix
          newPath += ' C' + newCoords.join(' ');
        }
      });
      
      // Apply the new path
      profilePath.setAttribute('d', newPath);
      
      // Schedule the next animation frame
      setTimeout(animateCircle, FRAME_DELAY);
    }
    
    // Start the animation
    animateCircle();
  }
  
  // Initialize when the DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add window resize listener to update SVGs when window size changes
  window.addEventListener('resize', debounce(() => {
    document.querySelectorAll('.scribble-underline').forEach(svg => {
      svg.remove(); // Remove existing SVGs
    });
    animateSvgPaths(); // Regenerate them with new dimensions
  }, 250));

  // Debounce function to limit how often a function runs during window resize
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
})();
