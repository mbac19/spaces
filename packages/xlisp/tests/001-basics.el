;; TODO:
;;
;; - error should support no parameters


;; -----------------------------------------------------------------------------
;; SETUP
;; -----------------------------------------------------------------------------

(defn test
    (defparam desc)
    (defparam (spread (quote form)))
    (eval (spread form))
)


;; -----------------------------------------------------------------------------
;; TESTS
;; -----------------------------------------------------------------------------

;; Here is a comment at the start of the file. The parser should know to
;; skip lines that are comments.

(print "This line of code is followed by a comment") ;; Here is an inline comment.

;; (error "here is commented out code that should not be executed")

"Ignores comment prefix when ;; inside quotes"

(test "defining variables"
    (def x 20)
    (if (not (is x 20))
        (error "Expecting x to be 20")
    )
)


(test "defining a variable to be equal to another variable"
    (def x 20)

    (def y x)

    (if (not (is y 20))
        (error "Expecting y to be 20")
    )
)


(test "defining functions"
    (defn square (defparam x) (* x x))

    (if (not (is (square 20) 400))
        (error "Expecting square of 20 to be 400")
    )
)


(test "boolean operators"
    (if (not (is (and true false) false))
        (error)
    )

    (if (not (is (and true true) true))
        (error)
    )

    (if (not (is (and false true) false))
        (error)
    )

    (if (not (is (and false false) false))
        (error)
    )
)


(test "inline functions"
    (def is-even (fn (defparam x) (is (% x 2) 0)))

    (if (not (is-even 12)) (error))

    (if (is-even 13) (error))
)


(test "defer operation"
    (defer (error "Should not execute"))
)


(test "eval operation"
    (def one-plus-two (defer (+ 1 2)))

    (if (is 3 one-plus-two)
        (error "Expecting one-plus-two to not evaluate")
    )

    (if (not (is 3 (eval one-plus-two)))
        (error "Expecting one-plus-two to evaluate")
    )
)


(test "defered function parameters"
    (defn defers-eval
        (defparam (defer bar))
        ()
    )

    (defers-eval (error "Should not eval"))
)


(test "spread operator"
    (error "NOT YET IMPLEMENTED")
)