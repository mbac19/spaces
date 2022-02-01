
(defer (error "Should not trigger this error"))

(defvar x (defer (+ 1 2)))

(if (is-same x 3)
    (error "x should not be evaluated to 3 yet"))

(defvar x-evaled (eval x))

(if (not (is-same x-evaled 3))
    (error "x-evaled should be the same as 3"))
