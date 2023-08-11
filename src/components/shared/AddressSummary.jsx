import "./AddressSummary.scss";

import { useEnsName, useNetwork } from "wagmi";
import { Link } from "react-router-dom";
import {
  Heading,
  Badge,
  Box,
  BadgeRow,
  Skeleton,
  ProfileIcon,
  LinkOutIcon,
  Button,
  Text,
} from "@unioncredit/ui";

import { EIP3770 } from "constants";
import { Avatar, StatusBadge } from "components/shared";
import { truncateAddress } from "utils/truncateAddress";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { blockExplorerAddress } from "utils/blockExplorer";
import { getProfileUrl } from "utils/generateLinks";
import { useState } from "react";
import useLabels from "hooks/useLabels";
import { mainnet } from "wagmi/chains";

export function AddressSummary({ address, allowEdit = false, ...props }) {
  const { chain } = useNetwork();
  const { getLabel, setLabel, removeLabel } = useLabels();
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  const label = getLabel(address);
  const primaryLabel = label || ensName || truncateAddress(address);

  const [copied, copy] = useCopyToClipboard();
  const [labelText, setLabelText] = useState(primaryLabel);
  const [editMode, setEditMode] = useState(false);

  const blockExplorerLink = blockExplorerAddress(chain.id, address);

  const handleSave = () => {
    if (labelText === primaryLabel) {
      removeLabel(address);
    } else {
      setLabel(address, labelText);
    }

    setEditMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditMode(false);
    }
  };

  if (!address) {
    return (
      <Box direction="vertical" mb="24px">
        <Box mt="2px" align="center">
          <Skeleton variant="circle" size={54} grey={200} mr="8px" />
          <Box direction="vertical">
            <Skeleton width={80} height={22} grey={200} m={0} />
            <Box mt="8px">
              <Skeleton width={72} height={18} grey={100} />
              <Skeleton width={72} height={18} grey={100} ml="4px" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box fluid mb="24px" align="center" className="AddressSummary" {...props}>
      <Box align="center" fluid>
        <Link to={`/profile/${EIP3770[chain.id]}:${address}`}>
          <Avatar size={64} address={address} />
        </Link>

        <Box direction="vertical" mx="12px" fluid>
          <Box fluid justify="space-between">
            {editMode ? (
              <input
                autoFocus
                type="text"
                maxLength={10}
                value={labelText}
                onBlur={(e) =>
                  (!e.relatedTarget || !e.relatedTarget.classList.contains("AliasButton")) &&
                  setEditMode(false)
                }
                onKeyDown={handleKeyDown}
                onChange={(e) => setLabelText(e.target.value)}
                className="AddressSummary__alias-input"
              />
            ) : (
              <Box align="flex-end" mr="4px">
                <Heading level={2} mb="4px">
                  {primaryLabel}
                </Heading>

                {label && (
                  <Text m="0 0 4px 6px" size="medium" grey={500} className="AddressSummary__ens">
                    {ensName}
                  </Text>
                )}
              </Box>
            )}

            {allowEdit && (
              <Button
                size="pill"
                color="secondary"
                variant="light"
                className="AliasButton"
                label={
                  editMode
                    ? labelText === primaryLabel
                      ? "Clear Alias"
                      : "Save Alias"
                    : "Edit Alias"
                }
                onClick={() => {
                  if (editMode) {
                    handleSave();
                  } else {
                    setLabelText(primaryLabel);
                    setEditMode(true);
                  }
                }}
              />
            )}
          </Box>
          <Box className="AddressSummary__info" align="center">
            <BadgeRow>
              <Badge
                mr="4px"
                color="grey"
                onClick={() => copy(address)}
                label={copied ? "Copied" : truncateAddress(address)}
              />
              <StatusBadge address={address} />
            </BadgeRow>

            <Box>
              <Link to={getProfileUrl(address, chain.id)}>
                <ProfileIcon width="24px" style={{ marginLeft: "4px" }} />
              </Link>

              <a href={blockExplorerLink} target="_blank" rel="noreferrer">
                <LinkOutIcon
                  width="24px"
                  fill="#44403c"
                  className="fillPath"
                  style={{ marginLeft: "4px" }}
                />
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
