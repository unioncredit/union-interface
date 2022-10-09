import { LoadingSpinner, Box } from "@unioncredit/ui";

import Header from "components/shared/Header";

export default function LoadingPage() {
  return (
    <>
      <Header loading />
      <Box fluid justify="center" mt="120px">
        <LoadingSpinner size={36} />
      </Box>
    </>
  );
}
