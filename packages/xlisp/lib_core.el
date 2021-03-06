;; -----------------------------------------------------------------------------
;; TEST UTILITIES
;; -----------------------------------------------------------------------------

;; -----------------------------------------------------------------------------
;; ORDER OPERATORS
;; -----------------------------------------------------------------------------

(export
    (def <
        (fn
            (def lhs (param 0))
            (def rhs (param 1))
            ((get lhs <) rhs)
        )
    )
)


(export
    (def <=
        (fn
            (def lhs (param 0))
            (def rhs (param 1))
            (or (< lhs rhs) (eq lhs rhs))
        )
    )
)
