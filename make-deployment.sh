#! /bin/bash

mkdir -p dist/
cd app/
rsync -av ./ ../dist/ --exclude=.git --exclude=*.md --exclude=*.txt
cd ../dist

./components/metaTags/insertMetaTags.py https://ec.europa.eu/eurostat/cache/website/economy/food-price-monitoring/

# put short hash in html

REV=`git rev-parse --short HEAD`
echo $REV

sed -i "/CommitId/c\CommitId: $REV" index.html

# TODO: remove console.debug lines

for f in $(find . -iname *.mjs -type f); do
  sed -i "/console.debug/d" $f
done

# all the following is only neccessary if server 
# isn't configured to know what .mjs is

# rename all .mjs to .js

for f in $(find . -iname *.mjs -type f); do
  BLA=`dirname $f`/`basename -s .mjs $f`.js
  mv $f $BLA
done

# replace ".mjs" with ".js" in all the files containing .mjs

for f in $(find . -iname *.js -type f); do
  sed -i 's/\.mjs/\.js/' $f
done

sed -i 's/\.mjs/\.js/'   index.html

# finito

cd ..
echo -e "\nDone.\n\nStarting smoke-test server..."

cd dist;python3 -m http.server 9001
