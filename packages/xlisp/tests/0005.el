
;; In this file, we are testing scope to make sure that variables and modules
;; are accessible / not accessible from different namespaces.


;; Here is a comment at the start of the file. The parser should know to
;; skip lines that are comments.

"This line of code is followed by a comment" ;; Here is an inline comment.

;; (error "here is commented out code that should not be executed")
