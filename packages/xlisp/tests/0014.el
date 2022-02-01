;; Test that we can retrieve the number of parameters passed to a function.

(def count-params (fn param-len))

(if (not (is (count-params) 0))
    (error "Expecting param count to be 0. Actual:" (count-params))
)

(if (not (is (count-params 1 2 3 4 5) 5))
    (error "Expecting param count to be 5. Actual:" (count-params 1 2 3 4 5))
)

;; Make sure we are not counting keys as parameters.
(if (not (is (count-params :key1 1 :key2 2) 2))
    (error "Expecting param count to be 2. Actual:" (count-params :key1 1 :key2 2))
)
