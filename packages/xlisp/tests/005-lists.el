(defn test
    (defparam desc)
    (defparam (... form))
    (efrl form)
    desc ;; Return test name if things are working.
)


;; Create a basic list.

(def foo (list 1 2 3))

(if (not (is? (get foo 0) 1))
    (error "Expecting list to contain '1' at index 0"))

(if (not (is? (get foo 1) 2))
    (error "Expecting list to contain '2' at index 1"))

(if (not (is? (get foo 2) 3))
    (error "Expecting list to contain '3' at index 2"))

(if (not (len foo) 3)
    (error "Expecting list to have 3 elements"))


;; Looping

(def bar (list 1 3 5))


;; List operations.

(test "list / sorting lists"
    (error "NOT IMPLEMENTED")
)
