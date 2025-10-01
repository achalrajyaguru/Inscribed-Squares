import React from 'react';

export function Theory() {
  return (
    <div className="theory-content">
      <h1>Inscribed Squares: Theory and Implementation</h1>
      
      <h2>Problem Definition</h2>
      <p>
        The <strong>Square Peg problem</strong> (also known as <strong>Toeplitz's question</strong>) 
        asks: "Does every simple closed curve in the plane contain the four vertices of a square?"
      </p>
      
      <p>
        This is one of the most famous unsolved problems in geometry. While it has been proven 
        for many special cases (convex curves, smooth curves, piecewise linear curves with 
        certain properties), the general case remains open.
      </p>

      <h2>Our Approach</h2>
      
      <h3>Polygonal Approximation</h3>
      <p>
        We approximate the user-drawn curve as a closed polygonal curve by:
      </p>
      <ul>
        <li>Capturing discrete points during freehand drawing</li>
        <li>Resampling to M=300 points uniformly distributed by arc length</li>
        <li>Treating the result as a piecewise linear approximation</li>
      </ul>

      <h3>Square Detection Algorithm</h3>
      <p>
        For each ordered pair of points (p₁, p₂) on the curve, we consider two construction methods:
      </p>
      
      <h4>Side-Based Construction</h4>
      <p>
        Rotate the vector p₁p₂ by ±90° to find candidate vertices p₃ and p₄. 
        This assumes p₁p₂ is one side of the square.
      </p>
      
      <h4>Diagonal-Based Construction</h4>
      <p>
        Treat p₁p₂ as a diagonal, find the center point, and rotate p₁ and p₂ 
        by ±90° around the center to find p₃ and p₄.
      </p>

      <h3>Validation and Tolerances</h3>
      <p>
        A candidate square is accepted if:
      </p>
      <ul>
        <li><strong>Hit tolerance (ε_hit = 5px):</strong> Both missing vertices lie within 5 pixels of some segment</li>
        <li><strong>Side tolerance (τ_side = 2%):</strong> All four sides are within 2% of the average side length</li>
        <li><strong>Angle tolerance (τ_angle = 2°):</strong> All four angles are within 2° of 90°</li>
      </ul>

      <h3>Deduplication</h3>
      <p>
        Squares are deduplicated using:
      </p>
      <ul>
        <li>Centroid-normalized vertex ordering</li>
        <li>Rounded hash with 1e-2 precision</li>
        <li>Sorting by side length (descending)</li>
      </ul>

      <h2>Implementation Details</h2>
      
      <h3>Point-to-Segment Projection</h3>
      <p>
        We use the standard formula for projecting a point onto a line segment:
      </p>
      <pre>
        t = max(0, min(1, (p - a) · (b - a) / |b - a|²))
        foot = a + t(b - a)
        distance = |p - foot|
      </pre>

      <h3>Arc Length Resampling</h3>
      <p>
        To ensure uniform distribution, we:
      </p>
      <ul>
        <li>Calculate cumulative arc lengths along the original curve</li>
        <li>Interpolate points at evenly spaced arc length intervals</li>
        <li>Handle the closing segment for closed curves</li>
      </ul>

      <h2>Limitations and Considerations</h2>
      
      <h3>Computational Complexity</h3>
      <p>
        The algorithm has O(M²) complexity where M=300 is the number of resampled points. 
        This gives us 90,000 point pairs to consider, which is manageable for real-time interaction.
      </p>

      <h3>Accuracy vs Performance</h3>
      <p>
        The tolerances (5px hit, 2% side, 2° angle) balance accuracy with practical usability. 
        Tighter tolerances would find fewer false positives but might miss valid squares due to 
        discretization errors.
      </p>

      <h3>Curve Smoothness</h3>
      <p>
        Our polygonal approximation works best for relatively smooth curves. Very jagged or 
        highly irregular curves may produce unexpected results due to the discrete nature 
        of our approach.
      </p>

      <h2>Further Reading</h2>
      <p>
        For more information on the Square Peg problem and related research:
      </p>
      <ul>
        <li>Matschke, Benjamin. "A survey on the square peg problem." Notices of the AMS 61.4 (2014): 346-352.</li>
        <li>Greene, Joshua E., and Andrew Lobb. "The rectangular peg problem." Annals of Mathematics 194.2 (2021): 509-517.</li>
        <li>Matschke, Benjamin. "Quadrilaterals inscribed in convex curves." arXiv preprint arXiv:1208.1047 (2012).</li>
      </ul>
    </div>
  );
}
