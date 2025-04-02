import "./Profile.scss";

import {
  ArrowLeftIcon,
  Box,
  Button,
  Card,
  InfoBanner,
  Layout,
  UnionIcon,
  WarningIcon,
} from "@unioncredit/ui";
import { useEnsAddress } from "wagmi";
import { base, mainnet } from "viem/chains";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO_ADDRESS } from "constants";
import { getVersion } from "providers/Version";
import ProfileHeader from "components/profile/ProfileHeader";
import NotFoundPage from "./NotFoundPage";
import ProfileHeaderLoading from "components/profile/ProfileHeaderLoading";
import { ProfileBannerCta } from "components/profile/ProfileBannerCta";
import { ProfileColumns } from "components/profile/ProfileColumns";
import { useVoucheesData } from "providers/VoucheesData";
import { useVouchersData } from "providers/VouchersData";
import { isAddress } from "viem";

function ProfileInner({ address, chainId, legacyTag }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: vouchees = [] } = useVoucheesData(address, chainId, getVersion(chainId));
  const { data: vouchers = [] } = useVouchersData(address, chainId, getVersion(chainId));

  // True if the user has navigated other pages previously, false if they landed
  // on the profile directly.
  const historyExists = location.key !== "default";

  const memberLoaded = address !== ZERO_ADDRESS;

  return (
    <Box fluid justify="center" direction="vertical" className="ProfileInner">
      <Button
        mb="16px"
        size="pill"
        color="secondary"
        variant="light"
        onClick={() => (historyExists ? navigate(-1) : navigate("/"))}
        label={historyExists ? "Back" : "Union dashboard"}
        icon={historyExists ? ArrowLeftIcon : UnionIcon}
      />

      {legacyTag && (
        <a
          target="_blank"
          rel="noreferrer"
          style={{ width: "100%" }}
          href={`https://v1.union.finance/profile/${legacyTag}:${address}`}
        >
          <InfoBanner
            mb="16px"
            icon={WarningIcon}
            variant="warning"
            label={
              "You seem to be looking for a legacy (v1) profile, click here to view their profile on the v1 mirror."
            }
          />
        </a>
      )}

      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body p={0}>
          {memberLoaded ? (
            <ProfileHeader address={address} chainId={chainId} />
          ) : (
            <ProfileHeaderLoading />
          )}
        </Card.Body>
      </Card>

      {/*--------------------------------------------------------------
        Profile details 
      *--------------------------------------------------------------*/}
      {memberLoaded && (
        <>
          <ProfileBannerCta vouchers={vouchers} address={address} />
          <ProfileColumns
            vouchees={vouchees}
            vouchers={vouchers}
            address={address}
            chainId={chainId}
          />
        </>
      )}
    </Box>
  );
}

export default function Profile() {
  const { addressOrEns: addressOrEnsParam } = useParams();

  // Profile pages support EIP3770 addresses so we need to check if
  // it starts with eth: or goe: or arb1: then parse out the address
  const addressOrEnsParts = addressOrEnsParam.split(":");
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(optgoe|opt|base):/)
    ? addressOrEnsParts
    : [EIP3770[base.id], addressOrEnsParts.length > 1 ? addressOrEnsParts[1] : addressOrEnsParam];

  const { data: addressFromEns, isLoading } = useEnsAddress({
    name: addressOrEns,
    chainId: mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = parseInt(Object.keys(EIP3770).find((key) => EIP3770[key] === tag));

  const { data: member = {} } = useMemberData(address, chainId, getVersion(chainId));

  const profileAddress = member.address || ZERO_ADDRESS;

  return !isLoading && !address ? (
    <NotFoundPage />
  ) : (
    <>
      <Helmet>
        <title>{`Profile ${address} | Union Credit Protocol`}</title>
      </Helmet>
      <Layout.Columned mt="24px" maxw="800px">
        <ProfileInner
          chainId={chainId}
          address={profileAddress}
          member={member}
          legacyTag={addressOrEnsParam.match(/^(eth|arb1|goe):/)?.[1]}
        />
      </Layout.Columned>
    </>
  );
}
