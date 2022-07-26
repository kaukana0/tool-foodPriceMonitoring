# 5. range UI element

Date: 2022-07

## Status

Accepted

## Context

A requirement of the project demands to include a range input w/ two handles.

### Options

1. implement from scratch as 0-dependency, vanilla-js, webcomponent
2. try and find 1. as already existing
3. use an existing solution (jquery-ui, etc.), sacrificing requirements from 1

### Some research

#### is there something out-of-the-box-usable out there?

- https://lion-web.netlify.app/components/input-range/overview/#input-range-overview
- https://getbootstrap.com/docs/5.0/forms/range/
- https://api.jqueryui.com/slider/#option-range
- https://opensource.adobe.com/spectrum-web-components/getting-started/
- https://www.cssscript.com/demo/d3-js-range-slider-pure-javascript-d3rangeslider/

Not w/o dependencies and/or w/ 2 handles.

#### why is it so difficult?

- https://css-tricks.com/sliding-nightmare-understanding-range-input/
- https://toughengineer.github.io/demo/slider-styler/slider-styler.html
- https://github.com/w3c/csswg-drafts/issues/4410

It's already difficult to even find out...

#### how about DIY?

One could base off sth. similar:

- https://www.simple.gy/blog/range-slider-two-handles/
- https://github.com/woocommerce/woocommerce-blocks/blob/trunk/assets/js/base/components/price-slider/index.tsx

Or just borrow the idea (tweaking 2 stacked standard sliders) and do it from scratch.

## Decision

Option 1, base of off some sources from the internets, make into a webComponent.

## Consequences

- have to make sure it looks ok on ff,chrome,edge
