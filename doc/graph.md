# Graph

> The developers's draft

## Dependency loading

We say vertex X is ready, if
- has no dependencies, or
- each dependency Y
  - is ready, or
  - there is a path directed from Y to A, which forms a [strongly connected graph](http://en.wikipedia.org/wiki/Strongly_connected_component), and each vertex on the path is loaded.

### The Static Situation

Suppose there is a dependency graph

```
   A ─────> B(ready)
   |
   v
   C <──────┬──────> E(ready)
   |        |
   └──────> D ─────> F ────── G
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



