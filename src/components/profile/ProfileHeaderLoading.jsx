import "./ProfileHeader.scss";

import { Box, Heading, Skeleton } from "@unioncredit/ui";

export default function ProfileHeaderLoading() {
  return (
    <Box fluid justify="space-between" align="flex-start" className="ProfileHeader">
      <Box className="ProfileHeader__card" fluid>
        <Box className="ProfileHeader__avatar" align="flex-start" justify="space-between">
          <Skeleton variant="circle" height={112} width={112} shimmer />
        </Box>

        <Box className="ProfileHeader__content" direction="vertical" fluid>
          <Heading mb={0}>
            <Skeleton height={32} width={150} shimmer />
          </Heading>

          <Box mt="8px" align="center" className="ProfileHeader__address">
            <Skeleton height={24} width={200} shimmer />
          </Box>

          <Box mt="12px" align="center" className="ProfileHeader__verification" fluid>
            <Skeleton height={20} width={40} shimmer />
            <Skeleton height={20} width={40} shimmer ml="6px" />
          </Box>
        </Box>
      </Box>

      <Box className="ProfileButtons" direction="vertical" justify="space-between" minw="200px">
        <Skeleton height={48} width={200} shimmer />
        <Skeleton mt="12px" height={48} width={200} shimmer />
      </Box>
    </Box>
  );
}
