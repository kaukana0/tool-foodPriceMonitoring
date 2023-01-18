#! /bin/bash

git rev-parse --short HEAD
read -p "Don't forget to put that into index.html - press enter to continue"

mkdir -p dist/
cd app/
rsync -av ./ ../dist/ --exclude=.git --exclude=devel/ --exclude=*.md --exclude=*.txt --exclude=jsonStat/
cd ..
dist/components/metaTags/insertMetaTags.py https://ec.europa.eu/eurostat/cache/website/economy/food-price-monitoring/

# the following is only neccessary if server isn't configured to know what .mjs is
# find -name "*.mjs"

cd dist/

mv ./components/chart/toast.mjs   ./components/chart/toast.js
mv ./components/chart/legend.mjs   ./components/chart/legend.js
mv ./components/chart/chart.mjs   ./components/chart/chart.js
mv ./components/chart/grid.mjs   ./components/chart/grid.js
mv ./components/chart/axis.mjs   ./components/chart/axis.js
mv ./components/chart/tooltip.mjs   ./components/chart/tooltip.js
mv ./components/chart/ticks/ticksAlt1.mjs   ./components/chart/ticks/ticksAlt1.js
mv ./components/chart/ticks/ticksAlt2.mjs   ./components/chart/ticks/ticksAlt2.js
mv ./components/dropdownBox/markUpCode.mjs   ./components/dropdownBox/markUpCode.js
mv ./components/dropdownBox/dropdownBox.mjs   ./components/dropdownBox/dropdownBox.js
mv ./components/l10n/lang.mjs   ./components/l10n/lang.js
mv ./components/navBar/itemFb.mjs   ./components/navBar/itemFb.js
mv ./components/navBar/itemModal.mjs   ./components/navBar/itemModal.js
mv ./components/navBar/itemTwitter.mjs   ./components/navBar/itemTwitter.js
mv ./components/navBar/navBar.mjs   ./components/navBar/navBar.js
mv ./components/navBar/rootUrl.mjs   ./components/navBar/rootUrl.js
mv ./components/navBar/itemLinkedin.mjs   ./components/navBar/itemLinkedin.js
mv ./components/pipeline/pipeline.mjs   ./components/pipeline/pipeline.js
mv ./components/processorCountries/processor.mjs   ./components/processorCountries/processor.js
mv ./components/titleLines/titleLines.mjs   ./components/titleLines/titleLines.js
mv ./components/range/range.mjs   ./components/range/range.js
mv ./components/processorCountryNames/countryNames.mjs   ./components/processorCountryNames/countryNames.js
mv ./components/processorCountryOrder/countryOrder.mjs   ./components/processorCountryOrder/countryOrder.js
mv ./components/util/util.mjs   ./components/util/util.js
mv ./components/processorCountryColors/countryColors.mjs   ./components/processorCountryColors/countryColors.js
mv ./components/dataGenerator/fpmToolFakeData.mjs   ./components/dataGenerator/fpmToolFakeData.js
mv ./components/multiDimAccess/multiDimAccess.mjs   ./components/multiDimAccess/multiDimAccess.js
mv ./components/multiDimAccess/tests.mjs   ./components/multiDimAccess/tests.js
mv ./components/multiDimAccess/visualizer.mjs   ./components/multiDimAccess/visualizer.js
mv ./js/pipelineProcessors/indicators.mjs   ./js/pipelineProcessors/indicators.js
mv ./js/pipelineProcessors/timeMonthly.mjs   ./js/pipelineProcessors/timeMonthly.js
mv ./js/pipelineProcessors/indexColors.mjs   ./js/pipelineProcessors/indexColors.js
mv ./js/pipelineProcessors/sourceData.mjs   ./js/pipelineProcessors/sourceData.js
mv ./js/main.mjs   ./js/main.js
mv ./js/cache.mjs   ./js/cache.js
mv ./js/dynamicMultiselect.mjs   ./js/dynamicMultiselect.js
mv ./js/iframeResize.mjs   ./js/iframeResize.js
mv ./js/stateMgmnt.mjs   ./js/stateMgmnt.js
mv ./js/slider.mjs   ./js/slider.js
mv ./js/selectBoxes.mjs   ./js/selectBoxes.js
mv ./js/extraction.mjs   ./js/extraction.js
#mv ./redist/jsonStat/import.mjs   ./redist/jsonStat/import.js
mv ./redist/lz-string.mjs   ./redist/lz-string.js

# replace "mjs" with "js" in all the files containing mjs
# grep -i -r -l .mjs *

sed -i 's/\.mjs/\.js/'  components/chart/chart.js
sed -i 's/\.mjs/\.js/'  components/chart/axis.js
sed -i 's/\.mjs/\.js/'  components/dropdownBox/dropdownBox.js
sed -i 's/\.mjs/\.js/'  components/l10n/lang.js
sed -i 's/\.mjs/\.js/'  components/multiDimAccess/tests.js
sed -i 's/\.mjs/\.js/'  js/main.js
sed -i 's/\.mjs/\.js/'  js/cache.js
sed -i 's/\.mjs/\.js/'  js/dynamicMultiselect.js
sed -i 's/\.mjs/\.js/'  js/stateMgmnt.js
sed -i 's/\.mjs/\.js/'  js/selectBoxes.js
sed -i 's/\.mjs/\.js/'  js/extraction.js
sed -i 's/\.mjs/\.js/'  index.html

cd ..

echo -e "\nDone.\n"
echo "Next steps:"
echo "- smoketest the deployment by doing 'cd dist ; python3 -m http.server 8080'"
echo -e "- scp contents of the dist/ folder to their destination.\n"
