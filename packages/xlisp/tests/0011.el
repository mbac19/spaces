
(def my-mod
    (mod
        (export (def x 20))
    )
)

(if (not (has my-mod x))
    (error "Expecting my-mod to have property x")
)

(if (has my-mod y)
    (error "Expecintg my-mod not to have property y")
)
