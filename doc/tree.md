# `config.tree`

```js
{
  // 1
  "A@1.1.0": [
    "1.1.0",
    // sync deps
    {
      "D@^1.0.0": [
        "1.0.9"
        // 4
      ],
      // An empty array indicates `E^2.0.0` uses a common `E@2.3.0`
      "E@^2.0.0": []
    },
    // async deps
    {}
  ],
  "B@1.1.0": [
    "1.1.0",
    {
      "D@^1.0.0": [
        "1.3.0"
      ],
      "E@^2.0.0": []
    }, 
    // 2
  ],
  // Common `E@2.3.0`
  "E@^2.0.0": [
    "2.3.0", 
    // 3
    {}, 
    {
      "F@^3.0.0": [
        "3.100.0"
      ]
    }
  ]
}
```

## Convention

1. If depend on an explicit version, where also will be an version -> version object
2. If there is no async deps, it is not needed to be output
3. If there is any async deps, sync deps should always be output
4. If no deps, no need to output them

