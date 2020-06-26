 
CLANG_FORMAT=node_modules/clang-format/bin/linux_x64/clang-format --style=Google
CSS_VALIDATOR=node_modules/css-validator/bin/css-validator
ESLINT=node_modules/eslint/bin/eslint.js
HTML_VALIDATE=node_modules/html-validate/bin/html-validate.js
PRETTIER=node_modules/prettier/bin-prettier.js

node_modules:
	npm install clang-format prettier css-validator html-validate eslint eslint-config-google

pretty: node_modules
	$(PRETTIER) --write project/src/main/webapp/*.{html,css}
	find project/src/main/java -iname *.java | xargs $(CLANG_FORMAT) -i
	find project/src/main/webapp -iname *.js | xargs $(CLANG_FORMAT) -i

validate: node_modules
	$(HTML_VALIDATE) project/src/main/webapp/*.html
	$(CSS_VALIDATOR) project/src/main/webapp/*.css
	$(ESLINT) project/src/main/webapp/*.js

validate-components: node_modules
	$(ESLINT) project/src/main/webapp/components/*.js
	$(ESLINT) project/src/main/webapp/components/user-home/*.js

package:
	mvn package
