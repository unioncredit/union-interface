import { LoadingSpinner, Box } from "@unioncredit/ui";

export default function LoadingPage() {
  return (
    <>
      <Box fluid justify="center" mt="120px">
        <LoadingSpinner size={36} />
      </Box>
    </>
  );
}
