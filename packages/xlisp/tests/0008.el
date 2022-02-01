;; Testing quote, making sure it does not evaluate its arguments unless
;; extracted or evaluated, and testing that quotes have properties that can
;; be read.

(def my-list (quote 1 2 3))

(def len-of-my-list ((get my-list __len)))

(if (not (is len-of-my-list 3))
    (error "Expecting len of list to be 3. Actual:" len-of-my-list)
)

(quote (error "Expecting quoted lists to not eval"))
