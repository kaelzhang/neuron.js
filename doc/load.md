## lib/load.js

- **G**: global
- **N**: normal module
- **P**: package main
- **F**: facade module
- **A**: async module


#### * -> F

F could be main module, or one of entries

- id in loaded ? -> skip
  - else load even if P is loaded

### G

#### G -> N, G -> P, G -> A

Not allowed

#### G -> F &lt;==> * -> F

### N & P

#### N & P -> N

not load

#### N & P -> P

- pkg in loaded ? -> skip
  - else load

#### N & P -> F &lt;==> * -> F

#### N & P -> A

- check id

### A -> F &lt;==> * -> F

### A -> N

Not load

### A -> P

- check pkg



