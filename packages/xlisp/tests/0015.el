;; Testing the pair construct.

(def my-pair (pair "hello" "world"))

(if (not (is (get my-pair first) "hello"))
    (error "Expecting pair.first to be 'hello'. Actual:" (get my-pair first))
)

(if (not (is (get my-pair second) "world"))
    (error "Expecting pair.second to be 'world'. Actual:" (get my-pair second))
)

