import * as Styling from "../components/ewc-dialog/src/externalStyling.mjs"

export function createToast() {
  Styling.applyEclClasses()

  document.addEventListener("DOMContentLoaded", function(event) {
    const el = document.getElementsByTagName("ewc-dialog")[0]
    el.title = "Information"
    el.bodyHtml = "No data available for your selection. Please change your selection."
  })
}