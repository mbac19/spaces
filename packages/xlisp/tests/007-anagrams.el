(defn anagram
    (def key1 (param 0))
    (def key2 (param 2))
    (is (anagram-key key1) (anagram-key key2))
)


(defn anagram-key (defparam a) (sorted a))


(export
    (defn anagrams
        (defparam (... (defer l))
        ;; For this to work, we need the following:
        ;;   - Implement the dict module
        ;;
        ;;   - Dot notation working in modules
        ;;
        ;;   - Add a property "from-key-merge" to dict module
        ;;
        ;;   - named parameters
        ;;
        ;;   - a cons function for constructing a list from elements and list
        ;;
        (def key-to-words
            (dict.from-key-merge
                :get-key      (fn (defparam x) (anagram-key x))
                :merge-values (fn (defparam acc) (defparam x) (cons x acc))
            )
        )

        ;; For this to work, we need a key-to-words implementation.
        (get key-to-words values)
    )
)


;; -----------------------------------------------------------------------------
;; TESTS
;; -----------------------------------------------------------------------------

(defn test
    (defparam desc)
    (defparam (... form))
    (efrl form)
    desc ;; Return test name if things are working.
)


(test "anagrams / empty list"
    (error "NOT IMPLEMENTED")
)


(test "anagrams / single item"
    (error "NOT IMPLEMENTED")
)


(test "anagrams / all are anagrams"
    (error "NOT IMPLEMENTED")
)


(test "anagrams / none are anagrams"
    (error "NOT IMPLEMENTED")
)
