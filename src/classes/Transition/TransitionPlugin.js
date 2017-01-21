/**
 * @file        Using with TransitionFilter.js
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
import { TransitionFilter } from './TransitionFilter';

const PIXI = require('pixi.js');

function prepareTransition(renderer) {
  this.updateTransform();
  // const bounds = this.getBounds();
  // let bounds = getBoundsFromChildren(this);
  const texture = PIXI.RenderTexture.create(renderer.width, renderer.height,
                                            PIXI.settings.SCALE_MODE, renderer.resolution);
  // const texture = new PIXI.RenderTexture(baseTexture);

  if (this.visible) {
    renderer.render(this, texture);
  }
  // let extract = new PIXI.extract.webGL(renderer);
  // document.body.appendChild(extract.image(texture));
  // document.body.appendChild(document.createTextNode('pretrans'));
  const filter = getTransitionFilter(this.filters);

  filter.setPreviousTexture(texture);
}

function startTransition(renderer, ruleFilter) {
  this.updateTransform();
  // const bounds = this.getBounds();
  // let bounds = getBoundsFromChildren(this);
  const baseTexture = new PIXI.BaseRenderTexture(renderer.width, renderer.height,
    PIXI.settings.SCALE_MODE, renderer.resolution);
  const texture = new PIXI.RenderTexture(baseTexture);
  const filter = getTransitionFilter(this.filters);

  filter.setBlocked(true);
  if (this.visible) {
    filter.enabled = false;
    renderer.render(this, texture);
    filter.enabled = true;
  }
  // let extract = new PIXI.extract.webGL(renderer);
  // document.body.appendChild(extract.image(texture));
  // document.body.appendChild(document.createTextNode('trans'));
  const promise = filter.startTransition(texture, ruleFilter);

  filter.setBlocked(false);

  return promise;
}

function completeTransition() {
  const filter = getTransitionFilter(this.filters);

  filter.completeTransition();
}

export function TransitionPlugin(obj) {
  if (obj.prototype) {   // class
    obj.prototype.prepareTransition = prepareTransition;
    obj.prototype.startTransition = startTransition;
    obj.prototype.completeTransition = completeTransition;
  } else {                // object
    obj.prepareTransition = prepareTransition;
    obj.startTransition = startTransition;
    obj.completeTransition = completeTransition;
  }
}

/* utils */

function getTransitionFilter(filters) {
  for (const filter of filters) {
    if (filter instanceof TransitionFilter) {
      return filter;
    }
  }

  return null;
}

// function getBoundsFromChildren(parent) {
//   const bounds = parent.getBounds();
//   for (const child of parent.children) {
//     const childBounds = getBoundsFromChildren(child);
//     bounds.x = Math.min(bounds.x, childBounds.x);
//     bounds.y = Math.min(bounds.y, childBounds.y);
//     bounds.width = Math.max(bounds.width, childBounds.width);
//     bounds.height = Math.max(bounds.height, childBounds.height);
//   }
//   return bounds;
// }
