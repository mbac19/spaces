;; Testing variadic function arguments.

(def sum
    (fn
        (def num1 (param 0))
        (def rest (param 1))
        ((get num1 +) (spread rest))
    )
)

(def x (sum 5))

(def y (num 5 10 20))

(if (not (is 5 x))
    (error "Expecting x to be 5. Actual:" x)
)

(if (not (is y 35))
    (error "Expecting y to be 35. Actual:" y)
)
