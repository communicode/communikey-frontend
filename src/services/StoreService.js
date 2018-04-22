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
import _ from "lodash";

/**
 * Provides various useful functions specifically for the communikey entities.
 *
 * @author dvonderbey@communicode.de
 * @since 0.14.0
 */

/**
 * Function to retrieve an array of parents, built from a child object inside an array and the name of the
 * attribute which possibly contains the parent object. Expects the attribute to contain an ID that matches
 * the "ID" field of the parent.
 *
 * @param {object} array - The array that contains the objects
 * @param {object} child - The child object which contains a parent
 * @param {string} potentialParent - The attribute name of the potential parent inside the child object
 * @param {boolean} removeChild - Removes original child if true
 * @param {boolean} reverse - Reverses the array
 * @author dvonderbey@communicode.de
 * @since 0.14.0
 */
export const getAncestors = (array, child, potentialParent, removeChild, reverse) => {
  let queue = [];
  const findParents = (currentChild) => {
    queue.push(currentChild);
    currentChild[potentialParent] && findParents(array.find(entity => entity.id === currentChild[potentialParent]));
  };
  findParents(child);
  removeChild && _.remove(queue, entity => {
    return entity === child;
  });
  reverse && queue.reverse();
  return queue;
};
