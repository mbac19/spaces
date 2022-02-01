;; Ensuring "or" boolean operators lazy evaluate and return properties.

(def result1 (or 1 2))

(def result2 (or false 2))

(if (not (is result1 1))
    (error "Expecting result1 to be 1. Actual:" result1)
)

(if (not (is result2 2))
    (error "Expecting result2 to be 2. Actual:" result2)
)

(or 1 (error "or should not evaluate nodes when unneeded"))
