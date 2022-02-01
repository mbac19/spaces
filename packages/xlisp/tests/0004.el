
(def double
    (fn
        (def x (param 0))
        (* x 2)
    )
)


(def mx-plus-b
    (fn
        (def m (param 0))
        (def x (param 1))
        (def b (param 2))
        (+ (* m x) b)
    )
)


(if (not (is 10 (double 5)))
    (error "Expecting (double 5) to be 10")
)


(if (not (is (mx-plus-b 2 3 4) 10))
    (error "Execting (mx-plus-b 2 3 4) to be 10")
)
