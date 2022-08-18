#! /bin/bash

git rev-parse --short HEAD
read -p "Don't forget to put that into index.html - press enter to continue"

mkdir -p dist/
cd app
rsync -av ./ ../dist/ --exclude=.git/



# the following is only neccessary if server isn't configured to know what .mjs is

cd ../dist
mv ./components/chart/toast.mjs  ./components/chart/toast.js
mv ./components/chart/rest.mjs  ./components/chart/rest.js
mv ./components/chart/chart.mjs  ./components/chart/chart.js
mv ./components/chart/legend.mjs  ./components/chart/legend.js
mv ./components/dropdownBox/dropdownBox.mjs  ./components/dropdownBox/dropdownBox.js
mv ./components/l10n/lang.mjs  ./components/l10n/lang.js
mv ./components/metaTags/metaTags.mjs  ./components/metaTags/metaTags.js
mv ./components/navBar/itemFb.mjs  ./components/navBar/itemFb.js
mv ./components/navBar/itemModal.mjs  ./components/navBar/itemModal.js
mv ./components/navBar/itemTwitter.mjs  ./components/navBar/itemTwitter.js
mv ./components/navBar/navBar.mjs  ./components/navBar/navBar.js
mv ./components/navBar/rootUrl.mjs  ./components/navBar/rootUrl.js
mv ./components/pipeline/pipeline.mjs  ./components/pipeline/pipeline.js
mv ./components/processorCountries/processor.mjs  ./components/processorCountries/processor.js
mv ./components/titleLines/titleLines.mjs  ./components/titleLines/titleLines.js
mv ./components/util/util.mjs  ./components/util/util.js
mv ./components/range/range.mjs  ./components/range/range.js
mv ./components/processorCountryNames/countryNames.mjs  ./components/processorCountryNames/countryNames.js
mv ./components/processorOriginalRawData/originalRawData.mjs  ./components/processorOriginalRawData/originalRawData.js
mv ./components/processorCountryOrder/countryOrder.mjs  ./components/processorCountryOrder/countryOrder.js
mv ./js/pipelineProcessors/indicators.mjs  ./js/pipelineProcessors/indicators.js
mv ./js/pipelineProcessors/timeMonthly.mjs  ./js/pipelineProcessors/timeMonthly.js
mv ./js/pipelineProcessors/coicop.mjs  ./js/pipelineProcessors/coicop.js
mv ./js/pipelineProcessors/index.mjs  ./js/pipelineProcessors/index.js
mv ./js/pipelineProcessors/countryValues.mjs  ./js/pipelineProcessors/countryValues.js
mv ./js/main.mjs  ./js/main.js
mv ./js/dynamicMultiselect.mjs  ./js/dynamicMultiselect.js
mv ./redist/jsonStat/import.mjs  ./redist/jsonStat/import.js

# replace mjs with js in all the files containing mjs

sed -i 's/\.mjs/\.js/' index.html
sed -i 's/\.mjs/\.js/' components/chart/chart.js
sed -i 's/\.mjs/\.js/' components/l10n/lang.js
sed -i 's/\.mjs/\.js/' components/processorOriginalRawData/originalRawData.js
sed -i 's/\.mjs/\.js/' js/dynamicMultiselect.js
sed -i 's/\.mjs/\.js/' js/main.js
sed -i 's/\.mjs/\.js/' js/pipelineProcessors/timeMonthly.js

cd ..
