
(def my-mod
    (mod
        (export (def x 10))
    )
)

(if (not (is (get my-mod x) 10))
    (error "Expecting my-mod.x to be 10")
)
