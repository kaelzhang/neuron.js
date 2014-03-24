// common code slice
// ----
//     - constants
//     - common methods


// A very simple `mix` method
// copy all properties in the supplier to the receiver
// @param {Object} receiver
// @param {Object} supplier
// @returns {mixed} receiver
function mix(receiver, supplier) {
    var c;
    for (c in supplier) {
        receiver[c] = supplier[c];
    }
}

