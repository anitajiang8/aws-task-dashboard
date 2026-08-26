import crownIcon from "../assets/crown.svg";
import hatIcon from "../assets/hat.svg";
import sunglassesIcon from "../assets/sunglasses.svg";

/**
 * Mochi's closet. Kept apart from constants.js because it imports image
 * assets, which would stop the pure logic modules from running outside
 * a bundler.
 */
export const ACCESSORIES = [
  {
    id: "none",
    name: "Nothing Equipped",
    image: null,
    iconClass: "accessory-icon-none",
    unlockLevel: 1,
    treatCost: 0,
  },
  {
    id: "bow",
    name: "Pink Bow",
    image: null,
    iconClass: "accessory-icon-bow",
    unlockLevel: 1,
    treatCost: 15,
  },
  {
    id: "star-collar",
    name: "Star Collar",
    image: null,
    iconClass: "accessory-icon-collar",
    unlockLevel: 1,
    treatCost: 15,
  },
  {
    id: "cloud-cushion",
    name: "Cloud Cushion",
    image: null,
    iconClass: "accessory-icon-cushion",
    unlockLevel: 1,
    treatCost: 20,
  },
  {
    id: "sparkles",
    name: "Room Sparkles",
    image: null,
    iconClass: "accessory-icon-sparkles",
    unlockLevel: 1,
    treatCost: 20,
  },
  {
    id: "hat",
    name: "Cozy Hat",
    image: hatIcon,
    iconClass: null,
    unlockLevel: 1,
    treatCost: 25,
  },
  {
    id: "sunglasses",
    name: "Focus Sunglasses",
    image: sunglassesIcon,
    iconClass: null,
    unlockLevel: 2,
    treatCost: 35,
  },
  {
    id: "crown",
    name: "Productivity Crown",
    image: crownIcon,
    iconClass: null,
    unlockLevel: 3,
    treatCost: 50,
  },
];
