# Inscribed Squares: Theory and Implementation

## Problem Definition

The **Square Peg problem** (also known as **Toeplitz's question**) asks: "Does every simple closed curve in the plane contain the four vertices of a square?"

This is one of the most famous unsolved problems in geometry. While it has been proven for many special cases (convex curves, smooth curves, piecewise linear curves with certain properties), the general case remains open.

## Our Approach

### Polygonal Approximation

We approximate the user-drawn curve as a closed polygonal curve by:

- Capturing discrete points during freehand drawing
- Resampling to M=300 points uniformly distributed by arc length
- Treating the result as a piecewise linear approximation

### Square Detection Algorithm

For each ordered pair of points (p₁, p₂) on the curve, we consider two construction methods:

#### Side-Based Construction

Rotate the vector p₁p₂ by ±90° to find candidate vertices p₃ and p₄. This assumes p₁p₂ is one side of the square.

#### Diagonal-Based Construction

Treat p₁p₂ as a diagonal, find the center point, and rotate p₁ and p₂ by ±90° around the center to find p₃ and p₄.

### Validation and Tolerances

A candidate square is accepted if:

- **Hit tolerance (ε_hit = 5px):** Both missing vertices lie within 5 pixels of some segment
- **Side tolerance (τ_side = 2%):** All four sides are within 2% of the average side length
- **Angle tolerance (τ_angle = 2°):** All four angles are within 2° of 90°

### Deduplication

Squares are deduplicated using:

- Centroid-normalized vertex ordering
- Rounded hash with 1e-2 precision
- Sorting by side length (descending)

## Implementation Details

### Point-to-Segment Projection

We use the standard formula for projecting a point onto a line segment:

```
t = max(0, min(1, (p - a) · (b - a) / |b - a|²))
foot = a + t(b - a)
distance = |p - foot|
```

### Arc Length Resampling

To ensure uniform distribution, we:

- Calculate cumulative arc lengths along the original curve
- Interpolate points at evenly spaced arc length intervals
- Handle the closing segment for closed curves

## Limitations and Considerations

### Computational Complexity

The algorithm has O(M²) complexity where M=300 is the number of resampled points. This gives us 90,000 point pairs to consider, which is manageable for real-time interaction.

### Accuracy vs Performance

The tolerances (5px hit, 2% side, 2° angle) balance accuracy with practical usability. Tighter tolerances would find fewer false positives but might miss valid squares due to discretization errors.

### Curve Smoothness

Our polygonal approximation works best for relatively smooth curves. Very jagged or highly irregular curves may produce unexpected results due to the discrete nature of our approach.

## Further Reading

For more information on the Square Peg problem and related research:

- Matschke, Benjamin. "A survey on the square peg problem." Notices of the AMS 61.4 (2014): 346-352.
- Greene, Joshua E., and Andrew Lobb. "The rectangular peg problem." Annals of Mathematics 194.2 (2021): 509-517.
- Matschke, Benjamin. "Quadrilaterals inscribed in convex curves." arXiv preprint arXiv:1208.1047 (2012).
