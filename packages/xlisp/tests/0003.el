
(def empty (fn))


(def ten (fn 10))


(if (not (is (empty) ()))
    (error "Expecting fn to evaluate to void")
)


(if (not (is (ten) 10))
    (error "Expecting 'ten' to evaluate to 10")
)
