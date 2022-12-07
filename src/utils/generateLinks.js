import { EIP3770 } from "constants";

/**
 * @name getProfileUrl
 *
 * @param {String} address
 * @param {Number} chainId
 */
export default function getProfileUrl(address, chainId) {
  if (!address) return null;

  return `https://app.union.finance/profile/${EIP3770[chainId]}:${address}`;
}

const SHARE_MESSAGE = `Please vouch for me on Union!`;

export const generateTwitterLink = (shareLink) =>
  `https://twitter.com/intent/tweet?text=${SHARE_MESSAGE}&url=${encodeURIComponent(
    shareLink
  )}&via=unionprotocol`;

export const generateTelegramLink = (shareLink) =>
  `https://telegram.me/share/url?text=${SHARE_MESSAGE}&url=${encodeURIComponent(
    shareLink
  )}`;
