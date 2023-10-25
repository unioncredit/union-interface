import "./Profile.scss";

import { Box, Card, Layout } from "@unioncredit/ui";
import { useAccount, useEnsAddress } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";
import { isAddress } from "ethers/lib/utils";
import { useParams } from "react-router-dom";
import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO_ADDRESS } from "constants";
import { getVersion } from "providers/Version";
import ProfileHeader from "components/profile/ProfileHeader";
import { ProfileSidebar } from "components/profile/ProfileSidebar";

function ProfileInner({ profileMember = {}, chainId }) {
  const address = profileMember.address || ZERO_ADDRESS;

  return (
    <Box fluid justify="center" direction="vertical" className="ProfileInner">
      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body p={0}>
          <ProfileHeader address={address} profileMember={profileMember} chainId={chainId} />
        </Card.Body>
      </Card>
      {/*--------------------------------------------------------------
        Profile details 
      *--------------------------------------------------------------*/}
      <Box fluid>
        <ProfileSidebar address={address} profileMember={profileMember} />

        <Card mb="24px">
          <Card.Body>Credit request etc</Card.Body>
        </Card>
      </Box>
    </Box>
  );
}

export default function Profile() {
  const { address: connectedAddress } = useAccount();
  const { addressOrEns: addressOrEnsParam } = useParams();

  // Profile pages support EIP3770 addresses so we need to check if
  // it starts with eth: or goe: or arb1: then parse out the address
  const addressOrEnsParts = addressOrEnsParam.split(":");
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(eth|goe|arb1|optgoe|opt):/)
    ? addressOrEnsParts
    : [EIP3770[mainnet.id], addressOrEnsParam];

  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
    chainId: mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = Object.keys(EIP3770).find((key) => EIP3770[key] === tag);

  const { data: profileMember } = useMemberData(address, chainId, getVersion(chainId));

  const { data: connectedMember } = useMemberData(connectedAddress, chainId);

  return (
    <>
      <Helmet>
        <title>{`Profile ${address} | Union Credit Protocol`}</title>
      </Helmet>
      <Layout.Columned mt="24px" maxw="985px">
        <ProfileInner
          chainId={chainId}
          profileMember={profileMember}
          connectedMember={connectedMember}
        />
      </Layout.Columned>
    </>
  );
}
