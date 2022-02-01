;; Can dump into the module.
(dump (import ..test-module))

;; Can assign to a variable.

(defvar my-stuff (import ..test-module))

;; Checking the dumpted namespace values.

(if (not (is-same x 10))
    (error "Expecting global x to be 10"))

(if (not (is-same y 20))
    (error "Expecting global y to be 20"))

(if (not (is-same z "thirty"))
    (error "Expecting z to be 'thirty'"))

;; Check my-stuff

(if (not (is-same (get my-stuff x) 10))
    (error "Expecting x to be 10"))
