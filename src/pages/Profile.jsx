import "./Profile.scss";

import { Button, Box, Card, Layout, ArrowLeftIcon, UnionIcon } from "@unioncredit/ui";
import { useEnsAddress, useNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";
import { isAddress } from "ethers/lib/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemberData } from "providers/MemberData";
import { EIP3770, ZERO_ADDRESS } from "constants";
import { getVersion } from "providers/Version";
import ProfileHeader from "components/profile/ProfileHeader";
import { ProfileSidebar } from "components/profile/ProfileSidebar";

function ProfileInner({ address, member, chainId }) {
  const navigate = useNavigate();
  const location = useLocation();

  // True if the user has navigated other pages previously, false if they landed
  // on the profile directly.
  const historyExists = location.key !== "default";

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

      {/*--------------------------------------------------------------
        Profile Header 
      *--------------------------------------------------------------*/}
      <Card mb="24px">
        <Card.Body p={0}>
          <ProfileHeader address={address} chainId={chainId} />
        </Card.Body>
      </Card>
      {/*--------------------------------------------------------------
        Profile details 
      *--------------------------------------------------------------*/}
      <Box fluid>
        <ProfileSidebar chainId={chainId} address={address} member={member} />
      </Box>
    </Box>
  );
}

export default function Profile() {
  const { chain: connectedChain } = useNetwork();
  const { addressOrEns: addressOrEnsParam } = useParams();

  // Profile pages support EIP3770 addresses so we need to check if
  // it starts with eth: or goe: or arb1: then parse out the address
  const addressOrEnsParts = addressOrEnsParam.split(":");
  const [tag, addressOrEns] = addressOrEnsParam.match(/^(eth|goe|arb1|optgoe|opt):/)
    ? addressOrEnsParts
    : [EIP3770[connectedChain?.id || mainnet.id], addressOrEnsParam];

  const { data: addressFromEns } = useEnsAddress({
    name: addressOrEns,
    chainId: mainnet.id,
  });

  const address = isAddress(addressOrEns) ? addressOrEns : addressFromEns;

  const chainId = Object.keys(EIP3770).find((key) => EIP3770[key] === tag);

  const { data: member = {} } = useMemberData(address, chainId, getVersion(chainId));

  const profileAddress = member.address || ZERO_ADDRESS;

  return (
    <>
      <Helmet>
        <title>{`Profile ${address} | Union Credit Protocol`}</title>
      </Helmet>
      <Layout.Columned mt="24px" maxw="653px">
        <ProfileInner chainId={chainId} address={profileAddress} member={member} />
      </Layout.Columned>
    </>
  );
}
