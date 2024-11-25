import { EIP3770 } from "constants";

/**
 * @name getProfileUrl
 *
 * @param {String} address
 * @param {Number} chainId
 */
export const getProfileUrl = (address, chainId) => {
  if (!address) return null;

  return `/profile/${EIP3770[chainId]}:${address}`;
};

const SHARE_MESSAGE = "I'm on Union! Here's the link to vouch for me:";

export const generateTwitterLink = (shareLink, message = SHARE_MESSAGE) =>
  `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(
    shareLink
  )}&via=unionprotocol`;

export const generateTelegramLink = (shareLink, message = SHARE_MESSAGE) =>
  `https://telegram.me/share/url?text=${message}&url=${encodeURIComponent(shareLink)}`;
