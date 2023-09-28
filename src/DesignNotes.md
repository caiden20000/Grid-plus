### Common names

Coordinates/coords/position are all referenced as "pos".
Vectors will always be named by their dimensions, eg Vec2, Vec3.
"pos" will always be in "Vec2" form (This is a 2D project)
"Screen" is referring ONLY to the canvas area, the rendering area.

### Coding practices

Every return statement should return a descriptive variable name, not a statement.
Ex: instead of
`return sum / count;`
do
`const average = sum / count; return average;`
