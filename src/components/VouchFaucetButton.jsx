import links from "config/links";

export default function VouchFaucetButton() {
  return (
    <>
      No frens?{" "}
      <a href={links?.discord} target="_blank" rel="noreferrer">
        Try Discord
      </a>
    </>
  );
}
