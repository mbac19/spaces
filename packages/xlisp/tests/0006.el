
(def x 10)

(
    (fn
        (if (not (is x 10))
            (error "Expecting x to be 10")
        )
    )
)
