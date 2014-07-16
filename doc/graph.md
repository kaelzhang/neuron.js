# Graph

> The developers' draft

## Dependency loading

We say vertex X is ready, if
- `X.ready === true`, or
- has no dependencies, or
- each dependency Y of X
  - is ready, or
  - there is a path directed from Y to X, which forms a [strongly connected graph](http://en.wikipedia.org/wiki/Strongly_connected_component), and each vertex on the path is loaded.

If X is a vertex of a strongly connected graph, and X is ready, then all vertices of the graph are ready.

Suppose there is a dependency graph

```
   A ─────> B(ready)
   |
   v
   C <──────┬──────> E(ready)
   |        |
   └──────> D ─────> F ─────> G
            ^                 |
            |                 |
            └─────────────────┘
```

We want to check if A is ready. So,

`A.ready <==> C.ready`

We are not sure if C is ready, and we found C has a dependency D, so

`C.read <==> D.ready`

D has 3 dependencies,
- E is ready
- C: there is a path C -> D
- F: there is a path F -> D

So, D is ready, which indicates A is ready.


## Shrinkwrap

using object `refs` as optimization:

### graph

```js
// modules
{
  0: [
    "F@2.1.0"
  ],
  1: [
    "E@1.9.0"
  ],
  2: [
    "Y@1.1.0",
    {
      "X@~1.1.0": 3
    }
  ],
  3: [
    "X@1.1.0", 
    {
      "Y@~1.1.0": 2
    }
  ],
  4: [
    "A@1.2.0", 
    {
      "D@^4.0.0": 6
      "F@^2.0.0": 0
    }
  ],
  5: [
    "B@5.0.0",
    {
      "D@^4.0.0": 7
      "F@^2.0.0": 0
    }
  ],
  6: [
    "D@4.1.0",
    {
      "E@^1.0.0": 8
    }
  ],
  7: [
    "D@4.1.0",
    {
      "E@^1.0.0": 1
    }
  ],
  8: [
    "E@1.1.0"
  ],

  _: {
    "A": 4,
    "B@5.0.0": 5,
    "B^5.0.0": 5
  }
}
```
