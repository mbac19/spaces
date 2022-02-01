;; Basic tests for sequences.

(def count-by-twos
    (seq
        (fn
            (def i (param 0))
            (pair ((get i *) 2) true)
        )
    )
)
