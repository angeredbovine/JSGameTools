DIRECTORY="./Fragments/"
OUTPUT_DIRECTORY="../Pages/"

if [ $1 = "" ]; then
    echo "Please specify a tool to build."
else

    TOOL="${DIRECTORY}$1/"

    cat ${DIRECTORY}WindowPaneHeaderTop.htmlf \
        ${DIRECTORY}WindowPaneStyles.htmlf \
        ${TOOL}Styles.htmlf \
        ${DIRECTORY}WindowPaneScripts.htmlf \
        ${TOOL}Scripts.htmlf \
        ${DIRECTORY}WindowPaneHeaderBottom.htmlf \
        ${DIRECTORY}WindowPaneFile.htmlf \
        ${TOOL}File.htmlf \
        ${DIRECTORY}WindowPaneTools.htmlf \
        ${TOOL}Tools.htmlf \
        ${DIRECTORY}WindowPaneSettings.htmlf \
        ${TOOL}Settings.htmlf \
        ${DIRECTORY}WindowPaneControls.htmlf \
        ${DIRECTORY}BaseContent.htmlf \
        ${TOOL}Content.htmlf \
        ${DIRECTORY}WindowPaneFooter.htmlf \
        > ${OUTPUT_DIRECTORY}$1.html
fi
