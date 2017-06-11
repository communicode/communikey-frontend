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
