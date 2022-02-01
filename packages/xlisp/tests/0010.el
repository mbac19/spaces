;; Testing property keys

(def -
    (fn
        (def a (key-param p1))
        (def b (key-param p2))
        ((get a -) b)
    )
)


(def result1 (- :p1 10 :p2 9))


(def result2 (- :p2 9 :p1 10))


(if (not (is result1 1))
    (error "Expecting result1 to be 1. Actual" result1)
)


(if (not (is result2 1))
    (error "Expecting result2 to be 1. Actual:" result2)
)
