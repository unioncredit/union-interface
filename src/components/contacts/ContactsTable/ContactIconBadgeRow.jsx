import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AvatarIcon,
  CheckIcon,
  IconBadge,
  IconBadgeRow,
} from "@unioncredit/ui";

export function ContactIconBadgeRow({ providing, receiving }) {
  const leftIcon = providing && receiving ? CheckIcon : AvatarIcon;
  const rightIcon =
    providing && receiving
      ? CheckIcon
      : providing
      ? ArrowRightIcon
      : ArrowLeftIcon;

  const color =
    providing && receiving ? "#22c55e" : providing ? "#EC4899" : "#3B82F6";

  return (
    <IconBadgeRow ml="4px">
      <IconBadge
        icon={leftIcon}
        color="white"
        variant="filled"
        borderSize={2}
        borderColor="white"
        backgroundColor={color}
      />

      <IconBadge
        icon={rightIcon}
        color="white"
        variant="filled"
        borderSize={2}
        borderColor="white"
        backgroundColor={color}
      />
    </IconBadgeRow>
  );
}
