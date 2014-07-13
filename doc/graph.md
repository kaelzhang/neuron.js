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

### The Static Situation

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

We are not sure if C is ready, and we found C has a depe
ndency D, so

`C.read <==> D.ready`

D has 3 dependencies,
- E is ready
- C: there is a path C -> D
- F: there is a path F -> D

So, D is ready, which indicates A is ready.


### Dynamic

Solution:

If X is load, check if X is ready
- If X is ready and in a graph, and set all modules as ready

