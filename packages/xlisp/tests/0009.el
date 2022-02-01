;; This tests lexigraphic scoping of functions.

(def x 20)

(def get-x (fn x))


(mod
    (def x 30)
    (if (not (is (get-x) 20))
        (error "Expecting x to be 20. Actual:" x)
    )
)
