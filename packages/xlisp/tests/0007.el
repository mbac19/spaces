
(def x 100)

(def y ((get x +) 20))

(if (not (is y 120))
    (error "Expecting y to be 120. Actual:" y)
)


(if (not ((get x <) 120))
    (error "Expecting x < 120")
)
