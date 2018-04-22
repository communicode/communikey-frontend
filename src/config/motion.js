/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
module.exports = {
  routes: {
    delay: [450, 0],
    duration: [450, 450],
    /**
     * @see http://easings.net
     */
    ease: ["easeOutQuad", "easeInOutQuad"],
    type: ["left", "left"]
  },
  baseLayout: {
    delay: [450, 0],
    duration: [450, 450],
    /**
     * @see http://easings.net
     */
    ease: "easeOutQuad",
    type: "alpha"
  }
};
