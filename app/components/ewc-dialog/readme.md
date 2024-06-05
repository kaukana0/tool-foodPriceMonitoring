# Note

This is very similar to 0.1.0 and has (backward compatible) modification(s).
But since it's not going to be part of EWC-lib because there already exists a new, significantly different major version in EWC, this is made part of the application, not of EWC - also, this avoids a branch in EWC.

# API

There are the following setters:

- **visible** - true to show modally, false to hide
- **title** - sets the header text
- **bodyHtml** - sets the body html

And one optional attribute:

- **assetBaseURL** - location to the icons which this element needs. If omitted, "./assets" is assumed. User of this element has to make sure the assets exist in the specified location (please see also webpack.config.js below).
